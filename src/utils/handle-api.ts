import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Token expirado ou inválido. Realizando logout automático...');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export interface TaskItem {
  _id: string | number;
  text: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'Baixa' | 'Média' | 'Alta';
}

export const getAllTasks = (setTasks: (tasks: TaskItem[]) => void, setLoading?: (loading: boolean) => void) => {
  if (setLoading) setLoading(true);
  axios.get<TaskItem[]>(`${baseURL}`).then(({ data }) => {
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      console.error("API response is not a valid array of tasks:", data);
      setTasks([]);
    }
    if (setLoading) setLoading(false);
  }).catch((err) => {
    console.log(err);
    if (setLoading) setLoading(false);
  });
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: (tasks: TaskItem[]) => void,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/save`, { text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: (tasks: TaskItem[]) => void,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/update`, { _id: taskId, text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (
  _id: string,
  setTasks: (tasks: TaskItem[]) => void
) => {
  axios
    .post(`${baseURL}/delete`, { _id })
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};
