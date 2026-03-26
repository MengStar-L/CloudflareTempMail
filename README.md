# CF Mail Viewer (云端纯享版)

这份教程专为您量身定制。所有的操作都在 **Cloudflare 网页控制台 (Dashboard)** 中点按鼠标即可完成，**不需要在您的电脑上安装任何环境或运行任何代码**。

我们在后台已经帮您把所有复杂的包文件合并成了单文件 `worker-dashboard.js`。

## 零代码部署流程

按照以下 5 个步骤，只需几分钟即可获得专属网页管家！

### 第一步：创建你的 D1 邮件数据库
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧的主菜单中，找到并点击 **Workers & Pages** -> **D1**。
3. 点击 **Create database**（创建数据库），并在弹出的框里命名为 `cf-mail-db`。
4. 创建成功后，点击进入这个刚建好数据库的概览页，随后点击上方标签页中的 **Console (控制台)**。
5. 请在本项目目录中找到 `schema.sql` 文件，打开它并复制里面**所有的文本内容**。
6. 将其粘贴到 Cloudflare 的 SQL 输入框内，点击 **Execute**。这样你的邮件和地址管理表就建立好啦！

### 第二步：创建 Worker (用来驱动页面的小云主机)
1. 在左侧菜单中，回到 **Workers & Pages** -> **Overview (概览)**。
2. 点击右上角的 **Create Application (创建应用程序)**，随后点击 **Create Worker**。
3. 随意起一个名字（比如 `cf-mail-viewer`），随后直接点击右下角的 **Deploy (部署)** 按钮。
4. 部署成功后，页面上会出现一个 **Edit Code (编辑代码)** 按钮，请点击它进入在线网页代码编辑器。
5. 将网页左侧编辑器中**原有的示例代码全部删除**。
6. 打开本项目中为您准备好的 `worker-dashboard.js` 文件，复制里面 **所有内容** （大约 120KB代码，已经帮您内置了所有的解析依赖）。
7. 将拷贝的所有内容粘贴到 Cloudflare 在线网页编辑器的左侧输入框。
8. 确认无误后点击右上角的蓝色的 **Deploy (部署按钮)** 或者 **Save and deploy** 按钮保存代码。

### 第三步：把数据库送给你的 Worker 当存储器
由于代码里写了要用名字为 `DB` 的绑定关系以及用来验证登录的密码，我们需要在网页上绑定变量：
1. 回到刚才这个 Worker 的主概览页面。
2. 点击中间靠右标签页里的 **Settings (设置)** -> **Variables and Secrets (变量与机密)**。
3. 往下拉，找到 **D1 Database Bindings** 区域，点击 **Add binding (添加绑定)**。
   - **Variable name (变量名称)**：此处**只能并且必须**填写：`DB`
   - **Database (数据库)**：下拉选择你第一步建立好的 `cf-mail-db`。
   - 点击 **Save and deploy (保存并部署)**。
4. 继续往下拉，找到最下方的 **Environment variables (环境变量)** 区域，点击 **Add variable (添加变量)**。
   - **Variable name**: 填入 `ADMIN_PASSWORD`
   - **Value**: 填入你后续在页面上登录想使用的密码，比如 `123456`
   - 点击 **Save and deploy (保存并部署)**。

### 第四步：设置 Cloudflare 邮箱分发站！ (让你的假邮箱活起来)
这一步是告诉 Cloudflare：不管别人往您的哪个前缀发邮件，都交给这个程序处理。
1. 在左侧的主菜单最上方，回到您自己的域名管理页面。
2. 找到左侧面板的 **Email (电子邮件)** -> **Email Routing (电子邮件路由)**。如果没启用，请按照网页提示一键启用它并配好 DNS。（都是一键自动完成）
3. 随后，点击屏幕上方中间的 **Routing Rules (路由规则)** 标签页。
4. 一直往屏幕下方滚动，直到看见底部的 **Catch-all address** 选项卡。
5. 点击右侧的 **Edit (编辑)**。将第一栏的操作 (Action) 修改为：**Send to a Worker (发送到 Worker)**。
6. 在目标（Destination）那一栏的下拉选单中，找到并选择刚刚部署好的 Worker：`cf-mail-viewer`。
7. 点击 Save 进行保存。

🎉 **大功告成！** 🎉

现在您的项目已经完全落户在云端。您可以点击 Worker 概览页里分配给您的诸如 `https://cf-mail.xxx.workers.dev` 访问链接。
输入设置好的 `ADMIN_PASSWORD` 即可进入管理系统。此时只需要在左下角随意添加您喜欢的邮箱地址前缀，当有邮件发往那个前缀地址时，刷新即可秒速看信啦！
