import React, { useContext } from 'react'
import styles from './SideBar.module.css';
import InsightsIcon from '@mui/icons-material/Insights';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, setLogin, setUserInfo } = useContext(AuthContext);

  const handleLogout = () => {
    setLogin(false);
    setUserInfo(null);
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, label: 'Dashboard' },
    { path: '/history', icon: <HistoryIcon sx={{ fontSize: 20 }} />, label: 'History' },
  ];

  if (userInfo && userInfo.role === 'admin') {
    navItems.push({ path: '/admin', icon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />, label: 'Admin' });
  }

  return (
    <div className={styles.sideBar}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <InsightsIcon sx={{ fontSize: 28, color: '#a78bfa' }} />
        </div>
        <span className={styles.logoText}>SkillSync AI</span>
      </div>

      {/* Navigation */}
      <nav className={styles.navSection}>
        <div className={styles.navLabel}>MENU</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <div className={styles.navIcon}>{item.icon}</div>
            <span>{item.label}</span>
            {location.pathname === item.path && <div className={styles.activeIndicator}></div>}
          </Link>
        ))}
      </nav>

      {/* User card + logout */}
      <div className={styles.bottomSection}>
        {userInfo && (
          <div className={styles.userCard}>
            <img
              className={styles.userAvatar}
              src={userInfo.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userInfo.name || 'User') + '&background=6366f1&color=fff'}
              alt={userInfo.name}
              referrerPolicy="no-referrer"
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userInfo.name}</div>
              <div className={styles.userEmail}>{userInfo.email}</div>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: 18 }} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

export default SideBar;