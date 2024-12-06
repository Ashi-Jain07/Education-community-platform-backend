import userModel from "../Model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

//Api for user registration
export function userRegistration(req, res) {
    const { role, firstName, lastName, email, password, age, country } = req.body;

    if (!role || !firstName || !lastName || !email || !password || !age || !country) {
        return res.status(400).json({ message: "Fill the required fields" });
    };

    userModel.findOne({ email }).then(data => {
        if (data) {
            return res.status(400).json({ message: "Email already registered" });
        }
        else {
            const newUser = new userModel({
                role: role,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: bcrypt.hashSync(password, 10),
                age: age,
                country: country
            });

            newUser.save().then(data => {
                if (!data) {
                    return res.status(400).json({ message: "User not register! Try again" });
                }
                res.status(200).send(data);
            }).catch(err => res.status(500).json({ message: err.message }));
        }
    }).catch(err => res.status(500).json({ message: err.message }));
};


//Api for user login
export function userLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Fill the required fields" });
    }

    userModel.findOne({ email }).then(data => {
        if (!data) {
            return res.status(403).json({ message: "Invalid Email" });
        }

        //Compare a password
        let isValidPassword = bcrypt.compareSync(password, data.password);

        if (!isValidPassword) {
            return res.status(403).json({ message: "Invalid Password" });
        }

        //Generate a jwt token for authenticate
        let token = jwt.sign({ id: data._id }, "ProjectKey", { expiresIn: '30m' });

        res.status(200).send({
            user: {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            },
            accessToken: token
        })

    }).catch(err => res.status(500).json({ message: err.message }));
};