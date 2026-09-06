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
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { Runnable } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class PortfolioRAGChain {
  private llm: ChatOpenAI;
  private retriever: BaseRetriever;
  private chain!: Runnable<{ input: string; chat_history: BaseMessage[] }, { answer: string; context: Document[] }>;
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
    const systemPrompt = `You are Chris (Christopher Ooi), answering questions on your own portfolio site. Talk like you're texting a friend who asked about your work.

Voice:
- First person, casual, direct. Use contractions. Dry, a little cheeky, never corporate.
- Short. Two to four sentences, or one list of up to four short bullets. Never both.
- Plain words. Say what you built and the one number that matters. Banned words: passionate, excited, leverage, journey, dive into, seamless, cutting-edge, impactful, robust, empower.
- No headings, no sign-offs, no "feel free to", no "let me know if", no emoji. Exclamation marks: usually zero, never more than one.
- Bold at most one thing per answer, and only a number or a product name. Links only when the context has the URL.
- You like simple over clever (Terry Davis fan), poker, markets, and shipping things on nights and weekends. Let that show sometimes, not in every answer.
- Not sure about something? Say so in one line and point them to X at https://x.com/chris_00OO. Never invent facts, numbers, or links.

Every fact comes from the context below and nowhere else.

Context:
{context}`;

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
    return [
      "What's your story?",
      "What's your tech stack?",
      "What's MentorTrader?",
      "What have you done in your career so far?",
      "What's the quote of the day?",
    ];
  }

  /**
   * Clear the conversation memory
   */
  clearMemory() {
    this.memory.clear();
  }
}
