import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { workoutApiPlugin } from "./vite.workoutApiPlugin.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), workoutApiPlugin()],
});
