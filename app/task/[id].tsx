import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { updateTask, getAllTasks, TaskItem } from '@/utils/handle-api';
import TaskFormModal from '@/components/TaskFormModal';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const task = useTaskStore((state) =>
    Array.isArray(state.tasks) ? state.tasks.find((t) => String(t._id) === id) : undefined
  );

  const toggleTaskCompleted = useTaskStore((state) => state.toggleTaskCompleted);
  const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);

  const [modalVisible, setModalVisible] = useState(false);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Feather name="alert-circle" size={48} color="#ccc" />
          <Text style={styles.notFoundText}>Tarefa não encontrada</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const priorityColor =
    task.priority === 'Alta' ? '#f44336' : task.priority === 'Média' ? '#ff9800' : '#4caf50';

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir a tarefa "${task.text}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteTaskFromStore(String(task._id));
            router.back();
          },
        },
      ]
    );
  };

  const handleSave = (
    text: string,
    completed: boolean,
    dueDate: string | null,
    priority: 'Baixa' | 'Média' | 'Alta',
  ) => {
    updateTask(
      String(task._id),
      text,
      completed,
      dueDate,
      (tasks: TaskItem[]) => useTaskStore.getState().setTasks(tasks),
      () => {
        getAllTasks((tasks) => useTaskStore.getState().setTasks(tasks));
        setModalVisible(false);
      }
    );
  };

  return (
    <>
      {/* Customiza o header dinamicamente com o título da tarefa */}
      <Stack.Screen options={{ title: task.text.length > 24 ? task.text.slice(0, 24) + '…' : task.text }} />

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Card principal */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
                <Text style={styles.priorityBadgeText}>{task.priority ?? 'Baixa'}</Text>
              </View>
              <View style={[styles.statusBadge, task.completed ? styles.statusDone : styles.statusPending]}>
                <Text style={styles.statusBadgeText}>{task.completed ? 'Concluída' : 'Pendente'}</Text>
              </View>
            </View>

            <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
              {task.text}
            </Text>

            {task.dueDate && (
              <View style={styles.infoRow}>
                <Feather name="calendar" size={16} color={isOverdue ? '#e53935' : '#555'} />
                <Text style={[styles.infoText, isOverdue && styles.infoTextOverdue]}>
                  Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {isOverdue ? '  ⚠️ Atrasada' : ''}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Feather name="flag" size={16} color={priorityColor} />
              <Text style={styles.infoText}>Prioridade: <Text style={{ color: priorityColor, fontWeight: 'bold' }}>{task.priority ?? 'Baixa'}</Text></Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name={task.completed ? 'check-circle' : 'circle'} size={16} color={task.completed ? '#4caf50' : '#999'} />
              <Text style={styles.infoText}>
                Status: <Text style={{ fontWeight: 'bold', color: task.completed ? '#4caf50' : '#ff9800' }}>
                  {task.completed ? 'Concluída' : 'Pendente'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Ações */}
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => toggleTaskCompleted(String(task._id))}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: task.completed ? '#ff9800' : '#4caf50' }]}>
              <Feather name={task.completed ? 'rotate-ccw' : 'check'} size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>
              {task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
            </Text>
            <Feather name="chevron-right" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#2196f3' }]}>
              <Feather name="edit-2" size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Editar Tarefa</Text>
            <Feather name="chevron-right" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.actionRowDanger]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ff4d4d' }]}>
              <AntDesign name="delete" size={20} color="#fff" />
            </View>
            <Text style={[styles.actionLabel, { color: '#ff4d4d' }]}>Excluir Tarefa</Text>
            <Feather name="chevron-right" size={18} color="#ffaaaa" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <TaskFormModal
        visible={modalVisible}
        task={task}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDone: { backgroundColor: '#e8f5e9' },
  statusPending: { backgroundColor: '#fff3e0' },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 16,
    lineHeight: 30,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  infoTextOverdue: {
    color: '#e53935',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionRowDanger: {
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#999',
  },
  backButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
