import { addWishlist, addWishlistVote, getWishlist, updateWishlist } from "../Controlller/wishlist.controller.js";

export function wishlistRoutes(app) {
    app.get("/wishlist", getWishlist);
    app.post("/wishlist", addWishlist);
    app.post("/wishlist/vote/:id", addWishlistVote);
    app.patch("/updateStatus/:id", updateWishlist);
}