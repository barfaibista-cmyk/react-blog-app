import { db } from "../db.js";
import jwt from 'jsonwebtoken';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJwtSecretKey } from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createGallery = (req, res) => {
    let uploadedFilePath = req.file ? req.file.path : null;

    try {
        const jwtSecretKey = getJwtSecretKey();
        if (!jwtSecretKey) {
            throw new Error("JWT_SECRET_KEY is not configured.");
        }
        const token = req.cookies.access_token;
        if (!token) {
            throw new Error("Not authenticated!");
        }

        jwt.verify(token, jwtSecretKey, (err, userInfo) => {
            if (err) {
                if (uploadedFilePath) {
                    fs.unlink(uploadedFilePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Error deleting file after auth failure:", unlinkErr);
                    });
                }
                return res.status(403).json("Token is not valid!");
            }

            if (!req.file || !req.file.filename) {
                if (uploadedFilePath) {
                    fs.unlink(uploadedFilePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Error deleting file without filename:", unlinkErr);
                    });
                }

                return res.status(400).json({ error: "No picture was uploaded." });
            }

            const q = "INSERT INTO galleries(`title`, `content`, `picture`, `album_id`, `created_by`, `created_at`) VALUES (?)";
            const values = [
                req.body.title,
                req.body.content || null,
                req.file.filename,
                req.body.album_id,
                userInfo.id,
                moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            ];

            db.query(q, [values], (dbErr, data) => {
                if (dbErr) {
                    console.error("Database Error:", dbErr);
                    if (uploadedFilePath) {
                        fs.unlink(uploadedFilePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Error deleting file after DB failure:", unlinkErr);
                        });
                    }
                    return res.status(500).json({ error: "Error saving data to database." });
                }
                return res.status(200).json({ message: "Gallery has been created successfully.", data: { id: data.insertId, ...req.body, picture: req.file.filename } });
            });
        });

    } catch (err) {
        console.error("General Gallery Create Error:", err.message);

        if (uploadedFilePath) {
            fs.unlink(uploadedFilePath, (unlinkErr) => {
                if (unlinkErr) console.error("Error deleting file after general error:", unlinkErr);
            });
        }
        if (err.message === "Not authenticated!") {
            return res.status(401).json(err.message);
        }
        if (err.message.includes("JWT_SECRET_KEY")) {
            return res.status(500).json("Server configuration error: " + err.message);
        }
        return res.status(500).json({ error: "An unexpected error occurred: " + err.message });
    }
};

export const updateGallery = (req, res) => {
    let uploadedFilePath = req.file ? req.file.path : null;

    try {
        const jwtSecretKey = getJwtSecretKey();
        if (!jwtSecretKey) throw new Error("JWT_SECRET_KEY is not configured.");

        const token = req.cookies.access_token;
        if (!token) throw new Error("Not authenticated!");

        jwt.verify(token, jwtSecretKey, (err, userInfo) => {
            if (err) {
                if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
                return res.status(403).json("Token is not valid!");
            }

            const galleryIdToUpdate = req.params.id;
            const qCheckOwner = "SELECT created_by, picture FROM galleries WHERE id = ?";

            db.query(qCheckOwner, [galleryIdToUpdate], (err, data) => {
                if (err) {
                    if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
                    return res.status(500).json("Error checking ownership.");
                }
                if (data.length === 0) {
                    if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
                    return res.status(404).json("Gallery not found.");
                }
                
                const existingGallery = data[0];
                if (existingGallery.created_by.toString() !== userInfo.id.toString()) {
                    if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
                    return res.status(403).json("Anda tidak diotorisasi untuk memperbarui galeri ini.");
                }

                let newPictureFilename = existingGallery.picture;
                if (req.file && req.file.filename) {
                    newPictureFilename = req.file.filename;
                    if (existingGallery.picture && existingGallery.picture !== newPictureFilename) {
                        const albumSeotitle = req.body.album_seotitle; 
                        if (albumSeotitle) {
                            const oldImagePath = path.join(__dirname, 'public', 'images', albumSeotitle, existingGallery.picture);
                            fs.unlink(oldImagePath, (unlinkErr) => {
                                if (unlinkErr) console.error("Error deleting old file:", unlinkErr);
                            });
                        }
                    }
                } else if (req.body.remove_picture === 'true' && existingGallery.picture) {
                    const albumSeotitle = req.body.album_seotitle;
                    if (albumSeotitle) {
                        const oldImagePath = path.join(__dirname, 'public', 'images', albumSeotitle, existingGallery.picture);
                        fs.unlink(oldImagePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Error deleting old file:", unlinkErr);
                        });
                    }
                    newPictureFilename = null;
                }

                const q = "UPDATE galleries SET `title`=?, `content`=?, `picture`=?, `album_id`=?, `updated_at`=? WHERE `id` = ? AND `created_by` = ?";
                
                const values = [
                    req.body.title,
                    req.body.content || null,
                    newPictureFilename,
                    req.body.album_id,
                    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    galleryIdToUpdate,
                    userInfo.id,
                ];

                db.query(q, values, (dbErr, data) => {
                    if (dbErr) {
                        console.error("Database Update Error:", dbErr);
                        if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
                        return res.status(500).json({ error: "Error updating data in database." });
                    }
                    if (data.affectedRows === 0) return res.status(404).json("Gallery not found or not owned by user.");
                    return res.json({ message: "Gallery has been updated.", data: { ...req.body, id: galleryIdToUpdate, picture: newPictureFilename } });
                });
            });
        });
    } catch (err) {
        console.error("General Gallery Update Error:", err.message);
        if (uploadedFilePath) fs.unlink(uploadedFilePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
        if (err.message === "Not authenticated!") return res.status(401).json(err.message);
        if (err.message.includes("JWT_SECRET_KEY")) return res.status(500).json("Server configuration error: " + err.message);
        return res.status(500).json({ error: "An unexpected error occurred: " + err.message });
    }
};

