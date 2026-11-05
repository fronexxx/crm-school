const baseUrl = '/api';

const auth = '/auth';
const orders = '/orders';
const manager = '/manager';


const urls = {
    auth: {
        login: auth,
        refresh: `${auth}/refresh`
    },
    orders,
    groups: `${orders}/groups`,
    comment: (id) => `${orders}/${id}/comment`,
    updateOrder: (id) => `${orders}/${id}/update`,


    managers: {
        manager,
        selfManager: `${manager}/me`
    }
};

export {
    urls, baseUrl
}