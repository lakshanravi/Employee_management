import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const MONGODB_URI = process.env.MONGODB_URI;
export const connectDB = async () => {
try {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected!"); 
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}

}
