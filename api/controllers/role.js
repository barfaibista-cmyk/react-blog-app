import { db } from "../db.js";

export const getRoles = (req, res) => {
	const q =  "SELECT roles.*  FROM roles";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getRole = (req, res) => {
	const q =  "SELECT roles.*  FROM roles WHERE roles.id = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data[0]);
	});
};
