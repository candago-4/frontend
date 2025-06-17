import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useDevices } from '@/contexts/DeviceContext';
import { DashboardMetrics, dashboardService } from '@/services/dashboardService';
import { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Platform,
  Share,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DeviceMetrics {
  deviceId: string;
  deviceName: string;
  metrics: DashboardMetrics;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const { devices, isLoading, error, fetchDevices } = useDevices();
  
  // State for date filters
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  // State for metrics
  const [allDeviceMetrics, setAllDeviceMetrics] = useState<DeviceMetrics[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Debug info
  console.log('Dashboard Screen - Devices:', devices.length);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      fetchAllDeviceMetrics();
    }
  }, [devices, startDate, endDate]);

  const fetchAllDeviceMetrics = async () => {
    if (devices.length === 0) return;

    setIsLoadingMetrics(true);
    try {
      const metricsPromises = devices.map(async (device) => {
        try {
          const metrics = await dashboardService.getMetrics(device.id, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });
          return {
            deviceId: device.id,
            deviceName: device.name,
            metrics,
          };
        } catch (error) {
          console.error(`Error fetching metrics for device ${device.id}:`, error);
          return {
            deviceId: device.id,
            deviceName: device.name,
            metrics: {
              metrosPercorridos: 0,
              mediaMetrosDia: 0,
              mediaVelocidade: 0,
              downTimeProbability: 0,
            },
          };
        }
      });

      const results = await Promise.all(metricsPromises);
      setAllDeviceMetrics(results);
    } catch (error) {
      console.error('Error fetching all device metrics:', error);
      Alert.alert('Error', 'Failed to fetch device metrics. Please try again later.');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleWebDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const exportToCSV = async () => {
    if (allDeviceMetrics.length === 0) {
      Alert.alert('No Data', 'No data available to export.');
      return;
    }

    setIsExporting(true);
    try {
      // Create CSV content
      const csvHeaders = [
        'Device ID',
        'Device Name',
        'Metros Percorridos',
        'Media de Metros/Dia',
        'Media de Velocidade',
        'Probabilidade de Down Time (%)',
        'Periodo Inicio',
        'Periodo Fim'
      ].join(',');

      const csvRows = allDeviceMetrics.map(deviceMetric => [
        deviceMetric.deviceId,
        deviceMetric.deviceName,
        deviceMetric.metrics.metrosPercorridos,
        deviceMetric.metrics.mediaMetrosDia,
        deviceMetric.metrics.mediaVelocidade,
        (deviceMetric.metrics.downTimeProbability * 100).toFixed(2),
        formatDate(startDate),
        formatDate(endDate)
      ].join(','));

      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const fileName = `lyncharea_dashboard_${formatDate(startDate)}_${formatDate(endDate)}.csv`;

      // Share the CSV content
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        // For mobile, use Share API
        await Share.share({
          message: csvContent,
          title: fileName,
        });
      }

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderMetricCard = (label: string, value: number | string, isRed?: boolean) => (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, isRed && styles.redValue]}>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const renderDeviceMetrics = (deviceMetric: DeviceMetrics) => (
    <View key={deviceMetric.deviceId} style={styles.deviceCard}>
      <Text style={styles.deviceName}>{deviceMetric.deviceName}</Text>
      <Text style={styles.deviceId}>ID: {deviceMetric.deviceId}</Text>
      
      <View style={styles.metricsGrid}>
        {renderMetricCard('Metros Percorridos', deviceMetric.metrics.metrosPercorridos)}
        {renderMetricCard('Media de Metros/Dia', deviceMetric.metrics.mediaMetrosDia)}
        {renderMetricCard('Media de Velocidade', deviceMetric.metrics.mediaVelocidade)}
        {renderMetricCard('Probabilidade de Down Time', 
          `${(deviceMetric.metrics.downTimeProbability * 100).toFixed(1)}%`, 
          true
        )}
      </View>
    </View>
  );

  const renderDateInput = (type: 'start' | 'end', date: Date, label: string) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.dateInput}>
          <Text style={styles.dateLabel}>{label}</Text>
          <input
            style={{
              backgroundColor: '#242038',
              border: '1px solid #9747FF',
              borderRadius: '8px',
              padding: '12px',
              color: '#F7ECE1',
              fontFamily: 'SpaceMono',
              fontSize: 14,
            }}
            type="date"
            value={formatDateForInput(date)}
            onChange={(e) => handleWebDateChange(type, e.target.value)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.dateInput}>
          <Text style={styles.dateLabel}>{label}</Text>
          <Pressable 
            style={styles.dateButton}
            onPress={() => type === 'start' ? setShowStartPicker(true) : setShowEndPicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
            <TabBarIcon name="calendar-today" color="#9747FF" size={20} />
          </Pressable>
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Loading Dashboard...</Text>
          <ActivityIndicator size="large" color="#9747FF" />
        </Container>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={fetchDevices}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </Container>
      </View>
    );
  }

  if (devices.length === 0) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>No Devices Found</Text>
          <Text style={styles.noDevicesText}>
            Add devices to start viewing dashboard metrics.
          </Text>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>

        {/* Date Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filtros de Período</Text>
          
          <View style={styles.dateRow}>
            {renderDateInput('start', startDate, 'Data Início')}
            {renderDateInput('end', endDate, 'Data Fim')}
          </View>

          <Pressable 
            style={styles.refreshButton}
            onPress={fetchAllDeviceMetrics}
            disabled={isLoadingMetrics}
          >
            <Text style={styles.refreshButtonText}>
              {isLoadingMetrics ? 'Atualizando...' : 'Atualizar Dados'}
            </Text>
          </Pressable>
        </View>

        {/* Export Button */}
        <Pressable 
          style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
          onPress={exportToCSV}
          disabled={isExporting || allDeviceMetrics.length === 0}
        >
          <Text style={styles.exportButtonText}>
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </Text>
        </Pressable>

        {/* Metrics Display */}
        <ScrollView style={styles.metricsScrollView} showsVerticalScrollIndicator={false}>
          {isLoadingMetrics ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9747FF" />
              <Text style={styles.loadingText}>Carregando métricas...</Text>
            </View>
          ) : allDeviceMetrics.length > 0 ? (
            <View style={styles.devicesContainer}>
              {allDeviceMetrics.map(renderDeviceMetrics)}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Nenhum dado disponível para o período selecionado</Text>
            </View>
          )}
        </ScrollView>

        {/* Date Pickers - Only for mobile */}
        {Platform.OS !== 'web' && showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            maximumDate={endDate}
          />
        )}
        
        {Platform.OS !== 'web' && showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
            maximumDate={new Date()}
          />
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 16,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    opacity: 0.8,
  },
  filtersContainer: {
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#242038',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
  },
  refreshButton: {
    backgroundColor: '#9747FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#28A745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  metricsScrollView: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginTop: 12,
  },
  devicesContainer: {
    gap: 16,
  },
  deviceCard: {
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 14,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#242038',
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9747FF',
    fontFamily: 'SpaceMono',
  },
  redValue: {
    color: '#F04438',
  },
  metricLabel: {
    fontSize: 12,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 4,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.7,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#9747FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  noDevicesText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 16,
  },
}); 