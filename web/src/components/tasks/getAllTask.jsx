import axios from 'axios';
import { GET_ALL_TASK } from '../../../routes/api-routes';

export async function getAllTasksApi(params = {}) {
    try {
        const res = await axios.get(GET_ALL_TASK, { params });
        return res.data;
    } catch (err) {
        console.error('API Error in getAllTasksApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}
