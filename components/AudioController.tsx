import React, { useEffect, useRef } from 'react';

interface AudioControllerProps {
  playGhostVoiceBuffer?: AudioBuffer | null;
  isSpooky: boolean;
}

const AudioController: React.FC<AudioControllerProps> = ({ playGhostVoiceBuffer, isSpooky }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const ghostSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    const initAudio = () => {
       if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
       }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  // Play Ghost Voice
  useEffect(() => {
    if (playGhostVoiceBuffer && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Stop previous if playing
      if (ghostSourceRef.current) {
        try { ghostSourceRef.current.stop(); } catch(e) {}
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = playGhostVoiceBuffer;
      
      // Add reverb/delay effect node chain for "Ghostly" sound
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 1.5; // Louder
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start();
      ghostSourceRef.current = source;
    }
  }, [playGhostVoiceBuffer]);

  return null; // Invisible component
};

export default AudioController;