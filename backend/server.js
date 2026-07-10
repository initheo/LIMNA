import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { analyzeWaterQuality } from "../ai/analyzeWater.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontDir = path.resolve(__dirname, "../front");

app.use(express.json());
app.use(express.static(frontDir));

app.post("/api/analyze", async (req, res) => {
  try {
    const { sumberAir, lokasi, filtrasi } = req.body || {};

    if (!sumberAir || !lokasi || !filtrasi) {
      return res.status(400).json({ error: "Semua field harus diisi." });
    }

    const result = await analyzeWaterQuality({ sumberAir, lokasi, filtrasi });
    return res.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error:
        error?.message ||
        "Gagal melakukan analisis AI. Pastikan GEMINI_API_KEY diatur dengan benar.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
