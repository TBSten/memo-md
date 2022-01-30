import Layout from "components/Layout";
import Loading from "components/Loading";
import LoadingDialog from "components/LoadingDialog";
import { getMemos, putMemo, removeMemos } from "lib/memo/client";
import { Memo } from "lib/memo/types";
import { useLongPress } from "lib/useLongPress";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
    ChangeEventHandler,
    EventHandler,
    FC,
    FormEventHandler,
    MouseEventHandler,
    useEffect,
    useState,
} from "react";

export interface TopProps {}

interface MemoLinkProps {
    memo: Memo;
    selected?: boolean;
    onChange?: (select: boolean) => any;
    onClick?: MouseEventHandler;
}
const MemoLink = ({
    memo,
    selected = false,
    onChange,
    onClick,
}: MemoLinkProps) => {
    // const longPress = useLongPress(() => {
    //     if (onChange) {
    //         onChange();
    //     }
    // }, 0.75 * 1000);
    const handleSelect: ChangeEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(!selected);
        console.log("input",selected);
    };
    return (
        <Link href={`/memo/${memo.key}`} key={memo.key}>
            <a
                onClick={(e) => {
                    // console.log("a");
                    // e.preventDefault();
                    // e.stopPropagation();
                }}
            >
                <li
                    className={`p-2 border-4 ${
                        selected
                            ? "bg-green-200 border-green-600"
                            : "bg-blue-200 border-blue-200"
                    } active:scale-105 transition-all `}
                    onClick={onClick}
                    // {...longPress}
                >
                    <h3 className="text-2xl flex justify-between">
                        <span className="max-w-90per">{memo.title}</span>
                        <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={selected}
                            onChange={handleSelect}
                            onClick={e=>{e.stopPropagation();}}
                        />
                    </h3>
                    <h4>{memo.author}</h4>
                    <h4>{new Date(memo.created_at).toLocaleString()}</h4>
                </li>
            </a>
        </Link>
    );
};

const Top: FC<TopProps> = ({}) => {
    const [openDialog,setOpenDialog] = useState(false) ;
    const [memos, setMemos] = useState<null | Memo[]>(null);
    useEffect(() => {
        //setMemos
        async function fetchMemos(isContinue: boolean = true) {
            const memos = await getMemos();
            setMemos(memos);
            if (isContinue) {
                setTimeout(() => {
                    fetchMemos();
                }, 1 * 1000);
            }
        }
        fetchMemos();
        return () => {};
    }, [setMemos]);
    const router = useRouter();
    const handleNew = async () => {
        setOpenDialog(true)
        const newMemo = {
            title: "メモ",
            author: "匿名",
            mdContent: "\n```:\n\n\n```\n",
        };
        const memo = await putMemo(newMemo);
        if (memo.key) {
            router.push(`/memo/${memo.key}`);
        }
        setOpenDialog(false)
    };
    const [selectMemos, setSelectMemos] = useState<string[]>([]);
    const handleRemove = async ()=>{
        // setMemos(prev=>prev.filter(key=>!selectMemos.includes(key)))
        // const newMemos = memos.filter(memo=>!selectMemos.includes(memo.key)) ;
        // console.log(memos,selectMemos,newMemos)
        setOpenDialog(true);
        await removeMemos(selectMemos) ;
        setSelectMemos([]);
        setOpenDialog(false);
    } ;
    return (
        <Layout title="一覧">
            {/* {selectMemos.map((memoKey) => (
                <div key={memoKey}>{memoKey}</div>
            ))} */}
            {selectMemos.length > 0 ? 
            <div>
                <button className="p-2 bg-blue-600 text-white" onClick={handleRemove}>DELETE</button>
            </div>
            :
            ""}
            <ul className="list-none p-1 grid grid-cols-2 gap-4">
                {memos === null ? (
                    <Loading />
                ) : memos.length <= 0 ? (
                    <div>
                        none memos
                        <div>
                <button className="p-2 bg-blue-600 text-white" onClick={handleNew}>NEW</button>
            </div>
                    </div>
                ) : (
                    <>
                        <li
                            className="p-2 bg-blue-200 active:scale-105 transition-all flex justify-center items-center text-6xl text-white "
                            onClick={handleNew}
                        >
                            +
                        </li>
                        {memos.map((memo) => (
                            <MemoLink
                                key={memo.key}
                                memo={memo}
                                selected={selectMemos.includes(memo.key)}
                                onChange={(select) =>
                                    setSelectMemos((prev) => {
                                        if(!select) return prev.filter(k=>k !== memo.key) ;
                                        return [
                                            ...prev.filter(
                                                (k) => k !== memo.key
                                            ),
                                            memo.key,
                                        ];
                                    })
                                }
                            />
                        ))}
                    </>
                )}
            </ul>
            {/* <TestAdd /> */}
            <LoadingDialog open={openDialog} onClose={()=>setOpenDialog(false)}/>
        </Layout>
    );
};
export default Top;

function useInput(init: string) {
    const [value, setValue] = useState(init);
    const onChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        setValue(e.target.value);
    };
    const props = {
        value,
        onChange,
    };
    return [value, props] as const;
}
function TestAdd() {
    const [title, titleProps] = useInput("title");
    const [author, authorProps] = useInput("author");
    const [mdContent, mdContentProps] = useInput("mdContent");

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        putMemo({
            author,
            mdContent,
            title,
        });
    };
    return (
        <form className="p-2 bg-indigo-300" onSubmit={handleSubmit}>
            <h3>add new</h3>
            <div className="grid grid-cols-1 gap-2">
                <input type="text" {...titleProps} />
                <input type="text" {...authorProps} />
                <textarea {...mdContentProps} className="h-96"></textarea>

                <input
                    type="submit"
                    value="送信"
                    className="bg-gray-200 rounded"
                />
            </div>
        </form>
    );
}
