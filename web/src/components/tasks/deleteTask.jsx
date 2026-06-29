import axios from 'axios';
import { DELETE_TASK } from '../../../routes/api-routes';

export async function deleteTaskApi(id) {
    try {
        const url = DELETE_TASK(id);
        const res = await axios.delete(url);
        return res.data;
    } catch (err) {
        console.error('API Error in deleteTaskApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}
