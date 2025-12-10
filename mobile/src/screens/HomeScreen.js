import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { attendanceAPI } from '../services/api';
import { getCurrentPosition } from '../services/location';
import { takeSelfie } from '../services/camera';
import { getUser, saveOfflineAttendance } from '../services/storage';
import colors from '../theme/colors';
import commonStyles from '../theme/styles';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(() => {
    loadUserData();
    checkConnectivity();
    loadTodayAttendance();
  }, []);

  const loadUserData = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const checkConnectivity = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
    return unsubscribe;
  };

  const loadTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendanceAPI.getMyAttendances(today, today, 1);
      if (response.data.attendances.length > 0) {
        setTodayAttendance(response.data.attendances[0]);
      }
    } catch (error) {
      console.error('Erreur chargement pointage:', error);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);

    try {
      // 1. Obtenir la position GPS
      const position = await getCurrentPosition();

      // 2. Prendre un selfie (optionnel selon config)
      // const selfie = await takeSelfie();

      // 3. Envoyer le pointage
      const data = {
        latitude: position.latitude,
        longitude: position.longitude,
        site_id: user?.site_id,
      };

      if (isOnline) {
        const response = await attendanceAPI.clockIn(data);
        Alert.alert('Succès', response.data.message);
        setTodayAttendance(response.data.attendance);
      } else {
        // Mode offline
        const offlineData = {
          ...data,
          date: new Date().toISOString().split('T')[0],
          clock_in: new Date().toISOString(),
          is_synced: false,
        };
        await saveOfflineAttendance(offlineData);
        Alert.alert(
          'Mode hors ligne',
          'Pointage enregistré localement. Il sera synchronisé automatiquement.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        error.response?.data?.error || error.message || 'Impossible de pointer'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);

    try {
      const position = await getCurrentPosition();

      const data = {
        attendance_id: todayAttendance?.id,
        latitude: position.latitude,
        longitude: position.longitude,
      };

      const response = await attendanceAPI.clockOut(data);
      Alert.alert('Succès', response.data.message);
      setTodayAttendance(response.data.attendance);
    } catch (error) {
      Alert.alert(
        'Erreur',
        error.response?.data?.error || error.message || 'Impossible de pointer'
      );
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>
          {user?.first_name} {user?.last_name}
        </Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
      </View>

      {/* Bouton de pointage principal */}
      <View style={styles.clockContainer}>
        <View style={styles.clockCard}>
          <Text style={styles.currentTime}>
            {new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.currentDate}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : todayAttendance?.clock_in && !todayAttendance?.clock_out ? (
            <TouchableOpacity
              style={[styles.clockButton, { backgroundColor: colors.error }]}
              onPress={handleClockOut}
            >
              <Text style={styles.clockButtonText}>🚪 Pointer la sortie</Text>
            </TouchableOpacity>
          ) : !todayAttendance?.clock_in ? (
            <TouchableOpacity
              style={styles.clockButton}
              onPress={handleClockIn}
            >
              <Text style={styles.clockButtonText}>✅ Pointer l'entrée</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedContainer}>
              <Text style={styles.completedText}>✓ Pointage terminé pour aujourd'hui</Text>
              <Text style={styles.completedTime}>
                {todayAttendance.total_hours}h travaillées
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statLabel}>Heures ce mois</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statLabel}>Retards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.leave_balance || 0}</Text>
          <Text style={styles.statLabel}>Jours congés</Text>
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Mon historique</Text>
            <Text style={styles.actionSubtitle}>Voir mes pointages</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Leaves')}
        >
          <Text style={styles.actionIcon}>🏖️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Mes congés</Text>
            <Text style={styles.actionSubtitle}>Demandes et solde</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: colors.white,
  },
  clockContainer: {
    padding: 20,
    marginTop: -30,
  },
  clockCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  currentTime: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary,
  },
  currentDate: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  clockButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 24,
    minWidth: 250,
    alignItems: 'center',
  },
  clockButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  loader: {
    marginTop: 24,
  },
  completedContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: colors.success,
    fontWeight: '600',
  },
  completedTime: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.gray[300],
  },
});

export default HomeScreen;

