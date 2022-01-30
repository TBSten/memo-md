import { apiHandler, ERROR_NO, responseError } from "lib/api";
import { NextApiHandler } from "next";
import markdownHtml from "zenn-markdown-html";

const handler: NextApiHandler = apiHandler(async (req, res) => {
    switch(req.method.toUpperCase()){
        case "POST" :
            const md = JSON.parse(req.body).md ;
            if(md){
                const html = markdownHtml(md) ;
                res.status(200).json({
                    msg:"ok",
                    html,
                });
                return ;
            }
            responseError(res,{
                code:401,
                msg:`invalid markdown : ${md}`,
                errorNo:ERROR_NO.INVALID.ARGS,
            });
            // throw new Error(`invalid markdown : ${md}`) ;
        default :
            responseError(res,{
                code:401,
                msg:`invalid method : ${req.method}`,
                errorNo:ERROR_NO.INVALID.REQUEST_METHOD,
            });
            // throw new Error(`invalid method : ${req.method}`) ;
    }
} ) ;

export default handler ;
