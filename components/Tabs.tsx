import { FC, ReactNode, useState } from "react";
import styles from "./scss/Tabs.module.scss";

export interface TabsProps {
    tabs: {
        label: ReactNode;
        comp: ReactNode;
    }[];
    defaultIdx: number;
    idx?: number;
    onChange?: (idx:number)=>any ;
}

const Tabs: FC<TabsProps> = ({ tabs, defaultIdx , onChange , idx }) => {
    const [autoIdx, setAutoIdx] = useState(defaultIdx);
    const handleSelect = (idx:number)=>{
        if(typeof idx === "number" && onChange){
            onChange(idx);
        }else{
            setAutoIdx(idx);
        }
    } ;
    const currentIdx = typeof idx === "number" ? idx : autoIdx ;
    return (
        <div>
            <div className="flex ml-2 bg-white w-fit max-w-full">
                {tabs.map((tab, i) => (
                    <div
                        className={`p-2 pb-1 pt-3 border-b-2 ${
                            i === currentIdx ? "border-indigo-600" : "border-gray-300"
                        } mx-1 transition-colors cursor-pointer`}
                        onClick={() => handleSelect(i)}
                        key={tab.label.toString()}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div>{tabs[currentIdx].comp}</div>
        </div>
    );
};
export default Tabs;
