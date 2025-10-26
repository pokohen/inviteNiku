import { useState, useEffect } from 'react';
import { AddWord } from './AddWord.tsx';
import { StudyMode } from './StudyMode.tsx';
import { VocabularyTest } from './VocabularyTest.tsx';
import { Modal } from '../common/Modal.tsx';
import { AddWordModal } from './AddWordModal.tsx';

export interface VocabularyWord {
  id: string;
  japanese: string;
  yomikana?: string; // 요미카타 (선택사항)
  korean: string;
  dateAdded: string;
}

interface MyVocabularyProps {
  onBackToSelect: () => void;
}

export const MyVocabulary = ({ onBackToSelect }: MyVocabularyProps) => {
  const [currentMode, setCurrentMode] = useState<'main' | 'study' | 'test'>('main');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isWordListModalOpen, setIsWordListModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);

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

  const handleBackToMain = () => {
    setCurrentMode('main');
  };

  if (currentMode === 'study') {
    return (
      <StudyMode
        words={words}
        onBack={handleBackToMain}
      />
    );
  }

  if (currentMode === 'test') {
    return (
      <VocabularyTest
        words={words}
        onBack={handleBackToMain}
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
          onClick={() => setCurrentMode('test')}
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

      {words.length > 0 && (
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
      )}

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
                      <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                        추가일: {word.dateAdded}
                      </div>
                    </div>
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
                        transition: 'all 0.2s ease',
                        marginLeft: '16px'
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
              <p style={{ fontSize: '14px' }}>단어 추가 버튼을 눌러 첫 번째 단어를 추가해보세요!</p>
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