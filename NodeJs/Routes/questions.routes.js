import { addAnswer, addQuestion, addVote, getQuestions } from "../Controlller/questions.controller.js";

export function questionRoutes(app) {
    app.get("/quetions", getQuestions);
    app.post("/quetion", addQuestion);
    app.post("/answer/:id", addAnswer);
    app.post("/vote/:id", addVote);
};