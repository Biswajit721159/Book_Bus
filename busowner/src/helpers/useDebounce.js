import { useRef, useEffect, useCallback } from 'react';

function useDebounce(callback, delay) {
    const timerRef = useRef(null);

    const debouncedFunction = useCallback((...args) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return debouncedFunction;
}

export default useDebounce;