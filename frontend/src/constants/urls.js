const baseUrl = '/api';
const auth = '/auth';
const orders = '/orders'

const urls = {
    auth: {
        login: auth,
        refresh: `${auth}/refresh`
    },
    orders,
    groups: `${orders}/groups`
};

export {
    urls, baseUrl
}