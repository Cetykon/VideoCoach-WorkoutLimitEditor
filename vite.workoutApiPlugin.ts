import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.resolve(PLUGIN_DIR, "../../backend/exercises/workout_configs");


function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function ensureConfigDir() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

export function workoutApiPlugin(): Plugin {
  return {
    name: "workout-config-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/workouts")) {
          next();
          return;
        }

        try {
          ensureConfigDir();

          if (req.method === "GET" && (url === "/api/workouts" || url.startsWith("/api/workouts?"))) {
            const files = fs.readdirSync(CONFIG_DIR).filter((f) => f.endsWith(".json"));
            const items = files.map((file) => {
              const slug = file.replace(/\.json$/, "");
              const raw = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, file), "utf8"));
              return { slug, name: raw.name ?? slug };
            });
            sendJson(res, 200, items);
            return;
          }

          const loadMatch = url.match(/^\/api\/workouts\/([^/?]+)/);
          if (req.method === "GET" && loadMatch) {
            const slug = decodeURIComponent(loadMatch[1]);
            const filePath = path.join(CONFIG_DIR, `${slug}.json`);
            if (!fs.existsSync(filePath)) {
              sendJson(res, 404, { error: "Not found" });
              return;
            }
            const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
            sendJson(res, 200, raw);
            return;
          }

          if (req.method === "POST" && (url === "/api/workouts" || url.startsWith("/api/workouts?"))) {
            const body = JSON.parse(await readBody(req));
            const slug = String(body.slug || "").replace(/[^a-z0-9_]/g, "");
            if (!slug || !body.workout) {
              sendJson(res, 400, { error: "slug and workout required" });
              return;
            }
            const filePath = path.join(CONFIG_DIR, `${slug}.json`);
            fs.writeFileSync(filePath, JSON.stringify(body.workout, null, 2) + "\n", "utf8");
            sendJson(res, 200, { slug, path: filePath });
            return;
          }

          sendJson(res, 405, { error: "Method not allowed" });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      });
    },
  };
}
