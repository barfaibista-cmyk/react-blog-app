import { db } from "../db.js";

export const getPermissions = (req, res) => {
	const q =  "SELECT permissions.*  FROM permissions";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getPermission = (req, res) => {
	const q =  "SELECT permissions.*  FROM permissions WHERE permissions.id = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data[0]);
	});
};
