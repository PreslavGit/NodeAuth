import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { getCountries, insertUser, loginExists } from '../db/queries'
import dotenv from 'dotenv';

dotenv.config();

const router: Router = require('express').Router();

router.get('/', async (req: Request, res: Response) => {
    let countries = await getCountries();
    res.render('./pages/register', { countries: countries, data: [], errors: [] })
});

router.post('/', async (req: Request, res: Response) => {
    let data = req.body;
    let formErrors = await validateForm(data);
    if (formErrors.length == 0) {
        //hash pass
        const salt = await bcrypt.genSalt()
        data.password = await bcrypt.hash(data.password, salt)
        //add user to db
        insertUser(data);

        //make a token and send it as a cookie 
        const secret = process.env.SECRET || 'secret should be in the env file'; 
        let token = jwt.sign(data.email, secret);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 1000000})

        res.redirect('/');
    } else {
        let countries = await getCountries();
        res.render('./pages/register', { countries: countries, data: data, errors: formErrors })
    }
});

async function validateForm(data: any){
        let errors: string[] = []

        if (data.email == '') {
            errors.push("Email required")
        }
        if (!data.email.includes('@')) {
            errors.push('Email must contain "@"')
        }
        if (!data.email.includes('.')) {
            errors.push('Email must contain "."')
        }
        if (data.login == '') {
            errors.push("Login required")
        }
        if (data.email == data.login) {
            errors.push("Email and Login name must be different")
        }
        if (data.login.includes('@')) {
            errors.push('Login name cannot include "@"')
        }
        if (data.name == '') {
            errors.push("Real name required")
        }
        if (data.password.length <= 6) {
            errors.push("Password must be at least 6 characters")
        }
        if (new Date(data.date).getTime() > new Date().getTime()) {
            errors.push("Birth date must be before today")
        }

        let dupe = await loginExists(data);

        if (dupe) {
            errors.push("Email or Login name already taken")
        }

        return errors;
}


module.exports = router
