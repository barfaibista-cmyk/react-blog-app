import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecretKey } from "../utils.js";

export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    db.query(q, [req.body.email, req.body.username], (err, data) => {
	    if (err) return res.status(500).json(err);
	    if (data.length) return res.status(409).json("User already exists!");

	    const salt = bcrypt.genSaltSync(10);
	    const hash = bcrypt.hashSync(req.body.password, salt);

	    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
	    const values = [req.body.username, req.body.email, hash];

	    db.query(q, [values], (err, data) => {
	        if (err) return res.status(500).json(err);
	        return res.status(200).json("User has been created.");
	    });
    });
};

export const login = (req, res) => {
	const jwtSecretKey = getJwtSecretKey();
	if (!jwtSecretKey) {
        console.error('ERROR: JWT_SECRET_KEY is not defined!');
        return res.status(500).json("Server configuration error: JWT secret key is missing.");
    }

	const q = "SELECT * FROM users WHERE email = ? OR username = ?";
	const loginIdentifier = req.body.username || req.body.email; 

    db.query(q, [loginIdentifier, loginIdentifier], (err, data) => {
	    if (err) return res.status(500).json(err);
	    if (data.length === 0) return res.status(404).json("User not found!");
  
	    const isPasswordCorrect = bcrypt.compareSync(
	    	req.body.password,
	        data[0].password
	    );

	    if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

	    const token = jwt.sign({ id: data[0].id }, jwtSecretKey, { expiresIn: '1h'} );
	    const { password, ...other } = data[0];

		res.cookie("access_token", token, {
		    httpOnly: true,
		    sameSite: 'Lax',
		    secure: process.env.NODE_ENV === 'production',
		})
		.status(200).json(other);
	});
};

export const logout = (req, res) => {
	res.clearCookie("access_token",{
	    httpOnly: true,
		sameSite:"Lax",
		secure: process.env.NODE_ENV === 'production',
	}).status(200).json("User has been logged out.")
};
