import { useState } from 'react';
import { VocabularyWord } from './MyVocabulary.tsx';

interface TestSetupModalProps {
  words: VocabularyWord[];
  onBack: () => void;
  onStartTest: (questionCount: number, timeAttack: boolean) => void;
}

export const TestSetupModal = ({ words, onBack, onStartTest }: TestSetupModalProps) => {
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const [timeAttack, setTimeAttack] = useState(false);

  const questionOptions = [
    { value: 0, label: `전체 문제 (${words.length}개)` },
    { value: 10, label: '10문제' },
    { value: 20, label: '20문제' },
    { value: 30, label: '30문제' },
    { value: 50, label: '50문제' }
  ].filter(option => option.value === 0 || option.value <= words.length);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      gap: 'clamp(20px, 6vw, 30px)',
      padding: 'clamp(16px, 5vw, 20px)',
      overflowX: 'hidden'
    }}>
      <h1 style={{ fontSize: 'clamp(20px, 6vw, 28px)', marginBottom: 'clamp(16px, 5vw, 20px)', lineHeight: '1.3', textAlign: 'center' }}>
        📚 테스트 설정
      </h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(20px, 6vw, 30px)',
        borderRadius: 'clamp(12px, 4vw, 16px)',
        border: '2px solid #dee2e6',
        width: '100%',
        maxWidth: 'min(400px, 90vw)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: 'clamp(20px, 6vw, 30px)' }}>
          <h3 style={{ marginBottom: 'clamp(12px, 4vw, 15px)', color: '#333', fontSize: 'clamp(16px, 4.5vw, 18px)' }}>문제 수 선택</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2.5vw, 10px)' }}>
            {questionOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'clamp(10px, 3vw, 12px)',
                  minHeight: 'clamp(44px, 11vw, 48px)',
                  backgroundColor: selectedQuestionCount === option.value ? '#e3f2fd' : '#fff',
                  border: selectedQuestionCount === option.value ? '2px solid #2196f3' : '1px solid #ddd',
                  borderRadius: 'clamp(6px, 2vw, 8px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="questionCount"
                  value={option.value}
                  checked={selectedQuestionCount === option.value}
                  onChange={(e) => setSelectedQuestionCount(Number(e.target.value))}
                  style={{ marginRight: 'clamp(8px, 2.5vw, 10px)' }}
                />
                <span style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 'clamp(20px, 6vw, 30px)' }}>
          <h3 style={{ marginBottom: 'clamp(12px, 4vw, 15px)', color: '#333', fontSize: 'clamp(16px, 4.5vw, 18px)' }}>모드 선택</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2.5vw, 10px)' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: !timeAttack ? '#e8f5e8' : '#fff',
                border: !timeAttack ? '2px solid #4caf50' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="mode"
                checked={!timeAttack}
                onChange={() => setTimeAttack(false)}
                style={{ marginRight: '10px' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 'bold' }}>일반 모드</div>
                <div style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: '#666', lineHeight: '1.3' }}>시간 제한 없이 천천히 풀어보세요</div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: timeAttack ? '#fff3e0' : '#fff',
                border: timeAttack ? '2px solid #ff9800' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="mode"
                checked={timeAttack}
                onChange={() => setTimeAttack(true)}
                style={{ marginRight: '10px' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 'bold' }}>⏰ 타임어택 모드</div>
                <div style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: '#666', lineHeight: '1.3' }}>문제당 5초의 시간 제한이 있습니다</div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={() => onStartTest(selectedQuestionCount, timeAttack)}
          style={{
            width: '100%',
            padding: 'clamp(12px, 4vw, 15px)',
            fontSize: 'clamp(16px, 4.5vw, 18px)',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(6px, 2vw, 8px)',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            minHeight: 'clamp(48px, 12vw, 56px)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          테스트 시작하기
        </button>
      </div>

      <button
        onClick={onBack}
        style={{
          padding: 'clamp(8px, 2.5vw, 10px) clamp(16px, 5vw, 20px)',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1.5vw, 5px)',
          cursor: 'pointer',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          minHeight: 'clamp(40px, 10vw, 44px)'
        }}
      >
        돌아가기
      </button>
    </div>
  );
};