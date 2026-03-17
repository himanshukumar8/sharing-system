import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import fileRoutes from "./routes/file.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import express from "express";
import { File } from "./models/file.models.js";

dotenv.config();

const __dirname = path.resolve();
// const PORT = process.env.PORT || 6600;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);

    // Serve uploaded files
    app.use("/uploads", express.static("uploads"));

    // Serve frontend
    app.use(express.static(path.join(__dirname, "/client")));

    // Short link resolver
    app.get("/f/:shortCode", async (req, res) => {
      const { shortCode } = req.params;

      try {
        const file = await File.findOne({
          shortUrl: `/f/${shortCode}`,
        });

        if (!file) {
          return res.status(404).send("File not found");
        }

        // redirect to actual file
        return res.redirect(`${process.env.BASE_URL}${file.path}`);
      } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();