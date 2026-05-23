import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TaskItem } from '@/utils/handle-api'

type TaskState = {
    tasks: TaskItem[],
    loading: boolean,
    setTasks: (tasks: TaskItem[]) => void,
    setLoading: (loading: boolean) => void,
    addTask: (task: TaskItem) => void,
    updateTask: (id: string | number, updatedTask: Partial<TaskItem>) => void,
    toggleTaskCompleted: (id: string | number) => void,
    deleteTask: (id: string | number) => void,
    deleteAllTasks: () => void,
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            loading: false,

            setTasks: (tasks) => set({ tasks }),

            setLoading: (loading) => set({ loading }),

            addTask: (newTask) => set((state) => ({
                tasks: [...state.tasks, newTask]
            })),

            updateTask: (id, updatedFields) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task._id == id ? { ...task, ...updatedFields } : task
                )
            })),

            toggleTaskCompleted: (id) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task._id == id ? { ...task, completed: !task.completed } : task
                )
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(task => task._id != id)
            })),

            deleteAllTasks: () => set({ tasks: [] }),
        }),
        {
            name: 'task-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)