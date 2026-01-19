import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';

export function verifyToken(req, res, next) {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === 'Bearer'
    ) {
        jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET, (err, verifiedToken) => {
            if (err) {
                return res.status(400).json({ "message": "Invalid Token" })

            }
            console.log(verifiedToken);

            userModel.findById(verifiedToken.id)
                .then((user) => {
                    if (!user) {
                        return res.status(401).json({ message: "User not found" });
                    }

                    req.user = user;
                    // console.log(req);
                    next();
                })
                .catch((error) => {
                    return res.status(400).json({ error: error.message })

                })
        })
    }
    else {
        return res.status(400).json({ "message": "Token not found" })
    }
}