import express from "express";
import config from "config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// import rateLimit from "express-rate-limit";

// Import routes
import masjidRouter from "./controllers/masjid/index.js";

// Database connection
import "./utils/dbConnect.js";

// Set up __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set server port (default to 5002)
const PORT = config.get("PORT") || 5002;

// Initialize Express app
const app = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://jummah.muzammil.xyz"],
  })
);

// Serve static files (Frontend build)
app.use(express.static(path.join(__dirname, "dist")));

// // Rate Limiting (Prevent abuse)
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Allow max 100 requests per IP
//   message: "Too many requests, please try again later.",
//   headers: true,
// });
// app.use(globalLimiter);

// ✅ Test API Route
app.get("/", async (req, res) => {
  try {
    res.json([
      { masjidName: "Masjid A", masjidArea: "Area 1", masjidTime: "1:30 PM" },
      { masjidName: "Masjid B", masjidArea: "Area 2", masjidTime: "1:45 PM" },
    ]);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// ✅ API Routes
app.use("/api/public/masjids", masjidRouter);
app.use((req, res) => {
  res.status(404).json({ message: "Not Found Router" });
});
// Handle all other routes (Frontend Routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
