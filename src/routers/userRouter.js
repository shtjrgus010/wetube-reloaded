import express from "express";

const app = express();

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

export default userRouter;
