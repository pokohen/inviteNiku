import { useState, useEffect } from 'react';
import { Col, Collapse, Flex, Row } from 'antd';
import Confetti from 'react-confetti';
import { hiraganaToKorean } from '@/shared/hiragana';
import { katakanaToKorean } from '@/shared/katakana';
import { 토로햄전용시험지 } from '@/shared/토로햄전용시험';

interface JapaneseTestProps {
  type: 'hiragana' | 'katakana' | 'special';
  questionCount: number; // 0이면 전체 문제
  onBackToSelect: () => void;
}

export function JapaneseTest({ type, questionCount, onBackToSelect }: JapaneseTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[][]>([]);
  const [choices, setChoices] = useState<string[][]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20분 = 1200초
  const [questionTimeLeft, setQuestionTimeLeft] = useState(60); // 1분 = 60초

  const characterMap = type === 'hiragana' ? hiraganaToKorean :
                      type === 'katakana' ? katakanaToKorean : 토로햄전용시험지;
  const testTitle = type === 'hiragana' ? '히라가나' :
                    type === 'katakana' ? '가타카나' : '토로햄전용';

  const generateThreeCharacterQuestion = () => {
    const questionKeys = Object.keys(characterMap);
    const selectedKeys = questionKeys.sort(() => Math.random() - 0.5).slice(0, 3);
    return selectedKeys;
  };

  const generateChoicesForThreeCharacters = (threeJapanese: string[]) => {
    const correctAnswers = threeJapanese.map(jp => characterMap[jp as keyof typeof characterMap]);

    const allAnswers = Object.values(characterMap);
    const wrongAnswers = allAnswers.filter(answer => !correctAnswers.includes(answer));

    const shuffledCorrect = [...correctAnswers].sort(() => Math.random() - 0.5);
    const wrongChoice1 = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const wrongChoice2 = wrongAnswers.sort(() => Math.random() - 0.5).slice(3, 6);
    const wrongChoice3 = wrongAnswers.sort(() => Math.random() - 0.5).slice(6, 9);

    return [shuffledCorrect, wrongChoice1, wrongChoice2, wrongChoice3].sort(() => Math.random() - 0.5);
  };

  const generateChoices = (correctAnswer: string) => {
    const allAnswers = Object.values(characterMap);
    const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const randomWrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const allChoices = [correctAnswer, ...randomWrongAnswers];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (type === 'special') {
      const generatedQuestions: string[][] = [];
      const count = questionCount === 0 ? Math.floor(Object.keys(characterMap).length / 3) : questionCount;

      for (let i = 0; i < count; i++) {
        generatedQuestions.push(generateThreeCharacterQuestion());
      }
      setQuestions(generatedQuestions);
    } else {
      const questionList = Object.keys(characterMap);
      const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);
      const finalQuestions = questionCount === 0 ? shuffledQuestions : shuffledQuestions.slice(0, questionCount);
      setQuestions(finalQuestions.map(q => [q]));
    }
  }, [characterMap, questionCount, type]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      if (type === 'special') {
        const currentThreeJapanese = questions[currentQuestionIndex];
        setChoices(generateChoicesForThreeCharacters(currentThreeJapanese));
      } else {
        const currentJapanese = questions[currentQuestionIndex][0];
        const correctAnswer = characterMap[currentJapanese as keyof typeof characterMap];
        setChoices([generateChoices(correctAnswer)]);
      }
    }
  }, [questions, currentQuestionIndex, characterMap, type]);

  useEffect(() => {
    if (type === 'special' && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [type, isFinished, timeLeft]);

  useEffect(() => {
    if (type === 'special' && !isFinished && selectedAnswer === '') {
      setQuestionTimeLeft(60);
      const questionTimer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(questionTimer);
    }
  }, [currentQuestionIndex, type, isFinished, selectedAnswer]);

  const handleTimeOut = () => {
    if (type === 'special') {
      const currentThreeJapanese = questions[currentQuestionIndex];
      setWrongAnswers([...wrongAnswers, ...currentThreeJapanese]);

      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer('');
        } else {
          setIsFinished(true);
        }
      }, 1000);
    }
  };

  const currentJapanese = questions.length > 0 ? questions[currentQuestionIndex] : [];
  const correctAnswer = type === 'special' && currentJapanese.length > 0
    ? currentJapanese.map(jp => characterMap[jp as keyof typeof characterMap])
    : currentJapanese.length > 0
    ? characterMap[currentJapanese[0] as keyof typeof characterMap]
    : '';

  const handleAnswerSelect = (selectedChoice: string | string[]) => {
    setSelectedAnswer(Array.isArray(selectedChoice) ? selectedChoice.join(',') : selectedChoice);

    if (type === 'special') {
      const isCorrect = Array.isArray(selectedChoice) && Array.isArray(correctAnswer) &&
        selectedChoice.length === correctAnswer.length &&
        selectedChoice.every((choice, index) => choice === correctAnswer[index]);

      if (isCorrect) {
        setScore(score + 1);
        setCorrectAnswers([...correctAnswers, ...currentJapanese]);
      } else {
        setWrongAnswers([...wrongAnswers, ...currentJapanese]);
      }
    } else {
      if (selectedChoice === correctAnswer) {
        setScore(score + 1);
        setCorrectAnswers([...correctAnswers, currentJapanese[0]]);
      } else {
        setWrongAnswers([...wrongAnswers, currentJapanese[0]]);
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

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setWrongAnswers([]);
    setCorrectAnswers([]);
    setIsFinished(false);
    setTimeLeft(20 * 60);
    setQuestionTimeLeft(60);

    if (type === 'special') {
      const generatedQuestions: string[][] = [];
      const count = questionCount === 0 ? Math.floor(Object.keys(characterMap).length / 3) : questionCount;

      for (let i = 0; i < count; i++) {
        generatedQuestions.push(generateThreeCharacterQuestion());
      }
      setQuestions(generatedQuestions);
    } else {
      const questionList = Object.keys(characterMap);
      const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);
      const finalQuestions = questionCount === 0 ? shuffledQuestions : shuffledQuestions.slice(0, questionCount);
      setQuestions(finalQuestions.map(q => [q]));
    }
  };

  if (isFinished) {
    const isPerfectScore = score === questions.length;

    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: '20px', position: 'relative', }}>
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
        <h2>{testTitle} 테스트 완료!</h2>
        {isPerfectScore && (
          <div style={{ marginTop: '10px', fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>
            🎉 すばらしい！100点でした！ 🎉
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
                      // 3의 배수로 맞추기 위해 빈 값 추가
                      while (items.length % 3 !== 0) {
                        items.push('');
                      }

                      return items.map((japanese, index) => (
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
                          {japanese ? (type === 'special' ? `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}` : `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}`) : ''}
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
                      // 3의 배수로 맞추기 위해 빈 값 추가
                      while (items.length % 3 !== 0) {
                        items.push('');
                      }

                      return items.map((japanese, index) => (
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
                          {japanese ? (type === 'special' ? `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}` : `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}`) : ''}
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
          <button onClick={onBackToSelect} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
            메인 화면으로
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
      <h2 style={{ marginBottom: '20px' }}>{testTitle} 테스트</h2>
      <div style={{ marginBottom: '20px' }}>
        {type === 'special' ? '아래의 글자들을 순서대로 나열한 선택지를 고르세요.' : '아래의 글자를 보고 맞는 한글을 선택해주세요.'}
      </div>
      {type === 'special' && (
        <div style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>
          남은 시간: {questionTimeLeft}초
        </div>
      )}
      <div style={{ fontSize: '48px', marginBottom: '30px' }}>
        {type === 'special' && Array.isArray(currentJapanese) ? currentJapanese.join(' ') : currentJapanese}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        {choices.length > 0 && (type === 'special' ? choices[0] : choices).map((choice, index) => {
          const choiceValue = type === 'special' ? choice : choice[0];
          const isSelected = type === 'special'
            ? selectedAnswer === (Array.isArray(choiceValue) ? choiceValue.join(',') : choiceValue)
            : selectedAnswer === choiceValue;
          const isCorrect = type === 'special'
            ? Array.isArray(correctAnswer) && Array.isArray(choiceValue) &&
              choiceValue.length === correctAnswer.length &&
              choiceValue.every((c, i) => c === correctAnswer[i])
            : choiceValue === correctAnswer;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(choiceValue)}
              disabled={selectedAnswer !== ''}
              style={{
                padding: '15px 20px',
                fontSize: '18px',
                backgroundColor: isSelected
                  ? (isCorrect ? '#28a745' : '#dc3545')
                  : selectedAnswer !== '' && isCorrect
                  ? '#28a745'
                  : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedAnswer !== '' ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s ease'
              }}
            >
              {type === 'special' && Array.isArray(choiceValue)
                ? `${index + 1}. ${choiceValue.join(', ')}`
                : choiceValue}
            </button>
          );
        })}
      </div>

      <button
        onClick={onBackToSelect}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        선택 화면으로
      </button>
    </div>
  )
}