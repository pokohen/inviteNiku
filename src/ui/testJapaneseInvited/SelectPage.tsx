interface SelectPageProps {
  onTypeSelect: (type: 'hiragana' | 'katakana' | 'special' | 'vocabulary') => void;
}
const correctAnswer = 'totoro';

export const SelectPage = ({ onTypeSelect }: SelectPageProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '30px' }}>
      <h1
        style={{ fontSize: '32px', marginBottom: '20px', cursor: 'pointer', textAlign: 'center' }}
        onClick={() => {
          const correct = prompt(`해당 시험은 따로 관리하고 있습니다.\n해당 페이지로 이동하기 위해 비밀번호를 입력해주세요.`);
          if (correct === correctAnswer) {
            onTypeSelect('special');
          } else if (correct !== null) {
            alert('비밀번호가 틀렸습니다.');
          }
        }}
      >
        일본어<br/>히라가나 / 카타카나<br/>테스트
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>학습하고 싶은 문자를 선택해주세요</p>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          onClick={() => onTypeSelect('hiragana')}
          style={{
            padding: '20px 40px',
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          히라가나<br/>(ひらがな)
        </button>

        <button
          onClick={() => onTypeSelect('katakana')}
          style={{
            padding: '20px 40px',
            fontSize: '18px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          가타카나<br/>(カタカナ)
        </button>
      </div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => onTypeSelect('vocabulary')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '20px 40px',
            fontSize: '18px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0a800'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
        >
          📚 나만의 단어장
        </button>
      </div>
    </div>
  );
}