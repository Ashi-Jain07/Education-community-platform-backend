import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    votes: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel;
