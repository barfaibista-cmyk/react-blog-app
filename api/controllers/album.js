import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from "../db.js";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAlbums = (req, res) => {
	const q =  "SELECT albums.* FROM albums";

    db.query(q, [req.query], (err, data) => {
	    if (err) return res.status(500).send(err);

	    return res.status(200).json(data);
    });
};

export const getAlbum = (req, res) => {
	const q =  "SELECT albums.*, galleries.title as gtitle, galleries.picture, galleries.content, galleries.created_at as gcreated_at, galleries.updated_at as gupdated_at FROM albums JOIN galleries ON galleries.album_id = albums.id WHERE albums.seotitle = ?";

	db.query(q, [req.params.id], (err, data) => {
		if (err) return res.status(500).json(err);

		return res.status(200).json(data);
	});
};

export const createAlbum = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

	    const directoryPath = join(__dirname, '..', 'upload', req.body.seotitle);

		fs.mkdir(directoryPath, { recursive: true }, (err) => {
		    if (err) {
		        console.error('Failed to created directory:', err);
		        return res.status(500).json({ message: 'Gagal membuat direktori album.' });
		    }

			const q = "INSERT INTO albums (title, seotitle, active, created_by, updated_by, created_at) VALUES (?);"
			const values = [
				req.body.title,
				req.body.seotitle,
				req.body.status,
				userInfo.id,
				userInfo.id,
				moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			];

			db.query(q, [values], (err, data) => {
				if (err) return res.status(500).json(err);

				return res.status(200).json(data[0]);
			});
		});
	});
}

export const updateAlbum = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "jwtkey", (err, userInfo) => {
	    if (err) return res.status(403).json("Token is not valid!");

		const albumIdToUpdate = req.params.id;
		const authenticatedUserId = userInfo.id;
    	if(albumIdToUpdate.toString() !== authenticatedUserId.toString()) {
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

	    const q = `UPDATE albums SET ${setParts.join(', ')} WHERE id = ?;`;
	    values.push(albumIdToUpdate);

		db.query(q, values, (err, data) => {
	        if (err) {
	            console.error(err);
	            return res.status(500).json({ error: "Error occured when updating album." });
	        }
	        
	        if (data.affectedRows === 0) {
	            return res.status(404).json({ error: "Album not found." });
	        }

	        return res.status(200).json({ message: "Album has been updated successfully." });
		});
	});
}

export const deleteAlbum = (req, res) => {
    if (!req.params.id) {
        return res.status(404).json({ error: "Album not found." });
    } else {
	    const q = "DELETE FROM albums WHERE id = ?;";
		db.query(q, [req.params.id], (err, data) => {
	        if (err) {
	            console.error(err);
	            return res.status(500).json({ error: "Error occured when deleting album." });
	        }        
	        return res.status(200).json({ message: "Album has been deleted successfully." });
		});
	}
}
