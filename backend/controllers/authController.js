const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User Registered" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err || result.length === 0)
            return res.status(400).json({ message: "User not found" });

        const user = result[0];

        const valid = bcrypt.compareSync(password, user.password);

        if (!valid)
            return res.status(401).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        res.json({ token });
    });
};