import { useState } from 'react';

interface AddWordModalProps {
  onAddWord: (japanese: string, korean: string, yomikana?: string) => void;
}

export const AddWordModal = ({ onAddWord }: AddWordModalProps) => {
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
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  const isValid = japanese.trim().length > 0 && korean.trim().length > 0;

  return (
    <div>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(16px, 5vw, 20px)'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'clamp(6px, 2vw, 8px)',
            fontSize: 'clamp(14px, 4vw, 16px)',
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
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
              fontSize: 'clamp(14px, 4vw, 16px)',
              border: '2px solid #dee2e6',
              borderRadius: 'clamp(6px, 2vw, 8px)',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box',
              minHeight: 'clamp(44px, 12vw, 48px)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: 'clamp(6px, 2vw, 8px)',
            fontSize: 'clamp(14px, 4vw, 16px)',
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
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
              fontSize: 'clamp(14px, 4vw, 16px)',
              border: '2px solid #dee2e6',
              borderRadius: 'clamp(6px, 2vw, 8px)',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box',
              minHeight: 'clamp(44px, 12vw, 48px)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#ffc107'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
          <p style={{
            fontSize: 'clamp(11px, 3vw, 12px)',
            color: '#666',
            margin: 'clamp(3px, 1vw, 4px) 0 0 0',
            lineHeight: '1.4'
          }}>
            한자가 포함된 단어의 읽는 법을 히라가나로 입력하세요
          </p>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: 'clamp(6px, 2vw, 8px)',
            fontSize: 'clamp(14px, 4vw, 16px)',
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
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
              fontSize: 'clamp(14px, 4vw, 16px)',
              border: '2px solid #dee2e6',
              borderRadius: 'clamp(6px, 2vw, 8px)',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box',
              minHeight: 'clamp(44px, 12vw, 48px)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          style={{
            padding: 'clamp(12px, 2vw, 15px) clamp(24px, 4vw, 30px)',
            fontSize: 'clamp(14px, 4vw, 16px)',
            backgroundColor: isValid ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(6px, 2vw, 8px)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            marginTop: 'clamp(8px, 2.5vw, 10px)',
            minHeight: 'clamp(44px, 12vw, 48px)'
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
          marginTop: 'clamp(16px, 5vw, 20px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(20px, 6vw, 24px)',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: 'clamp(6px, 2vw, 8px)',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          textAlign: 'center'
        }}>
          ✅ 단어가 성공적으로 추가되었습니다!
        </div>
      )}

      <div style={{
        marginTop: 'clamp(16px, 5vw, 20px)',
        backgroundColor: '#f8f9fa',
        padding: 'clamp(12px, 4vw, 16px)',
        borderRadius: 'clamp(6px, 2vw, 8px)'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: 'clamp(10px, 3vw, 12px)', textAlign: 'center', color: '#333', fontSize: 'clamp(14px, 4vw, 16px)' }}>
          💡 입력 팁
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: 'clamp(10px, 3vw, 12px)',
          color: '#666',
          lineHeight: '1.5'
        }}>
          <li>• 히라가나, 가타카나, 한자 모두 입력 가능합니다</li>
          <li>• 한자가 포함된 단어는 요미카타를 함께 입력하면 좋습니다</li>
          <li>• 요미카타는 히라가나로 읽는 법을 입력하세요</li>
          <li>• 정확한 한국어 뜻을 입력해주세요</li>
        </ul>
      </div>
    </div>
  );
};