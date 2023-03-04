import { Request, Response, Router } from 'express';


const router: Router = require('express').Router();

router.get('/', (req: Request, res: Response) => {
  res.cookie('jwt', '', {maxAge: 1})
  res.redirect('/login')
});


module.exports = router
