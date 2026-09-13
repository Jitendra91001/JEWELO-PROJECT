import { CorsOptions } from "cors";
import { env } from "./env.config";

const allowedOrigins = [
  env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server) or matched origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy rejection: Origin ${origin} not permitted`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Forwarded-For",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range", "Set-Cookie"],
  maxAge: 86400, // 24 hours
};

export default corsOptions;
