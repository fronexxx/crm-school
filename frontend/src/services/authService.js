import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

const authService = {
    login: async (user) => {
        const {data: userWithTokens} = await axiosInstance.post(urls.auth.login, user);
        localStorage.setItem('tokens', JSON.stringify(userWithTokens))
    },
    refresh: async () => {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const {data: {access, refresh}} = await axiosInstance.post(urls.auth.refresh, {refresh: tokens.refresh});
        tokens.access = access;
        tokens.refresh = refresh;
        localStorage.setItem('tokens', JSON.stringify(tokens));
    },
};

export {
    authService
}