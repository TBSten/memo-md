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
import { getMemo, putMemo } from "lib/memo/client";
import Loading from "components/Loading";

import "zenn-content-css";
import Tabs from "components/Tabs";

import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";

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
    return (
        <Layout title={memo ? memo.title : "Loading ..."}>
            {memo ? <Tabs tabs={tabs} /> : <Loading />}
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

function SaveButton(props:HTMLAttributes<HTMLButtonElement> & {savable:boolean}) {
    return (
        <button
            className={`transition-all active:opacity-50 active:scale-105  py-1 px-3 rounded-lg 
                    ${
                        props.savable
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-300 text-gray-900"
                    }`}
            disabled={!props.savable}
            {...props}
        >
            保存
        </button>
    );
}
function Edit({ memo, onChange }: EditProps) {
    const [savable, setSavable] = useState(true);
    const [editorEnable, setEditorEnable] = useState(false);
    //mdContent
    const [editorState, setEditorState] = useEditorStateWidthMemo(memo);
    const [title, setTitle] = useState(memo.title);
    const [author, setAuthor] = useState(memo.author);
    const handleChangeMdContent = (es: EditorState) => {
        setEditorState(es);
        const mdContent = es.getCurrentContent().getPlainText();
        onChange({ ...memo, mdContent });
    };
    const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = (e) => {
        setTitle(e.target.value);
        onChange({ ...memo, title: e.target.value });
    };
    const handleChangeAuthor: ChangeEventHandler<HTMLInputElement> = (e) => {
        setAuthor(e.target.value);
        onChange({ ...memo, author: e.target.value });
    };
    const handleSave = useCallback(async () => {
        if (savable) {
            setSavable(false);
            const updatedMemo = {
                ...memo,
                mdContent: editorState.getCurrentContent().getPlainText(),
            };
            console.log("save", updatedMemo);
            await putMemo(updatedMemo);
            setSavable(true);
        }
    }, [memo]);
    useEffect(() => {
        setEditorEnable(true);
    }, []);
    return (
        <div className="p-2">
            <SaveButton savable={savable} onClick={handleSave}/>

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
