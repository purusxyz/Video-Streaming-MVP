import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4 } from "uuid"
import path from "path"
import { log } from "console"
import fs from "fs"
import { exec } from "child_process" // watch out


const app = express()

//multer middleware

const storage = multer.diskStorage({
    destination: function(req, file, cb){
    cb(null, "./uploads")
},
filename: function(req, file, cb){
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
}
})

//configuration

const upload = multer({storage: storage})



app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    })
)

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept"
    );
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/upload", express.static("uploads"))

const PORT = 5000

app.get("/", function(req, res){
    res.json({message: "Hii There"})
})

app.post("/upload", upload.single("file"), function(req, res){
    console.log("file uploaded")
    const lessonId = uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log("hlsPath", hlsPath)
   
})


app.listen(PORT, function(){
    console.log(`App is listening at port ${PORT}`);
})