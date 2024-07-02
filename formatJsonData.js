//


const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve,milliseconds));
};


//load cookie function
const loadJson = async () => {
    // Load and parse the JSON file
    const courseJson = await fs.readFile('json/apnacollage_fullcourse.json', 'utf8');
    const allData = JSON.parse(courseJson);

    const allSectionsData = [];
    const AllSection = allData.course.sections;
    const VideoPath = allData.course.videos;
    const PdfPath = allData.course.objects;
  //  console.log(VideoPath);
    // Iterate over each course in the array
    Object.values(AllSection).forEach(sections => {
        // Process each course object here
        const folder_title = sections.title;
        const learningPath = sections.learningPath;
    

        const learningPathDetails = [];

        Object.values(learningPath).forEach(Path => {
            const videoId = Path.id;
            const videoType = Path.type;
            let VideoData, Videosourceid ;
            
            if(videoType == 'ivideo'){
                VideoData = VideoPath[videoId];
                Videosourceid = "https://fast.wistia.com/embed/medias/"+VideoData['sourceid'];
            }else{
                VideoData = PdfPath[videoId];
                if(VideoData['objectType']){
                    Videosourceid = VideoData['data']['pdf_full'];
                }
            }
            const VideoTitle = VideoData['title'];

            // Add each learning path item to the learningPathDetails array
            learningPathDetails.push({
                videoId: videoId,
                videoType: videoType,
                VideoTitle: VideoTitle,
                DownloadUrl: Videosourceid,
            });
            return false;
        });

        allSectionsData.push({
            title: folder_title,
            learningPath: learningPathDetails
        });
        return false;
    });

    console.log(allSectionsData);

    const jsonData = JSON.stringify(allSectionsData, null, 2); 

    await fs.writeFile('json/final.json', jsonData, 'utf8');

    return allSectionsData; // Optional: return courses if needed elsewhere

}

loadJson().then(() => {
    console.log('Finished processing all courses.');
}).catch(error => {
    console.error('Error processing courses:', error);
});
