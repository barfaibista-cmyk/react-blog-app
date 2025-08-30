import express from "express";
import {
  // addPermission,
  // deletePermission,
  getPermission,
  getPermissions,
  // updatePermission,
} from "../controllers/permission.js";

const router = express.Router();

router.get("/", getPermissions);
router.get("/:id", getPermission);
// router.post("/", addPermission);
// router.delete("/:id", deletePermission);
// router.put("/:id", updatePermission);

export default router;
