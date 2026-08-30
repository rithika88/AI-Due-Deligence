const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const Document = require("../models/document");

const router = express.Router();

// ------------------------------------
// Gemini
// ------------------------------------

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ------------------------------------
// Upload folder
// ------------------------------------

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ------------------------------------
// Multer
// ------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

// ------------------------------------
// Upload document
// ------------------------------------

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { type, companyId } = req.body;

    if (!type || !companyId) {
      return res.status(400).json({
        message: "Document type and companyId are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const document = await Document.create({
      name: req.file.originalname,
      type,
      companyId,
      filePath: req.file.path,
      status: "Uploaded",
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Document upload error:", error);

    res.status(500).json({
      message: "Failed to create document",
      error: error.message,
    });
  }
});

// ------------------------------------
// Get all documents
// ------------------------------------

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("companyId", "name industry")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
});

// ------------------------------------
// Get documents for one company
// ------------------------------------

router.get("/company/:companyId", async (req, res) => {
  try {
    const documents = await Document.find({
      companyId: req.params.companyId,
    })
      .populate("companyId", "name industry")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company documents",
      error: error.message,
    });
  }
});

// ------------------------------------
// Extract PDF text
// ------------------------------------

router.get("/:id/extract", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (!document.filePath) {
      return res.status(404).json({
        message: "No uploaded file available",
      });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        message: "File not found on server",
      });
    }

    const pdfBuffer = fs.readFileSync(document.filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    console.log("===== EXTRACTED TEXT =====");
    console.log(result.text);

    res.json({
      message: "Document text extracted successfully",
      documentId: document._id,
      documentName: document.name,
      text: result.text,
    });
  } catch (error) {
    console.error("PDF extraction error:", error);

    res.status(500).json({
      message: "Failed to extract document text",
      error: error.message,
    });
  }
});

// ------------------------------------
// Analyze document with Gemini
// ------------------------------------

router.post("/:id/analyze", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (!document.filePath) {
      return res.status(404).json({
        message: "No uploaded file available",
      });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        message: "File not found on server",
      });
    }

    // --------------------------------
    // Extract PDF text
    // --------------------------------

    const pdfBuffer = fs.readFileSync(document.filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const extracted = await parser.getText();

    await parser.destroy();

    const text = extracted.text;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "No text could be extracted from this document",
      });
    }

    // --------------------------------
    // Send document to Gemini
    // --------------------------------

    const prompt = `
You are an AI due diligence analyst.

Analyze the following company document.

Return ONLY valid JSON in this exact structure:

{
  "overallRisk": "Low | Medium | High",
  "financialMetrics": [
    {
      "name": "metric name",
      "value": "metric value"
    }
  ],
  "risks": [
    {
      "category": "Financial | Legal | Commercial | Technical | Other",
      "title": "short risk title",
      "description": "clear explanation of the risk"
    }
  ],
  "insights": [
    "insight 1",
    "insight 2",
    "insight 3"
  ]
}

Important:
- Do not invent facts.
- Only use information present in the document.
- If a metric is not available, do not create one.
- If there are no clear risks, return an empty risks array.
- Keep insights concise.
- This is due diligence analysis, not investment advice.

Document name:
${document.name}

Document type:
${document.type}

Document text:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let analysisText = response.text;

    console.log("===== GEMINI RAW RESPONSE =====");
    console.log(analysisText);

    // --------------------------------
    // Clean Gemini JSON response
    // --------------------------------

    analysisText = analysisText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error("Gemini JSON parse error:", parseError);

      return res.status(500).json({
        message: "Gemini returned an invalid analysis format",
        rawResponse: response.text,
      });
    }

    // --------------------------------
    // Update document status
    // --------------------------------

   document.status = "Analyzed";
document.analysis = analysis;

await document.save();
    // --------------------------------
    // Return analysis
    // --------------------------------

    res.json({
      message: "Document analyzed successfully",
      documentId: document._id,
      documentName: document.name,
      analysis,
    });
  } catch (error) {
    console.error("Gemini analysis error:", error);

    res.status(500).json({
      message: "Failed to analyze document",
      error: error.message,
    });
  }
});

// ------------------------------------
// View / download uploaded document
// ------------------------------------

router.get("/:id/file", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (!document.filePath) {
      return res.status(404).json({
        message: "No uploaded file available",
      });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        message: "File not found on server",
      });
    }

    res.sendFile(path.resolve(document.filePath));
  } catch (error) {
    console.error("File retrieval error:", error);

    res.status(500).json({
      message: "Failed to retrieve document",
      error: error.message,
    });
  }
});

module.exports = router;