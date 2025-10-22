import { BasicJapaneseTest } from './BasicJapaneseTest';
import { SpecialTest } from './SpecialTest';

interface JapaneseTestProps {
  type: 'hiragana' | 'katakana' | 'special';
  questionCount: number; // 0이면 전체 문제
  onBackToSelect: () => void;
}

export function JapaneseTest({ type, questionCount, onBackToSelect }: JapaneseTestProps) {
  if (type === 'special') {
    return <SpecialTest questionCount={questionCount} onBackToSelect={onBackToSelect} />;
  }

  return <BasicJapaneseTest type={type} questionCount={questionCount} onBackToSelect={onBackToSelect} />;
}