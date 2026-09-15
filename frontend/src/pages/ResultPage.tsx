import React, { useEffect, useState } from 'react';
import {
  Award,
  Bot,
  HeartHandshake,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { occupationApi, savedJobsApi } from '../api/client';
import { CareerCard } from '../components/common/CareerCard';
import { Modal } from '../components/common/Modal';
import { RiasecBadge } from '../components/common/RiasecBadge';
import { useAuth } from '../context/AuthContext';
import { Occupation, RIASEC_MAP, RiasecKey, TestResult } from '../types';

interface ResultPageProps {
  result: TestResult;
  onRetest: () => void;
  onSelectOccupation: (occ: Occupation) => void;
  onAskAiWithResult: (code: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onRetest,
  onSelectOccupation,
  onAskAiWithResult,
}) => {
  const { user, openAuthModal } = useAuth();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  const [recommendedJobs, setRecommendedJobs] = useState<Occupation[]>(result.recommendedJobs || []);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);

  const scores = result.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const sortedKeys = (Object.keys(scores) as RiasecKey[]).sort((a, b) => scores[b] - scores[a]);

  const top1 = sortedKeys[0] || 'R';
  const top2 = sortedKeys[1] || 'I';
  const top3 = sortedKeys[2] || 'A';

  const top1Info = RIASEC_MAP[top1];
  const top2Info = RIASEC_MAP[top2];
  const top3Info = RIASEC_MAP[top3];

  const maxScore = Math.max(...Object.values(scores), 1);

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoadingJobs(true);
      try {
        // Lấy các nghề có mainCode hoặc riasecCode trùng với Top 1 và Top 2
        const res = await occupationApi.getAll({ mainCode: top1, limit: 6 });
        setRecommendedJobs(res.items || res.data || []);

        if (user) {
          const saved = await savedJobsApi.getSaved().catch(() => []);
          setSavedJobIds(new Set(saved.map((j) => j.id)));
        }
      } catch (err) {
        console.error('Lỗi lấy nghề đề xuất:', err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchRecommended();
  }, [top1, user]);

  const handleToggleSave = async (occ: Occupation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      const res = await savedJobsApi.toggleSave(occ.id);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (res.saved) next.add(occ.id);
        else next.delete(occ.id);
        return next;
      });
    } catch (err) {
      console.error('Lỗi lưu nghề:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 24,
          padding: '28px 22px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38BDF8', fontSize: '0.78rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          <Sparkles size={16} /> KẾT QUẢ PHÂN TÍCH RIASEC
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1.25 }}>
          Mã Tính Cách: <span style={{ color: '#38BDF8' }}>{result.resultCode || `${top1}${top2}${top3}`}</span>
        </h1>

        <p style={{ fontSize: '0.86rem', color: '#94A3B8', marginTop: 8, lineHeight: 1.5 }}>
          Nhóm sở thích nổi bật nhất của bạn là <strong>{top1Info.nameVi}</strong> ({top1Info.nameEn}), kế tiếp là {top2Info.nameVi} và {top3Info.nameVi}.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <RiasecBadge code={top1} size="lg" />
          <RiasecBadge code={top2} size="lg" />
          <RiasecBadge code={top3} size="lg" />
        </div>
      </div>

      {/* 2. Top 3 Match Cards (activity_result.xml) */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Award size={20} color="var(--primary-teal)" />
          Top 3 Nhóm Tính Cách Của Bạn
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* #1 Top Match */}
          <div
            style={{
              background: 'white',
              borderRadius: 18,
              padding: 20,
              border: `2px solid ${top1Info.color}`,
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: top1Info.color, letterSpacing: 0.5 }}>
                #1 TOP MATCH
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {scores[top1]} điểm
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <RiasecBadge code={top1} size="lg" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {top1Info.nameVi} ({top1Info.nameEn})
              </h4>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {top1Info.descriptionVi}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {top1Info.traits.map((t, i) => (
                <span key={i} style={{ background: top1Info.bgColor, color: top1Info.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* #2 Match */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                #2 SECOND MATCH
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{scores[top2]} điểm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiasecBadge code={top2} size="md" />
              <div style={{ fontSize: '0.98rem', fontWeight: 700 }}>{top2Info.nameVi}</div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{top2Info.descriptionVi}</p>
          </div>

          {/* #3 Match */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                #3 THIRD MATCH
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{scores[top3]} điểm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiasecBadge code={top3} size="md" />
              <div style={{ fontSize: '0.98rem', fontWeight: 700 }}>{top3Info.nameVi}</div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{top3Info.descriptionVi}</p>
          </div>
        </div>
      </div>

      {/* 3. Interest Distribution Breakdown (Interest Distribution) */}
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 22,
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: 14 }}>
          Phân Phối Điểm Số 6 Nhóm RIASEC
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(Object.keys(RIASEC_MAP) as RiasecKey[]).map((key) => {
            const item = RIASEC_MAP[key];
            const score = scores[key] || 0;
            const pct = Math.round((score / (maxScore * 1.15)) * 100);

            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: item.color }}>
                    {key} - {item.nameVi.split('/')[0]} ({item.nameEn})
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{score} điểm</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: item.color,
                      borderRadius: 99,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI Career Advice Callout */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284C7, #0369A1)',
          borderRadius: 20,
          padding: 20,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bot size={28} color="#E0F2FE" />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Tư Vấn Chuyên Sâu Cùng AI</h4>
            <p style={{ fontSize: '0.8rem', color: '#BAE6FD', marginTop: 2 }}>
              Nhận lộ trình học tập và lời khuyên phát triển nghề nghiệp theo nhóm tính cách {top1}{top2}{top3} của bạn.
            </p>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ background: 'white', color: '#0369A1', fontWeight: 800 }}
          onClick={() => onAskAiWithResult(result.resultCode || `${top1}${top2}${top3}`)}
        >
          <Bot size={18} /> Trò Chuyện Cùng Trợ Lý AI
        </button>
      </div>

      {/* 5. Recommended Occupations Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={20} color="var(--primary-teal)" />
            Nghề Nghiệp Phù Hợp Nhất Cho Bạn
          </h3>
        </div>

        {loadingJobs ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            Đang gợi ý các nghề phù hợp...
          </div>
        ) : recommendedJobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendedJobs.map((occ) => (
              <CareerCard
                key={occ.id}
                occupation={occ}
                onClick={onSelectOccupation}
                onToggleSave={handleToggleSave}
                isSaved={savedJobIds.has(occ.id)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 20, background: 'white', borderRadius: 16 }}>
            Chưa có gợi ý cụ thể. Hãy khám phá thêm trong thư viện nghề nghiệp!
          </div>
        )}
      </div>

      {/* 6. Footer Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" onClick={onRetest} style={{ flex: 1 }}>
          <RotateCcw size={16} /> Làm lại bài test
        </button>
      </div>

      {/* Gentle Reminder Disclaimer Dialog (dialog_result_disclaimer.xml) */}
      <Modal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="Lời Nhắn Nhủ Từ Chuyên Gia"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <HeartHandshake size={28} />
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Kết quả bài test RIASEC này là một <strong>kim chỉ nam hữu ích</strong> dựa trên sở thích và xu hướng tính cách hiện tại của bạn, không phải là giới hạn hay quyết định duy nhất cho tương lai.
            <br /><br />
            Hãy sử dụng kết quả này như một điểm khởi đầu để tự tin khám phá các cơ hội nghề nghiệp rộng mở!
          </p>

          <button
            className="btn-primary"
            onClick={() => setShowDisclaimer(false)}
          >
            Đã hiểu, cùng khám phá ngay!
          </button>
        </div>
      </Modal>
    </div>
  );
};
