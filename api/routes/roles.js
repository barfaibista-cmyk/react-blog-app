import express from "express";
import {
  // addRole,
  // deleteRole,
  getRole,
  getRoles,
  // updateRole,
} from "../controllers/role.js";

const router = express.Router();

router.get("/", getRoles);
router.get("/:id", getRole);
// router.post("/", addRole);
// router.delete("/:id", deleteRole);
// router.put("/:id", updateRole);

export default router;
