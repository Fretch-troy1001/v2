import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/submit-valve", async (req, res) => {
    try {
      const { valve, asFoundDimension } = req.body;
      const params = new URLSearchParams({
        valve: valve || "",
        asFoundDimension: asFoundDimension || "",
      });
      
      // The webhook URL
      const webhookUrl = `https://troy-n8n-2026.duckdns.org/webhook-test/7c3dafe5-6f48-42f3-b2b6-bbe39aae3b12?${params.toString()}`;
      
      const response = await fetch(webhookUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const responseText = await response.text();
  
      if (response.ok) {
        res.json({ success: true, data: responseText });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: "Webhook failed", 
          details: responseText 
        });
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/submit-valve-lock-weld", async (req, res) => {
    try {
      const { valve, planeB, planeC } = req.body;
      const params = new URLSearchParams({
        valve: valve || "",
        planeB: planeB || "",
        planeC: planeC || "",
      });
      
      // The webhook URL for Valve Lock Weld
      const webhookUrl = `https://troy-n8n-2026.duckdns.org/webhook-test/PlaneAandB?${params.toString()}`;
      
      const response = await fetch(webhookUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const responseText = await response.text();
  
      if (response.ok) {
        res.json({ success: true, data: responseText });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: "Webhook failed", 
          details: responseText 
        });
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/submit-icv-clamping-ring", async (req, res) => {
    try {
      const { casingId, valveLockOd, roughWeldingThickness } = req.body;
      const params = new URLSearchParams({
        casingId: casingId || "",
        valveLockOd: valveLockOd || "",
        roughWeldingThickness: roughWeldingThickness || "",
      });
      
      // The webhook URL for ICV Clamping Ring
      const webhookUrl = `https://troy-n8n-2026.duckdns.org/webhook-test/clamping_ring?${params.toString()}`;
      
      const response = await fetch(webhookUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const responseText = await response.text();
  
      if (response.ok) {
        res.json({ success: true, data: responseText });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: "Webhook failed", 
          details: responseText 
        });
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if needed, but for now we focus on dev/preview)
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
