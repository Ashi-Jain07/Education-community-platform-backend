import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    prerequisites: { type: String, default: "" },
    attendees: { type: [String], default: [] }
});

const eventModel = mongoose.model("Event", eventSchema);
export default eventModel;