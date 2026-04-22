import React, { useState, useEffect, useContext } from 'react'
import styles from './Admin.module.css';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmailIcon from '@mui/icons-material/Email';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const Admin = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo && userInfo.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchAll = async () => {
      try {
        const response = await axios.get('/api/resume/get');
        setResumes(response.data.resumes || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getScoreColor = (score) => {
    const s = parseInt(score);
    if (s >= 75) return 'var(--score-high)';
    if (s >= 50) return 'var(--score-mid)';
    return 'var(--score-low)';
  };

  const getScoreGradient = (score) => {
    const s = parseInt(score);
    if (s >= 75) return 'linear-gradient(135deg, #10b981, #06b6d4)';
    if (s >= 50) return 'linear-gradient(135deg, #f59e0b, #f97316)';
    return 'linear-gradient(135deg, #ef4444, #ec4899)';
  };

  // Compute stats
  const totalSubmissions = resumes.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(resumes.reduce((sum, r) => sum + (parseInt(r.score) || 0), 0) / totalSubmissions)
    : 0;
  const highScores = resumes.filter(r => parseInt(r.score) >= 75).length;
  const uniqueUsers = new Set(resumes.map(r => r.user)).size;

  const stats = [
    { label: 'Total Submissions', value: totalSubmissions, icon: <AssessmentIcon sx={{ fontSize: 22 }} />, gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: <TrendingUpIcon sx={{ fontSize: 22 }} />, gradient: 'linear-gradient(135deg, #06b6d4, #10b981)' },
    { label: 'High Matches', value: highScores, icon: <TrendingUpIcon sx={{ fontSize: 22 }} />, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { label: 'Unique Users', value: uniqueUsers, icon: <PeopleIcon sx={{ fontSize: 22 }} />, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  ];

  return (
    <div className={styles.Admin}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <AdminPanelSettingsIcon sx={{ fontSize: 24, color: '#a78bfa' }} />
        </div>
        <div>
          <h1 className={styles.pageTitle}>Admin Panel</h1>
          <p className={styles.pageSubtitle}>Overview of all user submissions</p>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.statIcon} style={{ background: stat.gradient }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{loading ? '—' : stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section title */}
      <div className={styles.sectionHeader}>
        <h2>All Submissions</h2>
        <span className={styles.sectionCount}>{resumes.length} records</span>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLineShort}></div>
              <div className={styles.skeletonBlock}></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && resumes.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <SearchOffIcon sx={{ fontSize: 56, color: 'var(--text-muted)' }} />
          </div>
          <h3>No Submissions Yet</h3>
          <p>Submissions from all users will appear here</p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && resumes.length > 0 && (
        <div className={styles.cardGrid}>
          {resumes.map((resume, index) => (
            <div
              key={resume._id || index}
              className={styles.adminCard}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Top section with score */}
              <div className={styles.cardTop}>
                <div
                  className={styles.scorePill}
                  style={{ background: getScoreGradient(resume.score) }}
                >
                  {resume.score != null ? `${resume.score}%` : 'N/A'}
                </div>
              </div>

              {/* User info */}
              <div className={styles.cardUser}>
                <div className={styles.userAvatar} style={{ background: getScoreGradient(resume.score) }}>
                  {(resume.user || '?')[0].toUpperCase()}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{resume.user || 'Unknown'}</div>
                  <div className={styles.userEmail}>
                    <EmailIcon sx={{ fontSize: 12 }} />
                    <span>{resume.user || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Resume name */}
              <div className={styles.resumeName}>
                📄 {resume.resume_name || 'Resume.pdf'}
              </div>

              {/* Feedback preview */}
              <p className={styles.cardFeedback}>
                {resume.feedback
                  ? resume.feedback.length > 120
                    ? resume.feedback.substring(0, 120) + '...'
                    : resume.feedback
                  : 'No feedback available'}
              </p>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <span>
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : '—'}
                </span>
                <div
                  className={styles.scoreIndicator}
                  style={{ backgroundColor: getScoreColor(resume.score) }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WithAuthHOC(Admin);