import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getName } from './db/queries';


const app: Express = express();
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));

const registerRouter = require('./users/register')
const loginRouter = require('./users/login')
const logoutRouter = require('./users/logout')

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.SECRET || 'secret should be in the env file', async (err: any, decoded: any ) => {
            if(err){res.redirect('/login')}
            else{
                const email = decoded;
                const name = await getName(decoded)
                res.render('./pages/profile', {email: email, name: name})
            }
        });
    }else{
        res.redirect('/login')
    }
});

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});