import userModel from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res) {
    try {
        const { username, email, password, avatar } = req.body;
        console.log("REQ BODY:", req.body);


        //if the fields are empty
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' })
        }

        //Check if user already exists
        const existedUser = await userModel.findOne({ email })
        if (existedUser) {
            return res.status(400).json({ "message": 'User Exists Already' })

        }

        const randomAvatar = `https://i.pravatar.cc/150?img=${Math.floor(
            Math.random() * 70
        )}`;

        const hasedPass = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            username,
            email,
            password: hasedPass,
            avatar: randomAvatar,
            channels: [],
        })
        return res.status(201).json({ "message": 'User registration Successful', newUser })

    }
    catch (error) {
        return res.status(500).json({ error: error.message })

    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        //if the fields are empty
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ "message": 'User does not Exists ' })
        }
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
            return res.status(400).json({ "message": "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)//creating token
        return res.status(200).json({
            "message": "Login sucessful",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                channels: user.channels || [],
            },
            token: token
        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })

    }
}

export async function getUsers(req, res) {
    try {
        const users = await userModel.find();
        return res.status(201).json({ "message": 'users', users })
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }

}
export async function getUsersById(req, res) {
    try {
        const users = await userModel.findById(req.params.id);
        return res.status(201).json({ "message": 'users', users })
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }
}

export async function updateAvatar(req, res) {
    try {
        const { id } = req.params;
        const { avatar } = req.body;
        console.log(id);


        if (!avatar) {
            return res.status(400).json({ message: 'Avatar is required' })
        }

        const user = await userModel.findByIdAndUpdate(id, { avatar }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(201).json({ message: 'Avatar updated succesfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }
}