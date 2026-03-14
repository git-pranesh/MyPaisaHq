import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { submitToIndexNow } from "./indexnow";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/submit-indexnow", async (_req, res) => {
    const result = await submitToIndexNow();
    res.status(result.success ? 200 : 500).json(result);
  });

  return httpServer;
}
