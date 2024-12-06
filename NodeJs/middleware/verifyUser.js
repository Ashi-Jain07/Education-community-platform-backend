import userModel from "../Model/user.model.js";
import jwt from "jsonwebtoken";

//Create a middleware for verifying user
export function verifyUser(req, res, next) {

    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] == "JWT") {
        jwt.verify(
            req.headers.authorization.split(" ")[1], "ProjectKey",
            function (err, verifiedToken) {
                if (err) {
                    return res.status(403).json({ message: "Invalid Token" });
                }
                userModel.findById(verifiedToken._id).then(user => {
                    res.user = user;
                    next()
                }).catch(err => res.status(500).json({ message: err.message }));
            }
        )
    }
    else {
        res.status(404).json({ message: "Token is not present" })
    }
};