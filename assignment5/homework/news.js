/**
date: May 22, 2019
@Author: Ji yoon, Park
Title: Create a server & make a news page using AWS EC2, RDS, S3 based on express structure / SOPT_24 Seminar5 homework.
 */

var express = require('express');
var router = express.Router();
const async = require('async');
const moment=require('moment');

const utils = require('../utils/utils');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const db = require('../module/pool');
const upload = require('../config/multer');

/*1. 게시물 등록*/
router.post('/', upload.fields([{name:'imgs'},{name:'thumbnail'}]),async (req, res) => {
    
    if (!req.body.title || !req.body.writer ) {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.NULL_VALUE);
    } else { // if body components are all filled  
        const newsInfo={
            title:req.body.title,
            writer:req.body.writer,
            thumbnail:null,
            writetime:null
        }
        // writetime using moment module
        const writetimemoment=moment().format('YYYY-MM-DD HH:mm:ss');
        newsInfo.writetime=writetimemoment;
        console.log(newsInfo.title,newsInfo.writer,newsInfo.thumbnail,newsInfo.writetime);
        
        //thumbnail image
        const thumbnailImg=req.files.thumbnail[0].location;
        console.log('thumbnailImg',thumbnailImg);
        newsInfo.thumbnail=thumbnailImg;

         //Imgs image
        const imgsImg=req.files.imgs[0].location;
        console.log('imgsImg',imgsImg);
        
        // news table INSERT Query
        const newsInsertQuery='INSERT INTO news(writer,title,thumbnail,writetime) values(?,?,?,?)'
        const newsInsertResult=await db.queryParam_Parse(newsInsertQuery,[newsInfo.writer,newsInfo.title,newsInfo.thumbnail,newsInfo.writetime]);
        

        if (!newsInsertResult) { //if insert query failed
                res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.BOARD_CREATE_FAIL));
            } 
        else {//if success
                res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_BOARD));
            }

        //이미지들 = imgs[i].location 에 들어있음
        const imgs=req.files;
        for(let i=0;i<imgs.length;i++){
            
            const contentInfo={
                content:req.body.content,
                contentImg:imgs[i].location,
                newsIdx:null
            }
            //newsIdx 불러옴
            const selectQuery="SELECT newsIdx FROM news JOIN contents ON news.newsIdx=contents.newsIdx";
            const selectResult=await db.queryParam_Parse(selectQuery,newsInfo.title);
            //console.log('selectResult');
            //console.log(selectResult);

            const newnewsIdx=selectResult.newsIdx;
            console.log('newnewsIdx');
            console.log(newnewsIdx);
            //contentInfo.newsIdx=newsIdx; 
            
            //db에 저장
            const insertQuery='INSERT INTO contents(content,contentImg,newsIdx) values(?,?,?)'
            const insertResult=await db.queryParam_Parse(insertQuery,[contentInfo.content,contentInfo.contentImg,contentInfo.newsIdx])
            
            if (!insertResult) {
                res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.BOARD_CREATE_FAIL));
            } //성공 시
            else {
                res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_BOARD));
            }
    }   

    }
});

/*2. 전체 게시글 조회 */
router.get('/',async (req, res) => {
    const selectnewsQuery = 'SELECT * FROM news ORDER BY writetime DESC';
    const selectnewsResult = await db.queryParam_Parse(selectnewsQuery);

    if (!selectnewsResult) { //db 없을 시
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.SELECT_BOARD_FAIL);
    } else {

        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.SELECT_BOARD_SUCCESS));
        console.log(selectnewsResult);
    }
});


/*3. 특정 게시글 조회 */
router.get('/:id',async (req, res) => {
    const contentIdx = req.url.split('/')[1]; //id parsing
    console.log('contentIdx');
    console.log(contentIdx);
    const selectcontentQuery = 'SELECT title,contentImg,content,writetime FROM news,contents WHERE news.newsIdx=?';
    const selectcontentResult = await db.queryParam_Parse(selectcontentQuery,contentIdx);

    if (!selectcontentResult) { //db 없을 시
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST), responseMessage.SELECT_BOARD_FAIL);
    } else {

        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.SELECT_BOARD_SUCCESS));
        console.log(selectcontentResult);
        const resInfo=selectcontentResult;
        res.body=resInfo;
        console.log(selectcontentResult);
    }
});

module.exports = router;

