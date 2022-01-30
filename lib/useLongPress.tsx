import { useEffect, useState } from "react";

type LongPressSet = {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
};

export const useLongPress = (
    callback: () => void,
    ms: number
): LongPressSet => {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;

        if (startLongPress) {
            timeout = setTimeout(callback, ms);
        } else {
            clearTimeout(timeout as NodeJS.Timeout);
        }

        return () => {
            clearTimeout(timeout as NodeJS.Timeout);
        };
    }, [startLongPress, callback]);

    const start = () => {
        callback();
        setTimeout(() => {
            setStartLongPress(true);
        }, 1000);
    };

    const stop = () => {
        setStartLongPress(false);
    };

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
};
