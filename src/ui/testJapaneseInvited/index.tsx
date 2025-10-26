import { useState, useEffect } from 'react';
import { SelectPage } from '@/ui/testJapaneseInvited/SelectPage.tsx';
import { JapaneseTest } from '@/ui/testJapaneseInvited/JapaneseTest.tsx';
import { QuestionCountSelect } from '@/ui/testJapaneseInvited/QuestionCountSelect.tsx';

export const TestJapaneseInvited = () => {
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana' | 'special' | null>(null);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | null>(null);
  const [isTimeAttack, setIsTimeAttack] = useState<boolean>(false);

  useEffect(() => {
    const savedType = localStorage.getItem('japanese-test-type');
    const savedCount = localStorage.getItem('japanese-test-count');
    const savedTimeAttack = localStorage.getItem('japanese-test-time-attack');

    if (savedType === 'hiragana' || savedType === 'katakana' || savedType === 'special') {
      setSelectedType(savedType);
      if (savedType === 'special') {
        setSelectedQuestionCount(0); // special은 항상 전체 문제
        setIsTimeAttack(false); // special은 타임어택 없음
      } else if (savedCount) {
        setSelectedQuestionCount(parseInt(savedCount));
        setIsTimeAttack(savedTimeAttack === 'true');
      }
    }
  }, []);

  const handleTypeSelect = (type: 'hiragana' | 'katakana' | 'special') => {
    setSelectedType(type);
    localStorage.setItem('japanese-test-type', type);

    if (type === 'special') {
      setSelectedQuestionCount(0); // special은 항상 전체 문제
      setIsTimeAttack(false); // special은 타임어택 없음
      localStorage.setItem('japanese-test-count', '0');
      localStorage.setItem('japanese-test-time-attack', 'false');
    } else {
      setSelectedQuestionCount(null); // 문제 수 선택 화면으로
      setIsTimeAttack(false);
    }
  };

  const handleQuestionCountSelect = (count: number, timeAttack: boolean) => {
    setSelectedQuestionCount(count);
    setIsTimeAttack(timeAttack);
    localStorage.setItem('japanese-test-count', count.toString());
    localStorage.setItem('japanese-test-time-attack', timeAttack.toString());
  };

  const handleBackToSelect = () => {
    setSelectedType(null);
    setSelectedQuestionCount(null);
    setIsTimeAttack(false);
    localStorage.removeItem('japanese-test-type');
    localStorage.removeItem('japanese-test-count');
    localStorage.removeItem('japanese-test-time-attack');
  };

  // 테스트 시작 (타입과 문제 수 모두 선택됨)
  if (selectedType && selectedQuestionCount !== null) {
    return (
      <JapaneseTest
        type={selectedType}
        questionCount={selectedQuestionCount}
        timeAttack={isTimeAttack}
        onBackToSelect={handleBackToSelect}
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