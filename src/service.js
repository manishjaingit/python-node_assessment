import { spawn } from "child_process";
import Question from "../model/question.js";
import { ApiError } from "../utils/apiError.js";

export default {
  fetchQuestion: async (filter) => {
    try {
      const pythonProgress = spawn("python", [
        "app.py",
        filter?.model,
        filter?.question,
      ]);

      let resultData = "";
      let errorData = "";
      let result = "";

      pythonProgress.stdout.on("data", (data) => {
        resultData += data.toString("utf-8");
        console.log(resultData, "dataaa");
      });

      pythonProgress.stderr.on("data", (data) => {
        errorData += data.toString("utf-8");
      });

      pythonProgress.on("close", async (code) => {
        if (code !== 0) {
          // throw new ApiError(400, "Something went wrong", null);
          console.error(`Python script exited with code ${code}`);
        } else if (errorData) {
          console.error(`stderr: ${errorData}`);
        } else {
          const jsonResult = JSON.parse(resultData);
          console.log(jsonResult, "Parsed Result");

          for (const [question, answer] of Object.entries(jsonResult)) {
            const newQuestionAnswer = new Question({ question, answer });
            result = await newQuestionAnswer.save();
            console.log(result, "resultresult");
            return result;
          }
        }
        
      });
    } catch (error) {
      throw error;
    }
  },
  fetchQuestionList: async (filter) => {
    try {
      const result = await Question.find().sort({ createdAt: -1 });
      if (!result.length) {
        throw new ApiError(404, "Question not found");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};
