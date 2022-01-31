import { ButtonHTMLAttributes, FC, HTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {};

const Button: FC<ButtonProps> = (props) => {
    return (
        <button
            className={`transition-all active:opacity-50 active:scale-105 m-1 py-1 px-3 rounded-lg text-xl hover:shadow-lg shadow-black
    ${
        !props.disabled
            ? "bg-indigo-500 text-white"
            : "bg-gray-300 text-gray-900"
    }`}
            {...props}
        >
            {props.children}
        </button>
    );
};
export default Button;
