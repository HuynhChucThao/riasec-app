import React, { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { occupationApi, savedJobsApi } from '../api/client';
import { CareerCard } from '../components/common/CareerCard';
import { useAuth } from '../context/AuthContext';
import { Occupation, RIASEC_MAP, RiasecKey } from '../types';

interface ExplorePageProps {
  initialCategory?: string;
  onSelectOccupation: (occ: Occupation) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  initialCategory,
  onSelectOccupation,
}) => {
  const { user, openAuthModal } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>(initialCategory || 'ALL');
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: { keyword?: string; mainCode?: string; limit: number } = { limit: 50 };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCode !== 'ALL') params.mainCode = selectedCode;

      const res = await occupationApi.getAll(params);
      setOccupations(res.items || res.data || []);
      setTotal(res.total || 0);

      if (user) {
        const saved = await savedJobsApi.getSaved().catch(() => []);
        setSavedJobIds(new Set(saved.map((j) => j.occupation.id)));
      }
    } catch (err) {
      console.error('Lỗi tải danh sách nghề nghiệp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCode, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

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
        if (res.isSaved) next.add(occ.id);
        else next.delete(occ.id);
        return next;
      });
    } catch (err) {
      console.error('Lỗi lưu nghề:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 1. Header Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          Khám Phá Nghề Nghiệp
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Tìm kiếm và phân loại cơ hội nghề nghiệp theo mô hình tính cách RIASEC
        </p>
      </div>

      {/* 2. Search Bar Form */}
      <form onSubmit={handleSearchSubmit}>
        <div className="search-wrapper">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm nghề nghiệp, từ khóa, kỹ năng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                fetchJobs();
              }}
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* 3. Category Filter Chips (R, I, A, S, E, C) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <Filter size={14} /> Phân loại theo nhóm RIASEC:
        </div>

        <div className="chip-container">
          <button
            className={`filter-chip ${selectedCode === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCode('ALL')}
          >
            Tất cả
          </button>
          {(Object.keys(RIASEC_MAP) as RiasecKey[]).map((key) => {
            const info = RIASEC_MAP[key];
            const isActive = selectedCode === key;
            return (
              <button
                key={key}
                className={`filter-chip ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? info.color : 'var(--border-color)',
                  color: isActive ? info.color : 'var(--text-secondary)',
                  backgroundColor: isActive ? info.bgColor : 'white',
                }}
                onClick={() => setSelectedCode(key)}
              >
                <span>{key}</span> • <span>{info.nameVi.split('/')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Results Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Tìm thấy {total} nghề phù hợp
          </span>
          {selectedCode !== 'ALL' && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
              Đang lọc theo: {RIASEC_MAP[selectedCode as RiasecKey]?.nameVi}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Đang tìm kiếm nghề nghiệp...
          </div>
        ) : occupations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {occupations.map((occ) => (
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
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: '36px 20px',
              textAlign: 'center',
              border: '1px dashed var(--border-color)',
            }}
          >
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Không tìm thấy nghề nào phù hợp với từ khóa "{keyword}"
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6 }}>
              Thử tìm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục nghề.
            </p>
            <button
              className="btn-secondary"
              style={{ marginTop: 16 }}
              onClick={() => {
                setKeyword('');
                setSelectedCode('ALL');
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
