import express from "express";

const app = express();

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

export default videoRouter;
