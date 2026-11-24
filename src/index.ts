// ===========================================
// MCP Server for Shervin
// سرور MCP ساده برای شروین
// بدون هیچ کلیدی - شما خودتون کلیدها رو اضافه می‌کنید
// ===========================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FetchTransport } from '@modelcontextprotocol/sdk/transport/fetch.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// ===========================================
// Type Definitions
// ===========================================

interface Env {
  // کلیدهای سرویس‌های هوش مصنوعی
  MISTRAL_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  NUMES_API_KEY?: string;
  OPENCODE_API_KEY?: string;
  POLLINATIONS_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  LLM7_API_KEY?: string;
  APINEX_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  
  // کلیدهای سرویس‌های ابری
  GITHUB_TOKEN?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (params: any, env: Env) => Promise<{ type: string; text: string }>;
}

// ===========================================
// سرویس‌های هوش مصنوعی
// ===========================================

// لیست تمام مدل‌های پشتیبانی شده
const AI_MODELS = {
  mistral: ['mistral-tiny', 'mistral-small', 'mistral-medium', 'mistral-large', 'mixtral-8x7b', 'mixtral-8x22b'],
  openai: ['gpt-4', 'gpt-4-32k', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
  gemini: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
};

// ابزار چت عمومی (برای تمام سرویس‌ها)
async function createAIChatTool(serviceName: string, apiUrl: string, authHeader: string): Promise<MCPTool> {
  return {
    name: `${serviceName}_chat`,
    description: `Send a message to ${serviceName.toUpperCase()} AI`,
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model to use' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant', 'system'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
        temperature: { type: 'number', default: 0.7, minimum: 0, maximum: 1 },
        maxTokens: { type: 'integer', default: 2000, minimum: 1, maximum: 32000 },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      const apiKey = env[`${serviceName.toUpperCase()}_API_KEY` as keyof Env];
      if (!apiKey) {
        throw new Error(`${serviceName.toUpperCase()}_API_KEY is not configured`);
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [authHeader]: apiKey,
          },
          body: JSON.stringify({
            model: params.model,
            messages: params.messages,
            temperature: params.temperature || 0.7,
            max_tokens: params.maxTokens || 2000,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${response.status} - ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        return {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        };
      } catch (error) {
        throw new Error(`Failed to call ${serviceName} API: ${error}`);
      }
    },
  };
}

// ابزار لیست مدل‌ها
function createAIListModelsTool(serviceName: string, models: string[]): MCPTool {
  return {
    name: `${serviceName}_list_models`,
    description: `List all available ${serviceName} models`,
    inputSchema: { type: 'object', properties: {} },
    handler: async () => ({
      type: 'text',
      text: JSON.stringify({ models, count: models.length }, null, 2),
    }),
  };
}

// ===========================================
// سرویس‌های ابری
// ===========================================

// ابزارهای GitHub
const githubTools: MCPTool[] = [
  {
    name: 'github_get_repo',
    description: 'Get information about a GitHub repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
      },
      required: ['owner', 'repo'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not configured');
      }

      const response = await fetch(
        `https://api.github.com/repos/${params.owner}/${params.repo}`,
        {
          headers: {
            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
            'User-Agent': 'MCP-Server',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify({
          name: data.name,
          owner: data.owner?.login,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          htmlUrl: data.html_url,
        }, null, 2),
      };
    },
  },
  {
    name: 'github_get_user',
    description: 'Get information about the authenticated user',
    inputSchema: { type: 'object', properties: {} },
    handler: async (params: any, env: Env) => {
      if (!env.GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not configured');
      }

      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'User-Agent': 'MCP-Server',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify({
          login: data.login,
          name: data.name,
          email: data.email,
          htmlUrl: data.html_url,
        }, null, 2),
      };
    },
  },
];

