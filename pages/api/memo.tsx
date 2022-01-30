import { apiHandler, ERROR_NO, responseError } from "lib/api";
import { getMemos, putMemo , removeMemos } from "lib/memo/server";
import { NextApiHandler } from "next";

const handler: NextApiHandler = apiHandler(async (req, res) => {
    switch (req.method.toUpperCase()) {
        case "GET":
            const memos = await getMemos();
            res.status(200).json({
                msg: "ok",
                memos,
            });
            break;
        case "POST":
            const postBody = JSON.parse(req.body);
            const { key, title, author, mdContent } = postBody;
            const puttedMemo = await putMemo({
                key,
                title,
                author,
                mdContent,
            });
            res.json({
                msg: "ok",
                memo: puttedMemo,
            });
            break;
        case "DELETE":
            const deleteBody = JSON.parse(req.body);
            const { keys } = deleteBody ;
            if(keys){
                await removeMemos(keys) ;
                res.json({
                    msg: "ok",
                });
            }
            break;
        default:
            responseError(res, {
                code: 401,
                msg: `invalid method `,
                errorNo: ERROR_NO.INVALID.REQUEST_METHOD,
            });
    }
});

export default handler;
