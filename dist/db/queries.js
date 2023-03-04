"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHash = exports.getName = exports.getEmail = exports.loginExists = exports.insertUser = exports.getCountries = void 0;
var pool = require('./pool');
function getCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield pool.query("SELECT * FROM countries");
        return rows.map((c) => c.Country);
    });
}
exports.getCountries = getCountries;
function insertUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        pool.query(`INSERT INTO users (email, login, real_name, pass, birth_date, country) VALUES (?, ?, ?, ?, ?, ?)`, [user.email, user.login, user.name, user.password, user.date, user.country])
            .then(() => console.log(user.login + " inserted"));
    });
}
exports.insertUser = insertUser;
function loginExists(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const [users] = yield pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [user.email, user.login]);
        return users.length > 0 ? true : false;
    });
}
exports.loginExists = loginExists;
function getEmail(login) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user] = yield pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login]);
        return user[0].email;
    });
}
exports.getEmail = getEmail;
function getName(login) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user] = yield pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login]);
        return user[0].real_name;
    });
}
exports.getName = getName;
function getHash(login) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user] = yield pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login]);
        return user[0].pass;
    });
}
exports.getHash = getHash;
