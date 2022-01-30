
// fetchする関数を置いておく

import { isMemo, isPutMemo, Memo } from "./types";

let API_URL = `http://localhost:3000/api` ;

if(typeof window !== "undefined"){
    API_URL = `${location.origin}/api` ;
}

export async function getMemos(){
    const res = await fetch(`${API_URL}/memo`,{
        method:"GET",
    }) ;
    const json = await res.json();
    const resMemos = json?.memos ;
    if(res.status === 200 && resMemos instanceof Array){
        const memos = resMemos.map(memo=>(
            isMemo(memo)?memo:null
        ));
        return memos ;
    }
    console.error(res,json);
    throw new Error(`# ERROR fetch getMemos`) ;
} ;

export async function getMemo(key :string){
    const res = await fetch(`${API_URL}/memo/${key}`,{
        method:"GET",
    });
    const json = await res.json() ;
    const memo = json?.memo ;
    if(res.status === 200 && isMemo(memo)){
        return memo ;
    }
    throw new Error(`# ERROR fetch getMemo(${key})`) ;
}

interface PutMemoArgs{
    key? :string,
    title :string,
    author :string,
    mdContent :string,
}
export async function putMemo(args:PutMemoArgs){
    const body = {...args} ;
    if(isPutMemo(body)){
        const res = await fetch(`${API_URL}/memo`,{
            method: "POST" ,
            body:JSON.stringify(body),
        }) ;
        const json = await res.json() ;
        const memo = json.memo ;
        if(res.status === 200 && isMemo(memo) ){
            return memo ;
        }
        console.error(res,json);
        throw new Error(`# ERROR request failed`) ;
    }
    throw new Error(`# ERROR args unvalid`) ;
}

export async function mdToHtml(md:string){
    const body = {
        md,
    };
    const res = await fetch(`/api/md`, {
        method: "POST",
        body: JSON.stringify(body),
    });
    const json = await res.json();
    console.log("test", json);
    return json.html ;
};

export async function removeMemos(keys:string[]){
    const body = {
        keys,
    } ;
    const res = await fetch(`/api/memo`,{
        method:"DELETE",
        body: JSON.stringify(body),
    }) ;
    console.log(res,await res.json());
}


