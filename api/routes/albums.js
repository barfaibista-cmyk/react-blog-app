import express from "express";
import {
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbums,
  updateAlbum,
} from "../controllers/album.js";

const router = express.Router();

router.get("/", getAlbums);
router.get("/:id", getAlbum);
router.post("/", createAlbum);
router.delete("/:id", deleteAlbum);
router.put("/:id", updateAlbum);

export default router;
