import express from "express";
import { loginVolunteer } from "../controllers/volunteerController.js";

const router = express.Router();

router.post("/login", loginVolunteer);

export default router;
