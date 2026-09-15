import React from 'react';
import { Bot, Compass, History, Home, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onSelectTab('home')}
      >
        <div className="nav-icon-wrapper">
          <Home size={22} />
        </div>
        <span>Trang chủ</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => onSelectTab('explore')}
      >
        <div className="nav-icon-wrapper">
          <Compass size={22} />
        </div>
        <span>Khám phá</span>
      </button>

      {/* Center Floating AI Button */}
      <button
        className={`nav-item ai-center-btn ${activeTab === 'ai' ? 'active' : ''}`}
        onClick={() => onSelectTab('ai')}
        title="Trợ lý AI Định hướng nghề"
      >
        <Bot size={26} />
      </button>

      <button
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onSelectTab('history')}
      >
        <div className="nav-icon-wrapper">
          <History size={22} />
        </div>
        <span>Lịch sử</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onSelectTab('profile')}
      >
        <div className="nav-icon-wrapper">
          <User size={22} />
        </div>
        <span>Cá nhân</span>
      </button>
    </nav>
  );
};
