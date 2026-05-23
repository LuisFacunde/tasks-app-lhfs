import { ScrollView, View, Text, StyleSheet, Switch, TouchableOpacity, Image, Linking, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { globalStyles } from '@/styles/global';
import { useTaskStore } from '@/store/useTaskStore';

export default function SettingsScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);
  const completedCount = Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0;
  const pendingCount = Array.isArray(tasks) ? tasks.filter((t) => !t.completed).length : 0;

  const [notifications, setNotifications] = useState(false);

  const SettingRow = ({
    icon,
    label,
    value,
    onPress,
    danger,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIconBox, danger && styles.settingIconBoxDanger]}>
        <Feather name={icon as any} size={18} color={danger ? '#ff4d4d' : '#fff'} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <Feather name="chevron-right" size={18} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={require('../../assets/task-app-banner.png')} style={styles.logo} />
          <Text style={styles.appName}>Gerenciador de Tarefas</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
        </View>

        {/* Estatísticas */}
        <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#4caf50' }]}>
            <Text style={[styles.statNumber, { color: '#4caf50' }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#ff9800' }]}>
            <Text style={[styles.statNumber, { color: '#ff9800' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#000' }]}>
            <Text style={[styles.statNumber, { color: '#000' }]}>
              {Array.isArray(tasks) ? tasks.length : 0}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Preferências */}
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconBox}>
              <Feather name="bell" size={18} color="#fff" />
            </View>
            <Text style={styles.settingLabel}>Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#000' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sobre */}
        <Text style={styles.sectionTitle}>Sobre o App</Text>
        <View style={styles.card}>
          <Text style={styles.aboutText}>
            Bem-vindo ao Gerenciador de Tarefas! Este aplicativo foi desenvolvido com o intuito de facilitar a
            organização do seu dia a dia, permitindo o acompanhamento de suas atividades de forma simples,
            rápida e eficiente.
          </Text>

          <Text style={styles.techTitle}>Tecnologias Utilizadas</Text>
          {['React Native', 'Expo', 'TypeScript', 'Expo Router', 'Zustand'].map((tech) => (
            <View key={tech} style={styles.techRow}>
              <Feather name="check-circle" size={14} color="#4caf50" />
              <Text style={styles.techItem}>{tech}</Text>
            </View>
          ))}
        </View>

        {/* Zona de perigo */}
        <Text style={styles.sectionTitle}>Zona de Perigo</Text>
        <View style={styles.card}>
          <SettingRow
            icon="trash-2"
            label="Apagar todas as tarefas"
            onPress={deleteAllTasks}
            danger
          />
        </View>

        <Text style={styles.footer}>Feito com ❤️ usando React Native + Expo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIconBoxDanger: {
    backgroundColor: '#fff0f0',
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  settingLabelDanger: {
    color: '#ff4d4d',
  },
  settingValue: {
    fontSize: 15,
    color: '#999',
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  techTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  techItem: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 13,
    marginTop: 32,
  },
});
