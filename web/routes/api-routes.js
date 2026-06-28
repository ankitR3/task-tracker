const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_URL = BACKEND_URL + '/api/v1/task';

export const CREATE_TASK = API_URL + '/';
export const UPDATE_TASK = API_URL + '/:id';
export const DELETE_TASK = API_URL + '/:id';
export const GET_ALL_TASK = API_URL + '/';
export const UPDATE_TASK_STATUS = API_URL + '/:id/status';