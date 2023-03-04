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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const queries_1 = require("../db/queries");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = require('express').Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let countries = yield (0, queries_1.getCountries)();
    res.render('./pages/register', { countries: countries, data: [], errors: [] });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let formErrors = yield validateForm(data);
    if (formErrors.length == 0) {
        //hash pass
        const salt = yield bcryptjs_1.default.genSalt();
        data.password = yield bcryptjs_1.default.hash(data.password, salt);
        //add user to db
        (0, queries_1.insertUser)(data);
        //make a token and send it as a cookie 
        const secret = process.env.SECRET || 'secret should be in the env file';
        let token = jsonwebtoken_1.default.sign(data.email, secret);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000000 });
        res.redirect('/');
    }
    else {
        let countries = yield (0, queries_1.getCountries)();
        res.render('./pages/register', { countries: countries, data: data, errors: formErrors });
    }
}));
function validateForm(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let errors = [];
        if (data.email == '') {
            errors.push("Email required");
        }
        if (!data.email.includes('@')) {
            errors.push('Email must contain "@"');
        }
        if (!data.email.includes('.')) {
            errors.push('Email must contain "."');
        }
        if (data.login == '') {
            errors.push("Login required");
        }
        if (data.email == data.login) {
            errors.push("Email and Login name must be different");
        }
        if (data.login.includes('@')) {
            errors.push('Login name cannot include "@"');
        }
        if (data.name == '') {
            errors.push("Real name required");
        }
        if (data.password.length <= 6) {
            errors.push("Password must be at least 6 characters");
        }
        if (new Date(data.date).getTime() > new Date().getTime()) {
            errors.push("Birth date must be before today");
        }
        let dupe = yield (0, queries_1.loginExists)(data);
        if (dupe) {
            errors.push("Email or Login name already taken");
        }
        return errors;
    });
}
module.exports = router;
