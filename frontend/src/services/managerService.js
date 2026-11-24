import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

const managerService = {
    getAllManagers: async (page) => {
        const {data} = await axiosInstance.get(urls.managers.manager, {params: {page}});
        return data;
    },
    getSelfManager: async () => {
        const {data} = await axiosInstance.get(urls.managers.selfManager);
        return data
    },
    getAllStatistic: async () => {
        const {data} = await axiosInstance.get(urls.managers.statistic);
        return data
    },
    createManager: async (manager) => {
        const {data} = await axiosInstance.post(urls.managers.manager, manager);
        return data
    },
    banManager: async (id) => {
        const {data} = await axiosInstance.patch(urls.managers.banManager(id));
        return data
    },
    unbanManager: async (id) => {
        const {data} = await axiosInstance.patch(urls.managers.unbanManager(id));
        return data
    },
    createActivationToken: async (id) => {
        const {data} = await axiosInstance.post(urls.managers.createActivationToken(id));
        return data
    },
    activateManager: async (token, data) => {
        await axiosInstance.post(urls.managers.activateManager(token), data);
    },
    recoveryToken: async (id) => {
        const {data} = await axiosInstance.post(urls.managers.recoveryToken(id));
        return data
    },
    recoveryPassword: async (recoveryToken, data) => {
        await axiosInstance.post(urls.managers.recoveryPassword(recoveryToken), data);
    },
};

export {
    managerService
};