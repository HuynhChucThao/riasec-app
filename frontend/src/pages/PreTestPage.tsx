import React from 'react';
import { ArrowLeft, CheckCircle, Clock, HelpCircle, Sparkles } from 'lucide-react';

interface PreTestPageProps {
  onStartTest: () => void;
  onBack: () => void;
}

export const PreTestPage: React.FC<PreTestPageProps> = ({ onStartTest, onBack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back button */}
      <div>
        <button
          className="btn-secondary"
          onClick={onBack}
          style={{ padding: '8px 14px', borderRadius: 20, fontSize: '0.82rem' }}
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>

      {/* Hero Header */}
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--primary-teal-glow)',
            color: 'var(--primary-teal)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Sparkles size={28} />
        </div>

        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 8,
          }}
        >
          Khám Phá Con Đường Sự Nghiệp
        </h1>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 380, margin: '0 auto' }}>
          Bài kiểm tra RIASEC giúp bạn tìm thấy các ngành nghề phù hợp nhất với sở thích tự nhiên và đặc điểm tính cách của bản thân.
        </p>
      </div>

      {/* Info Stats (Duration & Total Questions) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 18,
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>THỜI GIAN</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>5 - 10 Phút</div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 18,
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#F0FDF4',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>TỔNG CÂU HỎI</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>42 Câu hỏi</div>
          </div>
        </div>
      </div>

      {/* Tips Before You Start (Before you start guidelines from Android) */}
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 22,
          border: '1px solid var(--border-color)',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            marginBottom: 14,
            color: 'var(--text-primary)',
          }}
        >
          Lưu ý trước khi bắt đầu (Before You Start)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong>Không có câu trả lời đúng hay sai:</strong> Mọi câu trả lời đều phản ánh sở thích trung thực của bạn.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong>Trả lời thật lòng:</strong> Hãy chọn mức độ bạn thực sự thích hoặc thấy đúng với bản thân ở thời điểm hiện tại.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong>Đừng suy nghĩ quá lâu:</strong> Trực giác và phản xạ đầu tiên thường phản ánh chính xác nhất sở thích của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button className="btn-primary" onClick={onStartTest} style={{ padding: '16px' }}>
        <span>Tôi Đã Sẵn Sàng - Bắt Đầu Làm Bài</span>
      </button>
    </div>
  );
};
