import express from "express";
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";
const app = express();

const globalRouter = express.Router();

globalRouter.get("/", trending);

globalRouter.get("/join", join);

export default globalRouter;
