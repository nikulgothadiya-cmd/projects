import express from "express";
import Book from "../models/Book.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Book.find());
});

// GET single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ msg: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    const book = await Book.create({
      ...req.body,
      image: req.file.filename,
    });

    res.json(book);
  }
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(book);
  }
);

router.delete("/:id", protect, adminOnly, async (req, res) => {
  res.json(await Book.findByIdAndDelete(req.params.id));
});

export default router;
