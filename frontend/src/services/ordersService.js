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
    }
}

export {
    ordersService
}