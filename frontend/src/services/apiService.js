import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {getErrorMessage} from "../utils/getErrorMessage";


const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {'Content-Type': 'application/json'}
});

axiosInstance.interceptors.request.use((req) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));

    if (tokens?.access) {
        req.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return req

});

let refreshPromise = null

const refreshTokens = () => {
    if (!refreshPromise) {
        const tokens = JSON.parse(localStorage.getItem('tokens'))

        refreshPromise = axios
            .post(`${baseUrl}${urls.auth.refresh}`, {refresh: tokens?.refresh})
            .then(({data}) => {
                localStorage.setItem('tokens', JSON.stringify({...tokens, ...data}));

            })
            .finally(() => {
                refreshPromise = null
            });
    }
    return refreshPromise;
};

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const isLogin = original?.url === urls.auth.login;

        if (error.response?.status !== 401 || !original || original._retry || isLogin) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            await refreshTokens();
            return axiosInstance(original);
        } catch {
            localStorage.removeItem('tokens');
            window.location.href = '/';
            return Promise.reject(error);
        }
    }
)

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (!axios.isAxiosError(error)) return Promise.reject(error);

        return Promise.reject(Object.assign(new Error(getErrorMessage(error)), {
            status: error.response?.status,
        }));
    }
);

export {
    axiosInstance
};