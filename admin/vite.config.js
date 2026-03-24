import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const base = env.VITE_APP_BASE_PATH || (mode === "production" ? "/admin/" : "/");
    const backendTarget = env.VITE_BACKEND_TARGET || "http://localhost:8080";

    return {
        base,
        server: {
            host: "::",
            port: 18080,
            hmr: {
                overlay: false,
            },
            proxy: {
                "/admin/api": {
                    target: backendTarget,
                    changeOrigin: true,
                },
                "/product-images": {
                    target: backendTarget,
                    changeOrigin: true,
                },
                "/api": {
                    target: backendTarget,
                    changeOrigin: true,
                },
            },
        },
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
