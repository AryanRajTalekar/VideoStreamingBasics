import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';

import {v4 as uuidv4} from 'uuid';
import path from 'path';
import fs from 'fs';
import {exec} from "child_process"; //watchout this should not br used on servers


dotenv.config();

const app = express();
const PORT = process.env.PORT;

//multer middle....he mostly code copy karto apan snippets madhun 
//multer is used to upload files
//multer cha code documentation madhun ghayaycha

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
});

//multer configuration

const upload = multer({
    storage:storage
});


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

//declare which type of content is going to come
//use middleware
//when using middleware we have to use req,res,next

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
        " Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
    // * denotes all the origins but it is not a good pratice
});


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads",express.static("uploads"));



app.get('/',(req,res)=>{
    // res.send("Hello World");
    res.json({message:"Hello World"});
});

app.post("/upload",upload.single("file"),function(req,res){
    const lessonID = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `Uploads/courses/${lessonID}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log("hlsPath",hlsPath);


    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath,{recursive:true});
    }

    //ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
        
    exec(ffmpegCommand,(error,stdout,stderr)=>{
        if(error){
            console.error(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        const videoUrl = `http://localhost:${PORT}/Uploads/courses/${lessonID}/index.m3u8`;
        res.json({message:"Video Converted to hls format",
            videoUrl:videoUrl,
            lessonID:lessonID
        });

    });

    // m3u8 is a file format that is used to store multimedia playlists
    // it is an extensible format that is used to store video and audio files
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

