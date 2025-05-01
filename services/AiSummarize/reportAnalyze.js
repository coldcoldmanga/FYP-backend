const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const SYSTEM_PROMPT = `Analyze the provided JSON dataset of facility issues with a focus on **smart pattern recognition** and **actionable intelligence**. Prioritize depth over breadth—uncover non-obvious correlations, root causes, and high-impact trends.  

**Output Structure (Be Concise, Data-Driven):**  
1. **Overview**  
   - Total issues, resolution rate (%)  
   - Top 3 issue categories (with frequency %)  
   - Most affected departments/locations  

2. **Key Insights** *(Think critically—ask: "Why?" and "So what?")*  
   - Hidden patterns (e.g., recurring issues tied to specific equipment/shifts)  
   - High-risk outliers (e.g., unresolved high-priority issues beyond SLA)  
   - Cost/downtime drivers (if data allows)  

3. **Trends** *(Go beyond basic time-series—analyze seasonality, escalation paths, and anomalies)*  
   - Temporal spikes (e.g., "HVAC failures peak every July")  
   - Status transition trends (e.g., "20% of 'Pending' issues escalate to 'Critical'")  
   - Efficiency metrics (e.g., "Resolution time increases by 2x on weekends")  

4. **Recommendations** *(Prioritize by impact + feasibility)*  
   - Quick wins (e.g., "Preventive maintenance for Top 2 recurring issues")  
   - Systemic fixes (e.g., "Revise vendor SLAs for delays in Part X repairs")  
   - Data gaps to address (if any)  

**Rules:**  
- No fluff. Use bullet points, metrics, and direct language.  
- If data is ambiguous, state assumptions (e.g., "Assuming 'Priority 1' = Critical").  
- Flag surprising findings with 🚩.  
- Ignore irrelevant fields without apology.
- Ensure all reports are included in the summary regardless of the status, or if they are duplicates. Treat each report as a unique entity.
- Before the content, add a title of the report in the format of {title}: {summary date period} (e.g., "Report Summary: 2024-01-01 to 2024-01-31")
`; 

async function analyzeReport(reportData) {

  const result = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(reportData),
      },
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
  });

  console.log(result.choices[0].message.content);

  return result.choices[0].message.content;

}

module.exports = { analyzeReport};