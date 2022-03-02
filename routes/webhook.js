const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const webhook = require('../controller/webhook');

router.get('/' , (req,res) => { res.send('test webhook'); })

router.post('/setwebhook', webhook.setwebhook)

router.post('/setMobile', webhook.setMobile)

module.exports = router;