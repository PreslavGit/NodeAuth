"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
router.get('/', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
});
module.exports = router;
