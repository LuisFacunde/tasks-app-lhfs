import { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView,
  Platform, StatusBar as RNStatusBar, Image, Pressable,
  ActivityIndicator,
} from 'react-native';
import TaskList from '@/components/TaskList';
import { addTask, updateTask, getAllTasks, TaskItem } from '@/utils/handle-api';
import { globalStyles } from '@/styles/global';
import { useTaskStore } from '@/store/useTaskStore';
import TaskFormModal from '@/components/TaskFormModal';

export default function TasksScreen() {
  // Store selectors
  const loading = useTaskStore((state) => state.loading);
  const tasks = useTaskStore((state) => state.tasks);

  // UI states
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    getAllTasks((tasks) => useTaskStore.getState().setTasks(tasks));
  }, []);

  const handleSave = (
    text: string,
    completed: boolean,
    dueDate: string | null,
    priority: 'Baixa' | 'Média' | 'Alta',
  ) => {
    const setTasks = (tasks: TaskItem[]) => useTaskStore.getState().setTasks(tasks);
    if (editingTask) {
      updateTask(String(editingTask._id), text, completed, dueDate, setTasks, () => {
        setModalVisible(false);
        setEditingTask(null);
      });
    } else {
      addTask(text, completed, dueDate, setTasks, () => {
        setModalVisible(false);
      });
    }
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/task-app-banner.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Total de Tarefas: {Array.isArray(tasks) ? tasks.length : 0}
          </Text>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f ? styles.filterButtonActive : styles.filterButtonInactive]}
              onPress={() => setFilter(f)}
            >
              <Text style={filter === f ? styles.filterTextActive : styles.filterTextInactive}>
                {f === 'all' ? 'Todas' : f === 'completed' ? 'Concluídas' : 'Pendentes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionButtonAdd,
              pressed && styles.actionButtonAddPressed,
            ]}
            onPress={openCreateModal}
          >
            <Text style={styles.actionButtonText}>Nova Tarefa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={() => useTaskStore.getState().deleteAllTasks()}
          >
            <Text style={styles.actionButtonText}>Excluir todas</Text>
          </Pressable>
        </View>

        <TaskList filter={filter} onUpdate={openEditModal} />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>

      <TaskFormModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: '#000',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  actionButtonAdd: {
    backgroundColor: globalStyles.primaryColor,
    shadowColor: globalStyles.primaryColor,
  },
  actionButtonAddPressed: {
    backgroundColor: '#333',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    shadowColor: '#ff0000',
  },
  deleteButtonPressed: {
    backgroundColor: '#d9363e',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
});
