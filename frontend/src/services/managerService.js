import {axiosInstance} from "./apiService";
import {urls} from "../constants/urls";

const managerService = {
    getSelfManager: async () => {
        const {data} = await axiosInstance.get(urls.managers.selfManager);
        return data
    }
}

export {
    managerService
};