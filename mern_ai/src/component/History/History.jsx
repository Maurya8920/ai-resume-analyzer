import React, { useState, useEffect, useContext } from 'react'
import styles from './History.module.css'
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { AuthContext } from '../../utils/AuthContext';
import axios from '../../utils/axios';
import HistoryIcon from '@mui/icons-material/History';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const History = () => {
  const { userInfo } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const email = userInfo?.email?.trim().toLowerCase();
        if (!email) return;
        const response = await axios.get(`/api/resume/get/${email}`);
        setResumes(response.data.resumes || []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userInfo]);

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

  return (
    <div className={styles.History}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <HistoryIcon sx={{ fontSize: 24, color: '#a78bfa' }} />
        </div>
        <div>
          <h1 className={styles.pageTitle}>Analysis History</h1>
          <p className={styles.pageSubtitle}>
            {resumes.length > 0
              ? `${resumes.length} analysis${resumes.length > 1 ? 'es' : ''} found`
              : 'Your past resume analyses will appear here'}
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonScore}></div>
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
          <h3>No Analyses Yet</h3>
          <p>Head to the Dashboard to analyze your first resume</p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && resumes.length > 0 && (
        <div className={styles.cardGrid}>
          {resumes.map((resume, index) => (
            <div
              key={resume._id || index}
              className={styles.historyCard}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Score badge */}
              <div
                className={styles.scoreBadge}
                style={{ background: getScoreGradient(resume.score) }}
              >
                {resume.score != null ? `${resume.score}%` : 'N/A'}
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>
                  <InsertDriveFileIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                  <span>{resume.resume_name || 'Resume.pdf'}</span>
                </div>

                <p className={styles.cardFeedback}>
                  {resume.feedback
                    ? resume.feedback.length > 150
                      ? resume.feedback.substring(0, 150) + '...'
                      : resume.feedback
                    : 'No feedback available'}
                </p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>
                    {resume.createdAt
                      ? new Date(resume.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Unknown date'}
                  </span>
                  <div
                    className={styles.scoreIndicator}
                    style={{ backgroundColor: getScoreColor(resume.score) }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WithAuthHOC(History)