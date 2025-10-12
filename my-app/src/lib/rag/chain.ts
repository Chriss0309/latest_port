import { ChatOpenAI } from "@langchain/openai";
import { 
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { BufferMemory } from "langchain/memory";
import { BaseRetriever } from "@langchain/core/retrievers";
import { RunnableSequence } from "@langchain/core/runnables";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class PortfolioRAGChain {
  private llm: ChatOpenAI;
  private retriever: BaseRetriever;
  private chain: any;
  private memory: BufferMemory;
  private initialized: Promise<void>;

  constructor(retriever: BaseRetriever, apiKey?: string) {
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required. Set OPENAI_API_KEY environment variable.");
    }

    // Initialize the LLM
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini", // Using the efficient model
      temperature: 0.7,
      streaming: true,
    });

    this.retriever = retriever;
    
    // Initialize memory
    this.memory = new BufferMemory({
      memoryKey: "chat_history",
      outputKey: "answer",
      returnMessages: true,
    });

    // Initialize the chain
    this.initialized = this.initializeChain();
  }

  private async initializeChain() {
    // System prompt for the portfolio assistant
    const systemPrompt = `You are a helpful AI assistant for a portfolio website. You have access to information about the portfolio owner's background, experience, projects, and skills.

When answering questions:
1. Act like you're the portfolio owner. 
2. Be friendly, casual, chill and conversational
3. Provide accurate information based on the context provided
4. If you don't have specific information, say so honestly
5. Keep responses concise but informative
6. Highlight relevant projects or experiences when appropriate
7. **IMPORTANT: Format all responses using Markdown syntax:**
   - Use **bold** for emphasis on key points, technologies, or achievements
   - Use bullet points or numbered lists for clarity
   - Use \`code blocks\` for technical terms, commands, or file names
   - Use proper headings (##, ###) when organizing longer responses
   - Use links [text](url) when referencing external resources

Context from the portfolio:
{context}

Remember to maintain a consistent tone that reflects chillness while being approachable. Always format your responses in clean, readable Markdown.`;

    // Create the prompt template for answering questions
    const qaPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPrompt),
      new MessagesPlaceholder("chat_history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    // Create a prompt for the history-aware retriever
    const retrieverPrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      ["user", "Given the above conversation, generate a search query to find relevant information from the portfolio to answer the question."],
    ]);

    // Create history-aware retriever
    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm: this.llm,
      retriever: this.retriever,
      rephrasePrompt: retrieverPrompt,
    });

    // Create document chain
    const documentChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt: qaPrompt,
    });

    // Create the retrieval chain
    this.chain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever: historyAwareRetriever,
    });
  }

  /**
   * Process a chat message and return the response
   */
  async chat(message: string, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Ensure chain is initialized
      await this.initialized;

      // Convert chat history to LangChain message format
      const messages = this.convertChatHistory(chatHistory);

      // Invoke the chain
      const response = await this.chain.invoke({
        input: message,
        chat_history: messages,
      });

      return response.answer;
    } catch (error) {
      console.error("Error in RAG chain:", error);
      throw error;
    }
  }

  /**
   * Stream a chat response
   */
  async *streamChat(message: string, chatHistory: ChatMessage[] = []): AsyncGenerator<string> {
    try {
      // Ensure chain is initialized
      await this.initialized;

      // Convert chat history to LangChain message format
      const messages = this.convertChatHistory(chatHistory);

      // Create a streaming version of the chain
      const stream = await this.chain.stream({
        input: message,
        chat_history: messages,
      });

      // Yield chunks as they come
      for await (const chunk of stream) {
        if (chunk.answer) {
          yield chunk.answer;
        }
      }
    } catch (error) {
      console.error("Error in RAG chain streaming:", error);
      throw error;
    }
  }

  /**
   * Convert chat history to LangChain message format
   */
  private convertChatHistory(chatHistory: ChatMessage[]): BaseMessage[] {
    return chatHistory.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });
  }

  /**
   * Get suggested questions based on the portfolio content
   */
  async getSuggestedQuestions(): Promise<string[]> {
    const suggestions = [
      "What is your professional background?",
      "What programming languages are you proficient in?",
      "Can you tell me about your recent projects?",
      "What kind of work experience do you have?",
      "What are your main technical skills?",
      "How can I contact you?",
      "What are you passionate about?",
      "What frameworks do you work with?",
    ];

    // You could enhance this by analyzing the actual content
    // and generating dynamic suggestions
    return suggestions.slice(0, 5);
  }

  /**
   * Clear the conversation memory
   */
  clearMemory() {
    this.memory.clear();
  }
}
