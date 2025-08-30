import express from "express";
import {
  // addCategory,
  // deleteCategory,
  getMenu,
  // getCategories,
  // updateCategory,
} from "../controllers/menu.js";

const router = express.Router();

router.get("/", getMenu);
// router.get("/:seotitle", getCategory);
// router.post("/", addCategory);
// router.delete("/:id", deleteCategory);
// router.put("/:id", updateCategory);

export default router;
