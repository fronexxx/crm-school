import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

const authService = {
    login: async (user) => {
        const {data: {access}} = await axiosInstance.post(urls.login, user);
        localStorage.setItem('access', access)
    }
}

export {
    authService
}