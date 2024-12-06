import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String },
    comments: [{
        author: { type: String },
        content: { type: String },
        nestedComments: [{
            author: { type: String },
            content: { type: String },
        }]
    }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

const announcementModel = mongoose.model('Announcement', announcementSchema);

export default announcementModel;