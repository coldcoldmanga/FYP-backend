
const { getWorker, assignWorker } = require("../firestoreService");
const { updateReportStatusToUser, updateAssignedTaskToWorker, updateReportStatusToAdmin } = require("../pushNotfication/oneSignal");

async function assignTask(reportID, specializeField){

    try {

        const workerData = await getWorker(specializeField);

        if(workerData.length === 0){
            return {
                success:false,
                message: "No worker available"
            }
        }
        //worker with the least active task
        const workerID = [...workerData].sort((a, b) => a.active_task - b.active_task)[0];

        await assignWorker(reportID, workerID);
        await updateReportStatusToUser(reportID, "assigned", workerID);
        await updateAssignedTaskToWorker(workerID, reportID);
        await updateReportStatusToAdmin(reportID, "assigned", workerID);

        
    } catch (error) {
        
    }
}

module.exports = { assignTask}