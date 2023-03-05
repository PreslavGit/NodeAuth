import { Request, Response, Router } from 'express';
import { loginExists, getHash, getEmail } from '../db/queries';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

const router: Router = require('express').Router();

router.get('/', (req: Request, res: Response) => {
  res.render('./pages/login', { error: '', email: undefined })
});

router.post('/', async (req: Request, res: Response) => {
  let data = req.body;
  let user = await loginExists({ email: data.loginName, login: data.loginName })

  if (!user) {
    //if user doesnt exist
    res.render('./pages/login', { error: "User doesnt exist", email: req.body.loginName })
  } else {
    //if user exists
    let hash = await getHash(data.loginName)
    let valid = await bcrypt.compare(data.loginPass, hash)

    if (valid) {
      //if exists and password is valid
      const secret = process.env.SECRET || 'secret should be in the env file';
      let email = await getEmail(data.loginName)
      let token = jwt.sign(email, secret);
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000000 })
      res.redirect('/')
    } else {
      //if exists and passwaord is not valid
      res.render('./pages/login', { error: "Incorrect pass", email: req.body.loginName })
    }
  }
});


module.exports = router
