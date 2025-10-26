import { useState, useEffect } from 'react';
import { Col, Collapse, Flex, Row } from 'antd';
import Confetti from 'react-confetti';
import { VocabularyWord } from './MyVocabulary.tsx';

interface VocabularyTestProps {
  words: VocabularyWord[];
  onBack: () => void;
}

export const VocabularyTest = ({ words, onBack }: VocabularyTestProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<VocabularyWord[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<VocabularyWord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<VocabularyWord[]>([]);
  const [choices, setChoices] = useState<string[]>([]);

  const generateChoices = (correctAnswer: string) => {
    const allAnswers = words.map(word => word.korean);
    const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const randomWrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const allChoices = [correctAnswer, ...randomWrongAnswers];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (words.length >= 4) {
      const shuffledWords = [...words].sort(() => Math.random() - 0.5);
      setQuestions(shuffledWords);
    }
  }, [words]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentWord = questions[currentQuestionIndex];
      setChoices(generateChoices(currentWord.korean));
    }
  }, [questions, currentQuestionIndex]);

  if (words.length < 4) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px'
      }}>
        <h2>테스트를 위해서는 최소 4개의 단어가 필요합니다</h2>
        <p>현재 {words.length}개의 단어가 있습니다</p>
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

  const currentWord = questions[currentQuestionIndex];
  const correctAnswer = currentWord?.korean;

  const handleAnswerSelect = (selectedChoice: string) => {
    if (selectedAnswer !== '') return;

    setSelectedAnswer(selectedChoice);

    if (selectedChoice === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentWord]);
    } else {
      setWrongAnswers([...wrongAnswers, currentWord]);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setWrongAnswers([]);
    setCorrectAnswers([]);
    setIsFinished(false);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setQuestions(shuffledWords);
  };

  if (isFinished) {
    const isPerfectScore = score === questions.length;

    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: '20px', position: 'relative' }}>
        {isPerfectScore && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={150}
            gravity={0.1}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          />
        )}
        <h2>📚 나만의 단어장 테스트 완료!</h2>
        {isPerfectScore && (
          <div style={{ marginTop: '10px', fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>
            🎉 완벽합니다! 100점입니다! 🎉
          </div>
        )}
        <Flex justify={'center'} align={'center'} gap={'10px'} style={{ marginTop: '10px', fontSize: '18px' }}>
          <p><span style={{ fontSize: '14px'}}>총 점수 : </span> {score} / {questions.length}</p>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', borderRadius: '9999px'}}></div>
          <p><span style={{ fontSize: '14px'}}>정답률 : </span> {((score / questions.length) * 100).toFixed(1)}%</p>
        </Flex>

        <Collapse
          style={{ marginTop: '20px', width: '80vw', margin: '0 auto' }}
          defaultActiveKey={wrongAnswers.length > 0 ? ['2'] : []}
          expandIconPosition={'end'}
          items={[
            {
              key: '1',
              label: (<span style={{ color: '#28a745', fontWeight: 600, fontSize: '15px'}}>맞춘 문제 ({correctAnswers.length}개)</span>),
              children: (
                <Row>
                  {correctAnswers.length > 0 ? (
                    (() => {
                      const items = [...correctAnswers];
                      while (items.length % 3 !== 0) {
                        items.push({ id: '', japanese: '', korean: '', dateAdded: '' });
                      }

                      return items.map((word, index) => (
                        <Col
                          span={8}
                          key={index}
                          style={{
                            padding: '5px 0',
                            borderRight: (index + 1) % 3 !== 0 ? '1px solid #ddd' : 'none',
                            borderBottom: index < items.length - 3 ? '1px solid #ddd' : 'none',
                            minHeight: '20px'
                          }}
                        >
                          {word.japanese ? (
                            <div>
                              <div style={{ fontWeight: 'bold' }}>
                                {word.japanese}
                                {word.yomikana && (
                                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px', fontWeight: 'normal' }}>
                                    ({word.yomikana})
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                → {word.korean}
                              </div>
                            </div>
                          ) : ''}
                        </Col>
                      ));
                    })()
                  ) : (
                    <Col style={{ margin: '5px 0', color: '#6c757d' }}>맞춘 문제 없음</Col>
                  )}
                </Row>
              ),
            },
            {
              key: '2',
              label: (<span style={{ color: '#dc3545', fontWeight: 600, fontSize: '15px'}}>틀린 문제 ({wrongAnswers.length}개)</span>),
              children: (
                <Row>
                  {wrongAnswers.length > 0 ? (
                    (() => {
                      const items = [...wrongAnswers];
                      while (items.length % 3 !== 0) {
                        items.push({ id: '', japanese: '', korean: '', dateAdded: '' });
                      }

                      return items.map((word, index) => (
                        <Col
                          span={8}
                          key={index}
                          style={{
                            padding: '5px 0',
                            borderRight: (index + 1) % 3 !== 0 ? '1px solid #ddd' : 'none',
                            borderBottom: index < items.length - 3 ? '1px solid #ddd' : 'none',
                            minHeight: '20px'
                          }}
                        >
                          {word.japanese ? (
                            <div>
                              <div style={{ fontWeight: 'bold' }}>
                                {word.japanese}
                                {word.yomikana && (
                                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px', fontWeight: 'normal' }}>
                                    ({word.yomikana})
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                → {word.korean}
                              </div>
                            </div>
                          ) : ''}
                        </Col>
                      ));
                    })()
                  ) : (
                    <Col style={{ margin: '5px 0', color: '#6c757d' }}>틀린 문제 없음</Col>
                  )}
                </Row>
              ),
            },
          ]}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={resetTest} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#007bff', border: 'none', borderRadius: '5px' }}>
            다시 풀기
          </button>
          <button onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
            단어장으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      margin: '0 auto',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        문제 {currentQuestionIndex + 1} / {questions.length}
      </div>
      <h2 style={{ marginBottom: '20px' }}>📚 나만의 단어장 테스트</h2>
      <div style={{ marginBottom: '20px' }}>
        아래의 일본어에 맞는 한국어 뜻을 선택해주세요.
      </div>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        {currentWord?.japanese}
      </div>
      {currentWord?.yomikana && (
        <div style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '20px',
          fontStyle: 'italic'
        }}>
          ({currentWord.yomikana})
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(choice)}
            disabled={selectedAnswer !== ''}
            style={{
              padding: '15px 20px',
              fontSize: '18px',
              backgroundColor: selectedAnswer === choice
                ? (choice === correctAnswer ? '#28a745' : '#dc3545')
                : selectedAnswer !== '' && choice === correctAnswer
                ? '#28a745'
                : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: selectedAnswer !== '' ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s ease'
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        단어장으로 돌아가기
      </button>
    </div>
  );
};