import React, { useEffect, useMemo, useState } from "react";
import {
  LogOut,
  Trash2,
  Plus,
  Pencil,
  Check,
  X,
  Search,
  FileQuestion,
  Briefcase,
  MessageSquare,
  Users as UsersIcon,
  LayoutDashboard,
} from "lucide-react";
import { adminApi, occupationApi } from "../api/client";
import { ColumnsType } from "antd/es/table";
import { BaseTable } from "../components/common/BaseTable/BaseTable";
import form from "antd/es/form";
import { Select } from "antd";

type TabKey = "overview" | "questions" | "occupations" | "users" | "feedback";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg-subtle, #F5F7FA)" }}
    >
      <header style={headerStyle}>
        <h1 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
          Bảng Quản Trị RIASEC
        </h1>
        <button onClick={onLogout} style={logoutBtnStyle}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </header>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 24px 0",
          flexWrap: "wrap",
        }}
      >
        <TabButton
          icon={<LayoutDashboard size={16} />}
          label="Tổng quan"
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        />
        <TabButton
          icon={<FileQuestion size={16} />}
          label="Câu hỏi"
          active={tab === "questions"}
          onClick={() => setTab("questions")}
        />
        <TabButton
          icon={<Briefcase size={16} />}
          label="Nghề nghiệp"
          active={tab === "occupations"}
          onClick={() => setTab("occupations")}
        />
        <TabButton
          icon={<UsersIcon size={16} />}
          label="Người dùng"
          active={tab === "users"}
          onClick={() => setTab("users")}
        />
        <TabButton
          icon={<MessageSquare size={16} />}
          label="Feedback"
          active={tab === "feedback"}
          onClick={() => setTab("feedback")}
        />
      </div>

      <div style={{ padding: 24 }}>
        {tab === "overview" && <OverviewAdmin />}
        {tab === "questions" && <QuestionsAdmin />}
        {tab === "occupations" && <OccupationsAdmin />}
        {tab === "users" && <UsersAdmin />}
        {tab === "feedback" && <FeedbackAdmin />}
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 24px",
  background: "white",
  borderBottom: "1px solid #E5E7EB",
};
const logoutBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #E5E7EB",
  background: "white",
  cursor: "pointer",
  fontSize: "0.85rem",
};
const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  padding: 18,
  border: "1px solid #E5E7EB",
};
const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #E5E7EB",
  fontSize: "0.85rem",
};
const iconBtnStyle = (color: string): React.CSSProperties => ({
  color,
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: 4,
  display: "flex",
});

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 16px",
        borderRadius: "8px 8px 0 0",
        border: "none",
        borderBottom: active
          ? "2px solid var(--primary-teal, #01ADC0)"
          : "2px solid transparent",
        background: active ? "white" : "transparent",
        color: active ? "var(--primary-teal, #01ADC0)" : "#6B7280",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        fontSize: "0.88rem",
      }}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: "0.78rem", color: "#6B7280", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <Search
        size={15}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9CA3AF",
        }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, width: "100%", paddingLeft: 32 }}
      />
    </div>
  );
}

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalTests: number;
    totalOccupations: number;
    averageRating: number;
    totalFeedbacks: number;
  };
  riasecDistribution: Record<string, number>;
  recentTests: {
    id: string;
    resultCode: string;
    testedAt: string;
    user?: { name?: string; email?: string } | null;
  }[];
}

