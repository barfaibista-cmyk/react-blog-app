import { db } from "../db.js";

export const getMenu = (req, res) => {
	const q =  "SELECT menus.* FROM menus";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};
