import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import tagRoutes from "./routes/tags.js";
import commentRoutes from "./routes/comments.js";
import roleRoutes from "./routes/roles.js";
import permissionRoutes from "./routes/permissions.js";
import * as galleryRoutes from "./controllers/gallery.js";
import albumRoutes from "./routes/albums.js";
import rolePermissionRoutes from "./routes/rolepermissions.js";
import menuRoutes from "./routes/menu.js";

import 'dotenv/config';
import cookieParser from "cookie-parser";
import multer from "multer";
import { createChallenge, verifySolution } from "altcha-lib";
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;
const altchaSecretKey = process.env.ALTCHA_SECRET_KEY;

const corsOptions = {
	origins: 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type','Authorization'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

if (!altchaSecretKey || altchaSecretKey.length === 0) {
    console.error('ERROR: ALTCHA_SECRET_KEY not found on file .env.');
    console.error('Please make sure file .env have variable ALTCHA_SECRET_KEY=value_your_secret.');
    process.exit(1);
}

app.get('/api/altcha/show', async (req, res) => {
	try {
	    const challenge = await createChallenge({ hmacKey: altchaSecretKey, maxNumber: 100000 });
	    res.status(200).json(challenge);
    } catch(error) {
		return res.json({
	      error: 'Failed to create challenge',
	      details: error.message
	    }, 500)
    }
});

app.post('/api/altcha/spam-filter', async (req, res) => {
	const { payload } = req.body;
	
    if (!payload) {
        return res.status(400).json({ success: false, message: 'Payload Altcha not found.' });
    }

    try {
        const result = await verifySolution({ payload, secret: altchaSecretKey });
        if (result) {
            res.json({ success: true, message: 'Verification Altcha success!' });
        } else {
            res.status(400).json({ success: false, message: 'Verification Altcha fail.', error: result.error });
        }
    } catch (error) {
        console.error('Error verifying Altcha:', error);
        res.status(500).json({ success: false, message: 'An error occure when verifyng altcha.' });
    }
});

app.post('/api/altcha/submit', async (req, res) => {
	const { altcha, name, email, content } = req.body;
	
    if (!altcha) {
        return res.status(400).json({ success: false, message: 'Altcha payload not found.' });
    }

    try {
        const result = await verifySolution({ payload: altcha, secret: altchaSecretKey });
        if (result) {
            console.log('Form data received:', { name, email, content });
            res.json({ success: true, message: 'Form has been submitted dan Altcha has been verified!' });
        } else {
            res.status(400).json({ success: false, message: 'Verifikasi Altcha gagal untuk pengiriman formulir. Failed to send verify altcha form ' });
        }
    } catch (error) {
        console.error('Error processing form with Altcha:', error);
        res.status(500).json({ success: false, message: 'something went wrong at server.' });
    }
});

const __dirname_base = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const albumSeotitle = req.body.album_seotitle;
        if (!albumSeotitle) {
            const err = new TypeError("The 'album_seotitle' field is missing from the form data.");
            err.status = 400;
            return cb(err);
        }
        const uploadPath = path.join(__dirname_base, 'public', 'images', albumSeotitle);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/rolepermissions", rolePermissionRoutes);
app.use("/api/menu", menuRoutes);

app.get("/api/galleries", galleryRoutes.getGalleries);
app.get("/api/galleries/:seotitle", galleryRoutes.getGallery);
app.post("/api/galleries", upload.single("picture"), galleryRoutes.createGallery);
app.put("/api/galleries/:id", upload.single("picture"), galleryRoutes.updateGallery);
// app.delete("/api/galleries/:id", galleryRoutes.deleteFromDb);

app.post('/api/galleries/upload-only', upload.single('picture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No picture was uploaded." });
    }
    return res.status(200).json({ filename: req.file.filename });
});

app.use('/api/images', express.static(path.join(__dirname_base, 'public', 'images')));

app.listen(port, () => {
	console.log(`Server is running on port ${port} and connected!`);
});