function OverviewAdmin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then(setStats)
      .catch((err: any) => console.error("Lỗi tải thống kê:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (!stats) return <p>Không tải được dữ liệu thống kê.</p>;

  const maxDist = Math.max(1, ...Object.values(stats.riasecDistribution));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Tổng người dùng" value={stats.overview.totalUsers} />
        <StatCard
          label="Học sinh/Sinh viên"
          value={stats.overview.totalStudents}
        />
        <StatCard label="Lượt làm test" value={stats.overview.totalTests} />
        <StatCard label="Nghề nghiệp" value={stats.overview.totalOccupations} />
        <StatCard
          label="Đánh giá TB"
          value={`⭐ ${stats.overview.averageRating}`}
        />
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>
          Phân bố nhóm RIASEC
        </h3>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            height: 120,
          }}
        >
          {Object.entries(stats.riasecDistribution).map(([code, count]) => (
            <div
              key={code}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                {count}
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 40,
                  borderRadius: "6px 6px 0 0",
                  background: "var(--primary-teal, #01ADC0)",
                  height: `${Math.max(6, (count / maxDist) * 80)}px`,
                }}
              />
              <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                {code}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>
          5 lượt test gần nhất
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stats.recentTests.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                borderBottom: "1px solid #F3F4F6",
                paddingBottom: 8,
              }}
            >
              <span>
                {t.user?.name || t.user?.email || "Người dùng ẩn danh"}
              </span>
              <span style={{ fontWeight: 700 }}>{t.resultCode}</span>
              <span style={{ color: "#6B7280" }}>
                {new Date(t.testedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface QuestionItem {
  id: string;
  content: string;
  type: string;
}

function QuestionsAdmin() {
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("R");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState("R");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getQuestions();
      setItems(data as QuestionItem[]);
    } catch (err) {
      console.error("Lỗi tải câu hỏi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((q) =>
        q.content.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      await adminApi.createQuestion({
        content: newContent.trim(),
        type: newType,
      });
      setNewContent("");
      load();
    } catch (err) {
      console.error("Lỗi thêm câu hỏi:", err);
    }
  };

  const startEdit = (q: QuestionItem) => {
    setEditingId(q.id);
    setEditContent(q.content);
    setEditType(q.type);
  };

  const saveEdit = async (id: string) => {
    try {
      await adminApi.updateQuestion(id, {
        content: editContent.trim(),
        type: editType,
      });
      setEditingId(null);
      load();
    } catch (err) {
      console.error("Lỗi cập nhật câu hỏi:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa câu hỏi này?")) return;
    try {
      await adminApi.deleteQuestion(id);
      load();
    } catch (err) {
      console.error("Lỗi xóa câu hỏi:", err);
    }
  };
  const columns: ColumnsType<QuestionItem> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 50,
      align: "right",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) =>
        editingId === record.id ? (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => saveEdit(record.id)}
              style={iconBtnStyle("#10B981")}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setEditingId(null)}
              style={iconBtnStyle("#6B7280")}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => startEdit(record)}
              style={iconBtnStyle("#6B7280")}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => handleDelete(record.id)}
              style={iconBtnStyle("#EF4444")}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      align: "left",
      key: "content",
      render: (_, record) =>
        editingId === record.id ? (
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />
        ) : (
          record.content
        ),
    },
    {
      title: "Nhóm",
      dataIndex: "type",
      key: "type",
      width: 90,
      render: (_, record) =>
        editingId === record.id ? (
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            style={inputStyle}
          >
            {["R", "I", "A", "S", "E", "C"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        ) : (
          record.type
        ),
    },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm câu hỏi theo nội dung..."
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Nội dung câu hỏi mới..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          style={inputStyle}
        >
          {["R", "I", "A", "S", "E", "C"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
          }}
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <BaseTable
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Không tìm thấy câu hỏi nào." }}
        />
      )}
    </div>
  );
}

interface OccupationItem {
  id: number;
  jobName: string;
  mainCode: string;
  description?: string;
  riasecCode?: string;
}

function OccupationsAdmin() {
  const [items, setItems] = useState<OccupationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    jobName: "",
    mainCode: "R",
    riasecCode: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ jobName: "", mainCode: "R" });

  const load = async (keyword?: string) => {
    setLoading(true);
    try {
      const res = await occupationApi.getAll({ keyword, limit: 100 });
      setItems((res.items || res.data || []) as OccupationItem[]);
    } catch (err) {
      console.error("Lỗi tải nghề nghiệp:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(
    () =>
      items.filter((q) =>
        q.jobName.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load(search.trim() || undefined);
  };

  const handleAdd = async () => {
    if (!form.jobName.trim()) return;
    try {
      await adminApi.createOccupation({
        jobName: form.jobName.trim(),
        mainCode: form.mainCode,
        riasecCode: form.riasecCode.trim() || form.mainCode,
        description: form.description.trim(),
      });
      setForm({ jobName: "", mainCode: "R", riasecCode: "", description: "" });
      setShowAddForm(false);
      load();
    } catch (err) {
      console.error("Lỗi thêm nghề nghiệp:", err);
    }
  };

  const startEdit = (o: OccupationItem) => {
    setEditingId(o.id);
    setEditForm({ jobName: o.jobName, mainCode: o.mainCode });
  };

  const saveEdit = async (id: number) => {
    try {
      await adminApi.updateOccupation(id, editForm);
      setEditingId(null);
      load(search.trim() || undefined);
    } catch (err) {
      console.error("Lỗi cập nhật nghề nghiệp:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa nghề nghiệp này?")) return;
    try {
      await adminApi.deleteOccupation(id);
      load(search.trim() || undefined);
    } catch (err) {
      console.error("Lỗi xóa nghề nghiệp:", err);
    }
  };
  const columnsOccupation: ColumnsType<OccupationItem> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 50,
      align: "right",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) =>
        editingId === record.id ? (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => saveEdit(record.id)}
              style={iconBtnStyle("#22C55E")}
            >
              <Check size={15} />
            </button>
            <button
              onClick={() => setEditingId(null)}
              style={iconBtnStyle("#EF4444")}
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => startEdit(record)}
              style={iconBtnStyle("#6B7280")}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => handleDelete(record.id)}
              style={iconBtnStyle("#EF4444")}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
    },
    {
      title: "Tên nghề",
      dataIndex: "jobName",
      key: "jobName",
      render: (_, record) =>
        editingId === record.id ? (
          <input
            value={editForm.jobName}
            onChange={(e) =>
              setEditForm({ ...editForm, jobName: e.target.value })
            }
            style={inputStyle}
          />
        ) : (
          record.jobName
        ),
    },
    {
      title: "Nhóm",
      dataIndex: "mainCode",
      key: "mainCode",
      width: 70,
      render: (_, record) =>
        editingId === record.id ? (
          <select
            value={editForm.mainCode}
            onChange={(e) =>
              setEditForm({ ...editForm, mainCode: e.target.value })
            }
            style={inputStyle}
          >
            {["R", "I", "A", "S", "E", "C"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        ) : (
          record.mainCode
        ),
    },
    {
      title: "Mã RIASEC",
      dataIndex: "riasecCode",
      key: "riasecCode",
      render: (_, record) =>
        editingId === record.id ? (
          <input
            value={form.riasecCode}
            onChange={(e) => setForm({ ...form, riasecCode: e.target.value })}
            style={inputStyle}
          />
        ) : (
          record.riasecCode
        ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (_, record) =>
        editingId === record.id ? (
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />
        ) : (
          record.description || "–"
        ),
    },
  ];
  return (
    <div>
      <form
        onSubmit={handleSearchSubmit}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm nghề nghiệp theo tên..."
        />
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
          }}
        >
          <Plus size={16} /> Thêm nghề
        </button>
      </form>

      {showAddForm && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 16,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Tên nghề"
            value={form.jobName}
            onChange={(e) => setForm({ ...form, jobName: e.target.value })}
            style={{ ...inputStyle, flex: 2, minWidth: 180 }}
          />
          <select
            value={form.mainCode}
            onChange={(e) => setForm({ ...form, mainCode: e.target.value })}
            style={inputStyle}
          >
            {["R", "I", "A", "S", "E", "C"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            placeholder="Mã RIASEC đầy đủ (vd: RIA)"
            value={form.riasecCode}
            onChange={(e) => setForm({ ...form, riasecCode: e.target.value })}
            style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          />
          <input
            placeholder="Mô tả ngắn"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, flex: 3, minWidth: 200 }}
          />
          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{ padding: "10px 16px" }}
          >
            Lưu
          </button>
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <BaseTable
          rowKey="id"
          columns={columnsOccupation}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Không tìm thấy nghề nghiệp nào." }}
        />
      )}
    </div>
  );
}

