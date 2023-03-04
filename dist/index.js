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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const queries_1 = require("./db/queries");
dotenv_1.default.config();
const app = (0, express_1.default)();
const cookieParser = require('cookie-parser');
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
const registerRouter = require('./users/register');
const loginRouter = require('./users/login');
const logoutRouter = require('./users/logout');
const port = process.env.PORT;
app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.SECRET || 'secret should be in the env file', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.redirect('/login');
            }
            else {
                const email = decoded;
                const name = yield (0, queries_1.getName)(decoded);
                res.render('./pages/profile', { email: email, name: name });
            }
        }));
    }
    else {
        res.redirect('/login');
    }
});
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
