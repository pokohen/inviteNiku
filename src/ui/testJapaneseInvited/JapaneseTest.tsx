import { useState, useEffect } from 'react';
import { hiraganaToKorean } from '@/shared/hiragana';
import { katakanaToKorean } from '@/shared/katakana';
import { 토로햄전용시험지 } from '@/shared/토로햄전용시험';

interface JapaneseTestProps {
  type: 'hiragana' | 'katakana' | 'special';
  onBackToSelect: () => void;
}

export function JapaneseTest({ type, onBackToSelect }: JapaneseTestProps) {
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
    setQuestions(shuffledQuestions);
  }, [characterMap]);

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
    setQuestions(shuffledQuestions);
  };

  if (isFinished) {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: '20px' }}>
        <h2>{testTitle} 테스트 완료!</h2>
        <p>총 점수: {score} / {questions.length}</p>
        <p>정답률: {((score / questions.length) * 100).toFixed(1)}%</p>

        <div style={{ marginTop: '20px' }}>
          <h3>맞춘 문제:</h3>
          {correctAnswers.map((japanese, index) => (
            <p key={index}>{japanese} → {characterMap[japanese as keyof typeof characterMap]}</p>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>틀린 문제:</h3>
          {wrongAnswers.map((japanese, index) => (
            <p key={index} style={{ color: 'red' }}>
              {japanese} → {characterMap[japanese as keyof typeof characterMap]}
            </p>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={resetTest} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            다시 하기
          </button>
          <button onClick={onBackToSelect} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
            선택 화면으로
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