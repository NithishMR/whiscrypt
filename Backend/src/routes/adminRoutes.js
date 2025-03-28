const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
// 🔹 Get all reports (Admins only)
router.get("/reports", authMiddleware, adminController.getAllReports);

// 🔹 Get a single report by ID (Admins only)
router.get("/reports/:id", authMiddleware, adminController.getReportById);

//get decrypted report
router.get(
  "/admin/reports/:id/decrypt",
  authMiddleware,
  adminController.getDecryptedReport
);

// 🎯 Filter Reports by Status & Date Range (Admins only)
router.get(
  "admin/reports/search",
  authMiddleware,
  adminController.searchReports
);
// 🔹 Update report status (e.g., "Reviewed", "Resolved") (Admins only)
router.get(
  "admin/reports/filter",
  authMiddleware,
  adminController.filterReports
);

router.patch(
  "/reports/:id",
  authMiddleware,
  adminController.updateReportStatus
);

module.exports = router;