interface UserItem {
  id: string;
  name?: string;
  email: string;
  role: string;
  createAt?: string;
}

function UsersAdmin() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setItems(data);
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.name || "").toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await adminApi.updateUserRole(id, role);
      load();
    } catch (err) {
      console.error("Lỗi đổi quyền người dùng:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa người dùng này?")) return;
    try {
      await adminApi.deleteUser(id);
      load();
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err);
    }
  };

  const columnsUser: ColumnsType<UserItem> = [
    {
      title: "STT",
      key: "index",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => handleDelete(record.id)}
            style={iconBtnStyle("#EF4444")}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      width: 140,
      render: (_, record) => (
        <Select
          value={record.role}
          onChange={(e) => handleRoleChange(record.id, e)}
          style={inputStyle}
        >
          <Select.Option value="STUDENT">STUDENT</Select.Option>
          <Select.Option value="ADMIN">ADMIN</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc email..."
        />
      </div>

      <BaseTable
        rowKey="id"
        columns={columnsUser}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "Không tìm thấy người dùng nào." }}
      />
    </div>
  );
}
interface FeedbackItem {
  id: string;
  userEmail: string;
  rating: number;
  content: string;
}

function FeedbackAdmin() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getFeedback()
      .then((data: FeedbackItem[]) => setItems(data))
      .catch((err: any) => console.error("Lỗi tải feedback:", err))
      .finally(() => setLoading(false));
  }, []);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1 sao ... index 4 = 5 sao
    items.forEach((f) => {
      const r = Math.round(f.rating);
      if (r >= 1 && r <= 5) counts[r - 1]++;
    });
    return counts;
  }, [items]);

  const maxCount = Math.max(1, ...distribution);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={cardStyle}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>
          Phân bố đánh giá sao ({items.length} lượt)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1];
            return (
              <div
                key={star}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{ width: 40, fontSize: "0.8rem", color: "#6B7280" }}
                >
                  {star} ⭐
                </span>
                <div
                  style={{
                    flex: 1,
                    background: "#F3F4F6",
                    borderRadius: 6,
                    height: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      background: "var(--primary-teal, #01ADC0)",
                      height: "100%",
                    }}
                  />
                </div>
                <span
                  style={{ width: 24, fontSize: "0.8rem", textAlign: "right" }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((f) => (
          <div key={f.id} style={{ ...cardStyle, padding: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.82rem",
                color: "#6B7280",
              }}
            >
              <span>{f.userEmail}</span>
              <span>{"⭐".repeat(Math.round(f.rating))}</span>
            </div>
            <p style={{ marginTop: 6 }}>{f.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
