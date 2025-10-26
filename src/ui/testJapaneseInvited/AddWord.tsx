import { useState } from 'react';

interface AddWordProps {
  onAddWord: (japanese: string, korean: string, yomikana?: string) => void;
  onBack: () => void;
}

export const AddWord = ({ onAddWord, onBack }: AddWordProps) => {
  const [japanese, setJapanese] = useState('');
  const [yomikana, setYomikana] = useState('');
  const [korean, setKorean] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (japanese.trim() && korean.trim()) {
      onAddWord(japanese.trim(), korean.trim(), yomikana.trim() || undefined);
      setJapanese('');
      setYomikana('');
      setKorean('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const isValid = japanese.trim().length > 0 && korean.trim().length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '30px',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        ➕ 단어 추가
      </h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            일본어
          </label>
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            placeholder="예: 先生"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '18px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            요미카타 (선택사항)
          </label>
          <input
            type="text"
            value={yomikana}
            onChange={(e) => setYomikana(e.target.value)}
            placeholder="예: せんせい (한자가 있는 경우만)"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '18px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#ffc107'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
          <p style={{
            fontSize: '12px',
            color: '#666',
            margin: '4px 0 0 0'
          }}>
            한자가 포함된 단어의 읽는 법을 히라가나로 입력하세요
          </p>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            한국어 뜻
          </label>
          <input
            type="text"
            value={korean}
            onChange={(e) => setKorean(e.target.value)}
            placeholder="예: 선생님"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '18px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: isValid ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            marginTop: '10px'
          }}
          onMouseOver={(e) => {
            if (isValid) {
              e.currentTarget.style.backgroundColor = '#1e7e34';
            }
          }}
          onMouseOut={(e) => {
            if (isValid) {
              e.currentTarget.style.backgroundColor = '#28a745';
            }
          }}
        >
          단어 추가
        </button>
      </form>

      {showSuccess && (
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          ✅ 단어가 성공적으로 추가되었습니다!
        </div>
      )}

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h3 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>
          💡 입력 팁
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.6'
        }}>
          <li>• 히라가나, 가타카나, 한자 모두 입력 가능합니다</li>
          <li>• 한자가 포함된 단어는 요미카타를 함께 입력하면 좋습니다</li>
          <li>• 요미카타는 히라가나로 읽는 법을 입력하세요</li>
          <li>• 정확한 한국어 뜻을 입력해주세요</li>
          <li>• 테스트 모드에서 선택지로 사용됩니다</li>
        </ul>
      </div>

      <button
        onClick={onBack}
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