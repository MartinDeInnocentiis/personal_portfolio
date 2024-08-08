import axios from 'axios';
import useAuthStore from './store-zustand';


export const refreshToken = async () => {
    const { refreshToken, setToken, logout  } = useAuthStore.getState(); 

    if (!refreshToken) {
        console.error('No refresh token available');
        return null;
    }

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        setToken(access);
        return access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
        return null;
    }
};