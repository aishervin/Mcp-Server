// MCP Server for Shervin
// Worker name: shervinmcp
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };
        // Handle OPTIONS
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        // Only handle POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                error: 'Method not allowed',
                message: 'Use POST to call MCP tools'
            }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        try {
            const body = await request.json();
            const { method, params } = body;
            // Handle tools/list request
            if (method === 'tools/list') {
                return new Response(JSON.stringify({
                    tools: [
                        // AI Tools
                        {
                            name: 'mistral_chat',
                            description: 'Chat with Mistral AI',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    model: { type: 'string', default: 'mistral-large' },
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
                                    temperature: { type: 'number', default: 0.7 },
                                    maxTokens: { type: 'integer', default: 2000 },
                                },
                                required: ['messages'],
                            },
                        },
                        {
                            name: 'openai_chat',
                            description: 'Chat with OpenAI',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    model: { type: 'string', default: 'gpt-3.5-turbo' },
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
                                    temperature: { type: 'number', default: 0.7 },
                                    maxTokens: { type: 'integer', default: 2000 },
                                },
                                required: ['messages'],
                            },
                        },
                        {
                            name: 'gemini_chat',
                            description: 'Chat with Google Gemini',
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
                        },
                        {
                            name: 'numes_chat',
                            description: 'Chat with Numes AI',
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
                        },
                        {
                            name: 'opencode_chat',
                            description: 'Chat with OpenCode Zen',
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
                        },
                        {
                            name: 'pollinations_chat',
                            description: 'Chat with Pollinations AI',
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
                        },
                        {
                            name: 'openrouter_chat',
                            description: 'Chat via OpenRouter',
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
                        },
                        {
                            name: 'deepseek_chat',
                            description: 'Chat with DeepSeek',
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
                        },
                        {
                            name: 'llm7_chat',
                            description: 'Chat with LLM7',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    model: { type: 'string', default: 'llm7' },
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
                        },
                        {
                            name: 'apinex_chat',
                            description: 'Chat with Apinex',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    model: { type: 'string', default: 'apinex' },
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
                        },
                        // Cloud Tools
                        {
                            name: 'github_get_repo',
                            description: 'Get GitHub repository info',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    owner: { type: 'string' },
                                    repo: { type: 'string' },
                                },
                                required: ['owner', 'repo'],
                            },
                        },
                        {
                            name: 'github_get_user',
                            description: 'Get GitHub user info',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                        {
                            name: 'cloudflare_list_zones',
                            description: 'List Cloudflare zones',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                    ],
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            // Handle tools/call request
            if (method === 'tools/call') {
                const { name, arguments: args } = params;
                // AI Tools handlers
                if (name === 'mistral_chat') {
                    if (!env.MISTRAL_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'MISTRAL_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.MISTRAL_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'mistral-large',
                            messages: args.messages,
                            temperature: args.temperature || 0.7,
                            max_tokens: args.maxTokens || 2000,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'openai_chat') {
                    if (!env.OPENAI_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'OPENAI_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'gpt-3.5-turbo',
                            messages: args.messages,
                            temperature: args.temperature || 0.7,
                            max_tokens: args.maxTokens || 2000,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'gemini_chat') {
                    if (!env.GEMINI_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'GEMINI_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${args.model || 'gemini-pro'}:generateContent?key=${env.GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: args.messages }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'numes_chat') {
                    if (!env.NUMES_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'NUMES_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.numes.io/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.NUMES_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'numes-7b-chat',
                            messages: args.messages,
                            temperature: args.temperature || 0.7,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'opencode_chat') {
                    if (!env.OPENCODE_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'OPENCODE_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.opencode.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.OPENCODE_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'opencode-zen',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'pollinations_chat') {
                    if (!env.POLLINATIONS_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'POLLINATIONS_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.pollinations.ai/v1/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.POLLINATIONS_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'llama-2-7b-chat',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'openrouter_chat') {
                    if (!env.OPENROUTER_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'OPENROUTER_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'openai/gpt-3.5-turbo',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'deepseek_chat') {
                    if (!env.DEEPSEEK_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'DEEPSEEK_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'deepseek-chat',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'llm7_chat') {
                    if (!env.LLM7_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'LLM7_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.llm7.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.LLM7_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'llm7',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'apinex_chat') {
                    if (!env.APINEX_API_KEY) {
                        return new Response(JSON.stringify({
                            error: 'APINEX_API_KEY not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.apinex.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.APINEX_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: args.model || 'apinex',
                            messages: args.messages,
                        }),
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify(data, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                // Cloud Tools handlers
                if (name === 'github_get_repo') {
                    if (!env.GITHUB_TOKEN) {
                        return new Response(JSON.stringify({
                            error: 'GITHUB_TOKEN not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch(`https://api.github.com/repos/${args.owner}/${args.repo}`, {
                        headers: {
                            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                            'User-Agent': 'MCP-Server',
                        },
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify({
                                    name: data.name,
                                    owner: data.owner?.login,
                                    description: data.description,
                                    stars: data.stargazers_count,
                                    forks: data.forks_count,
                                    htmlUrl: data.html_url,
                                }, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'github_get_user') {
                    if (!env.GITHUB_TOKEN) {
                        return new Response(JSON.stringify({
                            error: 'GITHUB_TOKEN not configured'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch('https://api.github.com/user', {
                        headers: {
                            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                            'User-Agent': 'MCP-Server',
                        },
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify({
                                    login: data.login,
                                    name: data.name,
                                    email: data.email,
                                    htmlUrl: data.html_url,
                                }, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                if (name === 'cloudflare_list_zones') {
                    if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) {
                        return new Response(JSON.stringify({
                            error: 'CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required'
                        }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/zones`, {
                        headers: {
                            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
                        },
                    });
                    const data = await response.json();
                    return new Response(JSON.stringify({
                        content: [{
                                type: 'text',
                                text: JSON.stringify({
                                    zones: data.result || [],
                                    count: (data.result || []).length,
                                }, null, 2),
                            }],
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                // Tool not found
                return new Response(JSON.stringify({
                    error: `Tool not found: ${name}`
                }), {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            // Unknown method
            return new Response(JSON.stringify({
                error: `Unknown method: ${method}`
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        catch (error) {
            return new Response(JSON.stringify({
                error: error instanceof Error ? error.message : String(error)
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};
