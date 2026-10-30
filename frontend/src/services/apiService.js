import axios from "axios";
import {baseUrl} from "../constants/urls";
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

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(Object.assign(new Error(getErrorMessage(error)), {
        status: error.response?.status,
    }))
);

export {
    axiosInstance
};