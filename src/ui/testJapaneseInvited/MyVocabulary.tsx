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
      justifyContent: 'center',
      height: '100vh',
      gap: '30px'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        📚 나만의 단어장
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          현재 {words.length}개의 단어가 저장되어 있습니다
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={() => setIsAddWordModalOpen(true)}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            minWidth: '300px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          ➕ 단어 추가
        </button>

        <button
          onClick={() => setCurrentMode('study')}
          disabled={words.length === 0}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: words.length === 0 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: words.length === 0 ? 'not-allowed' : 'pointer',
            minWidth: '300px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (words.length > 0) {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }
          }}
          onMouseOut={(e) => {
            if (words.length > 0) {
              e.currentTarget.style.backgroundColor = '#007bff';
            }
          }}
        >
          📖 학습 모드
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
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: words.length < 4 ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: words.length < 4 ? 'not-allowed' : 'pointer',
            minWidth: '300px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (words.length >= 4) {
              e.currentTarget.style.backgroundColor = '#c82333';
            }
          }}
          onMouseOut={(e) => {
            if (words.length >= 4) {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }
          }}
        >
          ✍️ 테스트 모드
        </button>
      </div>

      <button
        onClick={() => setIsWordListModalOpen(true)}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: '#6f42c1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a359a'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6f42c1'}
      >
        📋 단어 목록 보기 ({words.length}개)
      </button>

      {words.length < 4 && words.length > 0 && (
        <p style={{ fontSize: '14px', color: '#ffc107', textAlign: 'center' }}>
          테스트 모드는 최소 4개의 단어가 필요합니다
        </p>
      )}

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
        메인 화면으로
      </button>

      <Modal
        isOpen={isWordListModalOpen}
        onClose={() => setIsWordListModalOpen(false)}
        title="📋 단어 목록"
        width="600px"
      >
        <div>
          {words.length > 0 ? (
            <>
              <div style={{
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '16px',
                color: '#666'
              }}>
                총 {words.length}개의 단어가 저장되어 있습니다
              </div>

              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {words.map((word, index) => (
                  <div
                    key={word.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#6c757d',
                          backgroundColor: '#e9ecef',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          minWidth: '20px',
                          textAlign: 'center'
                        }}>
                          {index + 1}
                        </span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {word.japanese}
                          {word.yomikana && (
                            <span style={{
                              fontSize: '14px',
                              color: '#666',
                              marginLeft: '8px',
                              fontWeight: 'normal'
                            }}>
                              ({word.yomikana})
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: '16px', color: '#495057' }}>
                        → {word.korean}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#6c757d',
                        marginTop: '4px'
                      }}>
                        <span>추가일: {word.dateAdded}</span>
                        {word.completed && (
                          <span style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            ✅ 완료됨
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      {word.completed && (
                        <button
                          onClick={() => updateWord(word.id, { completed: false })}
                          style={{
                            background: 'none',
                            border: '2px solid #ffc107',
                            color: '#ffc107',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffc107';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#ffc107';
                          }}
                        >
                          🔄 완료해제
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`"${word.japanese}"를 삭제하시겠습니까?`)) {
                            deleteWord(word.id);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: '2px solid #dc3545',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc3545';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#dc3545';
                        }}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#856404'
                }}>
                  💡 단어를 삭제하려면 삭제 버튼을 클릭하세요
                </p>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>저장된 단어가 없습니다</p>
              <p style={{ fontSize: '14px', marginBottom: '20px' }}>단어 추가 버튼을 눌러 첫 번째 단어를 추가하거나 예시 단어를 불러와보세요!</p>

              <button
                onClick={() => {
                  addExampleWords();
                  setIsWordListModalOpen(false);
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
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
        width="500px"
      >
        <AddWordModal onAddWord={addWord} />
      </Modal>
    </div>
  );
};