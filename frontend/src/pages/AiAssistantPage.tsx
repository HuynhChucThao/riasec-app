import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User as UserIcon } from "lucide-react";
import { aiApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ChatMessage } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AiAssistantPageProps {
  initialContext?: {
    jobName?: string;
    riasecCode?: string;
  };
}

const STARTER_PROMPTS = [
  "Tôi thuộc nhóm tính cách RIA, tôi nên theo học ngành gì?",
  "Kỹ năng cần có để trở thành Kỹ sư phần mềm là gì?",
  "Làm sao để phát triển kỹ năng lãnh đạo trong nhóm Enterprising?",
  "Khác biệt chính giữa nhóm Realistic (R) và Investigative (I)?",
];

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  initialContext,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    let welcomeText = `Xin chào ${user?.name || "bạn"}! Tôi là Trợ lý AI Tư vấn Hướng nghiệp RIASEC. Tôi có thể giúp bạn giải đáp thắc mắc về các nhóm tính cách, gợi ý ngành học và định hướng con đường nghề nghiệp phù hợp nhất.`;

    if (initialContext?.jobName) {
      welcomeText = `Tôi thấy bạn đang quan tâm đến nghề **${initialContext.jobName}** (Nhóm RIASEC: ${initialContext.riasecCode || ""}). Bạn muốn tìm hiểu thêm về lộ trình học, kỹ năng cần trang bị hay cơ hội việc làm của ngành này?`;
    } else if (initialContext?.riasecCode) {
      welcomeText = `Chúc mừng bạn đã hoàn thành bài test RIASEC với mã kết quả **${initialContext.riasecCode}**! Tôi có thể giúp bạn phân tích sâu hơn về các nghề nghiệp lý tưởng cho nhóm tính cách này.`;
    }

    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, [initialContext, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setLoading(true);

    try {
      const res = await aiApi.chat(text, {
        userRiasec: initialContext?.riasecCode,
        currentOccupation: initialContext?.jobName,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: res.reply || "Xin lỗi, tôi chưa thể xử lý yêu cầu lúc này.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn(
        "Backend AI offline, using smart rule-based guidance fallback:",
        err,
      );
      // Giúp người dùng luôn nhận được tư vấn hữu ích ngay cả khi chưa config AI API key
      const fallbackReply = generateSmartFallbackReply(text, initialContext);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  function generateSmartFallbackReply(
    query: string,
    ctx?: { jobName?: string; riasecCode?: string },
  ): string {
    const q = query.toLowerCase();
    if (
      q.includes("ria") ||
      (ctx?.riasecCode && ctx.riasecCode.includes("R"))
    ) {
      return `Nhóm tính cách **RIA (Realistic - Investigative - Artistic)** là sự kết hợp tuyệt vời giữa tư duy kỹ thuật thực tế, óc phân tích khoa học và khả năng sáng tạo độc đáo!\n\n**Các ngành nghề đề xuất hàng đầu:**\n1. Kỹ sư phần mềm / Trí tuệ nhân tạo (AI Developer)\n2. Kiến trúc sư công trình & quy hoạch đô thị\n3. Kỹ sư cơ điện tử / Robotics\n4. Chuyên viên thiết kế sản phẩm công nghiệp (UI/UX)\n\n**Lời khuyên:** Hãy chú trọng rèn luyện cả tư duy logic toán học lẫn kỹ năng thẩm mỹ thiết kế để tạo nên các sản phẩm công nghệ vừa mạnh mẽ vừa thân thiện với người dùng!`;
    }
    if (
      q.includes("kỹ sư") ||
      q.includes("công nghệ") ||
      q.includes("phần mềm")
    ) {
      return `Để theo đuổi ngành **Công nghệ thông tin / Kỹ sư phần mềm**, bạn cần chuẩn bị:\n- **Kiến thức cốt lõi:** Lập trình (JavaScript/TypeScript, Python, Java), Cấu trúc dữ liệu & Thuật toán, Cơ sở dữ liệu (SQL, NoSQL).\n- **Kỹ năng mềm:** Tư duy giải quyết vấn đề, tự học tài liệu tiếng Anh và làm việc nhóm.\n- **Lộ trình:** Bắt đầu bằng việc thực hiện các dự án thực tế (Fullstack Web/Mobile App) tương tự như hệ thống RIASEC bạn đang trải nghiệm!`;
    }
    return `Cảm ơn câu hỏi của bạn! Với định hướng theo mô hình RIASEC, bạn nên cân nhắc sự hài hòa giữa sở thích tự nhiên, năng lực học tập và nhu cầu tuyển dụng của thị trường. Bạn muốn tìm hiểu kỹ hơn về ngành nào?`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 150px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 12,
          borderBottom: "1px solid var(--border-color)",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary-teal), #00C4D4)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-teal)",
          }}
        >
          <Bot size={22} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
            }}
          >
            Trợ Lý AI Tư Vấn Nghề Nghiệp
          </h2>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
              }}
            />
            Sẵn sàng hỗ trợ 24/7
          </span>
        </div>
      </div>

      {/* Suggested prompts if few messages */}
      {messages.length <= 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Sparkles size={12} color="var(--primary-teal)" /> Gợi ý câu hỏi
            nhanh:
          </span>
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
          >
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="filter-chip"
                style={{ fontSize: "0.76rem", padding: "6px 12px" }}
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: 8,
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "85%",
                flexDirection: isUser ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: isUser
                    ? "var(--primary-blue)"
                    : "var(--primary-teal)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                {isUser ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>

              <div>
                <div
                  className={`message-bubble ${isUser ? "user" : "assistant"}`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                    textAlign: isUser ? "right" : "left",
                    padding: "0 4px",
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", gap: 8, alignSelf: "flex-start" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--primary-teal)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={16} />
            </div>
            <div
              className="message-bubble assistant"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                className="pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--primary-teal)",
                }}
              />
              <span
                className="pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--primary-teal)",
                  animationDelay: "0.2s",
                }}
              />
              <span
                className="pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--primary-teal)",
                  animationDelay: "0.4s",
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          type="text"
          className="chat-input"
          placeholder="Nhập câu hỏi tư vấn hướng nghiệp..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={loading}
        />
        <button
          className="btn-send"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || loading}
          style={{ opacity: !inputText.trim() || loading ? 0.6 : 1 }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
