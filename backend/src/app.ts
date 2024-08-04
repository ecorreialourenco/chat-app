import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

export const PORT = 4000;
export const app = express();
export const httpServer = createServer(app);
// Set up WebSocket server.
export const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });