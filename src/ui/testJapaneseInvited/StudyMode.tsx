import { useState } from 'react';
import { VocabularyWord } from './MyVocabulary.tsx';

interface StudyModeProps {
  words: VocabularyWord[];
  onBack: () => void;
}

export const StudyMode = ({ words, onBack }: StudyModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (words.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px'
      }}>
        <h2>학습할 단어가 없습니다</h2>
        <button onClick={onBack} style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          돌아가기
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

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
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontSize: '16px',
        color: '#666'
      }}>
        {currentIndex + 1} / {words.length}
      </div>

      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        📖 학습 모드
      </h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRadius: '16px',
        textAlign: 'center',
        minWidth: '400px',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: '2px solid #dee2e6'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {currentWord.japanese}
        </div>

        {currentWord.yomikana && (
          <div style={{
            fontSize: '20px',
            color: '#666',
            marginBottom: '20px',
            fontStyle: 'italic'
          }}>
            ({currentWord.yomikana})
          </div>
        )}

        <div style={{
          fontSize: '24px',
          color: showAnswer ? '#28a745' : '#transparent',
          fontWeight: '600',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: showAnswer ? '#d4edda' : '#fff',
          border: showAnswer ? '2px solid #c3e6cb' : '2px dashed #dee2e6',
          borderRadius: '8px',
          padding: '15px',
          transition: 'all 0.3s ease'
        }}>
          {showAnswer ? currentWord.korean : '답을 보려면 클릭하세요'}
        </div>

        <button
          onClick={toggleAnswer}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: showAnswer ? '#dc3545' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = showAnswer ? '#c82333' : '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = showAnswer ? '#dc3545' : '#007bff';
          }}
        >
          {showAnswer ? '답 숨기기' : '답 보기'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <button
          onClick={handlePrevious}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← 이전
        </button>

        <div style={{
          padding: '8px 16px',
          backgroundColor: '#e9ecef',
          borderRadius: '20px',
          fontSize: '14px',
          color: '#495057'
        }}>
          {currentIndex + 1} / {words.length}
        </div>

        <button
          onClick={handleNext}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          다음 →
        </button>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#856404'
        }}>
          💡 충분히 학습한 후 테스트 모드에서 실력을 확인해보세요!
        </p>
      </div>

      <button
        onClick={onBack}
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
        단어장으로 돌아가기
      </button>
    </div>
  );
};