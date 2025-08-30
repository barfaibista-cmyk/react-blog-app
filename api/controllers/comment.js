import { db } from "../db.js";

export const getComments = (req, res) => {
	const q =  "SELECT comments.* FROM comments";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getComment = (req, res) => {
	const q =  "SELECT comments.* FROM comments WHERE comments.post_id = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data);
	});
};
