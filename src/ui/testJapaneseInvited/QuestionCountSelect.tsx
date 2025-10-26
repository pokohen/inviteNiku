import { useState } from 'react';
import { Modal } from '@/ui/common/Modal.tsx';

interface QuestionCountSelectProps {
  testType: 'hiragana' | 'katakana';
  onQuestionCountSelect: (count: number, timeAttack: boolean) => void;
  onBackToSelect: () => void;
}

export const QuestionCountSelect = ({ testType, onQuestionCountSelect, onBackToSelect }: QuestionCountSelectProps) => {
  const testTitle = testType === 'hiragana' ? '히라가나' : '가타카나';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const handleQuestionCountClick = (count: number) => {
    setSelectedCount(count);
    setIsModalOpen(true);
  };

  const handleTimeAttackSelect = (timeAttack: boolean) => {
    setIsModalOpen(false);
    onQuestionCountSelect(selectedCount, timeAttack);
  };

  const QuestionButton = ({ count, label, color, hoverColor }: { count: number; label: string; color: string; hoverColor: string }) => (
    <button
      onClick={() => handleQuestionCountClick(count)}
      style={{
        padding: '20px 40px',
        fontSize: '20px',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        minWidth: '300px',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = color}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '30px'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        {testTitle} 테스트
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        문제 수를 선택해주세요
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <QuestionButton
          count={20}
          label="20문제"
          color="#007bff"
          hoverColor="#0056b3"
        />
        <QuestionButton
          count={40}
          label="40문제"
          color="#28a745"
          hoverColor="#1e7e34"
        />
        <QuestionButton
          count={0}
          label="전체 문제 (Full)"
          color="#dc3545"
          hoverColor="#c82333"
        />
      </div>

      <button
        onClick={onBackToSelect}
        style={{
          marginTop: '20px',
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="테스트 모드 선택"
        width="500px"
      >
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            {selectedCount === 0 ? '전체 문제' : `${selectedCount}문제`}를 선택하셨습니다
          </h3>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>📝 일반 모드</h4>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              • 시간 제한 없이 천천히 문제를 풀 수 있습니다<br/>
              • 충분히 생각하고 답을 선택할 수 있습니다<br/>
              • 학습에 집중하고 싶을 때 추천합니다
            </p>

            <h4 style={{ color: '#ff6b6b', marginBottom: '15px' }}>⏰ 타임어택 모드</h4>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
              • 각 문제당 <strong style={{ color: '#ff6b6b' }}>5초</strong>의 제한시간이 있습니다<br/>
              • 시간이 끝나면 자동으로 다음 문제로 넘어갑니다<br/>
              • 빠른 반응속도와 집중력을 기를 수 있습니다<br/>
              • 실력 테스트를 하고 싶을 때 추천합니다
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => handleTimeAttackSelect(false)}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: '150px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              📝 일반 모드
            </button>

            <button
              onClick={() => handleTimeAttackSelect(true)}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: '150px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55757'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
            >
              ⏰ 타임어택
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};