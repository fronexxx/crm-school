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
    orderChoices: `${orders}/choices`,
    excel: `${orders}/excel`,


    managers: {
        manager,
        selfManager: `${manager}/me`,
        statistic: `${orders}/statistic`,
        banManager: (id) => `${manager}/${id}/ban`,
        unbanManager: (id) => `${manager}/${id}/unban`,
        createActivationToken: (id) => `${manager}/${id}/activation-token`,
        activateManager: (token) => `${manager}/activate/${token}`,
        recoveryToken: (id) => `${manager}/${id}/recovery-token`,
        recoveryPassword: (recoveryToken) => `${manager}/recovery-password/${recoveryToken}`
    }
};

export {
    urls, baseUrl
}