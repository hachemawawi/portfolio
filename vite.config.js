import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                cv: resolve(__dirname, "cv.html"),
                hire: resolve(__dirname, "hire-me.html"),
                projects: resolve(__dirname, "projects-grid-cards.html")
            }
        }
    }
});