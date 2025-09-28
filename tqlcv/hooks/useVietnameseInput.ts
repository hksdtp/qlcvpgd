import { useState, useCallback } from 'react';

interface VietnameseInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const useVietnameseInput = ({ value, onChange, onKeyDown }: VietnameseInputProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const [compositionValue, setCompositionValue] = useState('');

  const handleCompositionStart = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsComposing(true);
    setCompositionValue(e.currentTarget.value);
  }, []);

  const handleCompositionUpdate = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompositionValue(e.currentTarget.value);
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsComposing(false);
    setCompositionValue('');
    // Ensure the final value is properly set
    onChange(e.currentTarget.value);
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // If we're composing Vietnamese characters, don't update immediately
    if (isComposing) {
      setCompositionValue(newValue);
      return;
    }
    
    onChange(newValue);
  }, [isComposing, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Don't interfere with Vietnamese composition
    if (isComposing) {
      return;
    }
    
    // Call the original onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  }, [isComposing, onKeyDown]);

  return {
    value: isComposing ? compositionValue : value,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onCompositionStart: handleCompositionStart,
    onCompositionUpdate: handleCompositionUpdate,
    onCompositionEnd: handleCompositionEnd,
    // Don't pass isComposing to DOM - it's for internal use only
  };
};
