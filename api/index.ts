import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.post("/api/submit-valve", async (req, res) => {
    try {
        const { valve, asFoundDimension } = req.body;
        const params = new URLSearchParams({
            valve: valve || "",
            asFoundDimension: asFoundDimension || "",
        });

        const N8N_HOST = process.env.N8N_HOST;
        const path = process.env.N8N_WEBHOOK_SEAL_RING_PATH;

        if (!N8N_HOST || !path) {
            throw new Error("Missing N8N configuration");
        }

        const webhookUrl = `${N8N_HOST}${path}?${params.toString()}`;

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

        const N8N_HOST = process.env.N8N_HOST;
        const path = process.env.N8N_WEBHOOK_VALVE_LOCK_PATH;

        if (!N8N_HOST || !path) {
            throw new Error("Missing N8N configuration");
        }

        const webhookUrl = `${N8N_HOST}${path}?${params.toString()}`;

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

        const N8N_HOST = process.env.N8N_HOST;
        const path = process.env.N8N_WEBHOOK_CLAMPING_RING_PATH;

        if (!N8N_HOST || !path) {
            throw new Error("Missing N8N configuration");
        }

        const webhookUrl = `${N8N_HOST}${path}?${params.toString()}`;

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

export default app;
