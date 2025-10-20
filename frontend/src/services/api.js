import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setupInterceptors = (getAccessTokenSilently) => {
    apiClient.interceptors.request.use(async (config) => {
        try {
            const token = await getAccessTokenSilently();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Could not get access token", error);
        }
        return config;
    }, (error) => Promise.reject(error));
};

export default apiClient;