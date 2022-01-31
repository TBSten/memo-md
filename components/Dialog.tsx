import { FC } from "react";

export interface DialogProps {
    open: boolean;
    onClose?: () => any;
}

const Dialog: FC<DialogProps> = ({ open, children }) => {
    if (open) {
        return (
            <div className="w-screen h-screen fixed top-0 left-0 bg-opacity-50 bg-black flex justify-center items-center">
                <div className="bg-white rounded-3xl p-3 w-1/4 h-1/4 flex justify-center items-center">
                    {children}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
};
export default Dialog;
