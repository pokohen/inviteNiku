import { useState, useEffect, useMemo } from 'react';

export function TestJapaneseInvited () {
  const testWord = useMemo(() => ({
    'あ': '아',
    'い': '이',
    'う': '우',
    'え': '에',
    'お': '오',
    'か': '카',
    'き': '키',
    'く': '쿠',
    'け': '케',
    'こ': '코',
    'さ': '사',
    'し': '시',
    'す': '스',
    'せ': '세',
    'そ': '소',
    'ざ': '자',
    'じ': '지',
    'ず': '즈',
    'ぜ': '제',
    'ぞ': '조',
  }), []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const questionList = Object.keys(testWord);
    const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
  }, [testWord]);

  const currentJapanese = questions[currentQuestionIndex];
  const correctAnswer = testWord[currentJapanese as keyof typeof testWord];

  const handleSubmit = () => {
    if (userAnswer.trim() === correctAnswer) {
      alert('정답입니다!');
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentJapanese]);
    } else {
      alert('틀렸습니다!');
      setWrongAnswers([...wrongAnswers, currentJapanese]);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
    } else {
      setIsFinished(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setWrongAnswers([]);
    setCorrectAnswers([]);
    setIsFinished(false);
    const questionList = Object.keys(testWord);
    const shuffledQuestions = questionList.sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
  };

  if (isFinished) {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center', padding: '20px' }}>
        <h2>테스트 완료!</h2>
        <p>총 점수: {score} / {questions.length}</p>
        <p>정답률: {((score / questions.length) * 100).toFixed(1)}%</p>

        <div style={{ marginTop: '20px' }}>
          <h3>맞춘 문제:</h3>
          {correctAnswers.map((japanese, index) => (
            <p key={index}>{japanese} → {testWord[japanese as keyof typeof testWord]}</p>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>틀린 문제:</h3>
          {wrongAnswers.map((japanese, index) => (
            <p key={index} style={{ color: 'red' }}>
              {japanese} → {testWord[japanese as keyof typeof testWord]}
            </p>
          ))}
        </div>

        <button onClick={resetTest} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 시작
        </button>
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
      <div style={{ marginBottom: '20px' }}>
        아래의 일본어를 보고 맞는 한글을 입력해주세요.
      </div>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        {currentJapanese}
      </div>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="한글로 입력하세요"
        style={{
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={!userAnswer.trim()}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: userAnswer.trim() ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: userAnswer.trim() ? 'pointer' : 'not-allowed'
        }}
      >
        제출
      </button>
    </div>
  )
}