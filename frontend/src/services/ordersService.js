import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

let choicesCache = null;

const ordersService = {
    getAllOrders: async (params, signal) => {
        const {data} = await axiosInstance.get(urls.orders, {params, signal});
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
    getOrderChoices: () => {
        if (!choicesCache) {
            choicesCache =  axiosInstance.get(urls.orderChoices)
                .then(({data}) => data)
                .catch(e => {
                    choicesCache = null;
                    throw e
                });
        }
        return choicesCache;
    },
    exportExcel: async (params) => {
        const {data} = await axiosInstance.get(urls.excel, {params, responseType: 'blob'});
        return data
    },
};

export {
    ordersService
}