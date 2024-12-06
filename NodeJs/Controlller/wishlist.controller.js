import WishlistModel from "../Model/wishlist.model.js";

// Fetch wishlist items
export async function getWishlist(req, res) {
    try {
        const wishlist = await WishlistModel.find().sort({ votes: -1, createdAt: -1 });
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wishlist items" });
    }
}

// Add a new wishlist item
export async function addWishlist(req, res) {
    const { title, description } = req.body;

    try {
        const wishlistItem = new WishlistModel({ title, description });
        await wishlistItem.save();
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to add wishlist item" });
    }
}

// Vote on a wishlist item
export async function addWishlistVote(req, res) {
    const { voteType } = req.body;

    try {
        const wishlistItem = await WishlistModel.findById(req.params.id);
        if (!wishlistItem) return res.status(404).json({ error: "Wishlist item not found" });

        wishlistItem.votes += voteType === "up" ? 1 : -1;
        await wishlistItem.save();

        res.status(200).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to vote on wishlist item" });
    }
}

// Update status of a wishlist item
export async function updateWishlist(req, res) {
    const { status } = req.body;

    try {
        const wishlistItem = await WishlistModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!wishlistItem) return res.status(404).json({ error: "Wishlist item not found" });

        res.status(200).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
}
