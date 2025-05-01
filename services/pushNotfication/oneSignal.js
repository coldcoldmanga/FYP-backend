const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_APP_API = process.env.ONESIGNAL_APP_API;
const ONESIGNAL_NOTIFICATION_API = process.env.ONESIGNAL_NOTIFICATION_API;
const axios = require('axios');
const { getUserPlayerID, getUserTracking } = require('../firestoreService');
const sendNotification = async (message, title, userRole, playerID) => {
    try {
        let options = {}
        if(userRole !== ""){
            options = {
                method: 'POST',
                url: ONESIGNAL_NOTIFICATION_API,
                headers: {
                  accept: 'application/json',
                  Authorization: `Key ${ONESIGNAL_APP_API}`,
                  'content-type': 'application/json'
                },
                data: {
                  app_id: ONESIGNAL_APP_ID,
                  contents: {en: message},
                  headings: {en: title},
                  filters: [
                    {
                        field: 'tag',
                        key: 'user_role',
                        relation: '=',
                        value: userRole
                    }
                  ],
                }
              };
        }
        else{
            options = {
                method: 'POST',
                url: ONESIGNAL_NOTIFICATION_API,
                headers: {
                  accept: 'application/json',
                  Authorization: `Key ${ONESIGNAL_APP_API}`,
                  'content-type': 'application/json'
                },
                data: {
                  app_id: ONESIGNAL_APP_ID,
                  contents: {en: message},
                  headings: {en: title},
                  include_aliases: {
                    onesignal_id: playerID
                  },
                  target_channel: "push"
                }
            };
        }

          
         const response = await axios.request(options);
         return response.data;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateNewReportToAdmin = async (userID, faultType, reportID) => {

    try {
        const title = `New Report: ${reportID}`;
        const message = `A New ${faultType} Report has been submitted by ${userID}.`;
        const response = await sendNotification(message, title, "Admin", []);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const updateReportStatusToAdmin = async (reportID, status, workerID) => {
    try {
        const title = `${reportID}: Report Status Updated`;
        const message = `The report status has been updated to ${status} by ${workerID}.`;
        const response = await sendNotification(message, title, "Admin", [workerID]);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const updateReportStatusToUser = async (reportID, status, playerID) => {
    try {
        const title = `${reportID}: Report Status Updated`;
        const message = `The report status has been updated to ${status}.`;
        const response = await sendNotification(message, title, "", playerID);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

// const updateReportStatusToUser2 = async (reportID, status) => {

//     try {

//         const reportUserPlayerID = await getUserPlayerID(reportID);
//         const trackingUserPlayerID = await getUserTracking(reportID);
//         let playerID = [reportUserPlayerID];        
//             if(trackingUserPlayerID.length > 0){
//                 for(const userID of trackingUserPlayerID){
//                     playerID.push(userID);
//                 }
//             }

//         const title = `${reportID}: Report Status Updated`;
//         const message = `The report status has been updated to ${status}.`;
//         const response = await sendNotification(message, title, "", playerID);
//         return response;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }

// }

const updateAssignedTaskToWorker = async (playerID, reportID) => {
    try {
        const title = `New Task Assigned: ${reportID}`;
        const message = `You have been assigned a new task.`;
        const response = await sendNotification(message, title, "", playerID);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports = { updateNewReportToAdmin, updateReportStatusToAdmin, updateReportStatusToUser, updateAssignedTaskToWorker };
