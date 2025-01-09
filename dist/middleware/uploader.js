"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploaderMemory = exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploader = (directory, filePrefix) => {
    // ini define main directory file, ../ keluar satu tingkat dari folder src
    const defaultDir = path_1.default.join(__dirname, "../../public");
    const configureStoreFile = multer_1.default.diskStorage({
        destination: (req, file, callback) => {
            const fileDestination = defaultDir + directory;
            console.log("DESTINATION FILE STORE :", fileDestination);
            callback(null, fileDestination);
        },
        filename: (req, file, callback) => {
            const existName = file.originalname.split(".");
            console.log("Original Name", existName);
            const ext = existName[existName.length - 1];
            console.log("Ext name:", ext);
            if (filePrefix) {
                const newName = `${filePrefix}${Date.now()}.${ext}`;
                callback(null, newName);
            }
            else {
                callback(null, file.originalname);
            }
        },
    });
    return (0, multer_1.default)({ storage: configureStoreFile });
};
exports.uploader = uploader;
const uploaderMemory = () => {
    return (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
};
exports.uploaderMemory = uploaderMemory;
