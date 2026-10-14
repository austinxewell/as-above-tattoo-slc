import mongoose from "mongoose";

const DB_NAME = "as-above";

export async function connectToDatabase() {
  const url = process.env.MONGO_URL;

  if (!url) {
    throw new Error("MONGO_URL is not set. Add it to server/.env (or Railway's Variables).");
  }

  await mongoose.connect(url, { dbName: DB_NAME });
  console.log(`Connected to MongoDB database "${DB_NAME}"`);
}
