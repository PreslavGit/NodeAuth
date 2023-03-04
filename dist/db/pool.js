"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
dotenv_1.default.config();
const pool = mysql2_1.default.createPool({
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    password: process.env.MYSQLPASSWORD,
    port: parseInt(process.env.MYSQLPORT || '3306', 10),
    user: process.env.MYSQLUSER,
}).promise();
module.exports = pool;
