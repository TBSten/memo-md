import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { existMemo } from "lib/memo/server";
import {
    ChangeEventHandler,
    FC,
    HTMLAttributes,
    KeyboardEventHandler,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Memo } from "lib/memo/types";
import { getMemo, putMemo, removeMemos } from "lib/memo/client";
import Loading from "components/Loading";

import "zenn-content-css";
import Tabs from "components/Tabs";

import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import Button from "components/Button";
import { useRouter } from "next/router";
import LoadingDialog from "components/LoadingDialog";

export interface MemoDetailProps {
    memoKey: string;
}

async function fetchMemo(memoKey: string, setMemo: (memo: Memo) => any) {
    // console.log("fetchMemo");
    const memo = await getMemo(memoKey);
    setMemo(memo);
}

const MemoDetail: FC<MemoDetailProps> = ({ memoKey }) => {
    const [memo, setMemo] = useState<null | Memo>(null);
    let defaultIdx = 0;
    if (typeof location !== "undefined" && location.hash === "edit") {
        defaultIdx = 1;
    }
    const tabs = [
        {
            label: "閲覧",
            comp: <View memo={memo} onChange={setMemo} memoKey={memoKey} />,
        },
        {
            label: "編集",
            comp: (
                <Edit memo={memo} onChange={(memo) => setMemo({ ...memo })} />
            ),
        },
    ];
    useEffect(() => {
        fetchMemo(memoKey, setMemo);
    }, []);
    const [tabIdx,setTabIdx] = useState(0) ;
    return (
        <Layout title={memo ? memo.title : "Loading ..."}>
            {memo ? 
                <Tabs 
                    idx={tabIdx}
                    onChange={(idx)=>setTabIdx(idx)}
                    tabs={tabs} 
                    defaultIdx={defaultIdx}
                /> 
                : 
                <Loading />}
        </Layout>
    );
};
export default MemoDetail;

interface ViewProps {
    memo: Memo;
    memoKey: string;
    onChange: (memo: Memo) => any;
}

function View({ memo, onChange, memoKey }: ViewProps) {
    const setMemo = onChange;
    const duration = 1;
    useEffect(() => {
        fetchMemo(memoKey, setMemo);
        const autoFetch = setInterval(() => {
            fetchMemo(memoKey, setMemo);
        }, duration * 1000);
        return () => {
            clearInterval(autoFetch);
        };
    }, [memoKey, setMemo]);
    return (
        <>
            <div className="p-2 bg-white">
                <div
                    className="znc"
                    dangerouslySetInnerHTML={{
                        __html: memo.htmlContent,
                    }}
                ></div>
            </div>
            <div className="bg-gray-200 px-4 py-2">
                <ul className="list-none">
                    <li>タイトル:{memo.title}</li>
                    <li>作成者:{memo.author}</li>
                    <li>作成日:{new Date(memo.created_at).toLocaleString()}</li>
                    <li>更新日:{new Date(memo.updated_at).toLocaleString()}</li>
                </ul>
            </div>
        </>
    );
}

interface EditProps {
    memo: Memo;
    onChange: (memo: Memo) => any;
}

function useEditorStateWidthMemo(memo: Memo) {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
            ContentState.createFromText(memo.mdContent)
        )
    );
    return [editorState, setEditorState] as const;
}

function Edit({ memo, onChange }: EditProps) {
    useEffect(() => console.log("memo changed", memo), [memo]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState(memo.title);
    const [author, setAuthor] = useState(memo.author);
    const [editorState, setEditorState] = useEditorStateWidthMemo(memo);
    const [editorEnable, setEditorEnable] = useState(false);
    const handleChangeMdContent = (es: EditorState) => {
        setEditorState(es);
        const mdContent = es.getCurrentContent().getPlainText();
        // onChange({ ...memo, mdContent });
    };
    const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = (e) => {
        setTitle(e.target.value);
        // onChange({ ...memo, title: e.target.value });
    };
    const handleChangeAuthor: ChangeEventHandler<HTMLInputElement> = (e) => {
        setAuthor(e.target.value);
        // onChange({ ...memo, author: e.target.value });
    };
    const handleSave = async () => {
        if (!loading) {
            setLoading(true);
            const updatedMemo = {
                ...memo,
                title,
                author,
                mdContent: editorState.getCurrentContent().getPlainText(),
            };
            const newMemo = await putMemo(updatedMemo);
            onChange(newMemo);
            setLoading(false);
        }
    };
    const handleRemove = useCallback(async () => {
        if (!loading) {
            setLoading(true);
            await removeMemos([memo.key]);
            router.push(`/`);
            setLoading(false);
        }
    }, [memo.key]);
    useEffect(() => {
        setEditorEnable(true);
    }, []);
    return (
        <div className="p-2">
            <Button onClick={handleSave} disabled={loading}>
                保存
            </Button>
            <Button onClick={handleRemove} disabled={loading}>
                削除
            </Button>

            <div>
                タイトル
                <input
                    value={title}
                    onChange={handleChangeTitle}
                    className="w-full outline-none p-2 mb-2 rounded text-2xl"
                />
                作者
                <input
                    value={author}
                    onChange={handleChangeAuthor}
                    className="w-full outline-none p-2 mb-2 rounded"
                />
                内容
                <div className="bg-white rounded-3xl p-3">
                    {editorEnable && (
                        <Editor
                            placeholder="Write something"
                            editorKey="test-key"
                            editorState={editorState}
                            onChange={handleChangeMdContent}
                        />
                    )}
                </div>
            </div>

            <Button onClick={handleSave} disabled={loading}>
                保存
            </Button>
            <Button onClick={handleRemove} disabled={loading}>
                削除
            </Button>

            <div className="fixed right-3 bottom-3 z-10">
                <button
                    className="bg-indigo-800 text-white p-2 text-3xl rounded-full shadow-md hover:shadow-2xl shadow-stone-400 active:opacity-50 transition-all"
                    onClick={handleSave}
                >
                    保存
                </button>
            </div>

            <LoadingDialog open={loading} onClose={() => setLoading(false)} />
        </div>
    );
}
export const getServerSideProps: GetServerSideProps<MemoDetailProps> = async (
    ctx
) => {
    const memoKey = ctx.params.key;
    if (typeof memoKey === "string") {
        console.log("search memo ", memoKey);
        if (await existMemo(memoKey)) {
            console.log("exist memo", memoKey);
            return {
                props: {
                    memoKey,
                },
            };
        }
    }
    console.log("not exist memo", memoKey);
    return {
        notFound: true,
    };
};
