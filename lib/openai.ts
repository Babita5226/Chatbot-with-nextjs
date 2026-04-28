// This file should be added to .gitignore or .env.local in production
// Ollama API integration
export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "";
export const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
