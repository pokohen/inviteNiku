import { BasicJapaneseTest } from './BasicJapaneseTest.tsx';
import { SpecialTest } from './SpecialTest.tsx';

interface JapaneseTestProps {
  type: 'hiragana' | 'katakana' | 'special';
  questionCount: number; // 0이면 전체 문제
  timeAttack: boolean;
  onBackToSelect: () => void;
}

export function JapaneseTest({ type, questionCount, timeAttack, onBackToSelect }: JapaneseTestProps) {
  if (type === 'special') {
    return <SpecialTest questionCount={questionCount} onBackToSelect={onBackToSelect} />;
  }

  return <BasicJapaneseTest type={type} questionCount={questionCount} timeAttack={timeAttack} onBackToSelect={onBackToSelect} />;
}