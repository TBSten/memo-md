import { FC } from "react";
import Dialog, { DialogProps } from "./Dialog";
import Loading from "./Loading";

export type LoadingDialogProps = DialogProps & {};

const LoadingDialog: FC<LoadingDialogProps> = ({ open, onClose }) => {
    if (open) {
        return (
            <Dialog open={open} onClose={onClose}>
                <Loading />
            </Dialog>
        );
    } else {
        return <></>;
    }
};
export default LoadingDialog;
