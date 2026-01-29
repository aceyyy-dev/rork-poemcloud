import React, { useState, useCallback } from 'react';
import { usePurchases } from '@/contexts/PurchasesContext';
import PremiumModal from '@/components/PremiumModal';

export type PremiumFeature = 'translate' | 'listen' | 'unlimited_bookmarks' | 'offline';

const FEATURE_LABELS: Record<PremiumFeature, string> = {
  translate: 'Translate poems',
  listen: 'Listen to poems',
  unlimited_bookmarks: 'Save unlimited poems',
  offline: 'Offline reading',
};

interface UsePremiumGateResult {
  requirePremium: (feature: PremiumFeature, onPremiumAction: () => void) => void;
  PremiumGateModal: React.FC;
}

export function usePremiumGate(): UsePremiumGateResult {
  const { isPremium } = usePurchases();
  const [showModal, setShowModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<PremiumFeature | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requirePremium = useCallback((feature: PremiumFeature, onPremiumAction: () => void) => {
    console.log('[PremiumGate] Checking premium for feature:', feature);
    console.log('[PremiumGate] isPremium:', isPremium);
    
    if (isPremium) {
      console.log('[PremiumGate] User is premium, executing action');
      onPremiumAction();
    } else {
      console.log('[PremiumGate] User is not premium, showing modal');
      setCurrentFeature(feature);
      setPendingAction(() => onPremiumAction);
      setShowModal(true);
    }
  }, [isPremium]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setCurrentFeature(null);
    setPendingAction(null);
  }, []);

  const handleSubscribe = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    handleClose();
  }, [pendingAction, handleClose]);

  const PremiumGateModal: React.FC = useCallback(() => (
    <PremiumModal
      visible={showModal}
      onClose={handleClose}
      onSubscribe={handleSubscribe}
      feature={currentFeature ? FEATURE_LABELS[currentFeature] : undefined}
    />
  ), [showModal, handleClose, handleSubscribe, currentFeature]);

  return {
    requirePremium,
    PremiumGateModal,
  };
}

interface PremiumActionButtonProps {
  feature: PremiumFeature;
  onAction: () => void;
  children: React.ReactNode;
}

export function PremiumActionButton({ feature, onAction, children }: PremiumActionButtonProps) {
  const { requirePremium, PremiumGateModal } = usePremiumGate();

  const handlePress = useCallback(() => {
    requirePremium(feature, onAction);
  }, [requirePremium, feature, onAction]);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, { onPress: handlePress })}
      <PremiumGateModal />
    </>
  );
}
