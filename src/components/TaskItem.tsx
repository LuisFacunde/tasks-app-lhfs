import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskItem as TaskType } from '@/utils/handle-api';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskItemProps {
  task: TaskType;
  updateMode: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, updateMode }) => {
  const router = useRouter();
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <TouchableOpacity
      style={styles.task}
      onPress={() => router.push(`/task/${task._id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.text, !!task.completed && styles.textCompleted]}>
          {task.text}
        </Text>
        {task.dueDate && (
          <Text style={[styles.dateText, isOverdue ? styles.dateOverdue : styles.dateOnTime]}>
            Até: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}
        {task.priority && (
          <View style={[styles.priorityChip, {
            backgroundColor:
              task.priority === 'Alta' ? '#f4433622' :
              task.priority === 'Média' ? '#ff980022' : '#4caf5022',
          }]}>
            <Text style={[styles.priorityChipText, {
              color:
                task.priority === 'Alta' ? '#f44336' :
                task.priority === 'Média' ? '#ff9800' : '#4caf50',
            }]}>
              {task.priority}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.icons}>
        <TouchableOpacity
          onPress={updateMode}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="edit" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteTask(String(task._id))}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/task/${task._id}`)}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="eye" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  dateOverdue: {
    color: '#e53935',
  },
  dateOnTime: {
    color: '#43a047',
  },
  priorityChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  priorityChipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    gap: 14,
  },
  icon: {
    padding: 2,
  },
});

export default TaskItem;
