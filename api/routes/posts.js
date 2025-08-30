import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPostByCategory,
  getPostByTag,
  getPostByHits,
  getPostByQuery,
  getPosts,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/hits", getPostByHits);
router.get("/:seotitle", getPost);
router.get("/:ctitle/category", getPostByCategory);
router.get("/:tag/tag", getPostByTag);
router.get("/:keyword/search", getPostByQuery);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;
