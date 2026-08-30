const express = require("express");
const mongoose = require("mongoose");

const Company = require("../models/company");
const Document = require("../models/document");
const Report = require("../models/report");

const router = express.Router();

// ==========================================
// Generate Due Diligence Report
// ==========================================

router.post("/generate/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check company ID
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    // Find company
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Find analyzed documents
    const documents = await Document.find({
      companyId,
      status: "Analyzed",
    }).sort({ createdAt: -1 });

    if (documents.length === 0) {
      return res.status(400).json({
        message: "No analyzed documents available for this company",
      });
    }

    // Collect financial metrics
    const financialMetrics = [];

    // Collect risks
    const risks = [];

    // Collect insights
    const insights = [];

    documents.forEach((document) => {
      if (document.analysis) {
        // Financial metrics
        if (document.analysis.financialMetrics) {
          financialMetrics.push(
            ...document.analysis.financialMetrics.map((metric) => ({
              name: metric.name,
              value: metric.value,
            }))
          );
        }

        // Risks
        if (document.analysis.risks) {
          risks.push(
            ...document.analysis.risks.map((risk) => ({
              category: risk.category,
              title: risk.title,
              description: risk.description,
            }))
          );
        }

        // Insights
        if (document.analysis.insights) {
          insights.push(...document.analysis.insights);
        }
      }
    });

    // Determine overall risk
    let overallRisk = "Medium";

    for (const document of documents) {
      if (document.analysis?.overallRisk === "High") {
        overallRisk = "High";
        break;
      }

      if (document.analysis?.overallRisk === "Low") {
        overallRisk = "Low";
      }
    }

    // Create report
    const report = await Report.create({
      companyId: company._id,

      title: `${company.name} Due Diligence Report`,

      summary: `Due diligence report generated from ${documents.length} analyzed document(s).`,

      overallRisk,

      financialMetrics,

      risks,

      insights,

      recommendations: [
        "Review the source documents carefully before making business decisions.",
        "Validate important financial information against reliable sources.",
        "Investigate all identified risk factors before completing the due diligence process.",
      ],
    });

    res.status(201).json({
      message: "Due diligence report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);

    res.status(500).json({
      message: "Failed to generate report",
      error: error.message,
    });
  }
});
// ==========================================
// Get all reports
// ==========================================

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("companyId", "name industry")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Fetch all reports error:", error);

    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});
// ==========================================
// Get reports for a company
// ==========================================

router.get("/company/:companyId", async (req, res) => {
  try {
    const reports = await Report.find({
      companyId: req.params.companyId,
    })
      .populate("companyId", "name industry")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Fetch reports error:", error);

    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});

// ==========================================
// Get one report
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "companyId",
      "name industry"
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json(report);
  } catch (error) {
    console.error("Fetch report error:", error);

    res.status(500).json({
      message: "Failed to fetch report",
      error: error.message,
    });
  }
});

module.exports = router;