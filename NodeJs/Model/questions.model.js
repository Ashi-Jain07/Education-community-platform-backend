import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    votes: { type: Number, default: 0 },
    answer: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;