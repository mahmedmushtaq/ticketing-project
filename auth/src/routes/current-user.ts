import express from "express";

const router = express.Router();

router.get("/api/users/currentUser", async (req,res)=>{
    res.send("Hi there")
})

export {router as currentUserRouter}