import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4 } from "uuid"
import path from "path"
import { log } from "console"
import fs, { existsSync } from "fs"
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

    if(!existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive: true})

    }

    //ffmpeg
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // no queue because of MVP , not to be used in production
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error){
            console.log(`exec error: ${error}`)
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        const videoUrl = `http://localhost:5000/upload/courses/${lessonId}/index.m3u8`

        res.json({
            message: "Video converted to HLS formate",
            videoUrl: videoUrl,
            lessonId: lessonId
        })
    })
   
})


app.listen(PORT, function(){
    console.log(`App is listening at port ${PORT}`);
})