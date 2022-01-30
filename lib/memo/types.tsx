
export type Memo = {
    key? :string,
    title :string,
    author :string,
    created_at :number,
    updated_at :number,
    htmlContent :string,
    mdContent :string,
} ;

export function isMemo(arg:any):arg is Memo{
    return (
        arg &&
        typeof arg === "object" &&
        typeof arg.title === "string" &&
        typeof arg.author === "string" &&
        typeof arg.created_at === "number" &&
        typeof arg.updated_at === "number" &&
        typeof arg.htmlContent === "string" &&
        typeof arg.mdContent === "string"
    ) ;
}

export function isPutMemo(memo:any):boolean{
    return (
        memo && 
        typeof memo === "object" &&
        typeof memo.title === "string" &&
        typeof memo.author === "string" &&
        typeof memo.mdContent == "string"
    ) ;
}
