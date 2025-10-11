interface QuestionCountSelectProps {
  testType: 'hiragana' | 'katakana';
  onQuestionCountSelect: (count: number) => void;
  onBackToSelect: () => void;
}

export const QuestionCountSelect = ({ testType, onQuestionCountSelect, onBackToSelect }: QuestionCountSelectProps) => {
  const testTitle = testType === 'hiragana' ? '히라가나' : '가타카나';

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
        {testTitle} 테스트
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        문제 수를 선택해주세요
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button
          onClick={() => onQuestionCountSelect(20)}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          20문제
        </button>

        <button
          onClick={() => onQuestionCountSelect(40)}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          40문제
        </button>

        <button
          onClick={() => onQuestionCountSelect(0)}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
        >
          전체 문제 (Full)
        </button>
      </div>

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
        돌아가기
      </button>
    </div>
  );
};