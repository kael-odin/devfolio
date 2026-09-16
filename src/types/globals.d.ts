/* Build-time values injected by the `define` block in vite.config.js. */
interface ImportMetaEnv {
   readonly APP_VERSION: string;
   readonly BUILD_DATE: string;
   /** Optional public chat endpoint override (your deployed /api/chat or proxy URL). */
   readonly VITE_CHAT_API_URL?: string;
}
