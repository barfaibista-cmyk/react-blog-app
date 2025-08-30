import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:seotitle", getCategory);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);

export default router;
