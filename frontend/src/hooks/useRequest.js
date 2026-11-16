import {useCallback, useState} from "react";

export const useRequest = () => {
    const [error, setError] = useState(null);

    const run = useCallback(async (action) => {
        try {
            setError(null);
            return await action();
        } catch (e) {
            setError(e.message);
            return undefined;
        }
    }, []);

    return {error, setError, run}
};