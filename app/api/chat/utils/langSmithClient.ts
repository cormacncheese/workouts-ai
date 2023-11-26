import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';

export const client = new Client({
  apiUrl: 'https://api.smith.langchain.com',
  apiKey: process.env.LANGCHAIN_API_KEY
});

export const tracer = new LangChainTracer({
  projectName: 'maia-web',
  client
});
