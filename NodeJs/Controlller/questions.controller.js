import QuestionModel from "../Model/questions.model.js";

// Fetch questions with optional tag filter
export async function getQuestions(req, res) {
    const { tag } = req.query;

    try {
        const questions = tag
            ? await QuestionModel.find({ tags: tag }).sort({ createdAt: -1 })
            : await QuestionModel.find().sort({ createdAt: -1 });

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
};

// Add a new question
export async function addQuestion(req, res) {
    const { title, description, tags } = req.body;

    try {
        const question = new QuestionModel({ title, description, tags });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: "Failed to add question" });
    }
};

// Add an answer to a question
export async function addAnswer(req, res) {
    const { answer } = req.body;

    if(!answer) {
        return res.status(404).json({message: "Provide Answer"})
    }

    let update = {};
    update.answer = answer;

    try {
        const question = await QuestionModel.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!question) return res.status(404).json({ error: "Question not found" });
        await question.save();
       res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: "Failed to add answer" });
    }
};

// Vote on a question or answer
export async function addVote(req, res) {
    const { voteType, answerIndex } = req.body;

    try {
        const question = await QuestionModel.findById(req.params.id);
        if (!question) return res.status(404).json({ error: "Question not found" });

        if (answerIndex !== undefined) {
            question.answers[answerIndex].votes += voteType === "up" ? 1 : -1;
        } else {
            question.votes += voteType === "up" ? 1 : -1;
        }

        await question.save();
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: "Failed to vote" });
    }
};