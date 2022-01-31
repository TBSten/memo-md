import Link from "next/link";
import { FC } from "react";

export interface LayoutProps {
    title: string;
}

const Layout: FC<LayoutProps> = ({ children, title }) => {
    return (
        <div className="layout-root flex flex-col ">
            <header className="bg-slate-700 text-white px-4 py-1">
                <span className="text-sm">
                    <Link href="/">
                        <a>MEMO-MD</a>
                    </Link>
                </span>
            </header>
            <h1 className="text-2xl px-4 py-1 bg-indigo-700 text-white">
                {title.substring(0, 30)}
            </h1>
            <main className="flex-grow overflow-auto bg-zinc-100">
                {children}
            </main>
            {/* <footer className="bg-gray-200">
                SRC-MD
            </footer> */}
        </div>
    );
};
export default Layout;
