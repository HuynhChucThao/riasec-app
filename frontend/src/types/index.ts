export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RiasecInfo {
  code: RiasecKey;
  nameEn: string;
  nameVi: string;
  color: string;
  bgColor: string;
  descriptionVi: string;
  traits: string[];
}

export const RIASEC_MAP: Record<RiasecKey, RiasecInfo> = {
  R: {
    code: 'R',
    nameEn: 'Realistic',
    nameVi: 'Thực tế / Kỹ thuật',
    color: '#E05345',
    bgColor: '#FFEBEE',
    descriptionVi: 'Thích làm việc với máy móc, công cụ, vật liệu thực tế, hoạt động thể chất ngoài trời.',
    traits: ['Thực tế', 'Tháo vát', 'Khéo léo', 'Cơ khí', 'Kiên trì']
  },
  I: {
    code: 'I',
    nameEn: 'Investigative',
    nameVi: 'Nghiên cứu / Khám phá',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    descriptionVi: 'Thích tìm hiểu, nghiên cứu khoa học, giải quyết vấn đề bằng tư duy logic và trừu tượng.',
    traits: ['Tư duy', 'Logic', 'Phân tích', 'Tò mò', 'Độc lập']
  },
  A: {
    code: 'A',
    nameEn: 'Artistic',
    nameVi: 'Nghệ thuật / Sáng tạo',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    descriptionVi: 'Thích sáng tạo, giàu trí tưởng tượng, cảm nhận cái đẹp và thể hiện bản thân tự do.',
    traits: ['Sáng tạo', 'Trực giác', 'Cảm xúc', 'Độc đáo', 'Tự do']
  },
  S: {
    code: 'S',
    nameEn: 'Social',
    nameVi: 'Xã hội / Giúp đỡ',
    color: '#059669',
    bgColor: '#ECFDF5',
    descriptionVi: 'Thích giao tiếp, giúp đỡ, đào tạo, chữa lành và chăm sóc cho cộng đồng.',
    traits: ['Hòa đồng', 'Đồng cảm', 'Hợp tác', 'Thấu hiểu', 'Nhiệt huyết']
  },
  E: {
    code: 'E',
    nameEn: 'Enterprising',
    nameVi: 'Quản lý / Khởi nghiệp',
    color: '#D97706',
    bgColor: '#FFFBEB',
    descriptionVi: 'Thích lãnh đạo, đàm phán, thuyết phục người khác để đạt được mục tiêu kinh doanh.',
    traits: ['Quyết đoán', 'Tự tin', 'Thuyết phục', 'Lãnh đạo', 'Mục tiêu']
  },
  C: {
    code: 'C',
    nameEn: 'Conventional',
    nameVi: 'Nghiệp vụ / Quy chuẩn',
    color: '#475569',
    bgColor: '#F1F5F9',
    descriptionVi: 'Thích làm việc với dữ liệu, con số, hồ sơ tài liệu theo quy trình rõ ràng, ngăn nắp.',
    traits: ['Ngăn nắp', 'Chi tiết', 'Chính xác', 'Kỷ luật', 'Đáng tin cậy']
  },
};

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: 'STUDENT' | 'ADMIN';
  dreamWork?: string | null;
  avatarUrl?: string | null;
  status?: string;
  createdAt?: string;
}

export interface Occupation {
  id: number;
  jobName: string;
  description?: string | null;
  riasecCode: string; // e.g. "RIA"
  mainCode: string;   // e.g. "R"
  interestId?: number | null;
  education?: string | null;
  taskRaw?: string | null;
  skillsRaw?: string | null;
  imageName?: string | null;
  viewCount: number;
  isSaved?: boolean;
}

export interface Question {
  id: string;
  content: string;
  type: RiasecKey;
}

export interface TestResult {
  id?: string;
  resultCode: string;
  scores: Record<RiasecKey, number>;
  primaryType?: string;
  recommendedJobs?: Occupation[];
  testedAt?: string;
}

export interface TestHistoryItem {
  id: string;
  userId: string;
  resultCode: string;
  scores: Record<RiasecKey, number>;
  testedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface FeedbackItem {
  id?: string;
  content: string;
  rating: number;
  createdAt?: string;
}
