export const getErrorMessage = (e) => {
    const data = e.response?.data;

    if (typeof data === 'string' && data.length < 300) return data;
    if(Array.isArray(data)) return data.join('. ');
    if (data?.detail) return data.detail;
    if(data?.message) return data.message;

    if (data && typeof data === 'object') {
        const text = Object.values(data).flat().join('. ');
        if (text) return text
    }

    return e.response ? `Помилка сервера (${e.response.status})` : 'Немає зв’язку з сервером';

};