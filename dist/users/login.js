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
const queries_1 = require("../db/queries");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = require('express').Router();
router.get('/', (req, res) => {
    res.render('./pages/login', { error: '', email: undefined });
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let user = yield (0, queries_1.loginExists)({ email: data.loginName, login: data.loginName });
    if (!user) {
        //if user doesnt exist
        res.render('./pages/login', { error: "User doesnt exist", email: req.body.loginName });
    }
    else {
        //if user exists
        let hash = yield (0, queries_1.getHash)(data.loginName);
        let valid = yield bcryptjs_1.default.compare(data.loginPass, hash);
        if (valid) {
            //if exists and password is valid
            const secret = process.env.SECRET || 'secret should be in the env file';
            let email = yield (0, queries_1.getEmail)(data.loginName);
            let token = jsonwebtoken_1.default.sign(email, secret);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 1000000 });
            res.redirect('/');
        }
        else {
            //if exists and passwaord is not valid
            res.render('./pages/login', { error: "Incorrect pass", email: req.body.loginName });
        }
    }
}));
module.exports = router;
