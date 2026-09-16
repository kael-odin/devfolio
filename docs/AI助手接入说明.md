# AI 分身接入大模型（配置说明）

> 借鉴 [vienne-ai-site](https://github.com/vienne53/vienne-ai-site) 的「AI 分身」设计：密钥永不进前端，访客只看到你自己的接口地址。

本文档说明：**如何把本 portfolio 右下角的「AI 分身」悬浮窗接到 OpenAI 兼容网关 / 火山方舟（豆包）等 API**，以及密钥应该写在哪里。

---

## 1. 密钥写在哪里？

| 写法                             | 是否推荐           | 说明                                                   |
| -------------------------------- | ------------------ | ------------------------------------------------------ |
| 写进前端 JS / `data/*.json`      | 否                 | 任何人打开网站按 F12 都能看到，会盗刷你的额度。        |
| 写进本机 `.env` + 本地小服务     | 本机自用可以       | 密钥只在你的电脑进程里，**不要把 `.env` 提交到 Git**。 |
| 云平台「环境变量」+ 无服务器函数 | 网站公开访问时推荐 | 访客只看到你自己的接口地址，看不到厂商 key。           |

**结论：**

- 只在自己电脑调试：用下面「本机代理」即可，**不必**先上云。
- 网站要给别人长期访问：把 `server/chat-proxy.mjs` 的逻辑部署到云函数 / 小服务器（本仓库已带 `api/chat.js` + `api/health.js` 的 Vercel 模板）。

---

## 2. 本机最小流程

### 步骤 A：复制环境变量模板

```bash
cp .env.example .env
```

打开 `.env`，按注释填写。若曾在聊天里发过 key，请先在控制台**轮换**再写入。

**接火山方舟 / 豆包（OpenAI 兼容）时**必须同时配置：

- `OPENCLAW_CHAT_URL`：`https://ark.<地域>.volces.com/api/v3/chat/completions`（以控制台为准）
- `OPENCLAW_MODE=openai`
- `OPENCLAW_MODEL=ep-xxxx`（接入点 ID，不是模型昵称）

若控制台是 `/api/v3/responses`，则填 responses 地址并设 `OPENCLAW_MODE=responses`、`OPENCLAW_MODEL` 为 curl 里的 model 名。

配置好后执行 **`pnpm verify-chat`**：只检查是否漏项、URL 是否像网址，**不会**调用大模型、也不会打印完整密钥。

### 步骤 B：启动本地代理 + 本地站点（两个终端）

```bash
# 终端 1 — 聊天代理（一直开着，默认 http://127.0.0.1:8790）
pnpm chat-proxy

# 终端 2 — 本地站点
pnpm dev
```

浏览器打开 dev 服务器地址，点右下角 **「AI 分身」** 悬浮窗发消息即可。前端在 localhost 下默认请求 `http://<host>:8790/chat`；也可用 `VITE_CHAT_API_URL` 显式覆盖。

自检：浏览器打开 `http://127.0.0.1:8790/health` 应看到 `ok: true` 等 JSON。

---

## 3. 公开部署（GitHub Pages 现状说明）

本仓库默认部署到 **GitHub Pages（纯静态）**，跑不了后端函数，所以：

- **方案 A（推荐）：** 把 `server/` + `api/` 部署到 Vercel / 云函数 / 自建 VPS，然后在构建时设置 `VITE_CHAT_API_URL=https://你的域名/api/chat`。前端会自动指向它。
- **方案 B：** 用你自己的网关（只收 `{"message":""}` 的那种），设 `OPENCLAW_MODE=simple`，同样经由上面的代理/函数转发。

未配置后端时，悬浮窗不会静默失败——它会明确告诉访客「对话服务未配置」，并给出排查指引（与联系表单的占位守卫同一思路）。

---

## 4. 让 AI 分身回答「怎么联系你」（不用训练模型）

大模型**不用训练**。做法是：在每次对话里附带一段**固定文字**（系统提示 + 主人公开信息），模型按指令如实回答。

- 在 `.env` 里增加 **`OPENCLAW_OWNER_FACTS=`**（一行内写 GitHub、博客、邮箱等），或
- 复制 **`server/owner-facts.example.txt`** 为 **`server/owner-facts.txt`** 填写多行（该文件默认不提交 Git，见 `.gitignore`）。

模板自带的默认人设是「Kael 的 AI 分身」（见 `server/chat-handler.mjs`），owner-facts 示例也是 Kael 的公开信息。改完后**重启** `pnpm chat-proxy`。

---

## 5. 安全提醒

- 曾在公开聊天中发送过的 key，视为已泄露，请在控制台**轮换（作废再新建）**。
- `.env` 与 `server/owner-facts.txt` 已加入 `.gitignore`，请勿手动移除忽略规则。
- 仓库内只保留 `.env.example` 里的**占位符**，不要提交真实密钥。
