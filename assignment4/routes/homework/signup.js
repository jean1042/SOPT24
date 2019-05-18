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
    //console.log("signin page");
    //body = "id,"name,password,salt"
    if (!req.body.id || !req.body.name || !req.body.password) {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.NULL_VALUE);
    } else { // body 입력값이 정확할 시 


        //패스워드값 해싱
        //여기 try{


        const userInfo = {
            id: req.body.id,
            name: req.body.name,
            password: req.body.password,
            salt: null
        }

        const salt = await crypto.randomBytes(32);
        const hashedPassword = await crypto.pbkdf2(userInfo.password.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

        userInfo.salt = salt.toString('base64');
        /*db에 저장 하기 전에 출력을 먼저 해보자
        console.log("id: " , userInfo.id);
        console.log("id: " , userInfo.name);
        console.log("id: " , userInfo.password);
        console.log("id: " , userInfo.salt);*/

        const insertQuery = 'INSERT INTO user(id,name,password,salt) VALUES(?,?,?,?)';
        const insertResult = await db.queryParam_Parse(insertQuery, [req.body.id, req.body.name, req.body.password, hashedPassword])

        //쿼리 입력 실패 시
        if (!insertResult) {

            res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.NO_USER));
        } //성공 시
        else {
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_USER));
        }

    }







});
module.exports = router;