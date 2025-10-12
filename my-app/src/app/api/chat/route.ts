import { NextRequest, NextResponse } from "next/server";
import { PortfolioDataLoader } from "@/lib/rag/loader";
import { VectorStoreManager } from "@/lib/rag/vectorStore";
import { PortfolioRAGChain, ChatMessage } from "@/lib/rag/chain";

// Cache the initialized chain
let ragChain: PortfolioRAGChain | null = null;
let vectorStoreManager: VectorStoreManager | null = null;

/**
 * Initialize the RAG chain (called once on first request)
 */
async function initializeRAGChain() {
  if (ragChain) return ragChain;

  try {
    // Initialize vector store manager
    vectorStoreManager = new VectorStoreManager();
    await vectorStoreManager.initialize();

    // Get stats to check if we need to load documents
    const stats = await vectorStoreManager.getStats();
    
    if (stats.documentCount === 0) {
      console.log("No documents in vector store. Loading documents...");
      
      // Load documents
      const loader = new PortfolioDataLoader({
        dataPath: process.env.DATA_PATH || "./data",
        webUrls: process.env.WEB_URLS?.split(",") || [],
        twitterHandle: process.env.TWITTER_HANDLE,
      });
      
      const documents = await loader.loadAllDocuments();
      console.log(`Loaded ${documents.length} documents`);
      
      // Add documents to vector store
      await vectorStoreManager.addDocuments(documents);
    }

    // Create RAG chain
    const retriever = vectorStoreManager.asRetriever(4);
    ragChain = new PortfolioRAGChain(retriever);
    
    console.log("RAG chain initialized successfully");
    return ragChain;
  } catch (error) {
    console.error("Error initializing RAG chain:", error);
    throw error;
  }
}

/**
 * POST /api/chat - Handle chat messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatHistory = [], stream = false } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Initialize chain if not already done
    const chain = await initializeRAGChain();

    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chain.streamChat(message, chatHistory)) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Handle regular response
    const response = await chain.chat(message, chatHistory as ChatMessage[]);
    
    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat - Get suggested questions or chat status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Initialize chain if not already done
    const chain = await initializeRAGChain();

    if (action === "suggestions") {
      const suggestions = await chain.getSuggestedQuestions();
      return NextResponse.json({ suggestions });
    }

    if (action === "stats" && vectorStoreManager) {
      const stats = await vectorStoreManager.getStats();
      return NextResponse.json({ stats });
    }

    // Default response
    return NextResponse.json({
      status: "ready",
      message: "Chat API is ready",
    });
  } catch (error) {
    console.error("Chat API GET error:", error);
    return NextResponse.json(
      { error: "Failed to get chat information" },
      { status: 500 }
    );
  }
}
