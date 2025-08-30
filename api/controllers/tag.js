import { db } from "../db.js";
import jwt from 'jsonwebtoken';

export const getTags = (req, res) => {
	const q =  "SELECT tags.*, users.name, users.username FROM tags JOIN users ON users.id = tags.created_by";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getTag = (req, res) => {
	const q =  "SELECT tags.*, users.name, users.username FROM tags JOIN users ON users.id = tags.created_by WHERE tags.seotitle = ?";

	db.query(q, [req.params.seotitle], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data[0]);
	});
};

export const addTag = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

		const titles = req.body.title;
		const q = `
				INSERT INTO tags (title, seotitle, count, created_by, updated_by, created_at, updated_at) VALUES ?
				ON DUPLICATE KEY UPDATE 
				    count = count + 1, 
				    updated_by = VALUES(updated_by), 
				    updated_at = VALUES(updated_at);
			    `;

		const values = titles.map(title => {
	        const seotitle = title.toLowerCase().replace(/[\s,]+/g, '-');
	        
	        return [
	            title,
	            seotitle,
	            1,
	            userInfo.id,
	            userInfo.id,
	            new Date(),
	            new Date()
	        ];
	    });

	    db.query(q, [values], (err, data) => {
	        if (err) {
	            console.error("Error inserting tags:", err);
	            return res.status(500).json(err);
	        }
	        
	        return res.status(200).json("Tags have been created or updated successfully.");
	    });
	 });
}

export const updateTag = (req, res) => {}

export const deleteTag = (req, res) => {}
