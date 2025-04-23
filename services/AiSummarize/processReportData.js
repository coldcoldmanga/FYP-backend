const { getReports } = require("../firestoreService");
const { maxBy, round } = require('lodash');

async function processReports(startDate, endDate) {
    try {
        const reports = await getReports(startDate, endDate);
        const totalReports = reports.length;
        const completedReports = reports.filter(report => report.status === "Completed");
        const completionRate = totalReports > 0 ? round((completedReports.length / totalReports) * 100) : 0;
        const avgCompletionTime = calculateAvgCompletionTime(completedReports);
        const frequentFaultType = getFrequentFaultType(completedReports);
        const frequentFaultyFacility = getFrequentFaultyFacility(completedReports);

        let structuredData = {};

        reports.forEach(report => {
            structuredData[report.report_id] = {
                building_id: report.building_id,
                facility_id: report.facility_id,
                equipment_id: report.equipment_id,
                fault_type: report.fault_type,
                description: report.description,
                status: report.status,
                priority: report.priority,
                submitted_at: report.submitted_at,
                updated_at: report.updated_at,
            }
        });

        structuredData["Misc"] = {
            total_reports: totalReports,
            completed_reports: completedReports.length,
            completion_rate: completionRate,
            avg_completion_time: avgCompletionTime,
            frequent_fault_type: frequentFaultType,
            frequent_faulty_facility: frequentFaultyFacility,
        };

        structuredData["Summary_Period"] = {
            start_date: startDate,
            end_date: endDate,
        };
        console.log(structuredData);
        // fs.writeFileSync("structuredData.json", JSON.stringify(structuredData, null, 2));
        return structuredData;
    } catch (error) {
        console.error("Error processing reports:", error);
        throw error;
    }
}

function calculateAvgCompletionTime(completedReports) {
    if (completedReports.length === 0) return 0;
    
    let totalTime = 0;
    for (const report of completedReports) {
        const submissionTime = report.submitted_at.toDate();
        const completionTime = report.updated_at.toDate();
        const timeDiff = completionTime - submissionTime;
        totalTime += timeDiff;
    }

    const avgCompletionTime = round((totalTime / (1000 * 60 * 60 * 24)) / completedReports.length, 2);

    switch (avgCompletionTime) {
        case avgCompletionTime < 1:
            return avgCompletionTime * 24 + " hours";
        default:
            return avgCompletionTime + " days";
    }
}

function getFrequentFaultType(completedReports) {
    if (completedReports.length === 0) return null;

    const faultTypes = {};
    completedReports.forEach(report => {
        const type = report.fault_type;
        faultTypes[type] = (faultTypes[type] || 0) + 1;
    });

    return maxBy(Object.entries(faultTypes), ([_, count]) => count);
}

function getFrequentFaultyFacility(completedReports) {
    if (completedReports.length === 0) return null;

    const facility = {};
    completedReports.forEach(report => {
        const f = report.facility_id;
        facility[f] = (facility[f] || 0) + 1;
    });

    return maxBy(Object.entries(facility), ([_, count]) => count);
}

module.exports = { processReports };
