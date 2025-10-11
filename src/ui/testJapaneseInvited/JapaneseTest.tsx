import { useState, useEffect } from 'react';
import { Col, Collapse, Flex, Row } from 'antd';
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
  const [questions, setQuestions] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);

  const characterMap = type === 'hiragana' ? hiraganaToKorean :
                      type === 'katakana' ? katakanaToKorean : 토로햄전용시험지;
  const testTitle = type === 'hiragana' ? '히라가나' :
                    type === 'katakana' ? '가타카나' : '토로햄전용';

  const generateChoices = (correctAnswer: string) => {
    const allAnswers = Object.values(characterMap);
    const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const randomWrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const allChoices = [correctAnswer, ...randomWrongAnswers];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const questionList = Object.keys(characterMap);
    const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);

    // questionCount가 0이면 전체 문제, 아니면 지정된 개수만큼
    const finalQuestions = questionCount === 0 ? shuffledQuestions : shuffledQuestions.slice(0, questionCount);
    setQuestions(finalQuestions);
  }, [characterMap, questionCount]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentJapanese = questions[currentQuestionIndex];
      const correctAnswer = characterMap[currentJapanese as keyof typeof characterMap];
      setChoices(generateChoices(correctAnswer));
    }
  }, [questions, currentQuestionIndex, characterMap]);

  const currentJapanese = questions[currentQuestionIndex];
  const correctAnswer = characterMap[currentJapanese as keyof typeof characterMap];

  const handleAnswerSelect = (selectedChoice: string) => {
    setSelectedAnswer(selectedChoice);

    if (selectedChoice === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentJapanese]);
    } else {
      setWrongAnswers([...wrongAnswers, currentJapanese]);
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
    const questionList = Object.keys(characterMap);
    const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);

    // questionCount가 0이면 전체 문제, 아니면 지정된 개수만큼
    const finalQuestions = questionCount === 0 ? shuffledQuestions : shuffledQuestions.slice(0, questionCount);
    setQuestions(finalQuestions);
  };

  if (isFinished) {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: '20px', }}>
        <h2>{testTitle} 테스트 완료!</h2>
        <Flex justify={'center'} align={'center'} gap={'10px'} style={{ marginTop: '10px', fontSize: '18px' }}>
          <p><span style={{ fontSize: '14px'}}>총 점수 : </span> {score} / {questions.length}</p>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', borderRadius: '9999px'}}></div>
          <p><span style={{ fontSize: '14px'}}>정답률 : </span> {((score / questions.length) * 100).toFixed(1)}%</p>
        </Flex>

        <Collapse
          style={{ marginTop: '20px', width: '80vw', margin: '0 auto' }}
          defaultActiveKey={['1', '2']}
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
                          {japanese ? `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}` : ''}
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
                          {japanese ? `${japanese} → ${characterMap[japanese as keyof typeof characterMap]}` : ''}
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
        아래의 글자를 보고 맞는 한글을 선택해주세요.
      </div>
      <div style={{ fontSize: '48px', marginBottom: '30px' }}>
        {currentJapanese}
      </div>
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
              transition: 'all 0.3s ease'
            }}
          >
            {choice}
          </button>
        ))}
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