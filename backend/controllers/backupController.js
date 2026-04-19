const db = require('../models/db');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { encrypt, decrypt } = require('../utils/encryption');

exports.uploadFile = (req, res) => {
    const file = req.file;
    const userId = req.user.id;

    const buffer = fs.readFileSync(file.path);

    const { iv, encrypted } = encrypt(buffer);

    const encryptedPath = file.path + ".enc";
    fs.writeFileSync(encryptedPath, Buffer.concat([iv, encrypted]));

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    db.query(
        "SELECT MAX(version) as version FROM backups WHERE user_id=? AND filename=?",
        [userId, file.originalname],
        (err, result) => {
            let version = 1;
            if (result[0].version) version = result[0].version + 1;

            db.query(
                "INSERT INTO backups (user_id, filename, file_hash, version, file_path) VALUES (?, ?, ?, ?, ?)",
                [userId, file.originalname, hash, version, encryptedPath],
                (err) => {
                    if (err) return res.status(500).json(err);

                    fs.unlinkSync(file.path); // delete original

                    res.json({ message: "File uploaded & encrypted", version });
                }
            );
        }
    );
};

exports.getFiles = (req, res) => {
    db.query(
        "SELECT * FROM backups WHERE user_id=?",
        [req.user.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
};

exports.restoreFile = (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM backups WHERE id=?", [id], (err, result) => {
        if (err || result.length === 0)
            return res.status(404).json({ message: "File not found" });

        const file = result[0];

        const data = fs.readFileSync(file.file_path);

        const iv = data.slice(0, 16);
        const encryptedData = data.slice(16);

        const decrypted = decrypt(encryptedData, iv);

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${file.filename}`
        );

        res.send(decrypted);
    });
};