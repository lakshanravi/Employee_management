import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Employee API Working!" });
});

export default router;
