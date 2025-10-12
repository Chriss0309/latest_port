import { Document } from "@langchain/core/documents";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import fs from "fs/promises";
import path from "path";

// Interface for loader configuration
interface LoaderConfig {
  dataPath?: string;
  webUrls?: string[];
  twitterHandle?: string;
}

export class PortfolioDataLoader {
  private dataPath: string;
  private webUrls: string[];
  private twitterHandle?: string;

  constructor(config: LoaderConfig = {}) {
    this.dataPath = config.dataPath || path.join(process.cwd(), "data");
    this.webUrls = config.webUrls || [];
    this.twitterHandle = config.twitterHandle;
  }

  /**
   * Load all documents from various sources
   */
  async loadAllDocuments(): Promise<Document[]> {
    const documents: Document[] = [];

    // Load local files
    const localDocs = await this.loadLocalDocuments();
    documents.push(...localDocs);

    // Load web documents
    if (this.webUrls.length > 0) {
      const webDocs = await this.loadWebDocuments();
      documents.push(...webDocs);
    }

    // Load Twitter data (if handle provided)
    if (this.twitterHandle) {
      const twitterDocs = await this.loadTwitterData();
      documents.push(...twitterDocs);
    }

    return documents;
  }

  /**
   * Load documents from local markdown and text files
   */
  private async loadLocalDocuments(): Promise<Document[]> {
    try {
      // Check if data directory exists
      await fs.access(this.dataPath);

      // Use DirectoryLoader to load all markdown and text files
      const loader = new DirectoryLoader(this.dataPath, {
        ".md": (path) => new TextLoader(path),
        ".txt": (path) => new TextLoader(path),
      });

      const docs = await loader.load();
      
      // Add metadata to identify source
      return docs.map(doc => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          source_type: "local_file",
        },
      }));
    } catch (error) {
      console.warn("Data directory not found or error loading local documents:", error);
      return [];
    }
  }

  /**
   * Load documents from web URLs
   */
  private async loadWebDocuments(): Promise<Document[]> {
    const documents: Document[] = [];

    for (const url of this.webUrls) {
      try {
        const loader = new CheerioWebBaseLoader(url, {
          selector: "body", 
        });
        
        const docs = await loader.load();
        
        // Add metadata
        const processedDocs = docs.map(doc => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            source_type: "web",
            url,
          },
        }));
        
        documents.push(...processedDocs);
      } catch (error) {
        console.error(`Error loading web document from ${url}:`, error);
      }
    }

    return documents;
  }

  /**
   * Load Twitter profile data
   * Note: This is a placeholder - actual Twitter API integration would require authentication
   */
  private async loadTwitterData(): Promise<Document[]> {
    // Placeholder for Twitter data loading
    // In a real implementation, you would use the Twitter API
    // For now, return a mock document
    if (this.twitterHandle) {
      return [
        new Document({
          pageContent: `Twitter profile: @${this.twitterHandle}. This is a placeholder for Twitter data. To implement real Twitter integration, you'll need to use the Twitter API with proper authentication.`,
          metadata: {
            source_type: "twitter",
            handle: this.twitterHandle,
          },
        }),
      ];
    }
    return [];
  }

  /**
   * Add custom documents programmatically
   */
  static createDocument(content: string, metadata: Record<string, any> = {}): Document {
    return new Document({
      pageContent: content,
      metadata: {
        source_type: "custom",
        ...metadata,
      },
    });
  }
}
