import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  width?: string;
  height?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  width = '500px',
  height = 'auto'
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: window.innerWidth <= 480 ? '8px' : 'clamp(8px, 3vw, 20px)'
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          width: width,
          height: height,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            style={{
              padding: window.innerWidth <= 480
                ? '10px 12px'
                : 'clamp(12px, 4vw, 20px) clamp(16px, 5vw, 24px)',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(16px, 5vw, 20px)',
                fontWeight: '600',
                color: '#333',
                lineHeight: '1.2'
              }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 'clamp(20px, 6vw, 24px)',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0',
                  width: 'clamp(36px, 10vw, 44px)',
                  height: 'clamp(36px, 10vw, 44px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.color = '#333';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6c757d';
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div
          style={{
            padding: window.innerWidth <= 480
              ? '12px'
              : 'clamp(12px, 4vw, 24px)',
            flex: 1,
            overflow: 'auto'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};