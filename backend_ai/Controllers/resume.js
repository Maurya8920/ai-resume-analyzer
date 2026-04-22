const ResumeModel = require('../Models/resume');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: "o2pOz2qnFhJkuXJMOz6AR4cWDM1UuFQXlsV7ZsqD",
});


// ================= ADD RESUME =================
exports.addResume = async (req, res) => {
  try {
    let { user, job_desc } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    // ✅ normalize user (IMPORTANT FIX)
    user = user.trim().toLowerCase();

    console.log("Saving user:", user);

    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    const prompt = `
You are a resume evaluator.

Return output STRICTLY in this format:

Score: <number between 0-100>
Reason: <detailed explanation>

Resume:
${pdfData.text}

Job Description:
${job_desc}
`;

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    const result = response?.text || "No response generated";

    // ✅ extract score
    const scoreMatch = result.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

    // ✅ extract reason
    const reasonMatch = result.match(/Reason:\s*([\s\S]*)/i);
    const reason = reasonMatch ? reasonMatch[1].trim() : null;

    console.log("\n===== AI ANALYSIS RESULT =====\n");
    console.log(`Score: ${score}`);
    console.log(`Reason: ${reason}`);
    console.log("\n==============================\n");

    const newResume = new ResumeModel({
      user,
      resume_name: req.file.originalname,
      job_desc,
      score,
      feedback: reason
    });

    await newResume.save();

    // delete uploaded file
    fs.unlinkSync(pdfPath);

    res.status(200).json({
      message: "Your analysis is ready",
      data: newResume
    });

  } catch (err) {
    console.error("ERROR:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};



// ================= GET USER HISTORY =================
exports.getAllResumesForUser = async (req, res) => {
  try {
    let { user } = req.params;

    // ✅ normalize user (IMPORTANT FIX)
    user = user.trim().toLowerCase();

    console.log("Fetching user:", user);

    let resumes = await ResumeModel
      .find({ user })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Your Previous History",
      resumes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
};
exports.getResumeForAdmin = async (req, res) => {
    try {
        let resumes = await ResumeModel
      .find({ })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Fetched All History",
      resumes
    });


    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
}