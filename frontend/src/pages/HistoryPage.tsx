import React, { useEffect, useState } from 'react';
import { Calendar, History, LogIn, Sparkles } from 'lucide-react';
import { assessmentApi } from '../api/client';
import { RiasecBadge } from '../components/common/RiasecBadge';
import { useAuth } from '../context/AuthContext';
import { RiasecKey, TestHistoryItem, TestResult } from '../types';

interface HistoryPageProps {
  onSelectResult: (result: TestResult) => void;
  onStartTest: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectResult, onStartTest }) => {
  const { user, openAuthModal } = useAuth();
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const data = await assessmentApi.getHistory();
          setHistory(data || []);
        } catch (err) {
          console.error('Lỗi tải lịch sử:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (!user) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '40px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#F1F5F9',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <History size={26} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          Đăng Nhập Để Lưu Lịch Sử
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 320, margin: '8px auto 20px' }}>
          Đăng nhập vào tài khoản của bạn để lưu lại và theo dõi tiến trình thay đổi sở thích nghề nghiệp theo thời gian.
        </p>
        <button
          className="btn-primary"
          style={{ width: 'auto', display: 'inline-flex' }}
          onClick={openAuthModal}
        >
          <LogIn size={16} />
          <span>Đăng Nhập Ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          Lịch Sử Kiểm Tra RIASEC
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Xem lại các kết quả trắc nghiệm tính cách bạn đã hoàn thành
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Đang tải lịch sử kiểm tra...
        </div>
      ) : history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.map((item) => {
            const dateStr = new Date(item.testedAt).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: 18,
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() =>
                  onSelectResult({
                    id: item.id,
                    resultCode: item.resultCode,
                    scores: item.scores as Record<RiasecKey, number>,
                    testedAt: item.testedAt,
                  })
                }
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>{dateStr}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
                    Chi tiết &rarr;
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    Mã kết quả: <span style={{ color: 'var(--primary-teal)' }}>{item.resultCode}</span>
                  </div>
                  {/* <div style={{ display: 'flex', gap: 4 }}>
                    {item.resultCode.split('').map((char, i) => (
                      <RiasecBadge key={i} code={char} size="sm" />
                    ))}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: 18,
            padding: '36px 20px',
            textAlign: 'center',
            border: '1px dashed var(--border-color)',
          }}
        >
          <Sparkles size={32} color="var(--primary-teal)" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Bạn chưa thực hiện bài kiểm tra nào
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Hãy hoàn thành bài test đầu tiên để nhận định hướng nghề nghiệp phù hợp!
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: 16, width: 'auto', display: 'inline-flex' }}
            onClick={onStartTest}
          >
            Bắt đầu làm bài ngay
          </button>
        </div>
      )}
    </div>
  );
};
