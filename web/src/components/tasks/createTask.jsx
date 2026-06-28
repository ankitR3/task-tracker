import axios from 'axios';
import { CREATE_TASK } from '../../../routes/api-routes';

export async function createTaskApi(taskData) {
    try {
        const res = await axios.post(CREATE_TASK, taskData);
        return res.data;
    } catch (err) {
        console.error('API Error in createTaskApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}
