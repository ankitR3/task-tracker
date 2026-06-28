import axios from 'axios';
import { GET_TASKBY_ID } from '../../../routes/api-routes';

export async function getTaskByIdApi(id) {
    try {
        const url = GET_TASKBY_ID.replace(':id', id);
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.error('API Error in getTaskByIdApi:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
}
