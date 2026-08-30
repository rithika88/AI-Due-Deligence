
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const reportRoutes = require("./routes/reportRoutes");
require("dotenv").config();

const companyRoutes = require("./routes/companyRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Due Diligence Copilot API is running",
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test route works",
  });
});

app.use("/api/companies", companyRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });