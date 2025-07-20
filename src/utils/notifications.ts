// Utility functions for haptic feedback and sound notifications

/**
 * Triggers device vibration if supported
 */
export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Triggers a warning vibration pattern
 */
export const vibrateWarning = () => {
  vibrate([100, 50, 100]); // Short-pause-short pattern
};

/**
 * Triggers a time-up vibration pattern
 */
export const vibrateTimeUp = () => {
  vibrate([200, 100, 200, 100, 200]); // Long vibration pattern
};

/**
 * Plays a beep sound using Web Audio API
 */
export const playBeep = (frequency: number = 800, duration: number = 200, volume: number = 0.3) => {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Configure volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    // Start and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    // Clean up
    setTimeout(() => {
      try {
        audioContext.close();
      } catch (e) {
        // Ignore cleanup errors
      }
    }, duration + 100);
  } catch (error) {
    console.warn('Could not play beep sound:', error);
    // Fallback: try to trigger default system sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+Tvum4fCz2P1O/MeSs=');
      audio.volume = volume;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (fallbackError) {
      // Completely silent fallback
    }
  }
};

/**
 * Plays a warning beep sound
 */
export const playWarningSound = () => {
  playBeep(600, 150, 0.2);
};

/**
 * Plays a time-up sound sequence
 */
export const playTimeUpSound = () => {
  playBeep(400, 300, 0.4);
  setTimeout(() => playBeep(500, 300, 0.4), 150);
  setTimeout(() => playBeep(600, 400, 0.4), 300);
};

/**
 * Request permission for notifications (if needed in the future)
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};