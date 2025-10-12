import { NextRequest, NextResponse } from "next/server";
import { PortfolioDataLoader } from "@/lib/rag/loader";
import { VectorStoreManager } from "@/lib/rag/vectorStore";

/**
 * POST /api/chat/initialize - Initialize or reinitialize the vector store
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clearExisting = false, 
      webUrls = [],
      twitterHandle 
    } = body;

    // Initialize vector store manager
    const vectorStoreManager = new VectorStoreManager();
    await vectorStoreManager.initialize();

    // Clear existing data if requested
    if (clearExisting) {
      console.log("Clearing existing vector store...");
      await vectorStoreManager.clear();
      await vectorStoreManager.initialize();
    }

    // Load documents
    const loader = new PortfolioDataLoader({
      dataPath: process.env.DATA_PATH || "./data",
      webUrls: webUrls.length > 0 ? webUrls : process.env.WEB_URLS?.split(",") || [],
      twitterHandle: twitterHandle || process.env.TWITTER_HANDLE,
    });

    const documents = await loader.loadAllDocuments();
    console.log(`Loaded ${documents.length} documents`);

    // Add documents to vector store
    await vectorStoreManager.addDocuments(documents);

    // Get stats
    const stats = await vectorStoreManager.getStats();

    return NextResponse.json({
      success: true,
      message: "Vector store initialized successfully",
      documentsLoaded: documents.length,
      stats,
    });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to initialize vector store",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
