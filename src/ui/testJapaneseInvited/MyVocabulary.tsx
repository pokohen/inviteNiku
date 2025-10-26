import { useState, useEffect } from 'react';
import { StudyMode } from './StudyMode.tsx';
import { VocabularyTest } from './VocabularyTest.tsx';
import { TestSetupModal } from './TestSetupModal.tsx';
import { Modal } from '../common/Modal.tsx';
import { AddWordModal } from './AddWordModal.tsx';
import { exampleWord } from '../../shared/exampleWord.ts';

export interface VocabularyWord {
  id: string;
  japanese: string;
  yomikana?: string; // 요미카타 (선택사항)
  korean: string;
  dateAdded: string;
  completed?: boolean; // 학습 완료 여부
}

interface MyVocabularyProps {
  onBackToSelect: () => void;
}

export const MyVocabulary = ({ onBackToSelect }: MyVocabularyProps) => {
  const [currentMode, setCurrentMode] = useState<'main' | 'study' | 'test' | 'test-setup'>('main');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isWordListModalOpen, setIsWordListModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [testQuestionCount, setTestQuestionCount] = useState(0);
  const [testTimeAttack, setTestTimeAttack] = useState(false);
  const [wordFilter, setWordFilter] = useState<'all' | 'incomplete' | 'completed'>('all');

  useEffect(() => {
    const savedWords = localStorage.getItem('my-vocabulary');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
  }, []);

  const saveWords = (newWords: VocabularyWord[]) => {
    setWords(newWords);
    localStorage.setItem('my-vocabulary', JSON.stringify(newWords));
  };

  const addWord = (japanese: string, korean: string, yomikana?: string) => {
    const newWord: VocabularyWord = {
      id: Date.now().toString(),
      japanese,
      yomikana,
      korean,
      dateAdded: new Date().toLocaleDateString()
    };
    const updatedWords = [...words, newWord];
    saveWords(updatedWords);
    setIsAddWordModalOpen(false); // 모달 닫기
  };

  const deleteWord = (id: string) => {
    const updatedWords = words.filter(word => word.id !== id);
    saveWords(updatedWords);
  };

  const updateWord = (id: string, updates: Partial<VocabularyWord>) => {
    const updatedWords = words.map(word =>
      word.id === id ? { ...word, ...updates } : word
    );
    saveWords(updatedWords);
  };

  const addExampleWords = () => {
    const today = new Date().toLocaleDateString();
    const vocabularyWords: VocabularyWord[] = exampleWord.map(word => ({
      ...word,
      dateAdded: today,
      completed: false
    }));
    saveWords(vocabularyWords);
  };

  const handleBackToMain = () => {
    setCurrentMode('main');
  };

  const getFilteredWords = () => {
    switch (wordFilter) {
      case 'completed':
        return words.filter(word => word.completed);
      case 'incomplete':
        return words.filter(word => !word.completed);
      default:
        return words;
    }
  };

  const filteredWords = getFilteredWords();
  const completedCount = words.filter(word => word.completed).length;
  const incompleteCount = words.length - completedCount;

  if (currentMode === 'study') {
    return (
      <StudyMode
        words={words}
        onBack={handleBackToMain}
        onUpdateWord={updateWord}
      />
    );
  }

  if (currentMode === 'test-setup') {
    return (
      <TestSetupModal
        words={words}
        onBack={handleBackToMain}
        onStartTest={(questionCount, timeAttack) => {
          setTestQuestionCount(questionCount);
          setTestTimeAttack(timeAttack);
          setCurrentMode('test');
        }}
      />
    );
  }

  if (currentMode === 'test') {
    return (
      <VocabularyTest
        words={words}
        onBack={handleBackToMain}
        onUpdateWord={updateWord}
        questionCount={testQuestionCount}
        timeAttack={testTimeAttack}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100dvh',
      gap: 'clamp(12px, 4vw, 20px)',
      padding: 'clamp(16px, 5vw, 20px)',
      background: 'linear-gradient(135deg, #fef7e0 0%, #fff9e6 100%)',
      overflowX: 'hidden'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(8px, 3vw, 10px)',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 8vw, 36px)',
          marginBottom: 'clamp(4px, 2vw, 8px)',
          background: 'linear-gradient(45deg, #f57f17, #ff9800)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          📚 나만의 단어장
        </h1>
        <div style={{
          fontSize: 'clamp(12px, 4vw, 16px)',
          color: '#8d6e63',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          일본어 학습을 위한 개인 맞춤 단어장
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff9c4',
        padding: 'clamp(16px, 5vw, 20px)',
        borderRadius: 'clamp(12px, 4vw, 16px)',
        border: '1px solid #fdd835',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(245, 127, 23, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, #fdd835, #ff9800, #fdd835)'
        }}></div>
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#e65100',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          <div style={{
            fontWeight: 'bold',
            marginBottom: 'clamp(8px, 3vw, 12px)',
            fontSize: 'clamp(13px, 4vw, 15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(4px, 2vw, 8px)'
          }}>
            <span style={{ fontSize: 'clamp(16px, 5vw, 18px)' }}>💾</span>
            저장 위치 안내
          </div>
          <div style={{
            textAlign: 'left',
            maxWidth: 'min(300px, 100%)',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: 'clamp(4px, 1.5vw, 6px)', display: 'flex', alignItems: 'flex-start', gap: 'clamp(6px, 2vw, 8px)' }}>
              <span style={{ color: '#ff9800', fontWeight: 'bold', flexShrink: 0 }}>•</span>
              <span>단어장은 현재 브라우저에만 저장해요</span>
            </div>
            <div style={{ marginBottom: 'clamp(4px, 1.5vw, 6px)', display: 'flex', alignItems: 'flex-start', gap: 'clamp(6px, 2vw, 8px)' }}>
              <span style={{ color: '#ff9800', fontWeight: 'bold', flexShrink: 0 }}>•</span>
              <span>다른 컴퓨터나 휴대폰에서는 보이지 않아요</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(6px, 2vw, 8px)' }}>
              <span style={{ color: '#ff9800', fontWeight: 'bold', flexShrink: 0 }}>•</span>
              <span>시크릿 모드에서는 저장되지 않아요</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(16px, 5vw, 25px)',
        padding: 'clamp(12px, 4vw, 15px)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 'clamp(8px, 3vw, 12px)',
        border: '1px solid rgba(245, 127, 23, 0.2)',
        backdropFilter: 'blur(10px)',
        maxWidth: 'min(200px, 80vw)',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#8d6e63',
          marginBottom: 'clamp(2px, 1vw, 4px)'
        }}>
          저장된 단어
        </div>
        <div style={{
          fontSize: 'clamp(20px, 6vw, 24px)',
          fontWeight: 'bold',
          color: '#e65100'
        }}>
          {words.length}개
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: 'clamp(12px, 4vw, 16px)',
        maxWidth: 'min(600px, 95vw)',
        width: '100%'
      }}>
        <button
          onClick={() => setIsAddWordModalOpen(true)}
          style={{
            padding: 'clamp(16px, 5vw, 20px) clamp(20px, 6vw, 24px)',
            fontSize: 'clamp(16px, 4.5vw, 18px)',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #4caf50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(12px, 4vw, 16px)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'clamp(60px, 15vw, 80px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 2vw, 8px)' }}>
            <span style={{ fontSize: 'clamp(18px, 5vw, 20px)' }}>➕</span>
            단어 추가
          </div>
        </button>

        <button
          onClick={() => setCurrentMode('study')}
          disabled={words.length === 0}
          style={{
            padding: 'clamp(16px, 5vw, 20px) clamp(20px, 6vw, 24px)',
            fontSize: 'clamp(16px, 4.5vw, 18px)',
            fontWeight: '600',
            background: words.length === 0
              ? 'linear-gradient(135deg, #9e9e9e, #757575)'
              : 'linear-gradient(135deg, #2196f3, #1976d2)',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(12px, 4vw, 16px)',
            cursor: words.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: words.length === 0
              ? '0 4px 12px rgba(158, 158, 158, 0.3)'
              : '0 4px 12px rgba(33, 150, 243, 0.3)',
            opacity: words.length === 0 ? 0.6 : 1,
            minHeight: 'clamp(60px, 15vw, 80px)'
          }}
          onMouseOver={(e) => {
            if (words.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (words.length > 0) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 2vw, 8px)' }}>
            <span style={{ fontSize: 'clamp(18px, 5vw, 20px)' }}>📖</span>
            학습 모드
          </div>
        </button>

        <button
          onClick={() => {
            if (words.length >= 40) {
              setCurrentMode('test-setup');
            } else {
              setTestQuestionCount(0);
              setTestTimeAttack(false);
              setCurrentMode('test');
            }
          }}
          disabled={words.length < 4}
          style={{
            padding: 'clamp(16px, 5vw, 20px) clamp(20px, 6vw, 24px)',
            fontSize: 'clamp(16px, 4.5vw, 18px)',
            fontWeight: '600',
            background: words.length < 4
              ? 'linear-gradient(135deg, #9e9e9e, #757575)'
              : 'linear-gradient(135deg, #f44336, #d32f2f)',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(12px, 4vw, 16px)',
            cursor: words.length < 4 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: words.length < 4
              ? '0 4px 12px rgba(158, 158, 158, 0.3)'
              : '0 4px 12px rgba(244, 67, 54, 0.3)',
            opacity: words.length < 4 ? 0.6 : 1,
            minHeight: 'clamp(60px, 15vw, 80px)'
          }}
          onMouseOver={(e) => {
            if (words.length >= 4) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (words.length >= 4) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 2vw, 8px)' }}>
            <span style={{ fontSize: 'clamp(18px, 5vw, 20px)' }}>✍️</span>
            테스트 모드
          </div>
        </button>
      </div>

      <button
        onClick={() => setIsWordListModalOpen(true)}
        style={{
          marginTop: 'clamp(16px, 5vw, 20px)',
          padding: 'clamp(12px, 4vw, 16px) clamp(24px, 7vw, 32px)',
          fontSize: 'clamp(14px, 4vw, 16px)',
          fontWeight: '500',
          background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(10px, 3vw, 12px)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(6px, 2vw, 8px)',
          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
          minHeight: 'clamp(48px, 12vw, 56px)',
          maxWidth: 'min(320px, 90vw)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(156, 39, 176, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(156, 39, 176, 0.3)';
        }}
      >
        📋 단어 목록 보기 ({words.length}개)
      </button>

      {words.length < 4 && words.length > 0 && (
        <div style={{
          marginTop: 'clamp(12px, 4vw, 16px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(16px, 5vw, 20px)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: 'clamp(8px, 2.5vw, 10px)',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#f57c00',
          textAlign: 'center',
          fontWeight: '500',
          maxWidth: 'min(320px, 90vw)',
          lineHeight: '1.4'
        }}>
          ⚠️ 테스트 모드는 최소 4개의 단어가 필요합니다
        </div>
      )}

      <button
        onClick={onBackToSelect}
        style={{
          marginTop: 'clamp(20px, 6vw, 24px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(20px, 6vw, 24px)',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          fontWeight: '500',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#8d6e63',
          border: '1px solid rgba(141, 110, 99, 0.3)',
          borderRadius: 'clamp(8px, 2.5vw, 10px)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          minHeight: 'clamp(40px, 10vw, 44px)',
          maxWidth: 'min(200px, 80vw)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ← 메인 화면으로
      </button>

      <Modal
        isOpen={isWordListModalOpen}
        onClose={() => {
          setIsWordListModalOpen(false);
          setWordFilter('all');
        }}
        title="📋 단어 목록"
        width="min(600px, 95vw)"
      >
        <div>
          {words.length > 0 ? (
            <>
              <div style={{
                marginBottom: 'clamp(16px, 4vw, 20px)'
              }}>
                <div style={{
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  textAlign: 'center',
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  총 {words.length}개의 단어 (완료: {completedCount}개, 미완료: {incompleteCount}개)
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'clamp(4px, 1.5vw, 6px)',
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 'clamp(8px, 2.5vw, 10px)',
                  border: '1px solid #e9ecef'
                }}>
                  <button
                    onClick={() => setWordFilter('all')}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3vw, 16px)',
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      fontWeight: '600',
                      background: wordFilter === 'all'
                        ? 'linear-gradient(135deg, #007bff, #0056b3)'
                        : 'transparent',
                      color: wordFilter === 'all' ? 'white' : '#6c757d',
                      border: 'none',
                      borderRadius: 'clamp(6px, 2vw, 8px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: wordFilter === 'all' ? '0 2px 6px rgba(0, 123, 255, 0.3)' : 'none'
                    }}
                  >
                    전체 ({words.length})
                  </button>
                  <button
                    onClick={() => setWordFilter('incomplete')}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3vw, 16px)',
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      fontWeight: '600',
                      background: wordFilter === 'incomplete'
                        ? 'linear-gradient(135deg, #ffc107, #e0a800)'
                        : 'transparent',
                      color: wordFilter === 'incomplete' ? 'white' : '#6c757d',
                      border: 'none',
                      borderRadius: 'clamp(6px, 2vw, 8px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: wordFilter === 'incomplete' ? '0 2px 6px rgba(255, 193, 7, 0.3)' : 'none'
                    }}
                  >
                    미완료 ({incompleteCount})
                  </button>
                  <button
                    onClick={() => setWordFilter('completed')}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3vw, 16px)',
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      fontWeight: '600',
                      background: wordFilter === 'completed'
                        ? 'linear-gradient(135deg, #28a745, #1e7e34)'
                        : 'transparent',
                      color: wordFilter === 'completed' ? 'white' : '#6c757d',
                      border: 'none',
                      borderRadius: 'clamp(6px, 2vw, 8px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: wordFilter === 'completed' ? '0 2px 6px rgba(40, 167, 69, 0.3)' : 'none'
                    }}
                  >
                    완료 ({completedCount})
                  </button>
                </div>
              </div>

              <div style={{
                maxHeight: 'clamp(300px, 50vh, 400px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(8px, 3vw, 12px)',
                padding: '2px'
              }}>
                {filteredWords.length > 0 ? filteredWords.map((word, index) => (
                  <div
                    key={word.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'stretch',
                      padding: 'clamp(14px, 4vw, 18px)',
                      background: word.completed
                        ? 'linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: 'clamp(8px, 2.5vw, 12px)',
                      border: word.completed
                        ? '2px solid #28a745'
                        : '2px solid #e9ecef',
                      transition: 'all 0.3s ease',
                      gap: 'clamp(10px, 3vw, 14px)',
                      boxShadow: word.completed
                        ? '0 2px 8px rgba(40, 167, 69, 0.15)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = word.completed
                        ? '0 4px 16px rgba(40, 167, 69, 0.25)'
                        : '0 4px 16px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = word.completed
                        ? '0 2px 8px rgba(40, 167, 69, 0.15)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(8px, 2.5vw, 10px)',
                        marginBottom: 'clamp(6px, 2vw, 8px)',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: 'clamp(10px, 3vw, 12px)',
                          color: word.completed ? '#155724' : '#6c757d',
                          backgroundColor: word.completed ? '#d4edda' : '#e9ecef',
                          padding: 'clamp(3px, 1vw, 4px) clamp(6px, 2vw, 8px)',
                          borderRadius: 'clamp(6px, 2vw, 8px)',
                          minWidth: 'clamp(20px, 5vw, 24px)',
                          textAlign: 'center',
                          fontWeight: '600',
                          border: word.completed ? '1px solid #c3e6cb' : '1px solid #dee2e6'
                        }}>
                          {index + 1}
                        </span>
                        <div style={{
                          fontSize: 'clamp(16px, 5vw, 20px)',
                          fontWeight: '700',
                          wordBreak: 'break-word',
                          color: word.completed ? '#155724' : '#212529',
                          opacity: word.completed ? 0.8 : 1
                        }}>
                          {word.japanese}
                          {word.yomikana && (
                            <span style={{
                              fontSize: 'clamp(12px, 3.5vw, 14px)',
                              color: word.completed ? '#6c757d' : '#666',
                              marginLeft: 'clamp(6px, 2vw, 8px)',
                              fontWeight: 'normal',
                              fontStyle: 'italic'
                            }}>
                              ({word.yomikana})
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 'clamp(14px, 4vw, 16px)',
                        color: '#495057',
                        wordBreak: 'break-word',
                        lineHeight: '1.5',
                        padding: 'clamp(6px, 2vw, 8px) clamp(8px, 2.5vw, 10px)',
                        backgroundColor: word.completed ? 'rgba(40, 167, 69, 0.05)' : 'rgba(248, 249, 250, 0.8)',
                        borderRadius: 'clamp(4px, 1.5vw, 6px)',
                        border: word.completed ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid rgba(233, 236, 239, 0.5)',
                        fontWeight: '500'
                      }}>
                        💬 {word.korean}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(8px, 2.5vw, 10px)',
                        fontSize: 'clamp(10px, 3vw, 12px)',
                        color: '#6c757d',
                        marginTop: 'clamp(6px, 2vw, 8px)',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(3px, 1vw, 4px)'
                        }}>
                          📅 {word.dateAdded}
                        </span>
                        {word.completed && (
                          <span style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: 'clamp(2px, 1vw, 3px) clamp(6px, 2vw, 8px)',
                            borderRadius: 'clamp(6px, 2vw, 8px)',
                            fontSize: 'clamp(9px, 2.5vw, 10px)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(2px, 1vw, 3px)',
                            boxShadow: '0 1px 3px rgba(40, 167, 69, 0.3)'
                          }}>
                            ✅ 학습완료
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 'clamp(6px, 2vw, 8px)',
                      justifyContent: 'stretch',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      {word.completed && (
                        <button
                          onClick={() => updateWord(word.id, { completed: false })}
                          style={{
                            background: 'linear-gradient(135deg, #ffc107, #ffca2c)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: 'clamp(10px, 3vw, 12px)',
                            padding: 'clamp(6px, 2vw, 8px) clamp(10px, 3vw, 12px)',
                            borderRadius: 'clamp(6px, 2vw, 8px)',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            flex: '1',
                            fontWeight: '600',
                            boxShadow: '0 2px 6px rgba(255, 193, 7, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 193, 7, 0.3)';
                          }}
                        >
                          🔄 재학습
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`"${word.japanese}"를 삭제하시겠습니까?`)) {
                            deleteWord(word.id);
                          }
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #dc3545, #e74c3c)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 'clamp(11px, 3.5vw, 13px)',
                          padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 14px)',
                          borderRadius: 'clamp(6px, 2vw, 8px)',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                          flex: '1',
                          fontWeight: '600',
                          boxShadow: '0 2px 6px rgba(220, 53, 69, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(220, 53, 69, 0.3)';
                        }}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                )) : (
                  <div style={{
                    textAlign: 'center',
                    padding: 'clamp(30px, 8vw, 40px) clamp(16px, 5vw, 20px)',
                    color: '#6c757d'
                  }}>
                    <div style={{
                      fontSize: 'clamp(24px, 8vw, 32px)',
                      marginBottom: 'clamp(12px, 4vw, 16px)'
                    }}>
                      {wordFilter === 'completed' ? '🎉' : '📝'}
                    </div>
                    <p style={{
                      fontSize: 'clamp(14px, 4vw, 16px)',
                      marginBottom: '0',
                      lineHeight: '1.4'
                    }}>
                      {wordFilter === 'completed'
                        ? '아직 완료된 단어가 없습니다'
                        : wordFilter === 'incomplete'
                        ? '모든 단어를 완료했습니다!'
                        : '표시할 단어가 없습니다'
                      }
                    </p>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: 'clamp(12px, 4vw, 20px)',
                padding: 'clamp(12px, 4vw, 16px)',
                backgroundColor: '#fff3cd',
                borderRadius: 'clamp(6px, 2vw, 8px)',
                border: '1px solid #ffeaa7',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  color: '#856404',
                  lineHeight: '1.4'
                }}>
                  💡 단어를 삭제하려면 삭제 버튼을 클릭하세요
                </p>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 'clamp(20px, 8vw, 40px) clamp(16px, 5vw, 20px)',
              color: '#6c757d'
            }}>
              <div style={{
                fontSize: 'clamp(32px, 12vw, 48px)',
                marginBottom: 'clamp(12px, 4vw, 16px)'
              }}>📚</div>
              <p style={{
                fontSize: 'clamp(16px, 5vw, 18px)',
                marginBottom: 'clamp(6px, 2vw, 8px)',
                lineHeight: '1.4'
              }}>
                저장된 단어가 없습니다
              </p>
              <p style={{
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                marginBottom: 'clamp(16px, 5vw, 20px)',
                lineHeight: '1.4'
              }}>
                단어 추가 버튼을 눌러 첫 번째 단어를 추가하거나 예시 단어를 불러와보세요!
              </p>

              <button
                onClick={() => {
                  addExampleWords();
                  setIsWordListModalOpen(false);
                }}
                style={{
                  padding: 'clamp(10px, 3vw, 12px) clamp(20px, 6vw, 24px)',
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'clamp(6px, 2vw, 8px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                📝 예시 단어 50개 추가하기
              </button>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isAddWordModalOpen}
        onClose={() => setIsAddWordModalOpen(false)}
        title="➕ 단어 추가"
        width="min(500px, 95vw)"
      >
        <AddWordModal onAddWord={addWord} />
      </Modal>
    </div>
  );
};