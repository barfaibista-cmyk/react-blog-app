import { db } from "../db.js";

export const getRolePermissions = (req, res) => {
	const q =  "SELECT role_has_permissions.*, roles.id as rid, roles.name as rname, permissions.id as pid, permissions.name as pname  FROM role_has_permissions JOIN roles ON roles.id = role_has_permissions.role_id JOIN permissions ON permissions.id = role_has_permissions.permission_id";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

		const transformData = data.reduce((acc, currentItem) => {
		    const { rname, pname } = currentItem;
		    if (!acc[rname]) {
		        acc[rname] = [];
		    }
		    acc[rname].push(pname);
		    return acc;
		}, {});

	    return res.status(200).json(transformData);	
    });
};

export const getRolePermission = (req, res) => {
	const q =  "SELECT role_has_permissions.*, roles.id as rid, roles.name as rname, permissions.id as pid, permissions.name as pname  FROM role_has_permissions JOIN roles ON roles.id = role_has_permissions.role_id JOIN permissions ON permissions.id = role_has_permissions.permission_id WHERE role_has_permissions.role_id = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		const transformData = data.reduce((acc, currentItem) => {
		    const { rname, pname } = currentItem;
		    if (!acc[rname]) {
		        acc[rname] = [];
		    }
		    acc[rname].push(pname);
		    return acc;
		}, {});

	    return res.status(200).json(transformData);
	});
};
