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
};

export {
    managerService
};