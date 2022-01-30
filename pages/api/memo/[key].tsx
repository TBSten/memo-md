import { apiHandler, responseError } from "lib/api";
import { getMemo } from "lib/memo/server";
import { NextApiHandler, } from "next";


const handler: NextApiHandler = apiHandler(async (req, res) => {
    const key = req.query.key ;
    if(typeof key !== "string"){
        responseError(res,{
            code: 404,
            msg: `invalid key : ${key}` ,
        });
        return ;
    }
    switch (req.method.toUpperCase()) {
        case "GET":
            const memo = await getMemo(key) ;
            res.status(200).json({
                msg:"ok",
                memo,
            });
            break;
        default:
            responseError(res, {
                code: 401,
                msg: `invalid method `,
            });

            break;
    }
} ) ;

export default handler;
