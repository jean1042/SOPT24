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

const server=http.createServer((req,res)=>{
    //url parsing
    let urlParsed=url.parse(req.url);
    let queryParsed=querystring.parse(urlParsed.query); //query 생성

    //data structure
    let data={
        "msg":"",
        "id":null,
        "password":null
    };


    if(urlParsed.pathname=='/signup'){
        console.log('urlParsed.pathname: /signup');
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
        console.log('urlParsed.pathname: /signin' );
        
        let id=queryParsed.id;
        console.log("id2"+id);
        data.id=id;

        let password=queryParsed.password;
        console.log('before password2:'+password);

        //비밀번호 암호화
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
        
                /////////////////////
            var array=fs.readFile("user_info2.csv",(err,data)=>{
            if(err){
                console.log(err);
            }

            var array = data.toString().split("\n");
            

            for(i in array) {
            console.log(i+":"+array[i]);    
            }
        });
    }

}).listen(4000, (req,res)=>{
    console.log('3000 port opened!!'); 
});
