import axios from 'axios';
import { UPDATE_TASK, UPDATE_TASK_STATUS } from '../../../routes/api-routes';

export async function updateTaskApi(id, taskData) {
    try {
        const url = UPDATE_TASK(id);
        const res = await axios.put(url, taskData);
        return res.data;
    } catch (err) {
        console.error('API Error in updateTaskApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}

export async function updateTaskStatusApi(id, status) {
    try {
        const url = UPDATE_TASK_STATUS(id);
        const res = await axios.patch(url, { status });
        return res.data;
    } catch (err) {
        console.error('API Error in updateTaskStatusApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}
