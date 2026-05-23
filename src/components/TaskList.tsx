import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from '@/components/TaskItem';
import { TaskItem as TaskType } from '@/utils/handle-api';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskListProps {
  filter: 'all' | 'completed' | 'pending';
  onUpdate: (task: TaskType) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filter, onUpdate }) => {
  const tasks = useTaskStore((state) => state.tasks);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) {
      console.error("tasks is not an array:", tasks);
      return [];
    }
    return tasks.filter(t => {
      if (filter === 'completed') return t.completed;
      if (filter === 'pending') return !t.completed;
      return true;
    });
  }, [tasks, filter]);

  const sections = useMemo(() => {
    const completedTasks = filteredTasks.filter((task) => task.completed);
    const pendingTasks = filteredTasks.filter((task) => !task.completed);

    return [
      { title: '✅ Concluídas', data: completedTasks },
      { title: '📋 Pendentes', data: pendingTasks },
    ];
  }, [filteredTasks]);

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          
          <TaskItem
            task={item}
            updateMode={() => onUpdate(item)}
          />
        )}
        renderSectionFooter={({ section }) => 
          section.data.length === 0 ? (
            <Text style={styles.emptySectionText}>Nenhuma tarefa nesta categoria.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 12,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  emptySectionText: {
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default TaskList;
