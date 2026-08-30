const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Financial",
        "Legal",
        "Commercial",
        "Technical",
        "Other",
      ],
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    filePath: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Uploaded", "Processing", "Analyzed"],
      default: "Uploaded",
    },

    analysis: {
      overallRisk: {
        type: String,
        enum: ["Low", "Medium", "High"],
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

      insights: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);