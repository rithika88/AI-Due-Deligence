const express = require("express");
const Company = require("../models/company");

const router = express.Router();

// Create a company
router.post("/", async (req, res) => {
  try {
    const { name, industry, description } = req.body;

    if (!name || !industry) {
      return res.status(400).json({
        message: "Name and industry are required",
      });
    }

    const company = await Company.create({
      name,
      industry,
      description,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create company",
      error: error.message,
    });
  }
});

// Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
});
// Get a single company
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company",
      error: error.message,
    });
  }
});

module.exports = router;