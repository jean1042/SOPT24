const http=require('http');
const url=require('url');
const querystring=require('querystring');
const crypto=require('crypto');
const json2csv=require('json2csv');

const server=http.createServer((req,res)=>{
    let urlParsed=url.parse(req.url);
    let queryParsed=querystring.parse(urlParsed.query); //query 생성

    //data structure
    let data={
        "msg":"",
        "hashed":null
    };

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
            
            let str=queryParsed.str;
            console.log("str"+str);
            data.hashed=str;

            //password 암호화
            const salt=buffer.toString('base64');
            
            crypto.pbkdf2(str,salt,1000,32,'SHA512',(err,hashed)=>{
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
                    data.hashed=hashed.toString('base64');
                }
            });
        }
        
    });
}).listen(4000,(err,msg)=>{
    console.log('3000 port opened!!');
});


