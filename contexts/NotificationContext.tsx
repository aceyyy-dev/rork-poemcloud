import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';
import { getTodaysPoem } from '@/mocks/poems';

const NOTIFICATION_STORAGE_KEY = 'poemcloud_notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPreferences {
  dailyPushEnabled: boolean;
  dailyEmailEnabled: boolean;
  dailySmsEnabled: boolean;
  emailAddress: string;
  phoneNumber: string;
  notificationTime: string;
}

const defaultPreferences: NotificationPreferences = {
  dailyPushEnabled: false,
  dailyEmailEnabled: false,
  dailySmsEnabled: false,
  emailAddress: '',
  phoneNumber: '',
  notificationTime: '08:00',
};

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [pushPermissionGranted, setPushPermissionGranted] = useState(false);
  const [smsAvailable, setSmsAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS !== 'web') {
      const smsCheck = await SMS.isAvailableAsync();
      setSmsAvailable(smsCheck);
      console.log('[Notifications] SMS available:', smsCheck);
    }
    
    const emailCheck = await MailComposer.isAvailableAsync();
    setEmailAvailable(emailCheck);
    console.log('[Notifications] Email available:', emailCheck);

    if (Platform.OS !== 'web') {
      const { status } = await Notifications.getPermissionsAsync();
      setPushPermissionGranted(status === 'granted');
      console.log('[Notifications] Push permission status:', status);
    }
  };

  const preferencesQuery = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
      return defaultPreferences;
    },
  });

  useEffect(() => {
    if (preferencesQuery.data) {
      setPreferences(preferencesQuery.data);
    }
  }, [preferencesQuery.data]);

  const { mutate: savePreferences } = useMutation({
    mutationFn: async (prefs: NotificationPreferences) => {
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs));
      return prefs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });

  const requestPushPermission = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Push notifications are not available on web.');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive daily poems.'
      );
      return false;
    }

    setPushPermissionGranted(true);
    console.log('[Notifications] Push permission granted');
    return true;
  }, []);

  const scheduleDailyNotification = useCallback(async () => {
    if (Platform.OS === 'web') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!preferences.dailyPushEnabled || !pushPermissionGranted) return;

    const [hours, minutes] = preferences.notificationTime.split(':').map(Number);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your Daily Poem',
        body: 'A new poem is waiting for you. Tap to read.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });

    console.log('[Notifications] Daily notification scheduled at', preferences.notificationTime);
  }, [preferences.dailyPushEnabled, preferences.notificationTime, pushPermissionGranted]);

  useEffect(() => {
    if (preferences.dailyPushEnabled && pushPermissionGranted) {
      scheduleDailyNotification();
    }
  }, [preferences.dailyPushEnabled, pushPermissionGranted, scheduleDailyNotification]);

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  const toggleDailyPush = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPushPermission();
      if (!granted) return;
    } else {
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }
    updatePreferences({ dailyPushEnabled: enabled });
  }, [requestPushPermission, updatePreferences]);

  const toggleDailyEmail = useCallback((enabled: boolean) => {
    if (enabled && !preferences.emailAddress) {
      Alert.alert(
        'Email Required',
        'Please enter your email address first.',
        [{ text: 'OK' }]
      );
      return;
    }
    updatePreferences({ dailyEmailEnabled: enabled });
  }, [preferences.emailAddress, updatePreferences]);

  const toggleDailySms = useCallback((enabled: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'SMS is not available on web.');
      return;
    }
    if (!smsAvailable) {
      Alert.alert('Not Available', 'SMS is not available on this device.');
      return;
    }
    if (enabled && !preferences.phoneNumber) {
      Alert.alert(
        'Phone Number Required',
        'Please enter your phone number first.',
        [{ text: 'OK' }]
      );
      return;
    }
    updatePreferences({ dailySmsEnabled: enabled });
  }, [smsAvailable, preferences.phoneNumber, updatePreferences]);

  const sendDailyPoemEmail = useCallback(async () => {
    if (!emailAvailable) {
      console.log('[Notifications] Email not available');
      return;
    }

    const poem = getTodaysPoem();
    
    await MailComposer.composeAsync({
      recipients: [preferences.emailAddress],
      subject: `Your Daily Poem: ${poem.title}`,
      body: `
${poem.title}
by ${poem.poet.name}

${poem.text}

---
Sent from PoemCloud
      `.trim(),
    });

    console.log('[Notifications] Daily poem email sent');
  }, [emailAvailable, preferences.emailAddress]);

  const sendDailyPoemSms = useCallback(async () => {
    if (Platform.OS === 'web' || !smsAvailable) {
      console.log('[Notifications] SMS not available');
      return;
    }

    const poem = getTodaysPoem();
    
    await SMS.sendSMSAsync(
      [preferences.phoneNumber],
      `Your Daily Poem: "${poem.title}" by ${poem.poet.name}\n\n${poem.text.substring(0, 300)}...\n\n- PoemCloud`
    );

    console.log('[Notifications] Daily poem SMS sent');
  }, [smsAvailable, preferences.phoneNumber]);

  const setEmailAddress = useCallback((email: string) => {
    updatePreferences({ emailAddress: email });
  }, [updatePreferences]);

  const setPhoneNumber = useCallback((phone: string) => {
    updatePreferences({ phoneNumber: phone });
  }, [updatePreferences]);

  const setNotificationTime = useCallback((time: string) => {
    updatePreferences({ notificationTime: time });
  }, [updatePreferences]);

  return {
    preferences,
    pushPermissionGranted,
    smsAvailable,
    emailAvailable,
    toggleDailyPush,
    toggleDailyEmail,
    toggleDailySms,
    setEmailAddress,
    setPhoneNumber,
    setNotificationTime,
    sendDailyPoemEmail,
    sendDailyPoemSms,
    requestPushPermission,
    isLoading: preferencesQuery.isLoading,
  };
});
