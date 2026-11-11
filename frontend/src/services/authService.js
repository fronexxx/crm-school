import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";


const authService = {
    login: async (user) => {
        const {data: userWithTokens} = await axiosInstance.post(urls.auth.login, user);
        localStorage.setItem('tokens', JSON.stringify(userWithTokens))
    },

    logout: () => {
        localStorage.removeItem('tokens');
    },
};

export {
    authService
}