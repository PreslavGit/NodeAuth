import dotenv from 'dotenv';
import mysql from "mysql2"
dotenv.config();


const pool = mysql.createPool({
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  password: process.env.MYSQLPASSWORD,
  port: parseInt(process.env.MYSQLPORT || '3306', 10),
  user: process.env.MYSQLUSER,
  
}).promise();

module.exports = pool;