// ابزارهای Cloudflare
const cloudflareTools: MCPTool[] = [
  {
    name: 'cloudflare_list_zones',
    description: 'List all Cloudflare zones',
    inputSchema: { type: 'object', properties: {} },
    handler: async (params: any, env: Env) => {
      if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) {
        throw new Error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required');
      }

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/zones`,
        {
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(`Cloudflare API Error: ${JSON.stringify(data.errors)}`);
      }

      return {
        type: 'text',
        text: JSON.stringify({
          zones: data.result,
          count: data.result.length,
        }, null, 2),
      };
    },
  },
];

// ===========================================
// لیست تمام ابزارها
// ===========================================

// ابزارهای هوش مصنوعی
const aiTools: MCPTool[] = [
  // Mistral
  await createAIChatTool('mistral', 'https://api.mistral.ai/v1/chat/completions', 'Authorization'),
  createAIListModelsTool('mistral', AI_MODELS.mistral),
  
  // OpenAI
  await createAIChatTool('openai', 'https://api.openai.com/v1/chat/completions', 'Authorization'),
  createAIListModelsTool('openai', AI_MODELS.openai),
  
  // Gemini
  {
    name: 'gemini_chat',
    description: 'Send a message to Google Gemini',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'gemini-pro' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'model'] },
              parts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                  },
                },
              },
            },
            required: ['role', 'parts'],
          },
        },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${params.model || 'gemini-pro'}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: params.messages }),
        }
      );

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
  createAIListModelsTool('gemini', AI_MODELS.gemini),
  
  // Numes
  {
    name: 'numes_chat',
    description: 'Send a message to Numes AI',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'numes-7b-chat' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
        temperature: { type: 'number', default: 0.7 },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.NUMES_API_KEY) {
        throw new Error('NUMES_API_KEY is not configured');
      }

      const response = await fetch('https://api.numes.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.NUMES_API_KEY}`,
        },
        body: JSON.stringify({
          model: params.model || 'numes-7b-chat',
          messages: params.messages,
          temperature: params.temperature || 0.7,
        }),
      });

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
  
  // OpenCode Zen
  {
    name: 'opencode_chat',
    description: 'Send a message to OpenCode Zen',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'opencode-zen' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.OPENCODE_API_KEY) {
        throw new Error('OPENCODE_API_KEY is not configured');
      }

      const response = await fetch('https://api.opencode.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENCODE_API_KEY}`,
        },
        body: JSON.stringify({
          model: params.model || 'opencode-zen',
          messages: params.messages,
        }),
      });

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
  
  // Pollinations
  {
    name: 'pollinations_chat',
    description: 'Send a message to Pollinations AI',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'llama-2-7b-chat' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.POLLINATIONS_API_KEY) {
        throw new Error('POLLINATIONS_API_KEY is not configured');
      }

      const response = await fetch('https://api.pollinations.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.POLLINATIONS_API_KEY}`,
        },
        body: JSON.stringify({
          model: params.model || 'llama-2-7b-chat',
          messages: params.messages,
        }),
      });

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
  
  // OpenRouter
  {
    name: 'openrouter_chat',
    description: 'Send a message via OpenRouter',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'openai/gpt-3.5-turbo' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY is not configured');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: params.model || 'openai/gpt-3.5-turbo',
          messages: params.messages,
        }),
      });

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
  
  // DeepSeek
  {
    name: 'deepseek_chat',
    description: 'Send a message to DeepSeek',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', default: 'deepseek-chat' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
            required: ['role', 'content'],
          },
        },
      },
      required: ['messages'],
    },
    handler: async (params: any, env: Env) => {
      if (!env.DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: params.model || 'deepseek-chat',
          messages: params.messages,
        }),
      });

      const data = await response.json();
      return {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      };
    },
  },
];

// تمام ابزارها
const allTools: MCPTool[] = [
  ...aiTools,
  ...githubTools,
  ...cloudflareTools,
];

// ===========================================
// سرور اصلی MCP
// ===========================================

function createServer(env: Env = {}) {
  const server = new Server(
    {
      name: 'shervinmcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // لیست کردن ابزارها
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // فراخوانی ابزارها
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = allTools.find(t => t.name === name);

    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    try {
      const result = await tool.handler(args, env);
      return {
        content: [result],
      };
    } catch (error) {
      throw new Error(`Tool error: ${error}`);
    }
  });

  return server;
}

// ===========================================
// Export برای Cloudflare Workers
// ===========================================

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const server = createServer(env);
    const transport = new FetchTransport(request, () => new Response());
    await server.connect(transport);
    return new Response(null, { status: 200 });
  },
};

// ===========================================
// اجرا به صورت Stdio (برای تست محلی)
// ===========================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  const transport = new StdioServerTransport();
  server.connect(transport).catch(console.error);
}
