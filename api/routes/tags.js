import express from "express";
import {
  addTag,
  deleteTag,
  getTag,
  getTags,
  updateTag,
} from "../controllers/tag.js";

const router = express.Router();

router.get("/", getTags);
router.get("/:seotitle", getTag);
router.post("/", addTag);
router.delete("/:id", deleteTag);
router.put("/:id", updateTag);

export default router;
