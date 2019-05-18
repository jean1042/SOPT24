/**
date: May 18, 2019
@Author: Ji yoon, Park
Title: Create a server & save it to the AWS RDS database using MYSQL platform / SOPT_24 Seminar4 homework
 */

var express = require('express');
var router = express.Router();
const async = require('async');
const crypto = require('crypto-promise');

const utils = require('../utils/utils');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const db = require('../../module/pool');

router.post('/', async (req, res) => {
    //body = "id,"name,password,salt"
    if (!req.body.id || !req.body.name || !req.body.password) {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.NULL_VALUE);
    }else{
        const userInfo = {
            id: req.body.id,
            name: req.body.name,
            password: req.body.password,
            salt: null
        }

        const salt = await crypto.randomBytes(32);
        const hashedPassword = await crypto.pbkdf2(userInfo.password.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

        userInfo.salt = salt.toString('base64');
        
        //query
        const selectQuery='SELECT * FROM user WHERE id=?';
        const selectResult=await db.queryParam_Parse(selectQuery,req.body.id);
        console.log("selectResult: ",selectResult);
         //쿼리 입력 실패 시
        if (!selectResult) {
            res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.LOGIN_FAIL));
        } //성공 시
        else {
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.LOGIN_SUCCESS));
        }



    }
});
module.exports = router;