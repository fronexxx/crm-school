import axios from "axios";
import {baseUrl} from "../constants/urls";


const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {'Content-Type': 'application/json'}
});

axiosInstance.interceptors.request.use((req) => {
    const access_token = localStorage.getItem('access');

    if (access_token) {
        req.headers.Authorization = `Bearer ${access_token}`;
    }
    return req

});

export {
    axiosInstance
};