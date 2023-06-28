import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // 호스트를 이렇게 열어놔야지 docker에서도 돈다.
    host: true,
  },
});
