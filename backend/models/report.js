const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    overallRisk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    financialMetrics: [
      {
        name: String,
        value: String,
      },
    ],

    risks: [
      {
        category: String,
        title: String,
        description: String,
      },
    ],

    insights: [String],

    recommendations: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);