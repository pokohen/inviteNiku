import { useState, useEffect } from 'react';
import { VocabularyWord } from './MyVocabulary.tsx';

interface StudyModeProps {
  words: VocabularyWord[];
  onBack: () => void;
  onUpdateWord: (id: string, updates: Partial<VocabularyWord>) => void;
}

export const StudyMode = ({ words, onBack, onUpdateWord }: StudyModeProps) => {
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // 완료되지 않은 단어들만 필터링하고 랜덤 순서로 섞기
  useEffect(() => {
    const incompleteWords = words.filter(word => !word.completed);
    const shuffled = [...incompleteWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [words]);

  if (shuffledWords.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: 'clamp(16px, 5vw, 20px)',
        padding: 'clamp(16px, 5vw, 20px)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 'clamp(20px, 6vw, 24px)', lineHeight: '1.3' }}>학습할 단어가 없습니다</h2>
        <p style={{ color: '#666', marginBottom: 'clamp(16px, 5vw, 20px)', fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: '1.4' }}>모든 단어를 완료했거나 등록된 단어가 없습니다.</p>
        <button onClick={onBack} style={{
          padding: 'clamp(8px, 2.5vw, 10px) clamp(16px, 5vw, 20px)',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1.5vw, 5px)',
          cursor: 'pointer',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          minHeight: 'clamp(40px, 10vw, 44px)'
        }}>
          돌아가기
        </button>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length);
  };

  const toggleCompleted = () => {
    const updatedCompleted = !currentWord.completed;
    onUpdateWord(currentWord.id, { completed: updatedCompleted });
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
      minHeight: '100dvh',
      gap: 'clamp(20px, 6vw, 30px)',
      padding: 'clamp(16px, 5vw, 20px)',
      overflowX: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 'clamp(16px, 5vw, 20px)',
        right: 'clamp(16px, 5vw, 20px)',
        fontSize: 'clamp(14px, 4vw, 16px)',
        color: '#666'
      }}>
        {currentIndex + 1} / {shuffledWords.length}
      </div>

      <h1 style={{ fontSize: 'clamp(24px, 8vw, 32px)', marginBottom: 'clamp(16px, 5vw, 20px)', lineHeight: '1.2' }}>
        📖 학습 모드
      </h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(24px, 6vw, 40px)',
        borderRadius: 'clamp(12px, 4vw, 16px)',
        textAlign: 'center',
        width: '100%',
        maxWidth: 'min(400px, 90vw)',
        minHeight: 'clamp(240px, 60vw, 300px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: '2px solid #dee2e6',
        position: 'relative'
      }}>
        <button
          onClick={toggleCompleted}
          style={{
            position: 'absolute',
            top: 'clamp(12px, 4vw, 20px)',
            right: 'clamp(12px, 4vw, 20px)',
            fontSize: 'clamp(12px, 3.5vw, 16px)',
            backgroundColor: 'transparent',
            color: currentWord.completed ? '#28a745' : '#6c757d',
            border: 'none',
            borderRadius: 'clamp(6px, 2vw, 8px)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 10px)',
            minHeight: 'clamp(32px, 8vw, 36px)'
          }}
        >
          {currentWord.completed ? '✅ 완료됨' : '☑️ 완료 표시'}
        </button>
        <div style={{
          fontSize: 'clamp(28px, 10vw, 48px)',
          marginBottom: 'clamp(16px, 5vw, 20px)',
          fontWeight: 'bold',
          color: '#333',
          lineHeight: '1.2'
        }}>
          {currentWord.japanese}
        </div>

        {currentWord.yomikana && (
          <div style={{
            fontSize: 'clamp(16px, 5vw, 20px)',
            color: '#666',
            marginBottom: 'clamp(16px, 5vw, 20px)',
            fontStyle: 'italic',
            lineHeight: '1.3'
          }}>
            ({currentWord.yomikana})
          </div>
        )}

        <div style={{
          fontSize: 'clamp(18px, 6vw, 24px)',
          color: showAnswer ? '#28a745' : '#transparent',
          fontWeight: '600',
          minHeight: 'clamp(48px, 12vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: showAnswer ? '#d4edda' : '#fff',
          border: showAnswer ? '2px solid #c3e6cb' : '2px dashed #dee2e6',
          borderRadius: 'clamp(6px, 2vw, 8px)',
          padding: 'clamp(12px, 4vw, 15px)',
          transition: 'all 0.3s ease',
          lineHeight: '1.3'
        }}>
          {showAnswer ? currentWord.korean : '답을 보려면 클릭하세요'}
        </div>

        <div style={{ display: 'flex', gap: 'clamp(8px, 3vw, 10px)', marginTop: 'clamp(16px, 5vw, 20px)' }}>
          <button
            onClick={toggleAnswer}
            style={{
              width: '100%',
              padding: 'clamp(10px, 3vw, 12px) clamp(20px, 6vw, 24px)',
              fontSize: 'clamp(14px, 4vw, 16px)',
              backgroundColor: showAnswer ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 'clamp(6px, 2vw, 8px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: 'clamp(44px, 11vw, 48px)'
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
      </div>

      <div style={{
        display: 'flex',
        gap: 'clamp(16px, 5vw, 20px)',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={handlePrevious}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 'clamp(12px, 3.5vw, 14px)',
            color: '#007bff',
            cursor: 'pointer',
            padding: 'clamp(8px, 2vw, 10px)',
            minHeight: 'clamp(36px, 9vw, 40px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 6px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#007bff';
          }}
        >
          ⬅️ 이전
        </button>

        <div style={{
          padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 16px)',
          backgroundColor: '#e9ecef',
          borderRadius: 'clamp(16px, 5vw, 20px)',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#495057',
          whiteSpace: 'nowrap'
        }}>
          {currentIndex + 1} / {shuffledWords.length}
        </div>

        <button
          onClick={handleNext}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 'clamp(12px, 3.5vw, 14px)',
            color: '#007bff',
            cursor: 'pointer',
            padding: 'clamp(8px, 2vw, 10px)',
            minHeight: 'clamp(36px, 9vw, 40px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 6px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#007bff';
          }}
        >
          다음 ➡️
        </button>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: 'clamp(12px, 4vw, 15px)',
        borderRadius: 'clamp(6px, 2vw, 8px)',
        border: '1px solid #ffeaa7',
        textAlign: 'center',
        maxWidth: 'min(400px, 90vw)',
        width: '100%'
      }}>
        <p style={{
          margin: 0,
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#856404',
          lineHeight: '1.4'
        }}>
          💡 충분히 학습한 후 테스트 모드에서 실력을 확인해보세요!
        </p>
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
        단어장으로 돌아가기
      </button>
    </div>
  );
};