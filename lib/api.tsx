import { NextApiHandler, NextApiResponse } from "next";


export const ERROR_NO = {
    UNKNOWN:0,
    INVALID:{
        REQUEST_METHOD:1,
        REQUEST_BODY:2,
        ARGS:3,
    },
} ;


export function responseError(res:NextApiResponse,{code=500 as number, msg="Unknown Error" , errorNo :number=ERROR_NO.UNKNOWN }){
    res.status(code).json({
        msg,
    });
}

export function apiHandler(handler:NextApiHandler):NextApiHandler{
    return async (req,res)=>{
        try{
            await handler(req,res);
        }catch(e){
            console.error(`ERROR OCCURRED`);
            console.error(e);
            responseError(res,{
                code:500,
                msg:`internal server error . ${e}`,
                errorNo:ERROR_NO.UNKNOWN,
            })
        }
    } ;
}
