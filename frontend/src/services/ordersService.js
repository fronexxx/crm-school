import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

const ordersService = {
    getAllOrders: async (params) => {
        const {data} = await axiosInstance.get(urls.orders, {params});
        return data
    },
    getGroups: async () => {
        const {data} = await axiosInstance.get(urls.groups);
        return data
    },
    getComments: async (id) => {
        const {data} = await axiosInstance.get(urls.comment(id));
        return data
    },
    addComment: async (id, comment) => {
        const {data} = await axiosInstance.post(urls.comment(id), comment);
        return data
    },
};

export {
    ordersService
}