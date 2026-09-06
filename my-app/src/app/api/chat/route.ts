import { NextRequest, NextResponse } from "next/server";
import { PortfolioDataLoader } from "@/lib/rag/loader";
import { VectorStoreManager } from "@/lib/rag/vectorStore";
import { PortfolioRAGChain, ChatMessage } from "@/lib/rag/chain";

const CANNED: Record<string, string> = {
  "what's your story?":
    "I grew up in Malaysia and moved to Canada in 2023 to study Computer Science at Wilfrid Laurier University (graduating Oct 2026, 3.85 CGPA). Since then I've interned at Sensoft Technologies, Bolttech, and Manulife, and I'm currently a contract software engineer at Hecaton shipping products for startups like 1Bitcoin.ca, Fleetcraft, and reAIgents. I'm based in Waterloo and Toronto, and on nights and weekends I build MentorTrader, a marketplace connecting retail investors with vetted trading mentors.",
  "what's your tech stack?":
    "Languages: Python, TypeScript/JavaScript, SQL, Java, C, and Ruby. For full-stack work I reach for Next.js and React with tRPC and Prisma, and on the backend I've shipped with Express, FastAPI, Flask, Django, and Rails. Data and infra: PostgreSQL, CockroachDB, Redis, Databricks, Docker, and Kubernetes, with AWS (Lambda, Step Functions, RDS, SQS, S3) and Azure (AKS, AI Foundry). For tooling I use GitHub Actions, Sentry, Vercel, and GCP Functions.",
  "what's mentortrader?":
    "MentorTrader is a two-sided marketplace that connects retail investors with vetted trading mentors. It has an AI mentor-matching wizard built on OpenAI embeddings, PostgreSQL vector search, and Claude reranking that gives budget-aware recommendations and hands you straight into mentor messaging. It's built with Next.js, TypeScript, PostgreSQL, Stripe, Supabase, and Docker, and has reached **120+ mentors** and **20,000+ monthly visitors**.",
  "what have you done in your career so far?":
    "At Hecaton I'm building core features for **1Bitcoin.ca**, a Bitcoin exchange that has processed **$200M+ across 96,000+ transactions**, including instant Lightning payouts that cut settlement from ~60 minutes to seconds. I also shipped a Bitcoin notarization platform handling 500+ monthly transactions, the frontend foundation for Fleetcraft (Series A), and reAIgents, an AI real estate platform with 6M+ property records that saved $10–15K in API costs. At Manulife I built an AI diagram generation pipeline on Azure that orchestrates **4 model deployments** in a self-correcting agent loop to turn natural language into enterprise architecture diagrams. At Bolttech I re-architected a legacy pipeline into serverless AWS ETL processing 1M+ daily records, saving $15K+ a year and cutting processing time by 95%. At Sensoft I built a real-time React dashboard for 15,000+ Modbus sensors and a forecasting pipeline that cut energy costs 15%.",
};

const QUOTES = [
  "An idiot admires complexity, a genius admires simplicity, a physicist tries to make it simple, for an idiot anything the more complicated it is the more he will admire it, if you make something so clusterfucked he can't understand it he's gonna think you're a god cause you made it so complicated nobody can understand it.\n\nTerry Davis",
  "A retard in motion is always better than a genius at rest.\n\nAnonymous",
];
let quoteIndex = 0;

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

    const canned = CANNED[String(message).trim().toLowerCase()];
    if (canned) {
      return NextResponse.json({ message: canned, timestamp: new Date().toISOString() });
    }

    if (/quote of the day/i.test(message)) {
      const quote = QUOTES[quoteIndex++ % QUOTES.length];
      return NextResponse.json({ message: quote, timestamp: new Date().toISOString() });
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
