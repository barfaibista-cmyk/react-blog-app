import express from "express";
import {
  // addRole,
  // deleteRole,
  getRolePermissions,
  getRolePermission,
  // updateRole,
} from "../controllers/rolepermission.js";

const router = express.Router();

router.get("/", getRolePermissions);
router.get("/:id", getRolePermission);
// router.post("/", addRole);
// router.delete("/:id", deleteRole);
// router.put("/:id", updateRole);

export default router;
