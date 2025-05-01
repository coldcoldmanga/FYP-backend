const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { analyzeReport } = require('./services/AiSummarize/reportAnalyze');
const { processReports} = require('./services/AiSummarize/processReportData');
const { saveSummary } = require('./services/firestoreService');
const { updateAssignedTaskToWorker, updateTaskStatusToWorker, updateReportStatusToAdmin, updateNewReportToAdmin, updateReportStatusToUser2 } = require('./services/pushNotfication/oneSignal');
const { uploadAttachment } = require('./services/uploadAttachment/cloudinary');
const { assignTask } = require('./services/assignTask/assignTask');
const app = express();
const port = process.env.PORT | 3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.get('/', (req, res) => {
    res.send('The server is running on port 3000');
})

app.post('/analyzeReport', async (req, res) => {
    try {
        const { startDate, endDate} = req.body;

        //process report data
        const reportData =await processReports(startDate, endDate);

        //analyze report
        const analysis = await analyzeReport(reportData);

        //save summary
        await saveSummary(analysis);

        res.json({
            success:true,
            data: analysis
        });
        
    } catch (error) {

        console.error('Error analyzing report:', error);
        res.status(500).json({
            success:false,
            error: 'An error occurred while analyzing the report',
            message: error.message
        });
        
    }
})

// app.post('/assignTask', async (req, res) => {
//     try {

//         const { reportID, specializeField} = req.body;
        
//         await assignTask(reportID, specializeField);

//         res.json({
//             success:true,
//             message: 'Task assigned to worker'
//         })
        
//     } catch (error) {
//         console.error('Error assigning task:', error);

//         res.status(500).json({
//             success:false,
//             error: 'An error occurred while assigning task',
//             message: error.message
//         })
        
//     }
// });

app.post('/updateAssignedTaskToWorker', async (req, res) => {

    try {

        const { playerID, reportID} = req.body;

        await updateAssignedTaskToWorker(playerID, reportID);

        res.json({
            success:true,
            message: 'Task assigned to worker'
        })
        
    } catch (error) {
        console.error('Error sending push notification to worker:', error);

        res.status(500).json({
            success:false,
            error: 'An error occurred while sending push notification to worker',
            message: error.message
        })
        
    }

});

app.post('/updateReportStatusToAdmin', async (req, res) => {

    const { reportID, status, workerID} = req.body;

    try {

        await updateReportStatusToAdmin(reportID, status, workerID);

        res.json({
            success:true,
            message: 'Report status updated to admin'
        })
        
    } catch (error) {
        console.error('Error sending push notification to admin:', error);

        res.status(500).json({
            success:false,
            error: 'An error occurred while sending push notification to admin',
            message: error.message
        })
    }

});

app.post('/updateNewReportToAdmin', async (req, res) => {

    try {

        const { userID, faultType, reportID} = req.body;

        await updateNewReportToAdmin(userID, faultType, reportID);

        res.json({
            success:true,
            message: 'New report notification sent to admin'
        })
        
    } catch (error) {

        console.error('Error sendng push notification to admin:', error);

        res.status(500).json({
            success:false,
            error: 'An error occurred while sending push notification to admin',
            message: error.message
        })
        
    }

});

app.post('/updateReportStatusToUser', async (req, res) => {

    const { reportID, status, playerID } = req.body;
    
    try {
        await updateReportStatusToUser(reportID, status, playerID);

        res.json({
            success:true,
            message: 'Report status updated to user'
        })
    } catch (error) {
        console.error('Error sending push notification to user:', error);
        res.status(500).json({
            success:false,
            error: 'An error occurred while sending push notification to user',
            message: error.message
        })

    }
});

app.post('/uploadAttachment', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({
              success: false,
              error: 'No file uploaded'
            });
          }
      
          const file = req.files.file;
          const mediaType = req.body.mediaType;

        const url = await uploadAttachment(file.tempFilePath, mediaType);

        res.json({
            success:true,
            url
        })
    } catch (error) {
        console.error('Error uploading attachment:', error);

        res.status(500).json({
            success:false,
            error: 'An error occurred while uploading attachment',
            message: error.message
        })

    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
