import { FC, ReactNode, useState } from "react";
import styles from "./scss/Tabs.module.scss";

export interface TabsProps {
    tabs: {
        label: ReactNode;
        comp: ReactNode;
    }[];
}

const Tabs: FC<TabsProps> = ({ tabs }) => {
    const [idx, setIdx] = useState(0);
    return (
        <div>
            <div className="flex ml-2 bg-white w-fit max-w-full">
                {tabs.map((tab, i) => (
                    <div
                        className={`p-2 pb-1 pt-3 border-b-2 ${i===idx?"border-indigo-600":"border-gray-300"} mx-1 transition-colors `}
                        onClick={() => setIdx(i)}
                        key={tab.label.toString()}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div>{tabs[idx].comp}</div>
        </div>
    );
};
export default Tabs;
