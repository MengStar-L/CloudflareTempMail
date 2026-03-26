export const getHtml = () => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Cloudflare 邮件接收控制台</title>
  <style>
    :root {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-light: #e2e8f0;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * { box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f1f5f9; margin: 0; padding: 16px; gap: 16px; display: flex; height: 100vh; color: var(--text-main); overflow: hidden; }
    
    @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes scaleOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.95) translateY(10px); } }
    @keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .sidebar { width: 340px; background: var(--card-bg); border-radius: 24px; display: flex; flex-direction: column; z-index: 10; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: var(--transition); border: 1px solid rgba(255,255,255,0.7); overflow: hidden; }
    .sidebar-header { padding: 20px 24px; border-bottom: 1px dashed var(--border-light); font-weight: 600; font-size: 16px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); }
    .sidebar-content { flex: 1; overflow-y: auto; padding: 24px; }
    
    .main { flex: 1; background: var(--card-bg); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(255,255,255,0.7); }
    .main-header { padding: 20px 32px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-bottom: 1px dashed var(--border-light); font-weight: 600; font-size: 16px; display: flex; justify-content: space-between; align-items: center; z-index: 5; }
    .main-content { flex: 1; overflow-y: auto; padding: 32px; }
    
    .list-item { padding: 16px; border: 1px solid var(--border-light); margin-bottom: 14px; border-radius: 16px; cursor: pointer; transition: var(--transition); background: var(--bg-color); position: relative; overflow: hidden; opacity: 0; animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .list-item:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: #cbd5e1; }
    .list-item.active { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); background: #fefeff; }
    .list-item-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; word-break: break-all; padding-right: 48px; display: flex; align-items: center; transition: var(--transition); }
    .email-count { font-size: 12px; color: var(--text-muted); display: inline-flex; align-items: center; background: #f1f5f9; padding: 2px 8px; border-radius: 12px; }
    .red-dot { display: inline-block; width: 8px; height: 8px; background: var(--danger); border-radius: 50%; margin-left: 8px; animation: pulse-dot 2s infinite; }

    .btn { background: var(--text-main); color: #fff; border: 1px solid var(--text-main); padding: 8px 16px; border-radius: var(--radius-sm); cursor: pointer; font-size: 14px; transition: var(--transition); font-weight: 500; display: inline-flex; justify-content: center; align-items: center;}
    .btn:hover { background: #334155; border-color: #334155; transform: translateY(-1px); box-shadow: var(--shadow-sm); }
    .btn:active { transform: translateY(0); }
    .btn-outline { background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);}
    .btn-outline:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .btn-danger { background: #fff0f2; color: var(--danger); border: 1px solid #fecdd3; padding: 4px 10px; font-size: 12px; border-radius: var(--radius-sm); transition: var(--transition); font-weight: 500;}
    .btn-danger:hover { background: var(--danger); color: #fff; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
    .btn-icon-hover { opacity: 0; visibility: hidden; position: absolute; right: 12px; top: 14px; transform: translateX(10px); }
    .list-item:hover .btn-icon-hover { opacity: 1; visibility: visible; transform: translateX(0); }
    
    .input { padding: 10px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); width: 100%; box-sizing: border-box; font-size: 14px; outline: none; transition: var(--transition); background: var(--card-bg); color: var(--text-main); }
    .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    
    .address-input-group { display: flex; align-items: stretch; margin-bottom: 24px; gap: 0; border: 1px solid var(--border-light); border-radius: 22px; overflow: visible; transition: var(--transition); box-shadow: 0 4px 12px rgba(0,0,0,0.03); background: var(--card-bg); height: 44px; position: relative; }
    .address-input-group:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    .address-input-group .input { border: none; border-radius: 22px 0 0 22px; outline: none; flex: 0 0 28%; font-size: 14px; padding: 0 4px 0 16px; background: transparent; transition: var(--transition); height: 100%; box-shadow: none !important; }
    .address-input-group .input:focus { background: transparent; }
    .address-input-group span { background: transparent; padding: 0 6px; color: var(--text-muted); font-size: 15px; display: flex; align-items: center; font-weight: 500; }
    .address-input-group > .btn:last-child { border-radius: 0 22px 22px 0; border: none; border-left: 1px solid var(--border-light); font-weight: 600; padding: 0 14px; height: 100%; box-shadow: none; background: linear-gradient(to bottom, #1e293b, #0f172a); color: #fff;}
    .address-input-group > .btn:last-child:hover { background: #0f172a; }
    
    /* 现代悬浮提示框 Tooltip */
    [data-tooltip] { position: relative; }
    [data-tooltip]::before, [data-tooltip]::after { position: absolute; visibility: hidden; opacity: 0; transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; z-index: 1000; }
    [data-tooltip]::before { content: ''; border: 5px solid transparent; border-bottom-color: #1e293b; top: 100%; left: 50%; transform: translateX(-50%) translateY(-4px); }
    [data-tooltip]::after { content: attr(data-tooltip); background: #1e293b; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; white-space: nowrap; top: 100%; left: 50%; transform: translateX(-50%) translateY(2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    [data-tooltip]:hover::before, [data-tooltip]:hover::after { visibility: visible; opacity: 1; }
    [data-tooltip]:hover::before { transform: translateX(-50%) translateY(2px); }
    [data-tooltip]:hover::after { transform: translateX(-50%) translateY(8px); }
    
    /* 自定义拟态 Select 组件样式 */
    .custom-select { flex: 1; min-width: 0; position: relative; height: 100%; }
    .select-selected { height: 100%; width: 100%; border: none; border-radius: 0; outline: none; padding: 0 12px 0 4px; background-color: transparent; font-size: 14px; cursor: pointer; color: var(--text-main); font-weight: 500; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 14px center; background-size: 16px; padding-right: 36px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; user-select: none; transition: var(--transition); }
    .select-selected:focus { border: none; box-shadow: none; background-color: transparent; }
    .select-items { position: absolute; top: calc(100% + 4px); right: 0; min-width: 100%; background-color: var(--card-bg); box-shadow: var(--shadow-lg); border-radius: var(--radius-sm); border: 1px solid var(--border-light); z-index: 100; max-height: 220px; overflow-y: auto; overflow-x: hidden; padding: 4px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: var(--transition); }
    .select-items.show { opacity: 1; visibility: visible; transform: translateY(0); }
    .select-items div { padding: 10px 12px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-main); transition: var(--transition); border-radius: 4px; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}
    .select-items div:hover { background-color: #f1f5f9; color: var(--primary); }

    .email-detail { background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); transition: var(--transition); opacity: 0; animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; overflow: hidden; flex-shrink: 0; }
    .email-detail:hover { box-shadow: var(--shadow-md); }
    .header-wrap { padding: 24px 28px; cursor: pointer; transition: background 0.2s, padding 0.3s; }
    .header-wrap:hover { background: #f8fafc; }
    .email-body-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.35s cubic-bezier(0.25, 0.1, 0.25, 1); min-width: 0; width: 100%; box-sizing: border-box; }
    .email-body-content { overflow: hidden; min-height: 0; min-width: 0; box-sizing: border-box; }
    .email-subject { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #1e293b; letter-spacing: -0.01em; }
    .email-meta { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; }
    .from-badge { background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 12px; font-weight: 500; }
    .email-body { font-size: 15px; line-height: 1.7; color: #334155; white-space: pre-wrap; word-break: break-word; background: #f8fafc; padding: 20px; border-radius: var(--radius-md); border: 1px solid #f1f5f9; }
    
    .overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(6px); opacity: 0; animation: fadeIn 0.25s ease forwards; }
    .overlay.closing { animation: fadeOut 0.2s ease forwards; }
    .modal-box { background: var(--card-bg); padding: 32px; border-radius: var(--radius-lg); width: 440px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); max-height: 85vh; overflow-y: auto; opacity: 0; animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; border: 1px solid rgba(255,255,255,0.2); }
    .overlay.closing .modal-box { animation: scaleOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .modal-title { margin-top:0; font-size:20px; text-align:center; margin-bottom:28px; font-weight: 700; color: #1e293b; letter-spacing: -0.01em; }
    .hidden { display: none !important; }
    
    .setting-group { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px dashed var(--border-light); }
    .setting-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0;}
    .setting-title { font-size: 14px; font-weight: 600; margin-bottom: 14px; display: block; color: #334155;}
    
    .domain-list { border: 1px solid var(--border-light); border-radius: var(--radius-sm); max-height: 180px; overflow-y: auto; margin-bottom: 16px; background: #f8fafc; }
    .domain-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); font-size: 14px; transition: var(--transition); }
    .domain-item:hover { background: #fff; }
    .domain-item:last-child { border-bottom: none; }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    
    .mobile-back-btn { display: none !important; }
    @media (max-width: 768px) {
      body { padding: 0; gap: 0; }
      .sidebar { width: 100%; border-radius: 0; border: none; box-shadow: none; z-index: 10; }
      .main { position: fixed; inset: 0; z-index: 20; border-radius: 0; border: none; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); background: #f8fafc; }
      .main.mobile-active { transform: translateX(0); }
      .mobile-back-btn { display: inline-flex !important; }
      .modal-box { width: calc(100% - 40px) !important; padding: 24px !important; }
      .main-header { padding: 16px 20px !important; }
      .main-content { padding: 0 16px 20px 16px !important; }
      .email-detail { border-radius: 16px; margin-bottom: 12px; }
      .email-body { padding: 16px; }
      .header-wrap { padding: 16px 20px; }
      .email-meta { flex-direction: column; align-items: flex-start; gap: 8px; }
      #custom-domain-select { min-width: 80px; }
    }
  </style>
</head>
<body>
  <div id="auth-overlay" class="overlay">
    <div class="modal-box" style="width: 360px;">
      <h3 class="modal-title">🔐 验证访问权限</h3>
      <input type="password" id="pwd-input" class="input" style="margin-bottom:20px; text-align: center; letter-spacing: 2px;" placeholder="请输入专属访问密码" />
      <button class="btn" style="width:100%; padding: 12px; font-size: 15px;" onclick="saveAuthPwd()">进入随身邮箱</button>
    </div>
  </div>

  <div id="confirm-overlay" class="overlay hidden" style="z-index: 200;">
    <div class="modal-box" style="width: 380px; padding: 28px; text-align: center;">
      <div style="color: var(--danger); margin-bottom: 20px;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="56" height="56" style="margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #1e293b;">敏感操作确认</h3>
      <div id="confirm-msg" style="font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 28px;"></div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-outline" style="flex: 1;" onclick="closeConfirm(false)">取消</button>
        <button class="btn btn-danger" style="flex: 1;" onclick="closeConfirm(true)">确定</button>
      </div>
    </div>
  </div>

  <div id="settings-overlay" class="overlay hidden">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
        <h3 style="margin:0; font-size:20px; font-weight:700; color: #1e293b;">系统设置</h3>
        <button class="btn btn-outline" style="padding: 6px 12px; border-radius: var(--radius-sm);" onclick="closeSettings()">关闭</button>
      </div>
      <div class="setting-group">
        <span class="setting-title">一键闭眼生成机制规则配置</span>
        <div style="margin-bottom:12px; font-size:12px; color:var(--text-muted); line-height: 1.5;">
          可用语法：支持任意区间 <code>[a-z]{n}</code>、<code>[0-9]{n}</code>，甚至逆序自定义如 <code>[y-m]{8}</code>。<br>例如输入 <code>test_[a-z]{4}[0-9]{2}</code>，会一键抽出类似 <code>test_ykpq89</code> 的高质量前缀。
        </div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="config-random-pattern" class="input" placeholder="例如 [a-z]{6}" value="[a-z]{6}" />
          <button class="btn" style="white-space: nowrap;" onclick="saveConfig()">保存规则</button>
        </div>
      </div>
      <div class="setting-group">
        <span class="setting-title">修改访问密码</span>
        <div style="display:flex; gap:10px;">
          <input type="password" id="new-pwd-input" class="input" placeholder="输入您的新密码" />
          <button class="btn" style="white-space: nowrap;" onclick="updatePassword()">保存修改</button>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:10px; line-height: 1.5;">密码将以安全持久化的方式储存于 D1 数据库中。修改成功后需重新输入凭证进入。</div>
      </div>
      <div class="setting-group">
        <span class="setting-title">管理可用域名后缀</span>
        <div class="domain-list" id="domain-manage-list"></div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="new-domain-input" class="input" placeholder="例如: example.com" />
          <button class="btn" style="white-space: nowrap;" onclick="addDomain()">添加域名</button>
        </div>
      </div>
    </div>
  </div>

  <div class="sidebar">
    <div class="sidebar-header">
      <span style="display:flex; align-items:center; gap:8px;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        收信地址管理
      </span>
      <button class="btn btn-outline" style="padding: 6px 10px; font-size: 13px;" onclick="openSettings()">⚙ 设置</button>
    </div>
    <div class="sidebar-content">
      <div class="address-input-group">
        <input type="text" id="new-addr-prefix" class="input" placeholder="admin" spellcheck="false" autocomplete="off" style="flex: 0 0 26%;" />
        <button class="btn btn-outline" style="border-radius: 0; border: none; padding: 0 10px; color: var(--primary); background: transparent; flex-shrink: 0;" data-tooltip="根据规则一键抽出盲盒" onclick="randomAndAddAddress()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </button>
        <span style="border-left: 1px solid var(--border-light);">@</span>
        <div class="custom-select" id="custom-domain-select">
          <div class="select-selected" id="selected-domain-text" onclick="toggleDomainSelect(event)">暂无域名</div>
          <div class="select-items" id="domain-options"></div>
        </div>
        <button class="btn" style="border-left: 1px solid var(--border-light); flex-shrink: 0;" onclick="addAddress()" data-tooltip="添加新邮箱地址">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
      <div style="font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; justify-content: space-between; align-items: center;">
         邮箱清单
      </div>
      <input type="text" id="search-address-input" class="input" style="margin-bottom: 16px; padding: 8px 14px; border-radius: 20px; font-size: 13px; background: #f8fafc;" placeholder="🔍 对地址模糊搜索..." onkeyup="filterAddresses()" autocomplete="off" spellcheck="false" />
      
      <div style="margin-bottom: 12px;" id="global-inbox-container">
        <div class="list-item" id="global-inbox-item" onclick="selectAddress('all', '近期所有截获信件', this, false)" style="animation: none; opacity: 1;">
          <div class="list-item-title" style="color: var(--primary);">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right:6px; margin-top: -2px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            全局收货箱 (Latest)
          </div>
          <div class="email-count" style="background: #eef2ff; color: #4338ca;">聚合展示全站最新 50 封</div>
        </div>
      </div>
      <div id="address-list"></div>
    </div>
  </div>

  <div class="main">
    <div class="main-header">
      <button class="btn btn-outline mobile-back-btn" style="padding: 6px 10px; margin-right: 12px; border-radius: var(--radius-sm);" onclick="closeMobileMain()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <span id="main-header-text" style="display:flex; align-items:center; gap:8px; flex:1; min-width:0; overflow:hidden; white-space:nowrap;">在左侧发号施令吧</span>
      <span id="refresh-indicator" style="font-size: 12px; color: var(--primary); font-weight: 500; display:flex; align-items:center; gap:6px;"></span>
    </div>
    <div class="main-content" id="email-list-content">
      <div style="text-align: center; color: var(--text-muted); margin-top: 80px;">
        <svg fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" width="64" height="64" style="margin-bottom: 16px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <div style="font-size: 16px; font-weight: 500; color: #64748b; margin-bottom: 8px;">浩瀚星空，暂无信件降临</div>
        <div style="font-size: 14px;">在左侧添加邮箱地址，开启 Catch-all 路由进行神奇的邮件截获</div>
      </div>
    </div>
  </div>

  <script>
    let confirmResolve = null;
    function customConfirm(msg) {
        return new Promise(resolve => {
            confirmResolve = resolve;
            document.getElementById('confirm-msg').innerText = msg;
            document.getElementById('confirm-overlay').classList.remove('hidden');
        });
    }
    function closeConfirm(result) {
        if(confirmResolve) confirmResolve(result);
        confirmResolve = null;
        const overlay = document.getElementById('confirm-overlay');
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.classList.remove('closing');
            overlay.classList.add('hidden');
        }, 200);
    }
    
    let pwd = localStorage.getItem('cf_mail_pwd') || '';
    let currentAddressId = null;
    let currentAddressEmail = '';
    let knownCounts = {}; 
    let allDomains = [];
    let selectedDomainValue = '';
    let appConfig = { random_prefix_pattern: '[a-z]{6}' };
    let allAddresses = [];
    let currentAddrPage = 1;
    const ADDR_PER_PAGE = 7;

    if (pwd) {
      document.getElementById('auth-overlay').classList.add('hidden');
      initApp();
    }

    document.getElementById('pwd-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') saveAuthPwd();
    });

    // 全局点击消除下拉面板
    document.addEventListener('click', () => {
      const optsObj = document.getElementById('domain-options');
      if(optsObj && optsObj.classList.contains('show')) {
         optsObj.classList.remove('show');
      }
    });

    function toggleDomainSelect(e) {
      e.stopPropagation();
      document.getElementById('domain-options').classList.toggle('show');
    }

    function filterAddresses() {
        currentAddrPage = 1;
        renderAddresses();
    }

    function copyEmail(txt, btn) {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(txt).then(() => {
            const oldHtml = btn.innerHTML;
            btn.innerHTML = '✔ 已复制';
            btn.style.color = '#10b981';
            btn.style.borderColor = '#10b981';
            setTimeout(() => { 
                btn.innerHTML = oldHtml; 
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        });
    }

    function saveAuthPwd() {
      const val = document.getElementById('pwd-input').value;
      if (!val) return;
      pwd = val;
      localStorage.setItem('cf_mail_pwd', pwd);
      
      const overlay = document.getElementById('auth-overlay');
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.add('hidden');
        initApp();
      }, 300);
    }

    async function apiFetch(url, options = {}) {
      options.headers = { ...options.headers, 'x-admin-password': pwd };
      const res = await fetch(url, options);
      if (res.status === 401) {
        const isFirstFail = (pwd !== '');
        localStorage.removeItem('cf_mail_pwd');
        pwd = '';
        const authEl = document.getElementById('auth-overlay');
        authEl.classList.remove('hidden');
        authEl.classList.remove('closing');
        document.getElementById('settings-overlay').classList.add('hidden');
        document.getElementById('pwd-input').value = '';
        if (isFirstFail) alert('安全拦截：您输入的控制台密码不正确');
        throw new Error('Unauthorized');
      }
      return res;
    }

    async function initApp() {
      await loadConfig();
      await loadDomains();
      await loadAddresses(false);
      const globalItem = document.getElementById('global-inbox-item');
      if (globalItem) {
          selectAddress('all', '近期所有截获信件', globalItem, false, 0, true);
      }
      startPolling();
    }

    function startPolling() {
      setInterval(async () => {
        if (!pwd) return;
        const ind = document.getElementById('refresh-indicator');
        ind.innerHTML = '<svg class="animate-spin" style="animation: spin 1s linear infinite;" fill="none" viewBox="0 0 24 24" width="14" height="14"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 实时同步中';
        try {
          await loadAddresses(true); 
          if (currentAddressId) {
            await selectAddress(currentAddressId, currentAddressEmail, null, true);
          }
        } catch (e) { console.error(e); }
        if (!document.getElementById('spin-style')) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.innerHTML = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
        setTimeout(() => ind.innerHTML = '', 1000);
      }, 5000);
    }

    function openSettings() { 
      document.getElementById('settings-overlay').classList.remove('hidden'); 
      document.getElementById('config-random-pattern').value = appConfig.random_prefix_pattern || '[a-z]{6}';
      renderDomainManageList(); 
    }
    
    function closeSettings() {
      const overlay = document.getElementById('settings-overlay');
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.add('hidden');
      }, 300);
    }
    
    async function updatePassword() {
      const el = document.getElementById('new-pwd-input');
      const val = el.value.trim();
      if (!val) return alert('请输入新密码');
      if(!(await customConfirm('确认将密码修改为新密码吗？修改后将重新刷新页面并要求登入。'))) return;

      const res = await apiFetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: val })
      });
      if (res.ok) {
        alert('修改成功，请查收您的全新防护锁');
        localStorage.removeItem('cf_mail_pwd');
        location.reload();
      } else {
        alert('修改失败');
      }
    }

    async function loadConfig() {
        try {
            const res = await apiFetch('/api/settings/config');
            const data = await res.json();
            if(data && Object.keys(data).length > 0) appConfig = { ...appConfig, ...data };
        } catch (e) { console.error('Failed to load DB config', e); }
    }

    async function saveConfig() {
       const pattern = document.getElementById('config-random-pattern').value.trim();
       if(!pattern) return alert('不要拔掉上帝的底线！规则不能为空');
       const res = await apiFetch('/api/settings/config', {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ random_prefix_pattern: pattern })
       });
       if(res.ok) {
           appConfig.random_prefix_pattern = pattern;
           alert('🔥 军火库图纸上传完毕！去左边点亮那颗【闪电/骰子】抽盲盒吧！');
       }
    }

    async function loadDomains() {
      const res = await apiFetch('/api/domains');
      allDomains = await res.json();
      
      const optsObj = document.getElementById('domain-options');
      const textObj = document.getElementById('selected-domain-text');
      optsObj.innerHTML = '';
      
      if(allDomains.length === 0) {
        textObj.innerText = '请先在右上角登记';
        selectedDomainValue = '';
      } else {
        selectedDomainValue = allDomains[0];
        textObj.innerText = selectedDomainValue;
        allDomains.forEach(d => {
          const div = document.createElement('div');
          div.innerText = d;
          div.onclick = (e) => {
             e.stopPropagation();
             selectedDomainValue = d;
             textObj.innerText = d;
             optsObj.classList.remove('show');
          };
          optsObj.appendChild(div);
        });
      }
    }
    function renderDomainManageList() {
      const list = document.getElementById('domain-manage-list');
      list.innerHTML = '';
      if(allDomains.length === 0) list.innerHTML = '<div style="padding:20px; font-size:13px; color:#94a3b8; text-align:center;">暂无登记的域名，快来加入您的自建前缀吧</div>';
      allDomains.forEach(d => {
        const item = document.createElement('div');
        item.className = 'domain-item';
        const span = document.createElement('span');
        span.style.fontWeight = '500';
        span.innerText = d;
        const btn = document.createElement('button');
        btn.className = 'btn-danger';
        btn.style.margin = '0';
        btn.innerText = '移除';
        btn.onclick = () => deleteDomain(d);
        item.appendChild(span);
        item.appendChild(btn);
        list.appendChild(item);
      });
    }
    async function addDomain() {
      const el = document.getElementById('new-domain-input');
      const val = el.value.trim().toLowerCase();
      if(!val || !val.includes('.')) return alert('请输入合法的域名格式 (例如 custom.io)');
      
      const res = await apiFetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: val })
      });
      if(res.ok) {
        el.value = '';
        await loadDomains();
        renderDomainManageList();
      }
    }
    async function deleteDomain(domain) {
      if(!(await customConfirm('挥泪告别该域名后缀吗？（历史邮箱不受影响）'))) return;
      const res = await apiFetch('/api/domains', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      if(res.ok) {
        await loadDomains();
        renderDomainManageList();
      }
    }

    async function loadAddresses(isSilent = false, autoSelectEmail = null) {
      try {
        const res = await apiFetch('/api/addresses');
        const data = await res.json();
        
        // Handle polling logic instantly without tearing down DOM pages
        if (isSilent && allAddresses.length === data.length) {
            data.forEach(item => {
                const count = item.email_count || 0;
                let hasNew = false;
                if (knownCounts[item.id] !== undefined && count > knownCounts[item.id]) {
                    if (currentAddressId !== item.id) hasNew = true;
                    else knownCounts[item.id] = count;
                }
                
                const existingDiv = document.getElementById('addr-item-' + item.id);
                if(existingDiv) {
                    const titleDiv = existingDiv.querySelector('.list-item-title');
                    const cntDiv = existingDiv.querySelector('.email-count');
                    
                    if(hasNew && !titleDiv.querySelector('.red-dot')) {
                        titleDiv.innerHTML = item.email_address + '<span class="red-dot"></span>';
                    } else if (!hasNew && titleDiv.querySelector('.red-dot')) {
                        titleDiv.innerHTML = item.email_address;
                    }
                    cntDiv.innerText = '共 ' + count + ' 封记录';
                }
                if (!hasNew) knownCounts[item.id] = count;
            });
            allAddresses = data;
            return;
        }

        allAddresses = data;
        if (!isSilent && !autoSelectEmail) currentAddrPage = 1;
        
        data.forEach(item => {
            if (knownCounts[item.id] === undefined) knownCounts[item.id] = item.email_count || 0;
        });

        if (autoSelectEmail) {
            const index = data.findIndex(a => a.email_address === autoSelectEmail);
            if (index !== -1) {
                currentAddrPage = Math.floor(index / ADDR_PER_PAGE) + 1;
            }
        }

        renderAddresses();

        if (autoSelectEmail) {
            const target = data.find(a => a.email_address === autoSelectEmail);
            if (target) {
                const el = document.getElementById('addr-item-' + target.id);
                if (el) { el.click(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            }
        }
      } catch (e) { console.error(e); }
    }

    function renderAddresses() {
        const listEl = document.getElementById('address-list');
        listEl.innerHTML = '';
        
        const searchVal = document.getElementById('search-address-input').value.toLowerCase();
        let filtered = allAddresses;
        if(searchVal) {
            filtered = allAddresses.filter(a => a.email_address.toLowerCase().includes(searchVal));
        }
        
        const totalPages = Math.ceil(filtered.length / ADDR_PER_PAGE) || 1;
        if (currentAddrPage > totalPages) currentAddrPage = totalPages;
        
        const start = (currentAddrPage - 1) * ADDR_PER_PAGE;
        const pageData = filtered.slice(start, start + ADDR_PER_PAGE);

        pageData.forEach((item, index) => {
          const count = knownCounts[item.id] !== undefined ? knownCounts[item.id] : (item.email_count || 0);
          
          const div = document.createElement('div');
          div.id = 'addr-item-' + item.id;
          div.className = 'list-item';
          div.style.animationDelay = (index * 0.05) + 's';
          
          if (currentAddressId === item.id) div.classList.add('active');
          div.onclick = () => selectAddress(item.id, item.email_address, div, false, count);
          
          const title = document.createElement('div');
          title.className = 'list-item-title';
          
          let hasNew = false;
          const actualCount = item.email_count || 0;
          if (actualCount > count && currentAddressId !== item.id) hasNew = true;
          
          if(hasNew) title.innerHTML = item.email_address + '<span class="red-dot"></span>';
          else title.innerText = item.email_address;
          
          const sub = document.createElement('div');
          sub.className = 'email-count';
          sub.innerText = '共 ' + actualCount + ' 封记录';
          
          const delBtn = document.createElement('button');
          delBtn.className = 'btn-danger btn-icon-hover';
          delBtn.innerText = '销毁';
          delBtn.onclick = (e) => { e.stopPropagation(); deleteAddress(item.id); };

          div.appendChild(title);
          div.appendChild(sub);
          div.appendChild(delBtn);
          listEl.appendChild(div);
        });
        
        if (totalPages > 1) {
            const pageCtrl = document.createElement('div');
            pageCtrl.style.display = 'flex';
            pageCtrl.style.justifyContent = 'space-between';
            pageCtrl.style.alignItems = 'center';
            pageCtrl.style.padding = '8px 4px 0 4px';
            pageCtrl.style.marginTop = '8px';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn btn-outline';
            prevBtn.style.padding = '2px 8px';
            prevBtn.style.fontSize = '12px';
            prevBtn.style.minWidth = '50px';
            prevBtn.innerText = '上一页';
            prevBtn.disabled = currentAddrPage === 1;
            if(currentAddrPage === 1) prevBtn.style.opacity = '0.4';
            prevBtn.onclick = () => { currentAddrPage--; renderAddresses(); };
            
            const pageInfo = document.createElement('span');
            pageInfo.style.fontSize = '12px';
            pageInfo.style.color = 'var(--text-muted)';
            pageInfo.style.fontWeight = '500';
            pageInfo.innerText = currentAddrPage + ' / ' + totalPages;
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-outline';
            nextBtn.style.padding = '2px 8px';
            nextBtn.style.fontSize = '12px';
            nextBtn.style.minWidth = '50px';
            nextBtn.innerText = '下一页';
            nextBtn.disabled = currentAddrPage === totalPages;
            if(currentAddrPage === totalPages) nextBtn.style.opacity = '0.4';
            nextBtn.onclick = () => { currentAddrPage++; renderAddresses(); };
            
            pageCtrl.appendChild(prevBtn);
            pageCtrl.appendChild(pageInfo);
            pageCtrl.appendChild(nextBtn);
            listEl.appendChild(pageCtrl);
        }
    }

    function generateFromPattern(pattern) {
        let result = pattern;
        
        result = result.replace(/\\\\d(?:\\{(\\d+)\\})?/g, (m, n) => {
            let s = ''; let len = n ? parseInt(n) : 1;
            for(let i=0; i<len; i++) s += Math.floor(Math.random() * 10);
            return s;
        });

        const rangeRegex = /\\[([a-zA-Z0-9])-([a-zA-Z0-9])\\](?:\\{(\\d+)\\})?/g;
        result = result.replace(rangeRegex, (m, start, end, lenStr) => {
            let s = '';
            let c1 = start.charCodeAt(0);
            let c2 = end.charCodeAt(0);
            let min = Math.min(c1, c2);
            let max = Math.max(c1, c2);
            let len = lenStr ? parseInt(lenStr) : 1;
            for (let i = 0; i < len; i++) {
                s += String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            return s;
        });

        return result;
    }

    async function randomAndAddAddress() {
        const pattern = appConfig.random_prefix_pattern || '[a-z]{6}';
        const generated = generateFromPattern(pattern);
        document.getElementById('new-addr-prefix').value = generated;
        await addAddress(true);
    }

    async function addAddress(isRandom = false) {
      const prefixEl = document.getElementById('new-addr-prefix');
      const prefix = prefixEl.value.trim().toLowerCase();
      const domain = selectedDomainValue;
      if (!prefix || !domain) {
        alert('前缀不得为空，后缀不得缺失哦。（若是未见后缀请移步右上角设置添加）');
        return;
      }
      const email = prefix + '@' + domain;
      const res = await apiFetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        prefixEl.value = '';
        await loadAddresses(false, email);
      } else {
        const err = await res.json();
        alert('添加折戟: ' + (err.error || '可能是重复的邮标'));
      }
    }

    async function deleteAddress(id) {
      if (!(await customConfirm('您即将执行销毁指令，该地址连同关联的所有邮件将灰飞烟灭。确认吗？'))) return;
      const res = await apiFetch('/api/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        if (currentAddressId === id) {
          currentAddressId = null;
          document.getElementById('email-list-content').innerHTML = 
            '<div style="text-align: center; color: var(--text-muted); margin-top: 80px;"><div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">通讯已被销毁</div><div style="font-size: 14px;">请在左侧另寻新欢</div></div>';
          document.getElementById('main-header-text').innerHTML = '在左侧发号施令吧';
        }
        const el = document.getElementById('addr-item-' + id);
        if(el) {
            el.style.animation = 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
            setTimeout(() => loadAddresses(false), 300);
        } else {
             loadAddresses(false);
        }
      }
    }

    let currentEmailPage = 1;
    let isLoadingMore = false;

    function closeMobileMain() {
        document.querySelector('.main').classList.remove('mobile-active');
    }

    async function selectAddress(id, email, divElement, isSilentPoll = false, knownCount = 0, isInit = false) {
      try {
        if (!isSilentPoll && !isInit && window.innerWidth <= 768) {
            document.querySelector('.main').classList.add('mobile-active');
        }
        if (currentAddressId !== id && !isSilentPoll) {
            currentEmailPage = 1;
        }
      currentAddressId = id;
      currentAddressEmail = email;
      
      if (knownCount) knownCounts[id] = knownCount;
      
      if (!isSilentPoll) {
        document.querySelectorAll('.list-item').forEach(el => el.classList.remove('active'));
        if(divElement) {
          divElement.classList.add('active');
          const titleEl = divElement.querySelector('.list-item-title');
          if(titleEl && id !== 'all') titleEl.innerHTML = email;
        }
        let copyBtnHtml = '';
        if (id !== 'all') {
            copyBtnHtml = '<button class="btn btn-outline" style="margin-left: 12px; padding: 2px 8px; font-size: 13px; height: 26px; display: inline-flex; align-items: center; gap: 4px; vertical-align: middle; cursor: pointer;" onclick="copyEmail(\\'' + email + '\\', this)" title="复制当前收信地址"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>复制</button>';
        }
        document.getElementById('main-header-text').innerHTML = '<span class="from-badge" style="background:#f1f5f9; color:#0f172a; margin-right:8px; display:inline-flex; align-items:center;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right:4px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> ' + (id === 'all' ? '上帝视角' : '捕获局') + '</span><span style="vertical-align: middle; font-weight: 600;">' + email + '</span>' + copyBtnHtml;
      }
      
      const contentEl = document.getElementById('email-list-content');
      if (!isSilentPoll && currentEmailPage === 1) {
          contentEl.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; color: var(--primary);"><svg class="animate-spin" style="animation: spin 1s linear infinite;" fill="none" viewBox="0 0 24 24" width="40" height="40"><circle opacity="0.2" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><div style="margin-top: 16px; font-weight: 500; color: var(--text-muted); font-size: 14px;">正在穿越量子隧道拉取信件...</div></div>';
      }
      
      const totalLimit = currentEmailPage * 20;
      const res = await apiFetch('/api/emails?address_id=' + id + '&limit=' + totalLimit + '&offset=0');
      const emails = await res.json();
      if (emails.error) {
          alert('数据拉取失败: ' + emails.error);
          return;
      }
      
      if (emails.length === 0) {
        if(!isSilentPoll) contentEl.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 80px;"><svg fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" width="64" height="64" style="margin-bottom: 16px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg><div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">该信箱宁静如渊</div><div style="font-size: 14px;">稍候片刻，好运即达</div></div>';
        return;
      }
      
      let renderedCount = contentEl.children.length;
      if (document.getElementById('load-more-container')) renderedCount--;
      
      if(isSilentPoll && renderedCount === emails.length && !contentEl.innerHTML.includes('宁静如渊')) { return; }

      contentEl.innerHTML = '';
      appendEmailNodes(emails, contentEl, 0);
      
      if (emails.length === totalLimit) {
         renderLoadMoreButton(contentEl);
      }
      } catch (globalErr) {
        if (!isSilentPoll) alert('前端渲染崩溃: ' + globalErr.stack || globalErr);
      }
    }

    function appendEmailNodes(emailArray, containerEl, startIndex = 0) {
      emailArray.forEach((mail, idx) => {
        idx = startIndex + idx;
        const box = document.createElement('div');
        box.className = 'email-detail';
        box.style.animationDelay = (idx * 0.08) + 's';
        
        const headerWrap = document.createElement('div');
        headerWrap.className = 'header-wrap';
        
        const subjectWrap = document.createElement('div');
        subjectWrap.style.display = 'flex';
        subjectWrap.style.justifyContent = 'space-between';
        subjectWrap.style.alignItems = 'flex-start';

        const subject = document.createElement('div');
        subject.className = 'email-subject';
        subject.style.marginBottom = '0';
        subject.innerText = mail.subject || '（未具名信件）';
        
        const toggleIcon = document.createElement('div');
        toggleIcon.style.color = '#94a3b8';
        toggleIcon.style.marginLeft = '10px';
        toggleIcon.style.display = 'flex';
        toggleIcon.style.alignItems = 'center';
        toggleIcon.style.height = '27px';
        toggleIcon.innerHTML = '<svg style="transition: transform 0.2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';

        subjectWrap.appendChild(subject);
        subjectWrap.appendChild(toggleIcon);
        
        const meta = document.createElement('div');
        meta.className = 'email-meta';
        meta.style.marginTop = '10px';
        meta.style.marginBottom = '0';
        const fromSpan = document.createElement('span');
        fromSpan.className = 'from-badge';
        if (currentAddressId === 'all' && mail.to_address) {
            fromSpan.innerHTML = '从 <b>' + mail.from_address + '</b> <span style="color:#94a3b8; margin:0 6px;">➔</span> 寄往 <span style="background:#fce7f3; color:#be185d; padding:2px 8px; border-radius:10px; font-size:12px;">' + mail.to_address + '</span>';
        } else {
            fromSpan.innerText = mail.from_address;
        }

        const extCode = mail.otp_code || null;

        const metaRight = document.createElement('div');
        metaRight.style.display = 'flex';
        metaRight.style.alignItems = 'center';
        metaRight.style.gap = '12px';

        if (extCode) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn-outline';
            copyBtn.style.padding = '2px 10px';
            copyBtn.style.fontSize = '12px';
            copyBtn.style.height = '26px';
            copyBtn.style.display = 'inline-flex';
            copyBtn.style.alignItems = 'center';
            copyBtn.style.gap = '4px';
            copyBtn.style.color = '#10b981';
            copyBtn.style.borderColor = '#10b981';
            copyBtn.style.backgroundColor = '#ecfdf5';
            copyBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> 提取到验证码: <strong>' + extCode + '</strong>';
            
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(extCode).then(() => {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✔ 复制成功!';
                    copyBtn.style.backgroundColor = '#10b981';
                    copyBtn.style.color = '#ffffff';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.style.backgroundColor = '#ecfdf5';
                        copyBtn.style.color = '#10b981';
                    }, 2000);
                });
            };
            metaRight.appendChild(copyBtn);
        }

        const timeSpan = document.createElement('span');
        timeSpan.style.color = '#94a3b8';
        timeSpan.innerText = new Date(mail.received_at + 'Z').toLocaleString();
        
        metaRight.appendChild(timeSpan);
        meta.appendChild(fromSpan);
        meta.appendChild(metaRight);
        
        const bodyWrapper = document.createElement('div');
        bodyWrapper.className = 'email-body-wrapper';
        
        const bodyContent = document.createElement('div');
        bodyContent.className = 'email-body-content';

        const bodyDivider = document.createElement('div');
        bodyDivider.style.borderTop = '1px dashed var(--border-light)';
        bodyDivider.style.margin = '0 28px';

        const body = document.createElement('div');
        body.className = 'email-body';
        body.style.padding = '20px 28px 28px 28px';
        
        bodyContent.appendChild(bodyDivider);
        bodyContent.appendChild(body);
        bodyWrapper.appendChild(bodyContent);
        
        let isExpanded = false;
        let isFetching = false;
        headerWrap.onclick = async () => {
            if (isFetching) return;
            
            if (!isExpanded) {
                if (!mail.full_loaded) {
                    isFetching = true;
                    const originalIcon = toggleIcon.innerHTML;
                    toggleIcon.innerHTML = '<svg class="animate-spin" style="animation: spin 1s linear infinite; color: var(--primary);" fill="none" viewBox="0 0 24 24" width="20" height="20"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                    
                    try {
                        const res = await apiFetch('/api/emails/' + mail.id);
                        if(res.ok) {
                            const detail = await res.json();
                            mail.body_html = detail.body_html;
                            mail.body_text = detail.body_text;
                            mail.full_loaded = true;
                            
                            body.innerHTML = '';
                            if (mail.body_html) {
                                const iframe = document.createElement('iframe');
                                iframe.sandbox = "allow-popups allow-same-origin";
                                iframe.style.width = '100%';
                                iframe.style.border = 'none';
                                iframe.style.overflow = 'hidden';
                                iframe.style.opacity = '0';
                                iframe.style.transition = 'opacity 0.3s ease';
                                iframe.srcdoc = mail.body_html;
                                body.appendChild(iframe);
                                
                                let exactHeightCalculated = false;

                                await new Promise(resolve => {
                                    let handled = false;
                                    const doResolve = () => {
                                        if (handled) return;
                                        handled = true;
                                        iframe.style.opacity = '1';
                                        resolve();
                                    };
                                    
                                    iframe.onload = () => {
                                        try {
                                            const doc = iframe.contentWindow.document;
                                            doc.querySelectorAll('a').forEach(a => a.setAttribute('target', '_blank'));
                                            
                                            const adjustHeight = () => {
                                                if (iframe.contentWindow) {
                                                    const prevHeight = iframe.style.height;
                                                    const prevTrans = iframe.style.transition;
                                                    
                                                    iframe.style.transition = 'none';
                                                    iframe.style.height = '10px';
                                                    
                                                    const trueHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
                                                    
                                                    iframe.style.height = prevHeight;
                                                    // force reflow
                                                    const _ = iframe.offsetHeight; 
                                                    iframe.style.transition = prevTrans;
                                                    
                                                    const targetH = trueHeight + 30;
                                                    const currentH = parseInt(prevHeight || '0');
                                                    
                                                    if (!exactHeightCalculated) {
                                                        iframe.style.height = targetH + 'px';
                                                        exactHeightCalculated = true;
                                                    } else if (Math.abs(currentH - targetH) > 20) {
                                                        iframe.style.transition = 'opacity 0.3s ease, height 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                                                        iframe.style.height = targetH + 'px';
                                                    }
                                                }
                                            };
                                            adjustHeight();
                                            setTimeout(adjustHeight, 800);
                                            setTimeout(adjustHeight, 2500);
                                        } catch(e) {}
                                        doResolve();
                                    };
                                    
                                    setTimeout(() => {
                                        if (!exactHeightCalculated) {
                                            iframe.style.height = '350px';
                                            exactHeightCalculated = true;
                                            doResolve();
                                        }
                                    }, 2500); 
                                });
                            } else if (mail.body_text) {
                                const pureTextNode = document.createElement('div');
                                pureTextNode.innerText = mail.body_text;
                                pureTextNode.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
                                pureTextNode.style.fontSize = "14px";
                                pureTextNode.style.lineHeight = "1.6";
                                pureTextNode.style.color = "#334155";
                                pureTextNode.style.whiteSpace = "pre-wrap";
                                body.appendChild(pureTextNode);
                            } else {
                                const emptyTxt = document.createElement('div');
                                emptyTxt.innerText = "（未提供任何正文内容）";
                                emptyTxt.style.color = "#94a3b8";
                                body.appendChild(emptyTxt);
                            }
                        }
                    } catch(e) {
                         body.innerHTML = '<div style="color:var(--danger); padding:20px; text-align:center;">加载网络由于未知异常失败，请重试</div>';
                    }
                    toggleIcon.innerHTML = originalIcon;
                    isFetching = false;
                }
                
                isExpanded = true;
                bodyWrapper.style.gridTemplateRows = '1fr';
                toggleIcon.querySelector('svg').style.transform = 'rotate(180deg)';
                headerWrap.style.paddingBottom = '16px';
            } else {
                isExpanded = false;
                bodyWrapper.style.gridTemplateRows = '0fr';
                toggleIcon.querySelector('svg').style.transform = 'rotate(0deg)';
                headerWrap.style.paddingBottom = '20px';
            }
        };
        
        headerWrap.appendChild(subjectWrap);
        headerWrap.appendChild(meta);
        box.appendChild(headerWrap);
        box.appendChild(bodyWrapper);
        containerEl.appendChild(box);
      });
    }

    function renderLoadMoreButton(containerEl) {
      const wrapper = document.createElement('div');
      wrapper.id = 'load-more-container';
      wrapper.style.textAlign = 'center';
      wrapper.style.padding = '10px 0 30px 0';
      wrapper.innerHTML = '<button id="load-more-btn" class="btn btn-outline" style="padding: 8px 24px; border-radius: 20px; font-weight: 600; font-size: 13px;" onclick="loadMoreEmails()">加载更多往期信件 ▾</button>';
      containerEl.appendChild(wrapper);
    }

    async function loadMoreEmails() {
      if (isLoadingMore) return;
      isLoadingMore = true;
      const btn = document.getElementById('load-more-btn');
      if(btn) btn.innerText = '加载中...';
      
      currentEmailPage++;
      const offset = (currentEmailPage - 1) * 20;
      
      try {
          const res = await apiFetch('/api/emails?address_id=' + currentAddressId + '&limit=20&offset=' + offset);
          const newEmails = await res.json();
          if (newEmails.error) throw new Error(newEmails.error);
          
          const container = document.getElementById('load-more-container');
          if (container) container.remove();
          
          if (newEmails.length > 0) {
              const contentEl = document.getElementById('email-list-content');
              appendEmailNodes(newEmails, contentEl, (currentEmailPage - 1) * 20);
              
              if (newEmails.length === 20) {
                  renderLoadMoreButton(contentEl);
              }
          } else {
              if (btn) { btn.innerText = '没有更多了'; btn.disabled = true; }
          }
      } catch (e) {
          console.error(e);
          currentEmailPage--; 
          if(btn) btn.innerText = '加载失败，重试';
      }
      isLoadingMore = false;
    }
  </script>
</body>
</html>
`;
