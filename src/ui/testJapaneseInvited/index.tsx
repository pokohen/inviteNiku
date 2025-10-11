import { useState, useEffect } from 'react';
import { SelectPage } from '@/ui/testJapaneseInvited/SelectPage';
import { JapaneseTest } from '@/ui/testJapaneseInvited/JapaneseTest';

export const TestJapaneseInvited = () => {
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana' | 'special' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('japanese-test-type');
    if (saved === 'hiragana' || saved === 'katakana' || saved === 'special') {
      setSelectedType(saved);
    }
  }, []);

  const handleTypeSelect = (type: 'hiragana' | 'katakana' | 'special') => {
    setSelectedType(type);
    localStorage.setItem('japanese-test-type', type);
  };

  const handleBackToSelect = () => {
    setSelectedType(null);
    localStorage.removeItem('japanese-test-type');
  };

  if (selectedType) {
    return <JapaneseTest type={selectedType} onBackToSelect={handleBackToSelect} />;
  }

  return <SelectPage onTypeSelect={handleTypeSelect} />;
};