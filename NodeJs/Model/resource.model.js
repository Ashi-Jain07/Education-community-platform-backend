import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Lesson Plans", "Websites", "Coursebooks"], required: true },
    url: { type: String, required: true }, // Link to preview/download resource
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Bookmarked by users
}, { timestamps: true });

const ResourceModel = mongoose.model("Resource", resourceSchema);
export default ResourceModel;