const firestore = require("../firebaseConfig");
const { collection, query, where, getDocs, Timestamp } = require("firebase-admin/firestore");

async function getReports(startDate, endDate){
    try {
        const startTimestamp = Timestamp.fromDate(new Date(startDate));
        const endTimestamp = Timestamp.fromDate(new Date(endDate));
        const reportSnapshot = await firestore.collection("reports").where("submitted_at", ">=", startTimestamp).where("submitted_at", "<=", endTimestamp).get();

        const reportData = reportSnapshot.docs.map((doc) => {
            return {
              report_id:doc.id,
              building_id: doc.data().building_id,
              facility_id: doc.data().facility_id,
              equipment_id: doc.data().equipment_id,
              fault_type: doc.data().fault_type,
              description: doc.data().description,
              status: doc.data().status,
              priority: doc.data().priority,
              submitted_at: doc.data().submitted_at,
              updated_at: doc.data().updated_at,
            };
        });

        return reportData;
        
    } catch (error) {
        console.error("Error fetching reports:", error);
    }

}

async function saveSummary(summary){
    try {
        const summaryRef = firestore.collection("summaries").doc();
        await summaryRef.set({
            summary_content: summary,
            created_at: Timestamp.now(),
        })
        
    } catch (error) {
        console.error("Error saving summary:", error);
    }
}

async function getWorker(specialize){

    try {
        const workerRef = firestore.collection("user").where("specialize", "array-contains", specialize).where("active_task", "<", 5).get();
        const workerData = (await workerRef).docs.map((doc) => {
            return {
                worker_id: doc.id,
                ...doc.data(),
            }
        });

        return workerData;
    } catch (error) {
        console.error("Error fetching worker:", error);
    }

}

async function assignWorker(reportID, workerID){
    try {
        const reportRef = firestore.collection("reports").doc(reportID);
        await reportRef.update({
            assigned_to: workerID,
            updated_at: Timestamp.now(),
        })

    } catch (error) {
        
    }
}

module.exports = { getReports, saveSummary, getWorker, assignWorker};




