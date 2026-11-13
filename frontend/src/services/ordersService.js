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
    createGroups: async (groupName) => {
        const {data} = await axiosInstance.post(`${urls.groups}`, groupName);
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
    updateOrder: async (id, orderData) => {
        const {data} = await axiosInstance.patch(urls.updateOrder(id), orderData);
        return data
    },
    getOrderChoices: async () => {
        const {data} = await axiosInstance.get(urls.orderChoices);
        return data
    },
};

export {
    ordersService
}