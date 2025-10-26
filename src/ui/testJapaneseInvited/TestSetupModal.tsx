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
      height: '100vh',
      gap: '30px',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
        📚 테스트 설정
      </h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '16px',
        border: '2px solid #dee2e6',
        minWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>문제 수 선택</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {questionOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: selectedQuestionCount === option.value ? '#e3f2fd' : '#fff',
                  border: selectedQuestionCount === option.value ? '2px solid #2196f3' : '1px solid #ddd',
                  borderRadius: '8px',
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
                  style={{ marginRight: '10px' }}
                />
                <span style={{ fontSize: '16px' }}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>모드 선택</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>일반 모드</div>
                <div style={{ fontSize: '12px', color: '#666' }}>시간 제한 없이 천천히 풀어보세요</div>
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
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>⏰ 타임어택 모드</div>
                <div style={{ fontSize: '12px', color: '#666' }}>문제당 5초의 시간 제한이 있습니다</div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={() => onStartTest(selectedQuestionCount, timeAttack)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
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
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        돌아가기
      </button>
    </div>
  );
};