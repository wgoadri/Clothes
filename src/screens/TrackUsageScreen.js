import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { getDailyLogs, getTodayOutfit } from '../services/usageService';
import { getUsageMetrics } from '../services/statsService';
import ScreenLayout from '../components/ScreenLayout';

function Stars({ rating, size = 14 }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text key={n} style={{ fontSize: size }}>
          {n <= rating ? '⭐' : '☆'}
        </Text>
      ))}
    </View>
  );
}

function TodayWidget({ todayLog, onPress }) {
  if (todayLog) {
    const outfitName = todayLog.outfit?.name ?? todayLog.outfitName ?? null;
    return (
      <TouchableOpacity style={styles.todayCard} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.todayHeader}>
          <View style={styles.todayTitleRow}>
            <Ionicons name="calendar" size={18} color="#C9A07A" />
            <Text style={styles.todayTitle}>Today's Outfit</Text>
          </View>
          <MaterialIcons name="edit" size={16} color="#8B7355" />
        </View>
        <Text style={styles.todayOutfitName}>{outfitName ?? 'Unknown outfit'}</Text>
        {todayLog.rating > 0 && <Stars rating={todayLog.rating} size={16} />}
        {todayLog.notes ? (
          <Text style={styles.todayNotes} numberOfLines={2}>
            "{todayLog.notes}"
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.todayCardEmpty} onPress={onPress} activeOpacity={0.8}>
      <MaterialIcons name="checkroom" size={30} color="#C9A07A" />
      <Text style={styles.todayEmptyTitle}>Tap to log today's outfit</Text>
    </TouchableOpacity>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncate(str, max) {
  if (!str) return null;
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function TrackUsageScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayLog, setTodayLog] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const userId = auth.currentUser?.uid;

  const fetchData = useCallback(async () => {
    if (!userId) return;
    const [today, logs, stats] = await Promise.all([
      getTodayOutfit(userId),
      getDailyLogs(userId, 7),
      getUsageMetrics(userId),
    ]);
    setTodayLog(today);
    setRecentLogs(logs);
    setMetrics(stats);
  }, [userId]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const topItem = metrics?.wardrobe?.mostWornItems?.[0] ?? null;
  const topOutfit = metrics?.outfits?.mostWornOutfits?.[0] ?? null;

  return (
    <ScreenLayout
      navigation={navigation}
      title="Track Usage"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C9A07A" />
        </View>
      ) : (
        <>
          <TodayWidget
            todayLog={todayLog}
            onPress={() => navigation.navigate('DailyOutfitLogger')}
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={18} color="#C9A07A" />
              <Text style={styles.sectionTitle}>Recent Logs</Text>
            </View>

            {recentLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No logs yet. Start tracking your outfits!</Text>
              </View>
            ) : (
              <View style={styles.card}>
                {recentLogs.map((log, idx) => {
                  const name = log.outfitName ?? truncate(log.outfitId, 18) ?? '–';
                  return (
                    <View
                      key={log.id}
                      style={[styles.logRow, idx < recentLogs.length - 1 && styles.logRowBorder]}
                    >
                      <View style={styles.logLeft}>
                        <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                        <Text style={styles.logName}>{name}</Text>
                      </View>
                      {log.rating > 0 ? (
                        <Stars rating={log.rating} size={12} />
                      ) : (
                        <Text style={styles.noRating}>–</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bar-chart-outline" size={18} color="#C9A07A" />
              <Text style={styles.sectionTitle}>Stats Summary</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{metrics?.summary?.totalDays ?? 0}</Text>
                <Text style={styles.statLabel}>Days Logged</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{topOutfit?.wearCount ?? 0}</Text>
                <Text style={styles.statLabel}>Top Outfit Wears</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{topItem?.wearCount ?? 0}</Text>
                <Text style={styles.statLabel}>Top Item Wears</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Most worn item</Text>
                <Text style={styles.highlightValue}>
                  {topItem ? `${topItem.name} (${topItem.wearCount}x)` : 'No data'}
                </Text>
              </View>
              <View style={[styles.highlightRow, styles.highlightRowBorder]}>
                <Text style={styles.highlightLabel}>Most worn outfit</Text>
                <Text style={styles.highlightValue}>
                  {topOutfit ? `${topOutfit.name} (${topOutfit.wearCount}x)` : 'No data'}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  todayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  todayCardEmpty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8DED2',
    borderStyle: 'dashed',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  todayOutfitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B5B4D',
    marginBottom: 6,
  },
  todayNotes: {
    fontSize: 13,
    color: '#A89888',
    fontStyle: 'italic',
    marginTop: 6,
  },
  todayEmptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B7355',
    marginTop: 10,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B5B4D',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  logRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  logLeft: {
    flex: 1,
    marginRight: 8,
  },
  logDate: {
    fontSize: 11,
    color: '#A89888',
    marginBottom: 2,
  },
  logName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B5B4D',
  },
  noRating: {
    fontSize: 14,
    color: '#A89888',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#A89888',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#C9A07A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#8B7355',
    textAlign: 'center',
  },
  highlightRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  highlightRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0EBE3',
  },
  highlightLabel: {
    fontSize: 11,
    color: '#A89888',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  highlightValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B5B4D',
  },
});
