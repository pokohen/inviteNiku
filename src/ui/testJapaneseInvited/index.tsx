import { useState, useEffect } from 'react';
import { SelectPage } from '@/ui/testJapaneseInvited/SelectPage';
import { JapaneseTest } from '@/ui/testJapaneseInvited/JapaneseTest';
import { QuestionCountSelect } from '@/ui/testJapaneseInvited/QuestionCountSelect';

export const TestJapaneseInvited = () => {
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana' | 'special' | null>(null);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    const savedType = localStorage.getItem('japanese-test-type');
    const savedCount = localStorage.getItem('japanese-test-count');

    if (savedType === 'hiragana' || savedType === 'katakana' || savedType === 'special') {
      setSelectedType(savedType);
      if (savedType === 'special') {
        setSelectedQuestionCount(0); // special은 항상 전체 문제
      } else if (savedCount) {
        setSelectedQuestionCount(parseInt(savedCount));
      }
    }
  }, []);

  const handleTypeSelect = (type: 'hiragana' | 'katakana' | 'special') => {
    setSelectedType(type);
    localStorage.setItem('japanese-test-type', type);

    if (type === 'special') {
      setSelectedQuestionCount(0); // special은 항상 전체 문제
      localStorage.setItem('japanese-test-count', '0');
    } else {
      setSelectedQuestionCount(null); // 문제 수 선택 화면으로
    }
  };

  const handleQuestionCountSelect = (count: number) => {
    setSelectedQuestionCount(count);
    localStorage.setItem('japanese-test-count', count.toString());
  };

  const handleBackToSelect = () => {
    setSelectedType(null);
    setSelectedQuestionCount(null);
    localStorage.removeItem('japanese-test-type');
    localStorage.removeItem('japanese-test-count');
  };

  const handleBackToQuestionCount = () => {
    setSelectedQuestionCount(null);
    localStorage.removeItem('japanese-test-count');
  };

  // 테스트 시작 (타입과 문제 수 모두 선택됨)
  if (selectedType && selectedQuestionCount !== null) {
    return (
      <JapaneseTest
        type={selectedType}
        questionCount={selectedQuestionCount}
        onBackToSelect={selectedType === 'special' ? handleBackToSelect : handleBackToQuestionCount}
      />
    );
  }

  // 문제 수 선택 화면 (hiragana 또는 katakana 선택 후)
  if (selectedType && selectedType !== 'special') {
    return (
      <QuestionCountSelect
        testType={selectedType}
        onQuestionCountSelect={handleQuestionCountSelect}
        onBackToSelect={handleBackToSelect}
      />
    );
  }

  // 초기 선택 화면
  return <SelectPage onTypeSelect={handleTypeSelect} />;
};