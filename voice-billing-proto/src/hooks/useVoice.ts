import { useState, useEffect, useCallback, useMemo } from 'react';

export const useVoice = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = useMemo(() => {
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'hi-IN'; // Default to Hindi
            return rec;
        }
        return null;
    }, []);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            // Handle multiple results if continuous
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                finalTranscript += event.results[i][0].transcript;
            }
            onResult(finalTranscript);
        };

        recognition.onerror = (event: any) => {
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }, [onResult]);

    const startListening = useCallback(() => {
        if (!recognition) {
            setError('Speech recognition not supported');
            return;
        }
        setError(null);
        setIsListening(true);
        recognition.start();
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (!recognition) return;
        recognition.stop();
        setIsListening(false);
    }, [recognition]);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'hi-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    return { isListening, error, startListening, stopListening, speak };
};
