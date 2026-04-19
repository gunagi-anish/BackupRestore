const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update("secretkey").digest();

exports.encrypt = (buffer) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { iv, encrypted };
};

exports.decrypt = (encryptedBuffer, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};