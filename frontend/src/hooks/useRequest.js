import {useCallback, useState} from "react";
import axios from "axios";

export const useRequest = () => {
    const [error, setError] = useState(null);

    const run = useCallback(async (action) => {
        try {
            setError(null);
            return await action();
        } catch (e) {
            if (axios.isCancel(e)) return undefined;
            setError(e.message);
            return undefined;
        }
    }, []);

    return {error, setError, run}
};