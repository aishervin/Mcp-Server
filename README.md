# MCP Server

Personal MCP Server for Shervin - AI and Cloud Services Integration

## ✨ Features

- **10 AI Services:** Mistral, OpenAI, Gemini, Numes, OpenCode Zen, Pollinations, OpenRouter, DeepSeek, LLM7, Apinex
- **Cloud Services:** GitHub, Cloudflare
- **Modular Architecture** - Easy to add new services
- **Cloudflare Workers Ready**
- **Local Execution Support**

## 🚀 Quick Start

### Deploy to Cloudflare Workers

```bash
# Install dependencies
npm install

# Build
npm run build

# Login to Cloudflare
wrangler login

# Add your API keys as secrets
wrangler secret put MISTRAL_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put GEMINI_API_KEY
# ... add all your keys

# Deploy
wrangler deploy
```

### Run Locally

```bash
npm install
npm run build
npm start
```

## 📋 Available Tools

### AI Services
- `mistral_chat` - Chat with Mistral AI
- `openai_chat` - Chat with OpenAI
- `gemini_chat` - Chat with Google Gemini
- `numes_chat` - Chat with Numes AI
- `opencode_chat` - Chat with OpenCode Zen
- `pollinations_chat` - Chat with Pollinations AI
- `openrouter_chat` - Chat via OpenRouter
- `deepseek_chat` - Chat with DeepSeek
- `llm7_chat` - Chat with LLM7
- `apinex_chat` - Chat with Apinex

### Cloud Services
- `github_get_repo` - Get GitHub repository info
- `github_get_user` - Get GitHub user info
- `cloudflare_list_zones` - List Cloudflare zones

## 🔐 Configuration

Create a `.env` file or use Cloudflare secrets:

```env
MISTRAL_API_KEY=your_key
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
NUMES_API_KEY=your_key
OPENCODE_API_KEY=your_key
POLLINATIONS_API_KEY=your_key
OPENROUTER_API_KEY=your_key
LLM7_API_KEY=your_key
APINEX_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
GITHUB_TOKEN=your_token
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

## 📡 Usage

Connect to your MCP server:

```bash
mistral --mcp-server-address https://mcp-server.<your-subdomain>.workers.dev
```

## 🎯 Project Structure

```
Mcp-Server/
├── src/
│   └── index.ts          # Main server
├── package.json
├── tsconfig.json
├── wrangler.toml         # Cloudflare config
└── README.md
```

## 📄 License

MIT

---

**Worker Name:** `shervinmcp`
