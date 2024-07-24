import axios from 'axios';
import useAuthStore from './store-zustand';


export const refreshToken = async () => {
    const { refreshToken, setToken } = useAuthStore.getState(); 

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        setToken(access);
        return access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};