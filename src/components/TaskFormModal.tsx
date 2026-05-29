import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { TaskItem } from '@/utils/handle-api';

const DateTimePicker = Platform.OS !== 'web'
  ? require('@react-native-community/datetimepicker').default
  : null;

interface TaskFormModalProps {
  visible: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onSave: (
    text: string,
    completed: boolean,
    dueDate: string | null,
    priority: 'Baixa' | 'Média' | 'Alta',
  ) => void;
}

export default function TaskFormModal({ visible, task, onClose, onSave }: TaskFormModalProps) {
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  React.useEffect(() => {
    if (visible) {
      if (task) {
        setText(task.text);
        setCompleted(!!task.completed);
        setDueDate(task.dueDate ? new Date(task.dueDate) : null);
        setPriority(task.priority ?? 'Baixa');
      } else {
        setText('');
        setCompleted(false);
        setDueDate(null);
        setPriority('Baixa');
      }
    }
  }, [visible, task]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim(), completed, dueDate ? dueDate.toISOString() : null, priority);
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da tarefa..."
            value={text}
            maxLength={50}
            onChangeText={setText}
          />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Data limite:</Text>
            {Platform.OS === 'web' ? (
              // @ts-ignore
              <input
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e: any) => {
                  const val = e.target.value;
                  if (val) {
                    const parts = val.split('-');
                    setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                  } else {
                    setDueDate(null);
                  }
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
              />
            ) : (
              <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                  <Text>{dueDate ? dueDate.toLocaleDateString() : 'Selecionar Data'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </View>
            )}
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Concluída:</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={completed}
                onValueChange={setCompleted}
                color={completed ? '#000' : undefined}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Prioridade:</Text>
            <View style={styles.priorityContainer}>
              {(['Baixa', 'Média', 'Alta'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && {
                      backgroundColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                      borderColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                    },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!text.trim()}
            >
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  priorityText: { color: '#333' },
  priorityTextActive: { color: '#fff', fontWeight: 'bold' },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  saveBtnDisabled: { backgroundColor: '#ccc' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
