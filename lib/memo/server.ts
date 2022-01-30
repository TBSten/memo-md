
import { Deta } from "deta" ;
import { isMemo, isPutMemo, Memo } from "lib/memo/types";
import markdownHtml from "zenn-markdown-html";

const deta = Deta(process.env.DETA_PROJECT_KEY) ;

export const memos = deta.Base("Memo") ;

/*


export type Memo = {
    key? :string,
    title :string,
    author :string,
    created_at :number,
    updated_at :number,
    htmlContent :string,
    mdContent :string,
} ;


*/

export async function putMemo(args:{
    key? :string,
    title :string,
    author :string,
    mdContent :string,
}) {
    if(!isPutMemo(args)){
        console.error(args);
        throw new Error(`invalid args `) ;
    }
    if(!existMemo(args.key || "")){
        //新規追加
        const now = new Date().valueOf() ;
        const newMemo = {
            ...args,
            created_at : now,
            updated_at : now,
        } ;
        let ans = await memos.put(newMemo);
        ans = {
            ...ans,
            htmlContent: ans.mdContent || "",
        } ;
        if(isMemo(ans)){
            return ans ;
        }
        console.error(ans);
        throw new Error(`invalid put memo : ${ans}`) ;
    }else{
        //更新
        const now = new Date().valueOf() ;
        const newMemo = {
            ...args,
            created_at : now,
            updated_at : now,
        } ;
        let ans = await memos.put(newMemo);
        ans = {
            ...ans,
            htmlContent: ans.mdContent || "",
        } ;
        if(isMemo(ans)){
            return ans ;
        }
        console.error(ans);
        throw new Error(`invalid put memo : ${ans}`) ;
    }
}

export async function getMemo(key :string) :Promise<(Memo|null)>{
    const memo = await memos.get(key);
    if(memo && typeof memo.mdContent === "string"){
        const ans = {
            ...memo,
            htmlContent : markdownHtml(memo.mdContent),
        } ;
        // console.log("isMemo",ans,isMemo(ans));
        if(isMemo(ans)){
            return ans ;
        }
    }
    if(memo === null){
        return null ;
    }
    console.error("memo.mdContent invalid",key,memo.mdContent);
    console.error(memo);
    throw new Error(`${memo} is invalid , key : ${key}`) ;
}

export async function getMemos(){
    const res = await memos.fetch();
    if(res.items){
        const ans = res.items.map(memo=>{
            if(memo && typeof memo.mdContent === "string"){
                const m = {
                    ...memo,
                    htmlContent : markdownHtml(memo.mdContent)
                }
                // console.log("isMemo",m,isMemo(m));
                if(isMemo(m)) return m ;
                throw new Error(`${m} is not memo`) ;
            }
            console.error("mdContent invalid",memo,isMemo(memo) && typeof memo.mdContent === "string");
            console.error(memo.mdContent);
            throw new Error(`${memo.mdContent} is invalid`) ;
        });
        return ans.sort((a,b)=>b.updated_at - a.updated_at) ;
    }
    console.error("items invalid");
    console.error(res.items);
    throw new Error(`${res.items} is invalid`) ;
}

export async function existMemo(key:string){
    try{
        const memo = await getMemo(key) ;
        return !! memo ;
    }catch(e){
        return false ;
    }
}

export async function removeMemos(keys :string[]){
    const promises = keys.map(key=>{
        return  memos.delete(key) ;
    });
    await Promise.all(promises);
}
