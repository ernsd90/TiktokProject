const { exit } = require('process');
const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs'); //for working with files

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

// Set ffmpeg path to static binary
ffmpeg.setFfmpegPath(ffmpegStatic);


async function downloadAndSavePdf(url, folderName, filename) {
    try {
        // Create the directory if it doesn't exist
        await fs.mkdir(folderName, { recursive: true });

        const cleanName = filename.replace(/[\s\W_]+/g, '');
        const filepath = path.join(folder, cleanName+".pdf");

        // Fetch the PDF file as a stream
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        // Stream the PDF file to the local filesystem
        const writer = response.data.pipe(fs.createWriteStream(filepath));

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Failed to download and save PDF:', error);
    }
}

function downloadM3U8(url, outputFilePath) {
    return new Promise((resolve, reject) => {
        ffmpeg(url)
            .outputOptions([
                '-c copy',  // Copy codec settings without re-encoding (fastest method)
                '-bsf:a aac_adtstoasc'  // Required if the audio codec is AAC (common for M3U8)
            ])
            .output(outputFilePath)
            .on('end', () => {
                console.log('Download and conversion complete');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error processing video:', err);
                reject(err);
            })
            .run();
    });
}

function readFileAsync(filePath, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


async function loadJsonFile() {

    try {
        // Load and parse the JSON file
        const courseJson = await readFileAsync('json/final.json');
        const allData = JSON.parse(courseJson);
        const allSectionsData = [];
        let videoType;
        Object.values(allData).forEach((sections, index) => {
            // Process each course object here
            const folder_title = sections.title.replace(/[^\w\s]/g, '');
            const learningPath = sections.learningPath;
            const FolderName = "Course/"+index+" "+folder_title;
  
            fs.mkdir(FolderName, { recursive: true }, (err) => {
                if (err) {
                    console.error('Failed to create directory:', err);
                } else {
                    console.log('Directory created successfully');
                }
            });


            Object.values(learningPath).forEach(async (Path, vid) => {
                const VideoTitle = vid+" "+Path.VideoTitle.replace(/[^\w\s]/g, '');
                const VideoDownloadUrl = Path.DownloadUrl;
                 videoType = Path.videoType;

                if(videoType == 'pdf'){
                   // console.log(VideoDownloadUrl);
                   // console.log(FolderName);
                   // console.log(VideoTitle);
                    //await downloadAndSavePdf(VideoDownloadUrl, FolderName, VideoTitle);
                }else{
                    let outputFilePath = "D:\ApnaCollage/"+FolderName+"/"+VideoTitle+".mp4";
                    //console.log(outputFilePath);
                    let m3u8_url = VideoDownloadUrl+".m3u8";
                    if (fs.existsSync(outputFilePath)) {}else{

                        try {
                            console.log(`Start downloaded ${outputFilePath}`);
                            await downloadM3U8(m3u8_url, outputFilePath);
                            console.log(`Successfully downloaded ${VideoTitle}`);
                        } catch (error) {
                            console.log(`Failed ${m3u8_url}`);
                            console.error(`Failed ${outputFilePath}`);
                            console.error(`Failed to download ${VideoTitle}: ${error}`);
                        }
                        //let ffmpeg_i = 'ffmpeg -i "'+m3u8_url+'" -c copy -bsf:a aac_adtstoasc "'+outputFilePath+'"';
                        //console.log(ffmpeg_i);
                    }
                    console.log("-------------------------------------------");
                    
                }
                
            });
            if(videoType != 'pdf' && index == 5){
                throw new Error('BreakLoop');
            }
        });
    } catch (error) {
        console.error('Failed to read file:', error);
    }

}

// Call the async function
loadJsonFile();