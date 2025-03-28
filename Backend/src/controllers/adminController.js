const Report = require("../models/Report");
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secure-key";
// 🔹 Get all reports (Admins only)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}); // Fetch all reports from MongoDB
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: error.message,
    });
  }
};

// 🔹 Get a single report by ID (Admins only)
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id); // Find report by ID
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching report",
      error: error.message,
    });
  }
};

// 🔹 Update report status (Admins only)
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body; // Get new status from request body
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: status }, // Update status
      { new: true, runValidators: true } // Return updated report
    );

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Report status updated", data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating report status",
      error: error.message,
    });
  }
};
const getDecryptedReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id); // Fetch report by ID

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    // 🔹 Decrypt the report content
    const decryptedContent = crypto.AES.decrypt(
      report.content, // Encrypted text from DB
      ENCRYPTION_KEY
    ).toString(crypto.enc.Utf8);

    if (!decryptedContent) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to decrypt the report" });
    }

    res.status(200).json({
      success: true,
      data: { ...report.toObject(), content: decryptedContent }, // Send decrypted content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error decrypting the report",
      error: error.message,
    });
  }
};

const searchReports = async (req, res) => {
  try {
    const { q } = req.query; // Get search query from URL

    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    // Search in title and description fields (case-insensitive)
    const reports = await Report.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching reports",
      error: error.message,
    });
  }
};

// 🎯 Filter Reports by Status & Date Range
const filterReports = async (req, res) => {
  try {
    const { status, from, to } = req.query; // Get filters from URL

    let filter = {};

    // If status is provided, filter by it
    if (status) {
      filter.status = status;
    }

    // If date range is provided, filter by createdAt field
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const reports = await Report.find(filter);

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering reports",
      error: error.message,
    });
  }
};
module.exports = {
  getAllReports,
  getReportById,
  updateReportStatus,
  getDecryptedReport,
  searchReports,
  filterReports,
};
