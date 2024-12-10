import express from "express";
import { sendEmailController } from "../../Controllers/Email/SendEmailController.js";

const sendEmailRoute = express.Router();
sendEmailRoute.post("/api/send-email", sendEmailController);

export default sendEmailRoute;
