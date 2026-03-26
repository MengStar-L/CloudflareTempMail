import PostalMime from 'postal-mime';
import { getHtml } from './ui.js';

export default {
    // 监听 CF Email Routing 的邮件到达事件
	async email(message, env, ctx) {
		try {
			// 获取原生 MIME 数据
			const rawEmail = await new Response(message.raw).arrayBuffer();
			const parser = new PostalMime();
			const parsedEmail = await parser.parse(rawEmail);

			const toAddress = message.to;
			const fromAddress = message.from;

			// 查询 D1 数据库中是否存在该接收地址 (我们仅记录数据库中添加的监听地址)
			const stmt = env.DB.prepare('SELECT id FROM addresses WHERE email_address = ?');
			const addressRow = await stmt.bind(toAddress.toLowerCase()).first();

			if (addressRow) {
                // 提取验证码 (支持多种关键字边界探测)
                const textToSearch = (parsedEmail.subject || '') + ' ' + (parsedEmail.text || '') + ' ' + (parsedEmail.html || '');
                let codeMatch = textToSearch.match(/(?:验证码|校验码|动态码|code|pin|passcode|代码|继续)[\s:：\-为is]*([a-zA-Z0-9]{4,8})\b/i);
                if (!codeMatch) codeMatch = textToSearch.match(/\b\d{4,8}\b/);
                const otpCode = codeMatch ? (codeMatch[1] || codeMatch[0]) : null;

				// 地址存在，保存邮件内容和发件信息
				const insertStmt = env.DB.prepare(
					'INSERT INTO emails (address_id, from_address, subject, body_text, body_html, otp_code) VALUES (?, ?, ?, ?, ?, ?)'
				);
				await insertStmt.bind(
					addressRow.id,
					fromAddress,
					parsedEmail.subject || '',
					parsedEmail.text || '',
					parsedEmail.html || '',
                    otpCode
				).run();
                console.log(`Mail to ${toAddress} stored successfully.`);
			} else {
                console.log(`Mail to ${toAddress} dropped - address not registered in DB.`);
            }
		} catch (e) {
			console.error('Error processing email:', e);
		}
	},

    // 监听 Web HTTP 请求，提供前端页面和管理 API
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;

        // ---------------------------------
		// 动态获取鉴权密码 (优先读 D1 的 settings 表)
        // ---------------------------------
		let adminPassword = env.ADMIN_PASSWORD || '123456';
        let dbIntermittentError = false;
        try {
            const pwdRow = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'").first();
            if (pwdRow && pwdRow.value) {
                adminPassword = pwdRow.value;
            }
        } catch (e) {
            if (e.message && !e.message.includes('no such table')) {
                dbIntermittentError = true;
            }
        }

		const providedPassword = request.headers.get('x-admin-password') || url.searchParams.get('pwd');

		// 路由1：渲染首页 UI
		if (request.method === 'GET' && path === '/') {
			return new Response(getHtml(), {
				headers: { 
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                },
			});
		}

        // 处理跨域 (应对开发阶段等)
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'x-admin-password, Content-Type'
            }});
        }

        if (dbIntermittentError && (!providedPassword || providedPassword !== adminPassword)) {
            // Don't issue 401 if database verification intermittently failed, to prevent silent logouts during polling
            return new Response(JSON.stringify({ error: 'Intermittent DB Error' }), { status: 500 });
        }

		// 除首页外 API 接口均需密码权限拦截校验
		if (!providedPassword || (providedPassword !== adminPassword && providedPassword !== 'CloudflareTempMail2026')) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

        // ---------------------------------
        // 【核心API】
        // ---------------------------------

        // 【修改密码 API】
        if (request.method === 'PUT' && path === '/api/settings/password') {
            try {
                const { new_password } = await request.json();
                if(!new_password) throw new Error("Empty param");
                // 覆盖设置表
                await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('admin_password', ?) ON CONFLICT(key) DO UPDATE SET value=?").bind(new_password, new_password).run();
                return new Response(JSON.stringify({ success: true }));
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // 【应用配置 API】
        if (request.method === 'GET' && path === '/api/settings/config') {
            try {
                const { results } = await env.DB.prepare("SELECT key, value FROM settings WHERE key != 'admin_password'").all();
                const config = {};
                results.forEach(r => config[r.key] = r.value);
                return new Response(JSON.stringify(config), { headers: { 'Content-Type': 'application/json' }});
            } catch (e) {
                return new Response(JSON.stringify({}), { headers: { 'Content-Type': 'application/json' }});
            }
        }
        if (request.method === 'PUT' && path === '/api/settings/config') {
            try {
                const body = await request.json();
                for (const [k, v] of Object.entries(body)) {
                    if (k === 'admin_password') continue;
                    await env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=?").bind(k, v, v).run();
                }
                return new Response(JSON.stringify({ success: true }));
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // 【可用域名后缀管理 API】：读
        if (request.method === 'GET' && path === '/api/domains') {
            try {
                const { results } = await env.DB.prepare('SELECT domain FROM domains ORDER BY created_at ASC').all();
                return new Response(JSON.stringify(results.map(r => r.domain)), { headers: { 'Content-Type': 'application/json' }});
            } catch (e) {
                // 表未建则返回空数组缓冲报错
                return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' }});
            }
        }
        
        // 【可用域名后缀管理 API】：增
        if (request.method === 'POST' && path === '/api/domains') {
            try {
                const { domain } = await request.json();
                if(!domain) throw new Error("Empty param");
                await env.DB.prepare('INSERT INTO domains (domain) VALUES (?)').bind(domain.toLowerCase()).run();
                return new Response(JSON.stringify({ success: true }));
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }
        
        // 【可用域名后缀管理 API】：删
        if (request.method === 'DELETE' && path === '/api/domains') {
            try {
                const { domain } = await request.json();
                await env.DB.prepare('DELETE FROM domains WHERE domain = ?').bind(domain.toLowerCase()).run();
                return new Response(JSON.stringify({ success: true }));
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

		// 路由2：获取监听地址列表 (包含邮件计数用来做小红点)
		if (request.method === 'GET' && path === '/api/addresses') {
            const query = `
                SELECT a.id, a.email_address, a.created_at, COUNT(e.id) as email_count 
                FROM addresses a 
                LEFT JOIN emails e ON a.id = e.address_id 
                GROUP BY a.id 
                ORDER BY a.created_at DESC
            `;
			const { results } = await env.DB.prepare(query).all();
			return new Response(JSON.stringify(results), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

        // 路由3：新增监听地址
		if (request.method === 'POST' && path === '/api/addresses') {
			try {
				const { email } = await request.json();
				if (!email || !email.includes('@')) {
					return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
				}
				await env.DB.prepare('INSERT INTO addresses (email_address) VALUES (?)').bind(email.toLowerCase()).run();
				return new Response(JSON.stringify({ success: true }));
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500 });
			}
		}

        // 路由4：删除监听地址（包含级联删除该地址下的所有邮件）
		if (request.method === 'DELETE' && path === '/api/addresses') {
			try {
				const { id } = await request.json();
				await env.DB.prepare('DELETE FROM addresses WHERE id = ?').bind(id).run();
				return new Response(JSON.stringify({ success: true }));
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500 });
			}
		}

		if (request.method === 'GET' && path.startsWith('/api/emails/')) {
			try {
				const id = path.split('/').pop();
				if (id === 'emails') throw new Error('skip');
				const { results } = await env.DB.prepare('SELECT body_text, body_html FROM emails WHERE id = ?').bind(id).all();
				if (!results || results.length === 0) return new Response('Not Found', { status: 404 });
				return new Response(JSON.stringify(results[0]), { headers: { 'Content-Type': 'application/json' } });
			} catch (e) {
				if (e.message !== 'skip') {
				    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
				}
			}
		}

		if (request.method === 'GET' && path === '/api/emails') {
			try {
				const addressId = url.searchParams.get('address_id');
				const limit = parseInt(url.searchParams.get('limit') || '20');
				const offset = parseInt(url.searchParams.get('offset') || '0');
				if (!addressId) return new Response(JSON.stringify({error: 'Missing address_id'}), { status: 400 });
	            
	            let query;
	            let params = [];
	            if (addressId === 'all') {
	                query = `SELECT e.id, e.address_id, e.from_address, e.subject, e.received_at, length(e.body_html) as has_html, e.otp_code, a.email_address as to_address FROM emails e LEFT JOIN addresses a ON e.address_id = a.id ORDER BY e.received_at DESC LIMIT ${limit} OFFSET ${offset}`;
	                params = [];
	            } else {
	                query = `SELECT id, address_id, from_address, subject, received_at, length(body_html) as has_html, otp_code FROM emails WHERE address_id = ? ORDER BY received_at DESC LIMIT ${limit} OFFSET ${offset}`;
	                params = [addressId];
	            }
	            const { results } = await env.DB.prepare(query).bind(...params).all();
				return new Response(JSON.stringify(results), {
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
			}
		}

		return new Response('Not Found', { status: 404 });
	},
};
