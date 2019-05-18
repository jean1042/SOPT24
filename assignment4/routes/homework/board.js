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


/*1. 게시글 전체 조회*/
router.get('/', async (req, res) => {
    const selectboardQuery = 'SELECT * FROM board';
    const selectboardResult = await db.queryParam_Parse(selectboardQuery);

    if (!selectboardResult) { //db 없을 시
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.NULL_VALUE);
    } else {

        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.LOGIN_SUCCESS));
        console.log(selectboardResult);
    }
});

/*2. 특정 게시글 조회*/
router.get('/:id', async (req, res) => {
    // console.log(req.url.split('/')[1]);
    const boardIdx = req.url.split('/')[1]; //id parsing
    const selectoneQuery = 'SELECT * FROM board WHERE boardIdx= ?';
    const selectoneResult = await db.queryParam_Parse(selectoneQuery, boardIdx);

    //쿼리 입력 실패 시
    if (!selectoneResult) {
        res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.SELECT_BOARD_FAIL));
    } //성공 시
    else {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.SELECT_BOARD_SUCCESS));
    }
});

/*3.게시글 작성*/
router.post('/', async (req, res) => {
    var currentDate = new Date();
    var currentHours = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate();
    var nowdate = currentYear + ":" + currentMonth + ":" + currentDay + ":" + currentHours + ":" + currentMinute;

    const boardInfo = {
        writer: req.body.id,
        title: req.body.title,
        content: req.body.content,
        writetime: nowdate,
        boardPw: req.body.boardPw,
        salt: null
    }

    const salt = await crypto.randomBytes(32);
    const hashedPassword = await crypto.pbkdf2(boardInfo.boardPw.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

    boardInfo.salt = hashedPassword;

    const insertboardQuery = 'INSERT INTO board(title,content,writer,writetime,boardPw,salt) VALUES(?,?,?,?,?,?)';
    const insertboardResult = await db.queryParam_Parse(insertboardQuery, [boardInfo.title, boardInfo.content, boardInfo.writer, boardInfo.writetime, boardInfo.boardPw, boardInfo.salt]);

    //쿼리 입력 실패 시
    if (!insertboardResult) {

        res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.BOARD_CREATE_FAIL));
    } //성공 시
    else {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_BOARD));
    }


})


/*4.게시글 삭제*/
router.delete('/', async (req, res) => {
    const boardidx= req.body.boardidx;

    const deleteQuery = 'DELETE FROM board WHERE boardidx= ?';
    const deleteResult = await db.queryParam_Parse(deleteQuery, boardidx);

    //쿼리 입력 실패 시
    if (!deleteResult) {
        res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.SELECT_BOARD_FAIL));
    } //성공 시
    else {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.SELECT_BOARD_SUCCESS));
    }
});

module.exports = router;