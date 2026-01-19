import express from "express";
import { register,login, getUsers,getUsersById,updateAvatar } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);
router.patch('/:id/avatar',updateAvatar);
router.post("/login", login);
router.get('/users',getUsers)
router.get('/users/:id',getUsersById)


export default router;
