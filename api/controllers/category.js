import { db } from "../db.js";
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getCategories = (req, res) => {
	const q =  "SELECT categories.*, users.name, users.username FROM categories JOIN users ON users.id = categories.created_by";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getCategory = (req, res) => {
	const q =  "SELECT categories.*, users.name, users.username FROM categories JOIN users ON users.id = categories.created_by WHERE categories.seotitle = ?";

	db.query(q, [req.params.seotitle], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data[0]);
	});
};

export const addCategory = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

		const q = "INSERT INTO categories (parent, title, seotitle, active, created_by, updated_by, created_at) VALUES (?);";

		const { parent, title, seotitle, active } = req.body;
		let parentId = parent === '' ? 0 : Number(parent);

		const values = [
			parentId,
			title,
			seotitle,
			active,
			userInfo.id,
			userInfo.id,
			moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
		];

		db.query(q, [values], (err, data) => {
	    	if (err) return res.status(500).json(err);
	      	return res.json("Category has been created.");
	    });
	});
}

export const updateCategory = (req, res) => {}

export const deleteCategory = (req, res) => {}
