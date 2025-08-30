import { db } from "../db.js";
import moment from 'moment';
import jwt from 'jsonwebtoken';

export const getUsers = (req, res) => {
	const q =  "SELECT id, name, username, email, picture, bio, telp, created_at  FROM users";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getUser = (req, res) => {
	const q =  "SELECT id, name, username, email, picture, bio, telp, created_at  FROM users WHERE users.id = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data[0]);
	});
};

export const createUser = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

		const q = "INSERT INTO users (name, username, email, picture) VALUES ?;"
		const picture = 'avatar.png';
		const values = [
			req.body.name,
			req.body.username,
			req.body.email,
			picture,
		];

		db.query(q, [values], (err, data) => {
			if (err) return res.status(500).json(err);

			return res.status(200).json(data[0]);
		});
	});
}

export const updateUser = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

		const userIdToUpdate = req.params.id;
		const authenticatedUserId = userInfo.id;
    	if(userIdToUpdate.toString() !== authenticatedUserId.toString()) {
            return res.status(403).json("You are not authorized to update this user.");
        }
		const bodyData = req.body;
		const setParts = [];
    	const values = [];

    	for (const key in bodyData) {
	        if (Object.prototype.hasOwnProperty.call(bodyData, key) && bodyData[key] !== undefined) {
	            setParts.push(`${key} = ?`);
	            values.push(bodyData[key]);
	        }
	    }

	    setParts.push('updated_at = ?');
    	values.push(moment().format("YYYY-MM-DD HH:mm:ss"));

    	if (setParts.length === 0) {
	        return res.status(400).json({ error: "No valid fields to update." });
	    }

	    const q = `UPDATE users SET ${setParts.join(', ')} WHERE id = ?;`;
	    values.push(userIdToUpdate);

		db.query(q, values, (err, data) => {
	        if (err) {
	            console.error(err);
	            return res.status(500).json({ error: "Error occured when updating user." });
	        }
	        
	        if (data.affectedRows === 0) {
	            return res.status(404).json({ error: "User not found." });
	        }

	        return res.status(200).json({ message: "User has been updated successfully." });
		});
	});
}
