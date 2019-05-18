/**
date: April 20, 2019
Author: Ji yoon, Park
Title: Create server & parsing query homework / SOPT_24 Seminar2
 */

const http=require('http');
const url=require('url');
const querystring=require('querystring');
const crypto=require('crypto');
const fs=require('fs');
const json2csv=require('json2csv');
const request=require('request');

const server=http.createServer((req,res)=>{

    //url parsing
    let urlParsed=url.parse(req.url);
    let queryParsed=querystring.parse(urlParsed.query); //query 생성
    let pathname=urlParsed.pathname;

    //data structure
    let data={
        "msg":"",
        "id":null,
        "password":null
    };
    
    if(pathname=='/signup'){
        crypto.randomBytes(32,(err,buffer)=>{
            if(err){
                console.log(err);
                data.msg="randomBytes error!";
                res.statusCode=500;
                res.setHeader=('Content-Type','text/plain');
                res.write(JSON.stringify(result));
                res.end();
            }
            else{

                let id=queryParsed.id;
                console.log("id"+id);
                data.id=id;

                let password=queryParsed.password;
                console.log('before password:'+password);

                //password 암호화
                const salt=buffer.toString('base64');

                crypto.pbkdf2(password,salt,100,32,'SHA512',(err,hashed)=>{
                    if(err){ //if crypto failed
                        console.log(err);
                        data.msg="pbkdf2 error!!";
                        res.statusCode=500;
                        res.setHeader=('Content-Type','text/plain');
                        res.write(JSON.stringify(result));
                        res.end();
                    }
                    else{ //if crypto successed
                        data.msg="pbkdf2 success!!";   
                        data.password=hashed.toString('base64');
                        

                        console.log('data.password'+data.password);
                        //setup status code
                        res.statusCode=200;
                        res.setHeader=('Content-Type','text/plain');
                        res.write(JSON.stringify(data));
                        
                        //save to csv result
                        const resultCSV=json2csv.parse({
                            id:data.id,
                            password:data.password
                        });

                        fs.writeFile('user_info2.csv',resultCSV,(err)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.write('file Saved!!');
                                res.end();
                            }
                        });
                    }

                });
            }
        });
        
    }

    else if(urlParsed.pathname=='/signin'){ //if url is /signin
        crypto.randomBytes(32,(err,buffer)=>{
            if(err){
                console.log(err);
                data.msg="randomBytes error!";
            }
            else{
                let id=queryParsed.id;
                console.log("id2"+id);
                data.id=id;
        
        
                //비밀번호 암호화
                let password=queryParsed.password;
                //password 암호화
                const salt=buffer.toString('base64');
                
                crypto.pbkdf2(password,salt,100,32,'SHA512',(err,hashed)=>{
                    if(err){
                        console.log(err);
                        data.msg="pbkdf2 error!!";
                        res.statusCode=500;
                        res.setHeader=('Content-Type','text/plain');
                        res.write(JSON.stringify(result));
                        res.end();
                    }
        
                    else{
                        data.msg="pbkdf2 success!!";   
                        data.password=hashed.toString('base64');
                        
                        var array=fs.readFile("user_info2.csv",(err,data)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                array=data.toString().split("\n");
                                
                                for(i in array){
                                    arraytest.id=array[i].toString().split(",");

                                    console.log(i+":"+arraytest[i]);
                                    
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    //info 로 요청 보내는 경우
    else if (urlParsed.pathname=='/info'){
        console.log("info");
        
            //응답 옵션 지정
            const options={
                uri: 'http://15.164.75.18:3000/homework/2nd',
                method:'POST',
                body:{
                    "name":"박지윤",
                    "phone":"010-7752-1042"
                },json:true
            };
        
            //다른 서버에 요청 보냄 
            request(options,(err,response,body)=>{
//                const data=JSON.parse(body).data;

                let data={
                    "msg":"",
                    "resData":null, //응답 받은 객체 
                }

                if(err){
                    console.log(err);

                    data.msg="request error";
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.write(JSON.stringify(data));
                    res.end();
                }
                else{
                    console.log("weg");
                    //서버가 나한테 준 응답 resData
                    const resData=JSON.parse(body).data;
                    console.log("arrrr");
                    console.log(resData);
                    data.resData=resData;

                    // const resultCSV=json2csv.parse({
                    //     data: resData,
                    //     fields=
                    // });

                }
            });


        
    }


}).listen(4000, (req,res)=>{
    console.log('3000 port opened!!'); 
});
