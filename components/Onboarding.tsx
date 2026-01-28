import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';
import OnboardingScreen4 from './OnboardingScreen4';
import { Mood } from '@/types';

interface Props {
  onComplete: (preferences: {
    moods: Mood[];
    countries: string[];
    isPremium: boolean;
  }) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<{
    moods: Mood[];
    countries: string[];
  }>({
    moods: [],
    countries: [],
  });

  const handleScreen2Complete = (prefs: {
    moods: Mood[];
    countries: string[];
  }) => {
    setPreferences(prefs);
    setStep(2);
  };

  const handleSubscribe = () => {
    onComplete({ ...preferences, isPremium: true });
  };

  const handleSkip = () => {
    onComplete({ ...preferences, isPremium: false });
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      {step === 0 && <OnboardingScreen1 onNext={() => setStep(1)} />}
      {step === 1 && (
        <OnboardingScreen2 onNext={handleScreen2Complete} onBack={handleBack} />
      )}
      {step === 2 && (
        <OnboardingScreen3 onNext={() => setStep(3)} onBack={handleBack} />
      )}
      {step === 3 && (
        <OnboardingScreen4
          onSubscribe={handleSubscribe}
          onSkip={handleSkip}
          onBack={handleBack}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
