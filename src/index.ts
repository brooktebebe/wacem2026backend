import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import contactRouter from "./routes/contact.js"; // make sure file extension is included for ES Modules

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL || "https://wacem2026.org"];

const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // if you need cookies/auth headers
};

app.use(cors(corsOptions));

// Middlewares
app.use(morgan("combined")); // better for production
app.use(express.json());

// Routes
app.use("/api/contact", contactRouter);

// Default route
app.get("/", (_, res) => res.send("WACEM Backend API is running!"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
