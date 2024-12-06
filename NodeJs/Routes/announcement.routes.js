import { addAnnouncement, AddNestedComment, deleteAnnouncement, deleteComment, editComment, fetchAnnouncement, UpdateLikesDislikeComment } from "../Controlller/announcement.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

export function announcementRoutes(app) {
    app.get("/fetchAnnouncement", verifyUser, fetchAnnouncement);
    app.post("/addAnouncement", addAnnouncement);
    app.delete("/deleteAnnouncement/:id", deleteAnnouncement);
    app.patch("/updateLikeDislikeComment/:id", UpdateLikesDislikeComment);
    app.patch("/updateComment/:id", AddNestedComment);
    app.patch("/editComment/:id", editComment);
    app.patch("/deleteComment/:id", deleteComment);
};