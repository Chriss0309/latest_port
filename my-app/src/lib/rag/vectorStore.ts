import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class VectorStoreManager {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: MemoryVectorStore | null = null;

  constructor(apiKey?: string) {
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required. Set OPENAI_API_KEY environment variable.");
    }

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small", // Using the latest embedding model
    });
  }

  /**
   * Initialize vector store (memory-based, no persistence)
   */
  async initialize(): Promise<void> {
    // MemoryVectorStore doesn't need initialization - will be created when documents are added
    console.log("Vector store ready. Will create in-memory index when documents are added.");
    this.vectorStore = null;
  }

  /**
   * Add documents to the vector store
   */
  async addDocuments(documents: Document[]): Promise<void> {
    if (documents.length === 0) {
      console.log("No documents to add.");
      return;
    }

    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""],
    });

    const splitDocs = await textSplitter.splitDocuments(documents);
    console.log(`Split ${documents.length} documents into ${splitDocs.length} chunks.`);

    // If vector store doesn't exist yet, create it with these documents
    if (!this.vectorStore) {
      console.log("Creating in-memory vector store with documents...");
      this.vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings);
    } else {
      // Add to existing vector store
      await this.vectorStore.addDocuments(splitDocs);
    }

    console.log(`Vector store now contains ${splitDocs.length} document chunks.`);
  }


  /**
   * Search for similar documents
   */
  async similaritySearch(query: string, k: number = 4): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized. Call initialize() first.");
    }

    return await this.vectorStore.similaritySearch(query, k);
  }

  /**
   * Search with relevance scores
   */
  async similaritySearchWithScore(
    query: string,
    k: number = 4
  ): Promise<[Document, number][]> {
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized. Call initialize() first.");
    }

    return await this.vectorStore.similaritySearchWithScore(query, k);
  }

  /**
   * Get the vector store as a retriever
   */
  asRetriever(k: number = 4) {
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized. Call initialize() first.");
    }

    return this.vectorStore.asRetriever({
      k,
      searchType: "similarity",
    });
  }

  /**
   * Clear all documents from the vector store
   */
  async clear(): Promise<void> {
    // Simply reset the in-memory store
    this.vectorStore = null;
    console.log("In-memory vector store cleared.");
  }

  /**
   * Get statistics about the vector store
   */
  async getStats(): Promise<{ documentCount: number }> {
    // If vector store doesn't exist yet, return 0
    if (!this.vectorStore) {
      return { documentCount: 0 };
    }

    try {
      // Try to estimate document count through a broad search
      const results = await this.vectorStore.similaritySearch("", 1000);
      return { documentCount: results.length };
    } catch (error) {
      // If search fails, return 0
      return { documentCount: 0 };
    }
  }
}
