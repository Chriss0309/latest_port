# Portfolio RAG Chatbot Setup Guide

## Overview
This portfolio website features an AI-powered chatbot that can answer questions about your background, experience, and projects using Retrieval Augmented Generation (RAG) with LangChain, OpenAI, and FAISS.

## Prerequisites
- Node.js 18+ installed
- OpenAI API key

## Setup Instructions

### 1. Install Dependencies
```bash
npm install faiss-node @langchain/openai cheerio dotenv
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Vector Store Configuration
VECTOR_STORE_PATH=./vector_store

# Data Source Paths
DATA_PATH=./data

# Optional: Web URLs to scrape (comma-separated)
WEB_URLS=https://your-github.com,https://your-portfolio.com

# Optional: Twitter handle
TWITTER_HANDLE=yourhandle
```

### 3. Customize Your Personal Data
Edit the sample files in the `data/` directory:
- `data/about-me.md` - Personal information and summary
- `data/experience.md` - Work experience and roles
- `data/projects.md` - Project descriptions and technologies

### 4. Initialize the Vector Store
The vector store will automatically initialize when you first use the chat. Alternatively, you can manually initialize it:

```bash
curl -X POST http://localhost:3000/api/chat/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "clearExisting": true,
    "webUrls": ["https://github.com/yourusername"],
    "twitterHandle": "yourhandle"
  }'
```

### 5. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio with the integrated chatbot.

## Architecture

### Components
- **Data Loader** (`src/lib/rag/loader.ts`) - Loads documents from various sources
- **Vector Store** (`src/lib/rag/vectorStore.ts`) - Manages FAISS vector database
- **RAG Chain** (`src/lib/rag/chain.ts`) - Implements the retrieval and generation logic
- **Chat API** (`src/app/api/chat/route.ts`) - Handles chat requests
- **Chat UI** (`src/components/chat/ChatInterface.tsx`) - User interface

### Data Flow
1. User asks a question
2. Question is sent to the API endpoint
3. RAG chain retrieves relevant documents from vector store
4. OpenAI generates a response based on retrieved context
5. Response is streamed back to the user

## Customization

### Adding More Data Sources
Edit `src/app/api/chat/route.ts` to add more data sources:
```typescript
const loader = new PortfolioDataLoader({
  dataPath: "./data",
  webUrls: ["https://your-site.com"],
  twitterHandle: "yourhandle"
});
```

### Modifying the Assistant's Personality
Edit the system prompt in `src/lib/rag/chain.ts` to change how the assistant responds.

### Adjusting Retrieval Settings
Modify the retriever settings in `src/lib/rag/vectorStore.ts`:
- Change chunk size for document splitting
- Adjust the number of retrieved documents (k parameter)
- Use different embedding models

## Troubleshooting

### Common Issues
1. **"OpenAI API key is required"** - Make sure your `.env.local` file contains a valid API key
2. **"No documents in vector store"** - Check that your data files exist in the `data/` directory
3. **Rate limiting errors** - Consider using a different OpenAI model or implementing rate limiting

### Clearing the Vector Store
If you need to reset the vector store:
```bash
rm -rf ./vector_store
```

Then restart the application to reinitialize.

## Cost Considerations
- The chatbot uses OpenAI's `gpt-4o-mini` model for efficiency
- Embeddings use `text-embedding-3-small` for cost optimization
- Consider implementing caching for frequently asked questions

## Security Notes
- Never commit your `.env.local` file
- Validate and sanitize all user inputs
- Consider implementing rate limiting for production use
- Add authentication if deploying publicly