export const deleteGallery = (req, res) => {
    try {
        const jwtSecretKey = getJwtSecretKey();
        if (!jwtSecretKey) throw new Error("JWT_SECRET_KEY is not configured.");

        const token = req.cookies.access_token;
        if (!token) throw new Error("Not authenticated!");

        jwt.verify(token, jwtSecretKey, (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            const galleryIdToDelete = req.params.id;
            
            const qCheckOwner = "SELECT picture, created_by, album_id FROM galleries WHERE id = ?";
            db.query(qCheckOwner, [galleryIdToDelete], (err, data) => {
                if (err) return res.status(500).json({ error: "Error checking ownership." });
                if (data.length === 0) return res.status(404).json({ error: "Galeri tidak ditemukan." });

                const gallery = data[0];
                if (gallery.created_by.toString() !== userInfo.id.toString()) {
                    return res.status(403).json("Anda tidak diotorisasi untuk menghapus galeri ini.");
                }

                if (gallery.picture) {
                    const qGetAlbumSeotitle = "SELECT seotitle FROM albums WHERE id = ?";
                    db.query(qGetAlbumSeotitle, [gallery.album_id], (albumErr, albumData) => {
                        if (albumErr || albumData.length === 0) {
                            console.error("Could not retrieve album seotitle for deleting image:", albumErr);
                            deleteFromDb(galleryIdToDelete, res);
                            return;
                        }
                        const albumSeotitle = albumData[0].seotitle;
                        const imagePath = path.join(__dirname, 'public', 'images', albumSeotitle, gallery.picture);
                        fs.unlink(imagePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Gagal menghapus file gambar:", unlinkErr);
                            deleteFromDb(galleryIdToDelete, res);
                        });
                    });
                } else {
                    deleteFromDb(galleryIdToDelete, res);
                }
            });
        });
    } catch (err) {
        console.error("General Gallery Delete Error:", err.message);
        if (err.message === "Not authenticated!") return res.status(401).json(err.message);
        if (err.message.includes("JWT_SECRET_KEY")) return res.status(500).json("Server configuration error: " + err.message);
        return res.status(500).json({ error: "An unexpected error occurred: " + err.message });
    }
};

const deleteFromDb = (id, res) => {
    const q = "DELETE FROM galleries WHERE id = ?;";
    db.query(q, [id], (dbErr, data) => {
        if (dbErr) {
            console.error("Database Delete Error:", dbErr);
            return res.status(500).json({ error: "Terjadi kesalahan saat menghapus galeri dari database." });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ error: "Galeri tidak ditemukan di database." });
        }
        return res.status(200).json({ message: "Galeri telah berhasil dihapus." });
    });
};

export const getGalleries = (req, res) => {
	const q =  "SELECT galleries.*, albums.id as aid, albums.title as atitle, albums.seotitle as aseotitle, users.id as uid, users.name FROM galleries JOIN albums ON albums.id = galleries.album_id JOIN users ON users.id = galleries.created_by";

    db.query(q, (err, data) => {
	    if (err) return res.status(500).send(err);
	    return res.status(200).json(data);
    });
};

export const getGallery = (req, res) => {
	const q =  "SELECT galleries.*, albums.id as aid, albums.title as atitle, albums.seotitle as aseotitle, users.id as uid, users.name FROM galleries JOIN albums ON albums.id = galleries.album_id JOIN users ON users.id = galleries.created_by WHERE albums.seotitle = ?";

	db.query(q, [req.params.seotitle], (err, data) => {
		if (err) return res.status(500).json(err);
		return res.status(200).json(data);
	});
};
