import { useState, useEffect, useRef } from 'react';
import { Col, Collapse, Flex, Row } from 'antd';
import Confetti from 'react-confetti';
import { VocabularyWord } from './MyVocabulary.tsx';

interface VocabularyTestProps {
  words: VocabularyWord[];
  onBack: () => void;
  onUpdateWord: (id: string, updates: Partial<VocabularyWord>) => void;
  questionCount: number; // 0이면 전체 문제
  timeAttack: boolean;
}

export const VocabularyTest = ({ words, onBack, onUpdateWord, questionCount, timeAttack }: VocabularyTestProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<VocabularyWord[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<VocabularyWord[]>([]);
  const [uncompletedWords, setUncompletedWords] = useState<VocabularyWord[]>([]); // 완료 해제된 단어들
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<VocabularyWord[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  const hasProcessedUncompleted = useRef(false);

  const generateChoices = (correctAnswer: string, questionWords: VocabularyWord[]) => {
    const allAnswers = questionWords.map(word => word.korean);
    const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const randomWrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const allChoices = [correctAnswer, ...randomWrongAnswers];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (words.length >= 4 && questions.length === 0) {
      // 처음 테스트 시작할 때만 questions 설정 (테스트 중에는 변경되지 않음)
      const shuffledWords = [...words].sort(() => Math.random() - 0.5);
      const finalQuestions = questionCount === 0 ? shuffledWords : shuffledWords.slice(0, questionCount);
      setQuestions(finalQuestions);
    }
  }, [words, questions.length, questionCount]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentWord = questions[currentQuestionIndex];
      setChoices(generateChoices(currentWord.korean, questions));

      if (timeAttack) {
        setTimeLeft(5);
        setTimerActive(true);
      }
    }
  }, [questions, currentQuestionIndex, timeAttack]);

  // 타임어택 타이머
  useEffect(() => {
    if (timeAttack && timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeAttack && timerActive && timeLeft === 0) {
      // 시간 초과 시 틀린 답 처리
      handleTimeUp();
    }
  }, [timeLeft, timerActive, timeAttack]);

  if (words.length < 4) {
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
        <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', lineHeight: '1.3' }}>테스트를 위해서는 최소 4개의 단어가 필요합니다</h2>
        <p style={{ fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: '1.4' }}>현재 {words.length}개의 단어가 있습니다</p>
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

  const currentWord = questions[currentQuestionIndex];
  const correctAnswer = currentWord?.korean;

  const handleTimeUp = () => {
    setTimerActive(false);
    setWrongAnswers([...wrongAnswers, currentWord]);

    // 오답인 경우, 해당 단어가 완료 상태였다면 완료 해제 목록에 추가
    if (currentWord.completed) {
      setUncompletedWords([...uncompletedWords, currentWord]);
    }

    // 시간 초과 시 정답을 표시하기 위해 특별한 값 설정
    setSelectedAnswer('TIME_UP');

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  const handleAnswerSelect = (selectedChoice: string) => {
    if (selectedAnswer !== '') return;

    setSelectedAnswer(selectedChoice);
    if (timeAttack) {
      setTimerActive(false); // 타이머 멈춤
    }

    if (selectedChoice === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentWord]);
    } else {
      setWrongAnswers([...wrongAnswers, currentWord]);

      // 오답인 경우, 해당 단어가 완료 상태였다면 완료 해제 목록에 추가
      if (currentWord.completed) {
        setUncompletedWords([...uncompletedWords, currentWord]);
      }
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

  // 테스트 완료 시 완료 해제 처리 (한번만 실행)
  useEffect(() => {
    if (isFinished && uncompletedWords.length > 0 && !hasProcessedUncompleted.current) {
      hasProcessedUncompleted.current = true;
      uncompletedWords.forEach(word => {
        onUpdateWord(word.id, { completed: false });
      });
    }
  }, [isFinished, uncompletedWords.length]);

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setWrongAnswers([]);
    setCorrectAnswers([]);
    setUncompletedWords([]);
    setIsFinished(false);
    setTimeLeft(5);
    setTimerActive(false);
    hasProcessedUncompleted.current = false; // 리셋
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const finalQuestions = questionCount === 0 ? shuffledWords : shuffledWords.slice(0, questionCount);
    setQuestions(finalQuestions);
  };

  if (isFinished) {
    const isPerfectScore = score === questions.length;

    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: 'clamp(16px, 5vw, 20px)', position: 'relative', maxWidth: '100vw', overflowX: 'hidden' }}>
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
        <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', lineHeight: '1.3', margin: '0 0 clamp(12px, 3vw, 16px) 0' }}>📚 나만의 단어장 테스트 완료! {timeAttack && '⏰ 타임어택'}</h2>
        {isPerfectScore && (
          <div style={{ marginTop: 'clamp(8px, 2.5vw, 10px)', fontSize: 'clamp(16px, 5vw, 20px)', color: '#28a745', fontWeight: 'bold', lineHeight: '1.3' }}>
            🎉 완벽합니다! 100점입니다! 🎉
          </div>
        )}
        <Flex justify={'center'} align={'center'} gap={'clamp(8px, 2.5vw, 10px)'} style={{ marginTop: 'clamp(8px, 2.5vw, 10px)', fontSize: 'clamp(14px, 4vw, 18px)', flexWrap: 'wrap' }}>
          <p><span style={{ fontSize: 'clamp(12px, 3vw, 14px)'}}>총 점수 : </span> {score} / {questions.length}</p>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', borderRadius: '9999px'}}></div>
          <p><span style={{ fontSize: 'clamp(12px, 3vw, 14px)'}}>정답률 : </span> {((score / questions.length) * 100).toFixed(1)}%</p>
        </Flex>

        {uncompletedWords.length > 0 && (
          <div style={{
            marginTop: 'clamp(16px, 5vw, 20px)',
            padding: 'clamp(12px, 4vw, 15px)',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: 'clamp(6px, 2vw, 8px)',
            maxWidth: 'min(600px, 90vw)',
            margin: 'clamp(16px, 5vw, 20px) auto 0'
          }}>
            <div style={{
              fontSize: 'clamp(14px, 4vw, 16px)',
              fontWeight: 'bold',
              color: '#856404',
              marginBottom: 'clamp(8px, 2.5vw, 10px)'
            }}>
              🔄 완료 해제된 단어 ({uncompletedWords.length}개)
            </div>
            <div style={{
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              color: '#856404',
              marginBottom: 'clamp(8px, 2.5vw, 10px)',
              lineHeight: '1.4'
            }}>
              다음 단어들이 오답으로 인해 완료 상태에서 해제되어 다시 학습모드에 나타납니다:
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(6px, 2vw, 8px)'
            }}>
              {uncompletedWords.map((word, index) => (
                <span
                  key={word.id}
                  style={{
                    backgroundColor: '#ffc107',
                    color: 'white',
                    padding: 'clamp(3px, 1vw, 4px) clamp(6px, 2vw, 8px)',
                    borderRadius: 'clamp(3px, 1vw, 4px)',
                    fontSize: 'clamp(10px, 3vw, 12px)',
                    fontWeight: 'bold'
                  }}
                >
                  {word.japanese}
                  {index < uncompletedWords.length - 1 ? '' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        <Collapse
          style={{ marginTop: 'clamp(16px, 5vw, 20px)', width: 'min(80vw, 600px)', margin: '0 auto' }}
          defaultActiveKey={wrongAnswers.length > 0 ? ['2'] : []}
          expandIconPosition={'end'}
          items={[
            {
              key: '1',
              label: (<span style={{ color: '#28a745', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 15px)'}}>맞춘 문제 ({correctAnswers.length}개)</span>),
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
              label: (<span style={{ color: '#dc3545', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 15px)'}}>틀린 문제 ({wrongAnswers.length}개)</span>),
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

        <div style={{ display: 'flex', gap: 'clamp(12px, 4vw, 15px)', justifyContent: 'center', marginTop: 'clamp(16px, 5vw, 20px)', flexWrap: 'wrap' }}>
          <button onClick={resetTest} style={{ padding: 'clamp(8px, 2.5vw, 10px) clamp(16px, 5vw, 20px)', backgroundColor: 'transparent', color: '#007bff', border: 'none', borderRadius: 'clamp(4px, 1.5vw, 5px)', fontSize: 'clamp(12px, 3.5vw, 14px)', minHeight: 'clamp(40px, 10vw, 44px)', cursor: 'pointer' }}>
            다시 풀기
          </button>
          <button onClick={onBack} style={{ padding: 'clamp(8px, 2.5vw, 10px) clamp(16px, 5vw, 20px)', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 'clamp(4px, 1.5vw, 5px)', fontSize: 'clamp(12px, 3.5vw, 14px)', minHeight: 'clamp(40px, 10vw, 44px)', cursor: 'pointer' }}>
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
      padding: 'clamp(16px, 5vw, 20px)',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 'clamp(16px, 4vw, 20px)'
    }}>
      <h2 style={{ marginBottom: 'clamp(16px, 4vw, 20px)', fontSize: 'clamp(18px, 5vw, 24px)', lineHeight: '1.3' }}>📚 나만의 단어장 테스트 {timeAttack && '(타임어택)'}</h2>
      <div>
        <span style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>문제 {currentQuestionIndex + 1} / {questions.length}</span>
        {timeAttack && (
          <div style={{
            marginTop: 'clamp(8px, 2.5vw, 10px)',
            fontSize: 'clamp(20px, 6vw, 24px)',
            fontWeight: 'bold',
            color: timeLeft <= 2 ? '#dc3545' : timeLeft <= 3 ? '#ff6b6b' : '#28a745'
          }}>
            ⏰ {timeLeft}초
          </div>
        )}
      </div>
      <div style={{ marginBottom: 'clamp(16px, 4vw, 20px)', fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: '1.4' }}>
        아래의 일본어에 맞는 한국어 뜻을 선택해주세요.
      </div>
      <div>
        <div style={{ fontSize: 'clamp(40px, 10vw, 48px)', lineHeight: '1.2' }}>
          {currentWord?.japanese}
        </div>
        <div style={{
          fontSize: 'clamp(16px, 5vw, 20px)',
          color: '#666',
          marginBottom: 'clamp(8px, 2vw, 12px)',
          fontStyle: 'italic',
          lineHeight: '1.3',
          minHeight: 'clamp(20px, 6vw, 24px)'
        }}>
          {currentWord?.yomikana ? `(${currentWord.yomikana})` : ''}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(12px, 4vw, 15px)', maxWidth: 'min(500px, 90vw)' }}>
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(choice)}
            disabled={selectedAnswer !== '' || (timeAttack && timeLeft === 0)}
            style={{
              padding: 'clamp(12px, 4vw, 15px) clamp(16px, 5vw, 20px)',
              fontSize: 'clamp(14px, 4vw, 18px)',
              minHeight: 'clamp(60px, 15vw, 80px)',
              backgroundColor: selectedAnswer === choice
                ? (choice === correctAnswer ? '#28a745' : '#dc3545')
                : (selectedAnswer !== '' && choice === correctAnswer)
                ? '#28a745'
                : (selectedAnswer === 'TIME_UP' && choice === correctAnswer)
                ? '#28a745'
                : (timeAttack && timeLeft === 0)
                ? '#6c757d'
                : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 'clamp(6px, 2vw, 8px)',
              cursor: (selectedAnswer !== '' || (timeAttack && timeLeft === 0)) ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s ease',
              lineHeight: '1.3',
              wordBreak: 'keep-all'
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: 'clamp(24px, 7vw, 30px)',
          padding: 'clamp(8px, 2.5vw, 10px) clamp(16px, 5vw, 20px)',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1.5vw, 5px)',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          minHeight: 'clamp(40px, 10vw, 44px)',
          cursor: 'pointer'
        }}
      >
        단어장으로 돌아가기
      </button>
    </div>
  );
};