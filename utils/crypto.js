const CryptoJS = require("crypto-js");

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || "3dba8afdc23f4b7f2d35607c08d3d179643b537e14583a42dda4f2cf59f18adc";

// ✅ Encrypt Private Key
exports.encryptKey = (privateKey) => {
    return CryptoJS.AES.encrypt(privateKey, ENCRYPTION_SECRET).toString();
};

// ✅ Decrypt Private Key
exports.decryptKey = (encryptedKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};
