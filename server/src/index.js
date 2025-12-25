import dotenv from "dotenv"
import connectDB from "../config/database.js"
import app from "./app.js"

dotenv.config()

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB")

    app.on("error", (err) => {
      console.error("App Error,", err)
    });

    const PORT = process.env.PORT || 8000;

    // listen
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });

  } catch (error) {
    console.error("Failed to connect to MongoDbD:", error)
    process.exit(1)
  }
};

startServer();
