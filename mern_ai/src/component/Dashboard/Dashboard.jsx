import React, { useState, useContext, useRef } from 'react'
import styles from './Dashboard.module.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { AuthContext } from '../../utils/AuthContext';
import axios from '../../utils/axios';

const Dashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) {
      return;
    }
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_desc', jobDesc);
    formData.append('user', userInfo?.email || 'anonymous');

    try {
      const response = await axios.post('/api/resume/addResume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      setResult(response.data.data);
    } catch (error) {
      console.error(error);
      setResult({ error: true, message: 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--score-high)';
    if (score >= 50) return 'var(--score-mid)';
    return 'var(--score-low)';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className={styles.Dashboard}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Upload your resume and get AI-powered analysis</p>
        </div>
        {userInfo && (
          <div className={styles.userBadge}>
            <img
              src={userInfo.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userInfo.name || 'U') + '&background=6366f1&color=fff'}
              alt=""
              className={styles.userBadgeAvatar}
              referrerPolicy="no-referrer"
            />
            <span>{userInfo.name}</span>
          </div>
        )}
      </div>

      <div className={styles.mainGrid}>
        {/* Left column — inputs */}
        <div className={styles.inputSection}>
          {/* Upload area */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>
              <CloudUploadIcon sx={{ fontSize: 18 }} />
              <span>Resume Upload</span>
            </div>
            <div
              className={`${styles.uploadZone} ${dragActive ? styles.uploadZoneActive : ''} ${file ? styles.uploadZoneHasFile : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              {file ? (
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>
                    <InsertDriveFileIcon sx={{ fontSize: 28, color: '#6366f1' }} />
                  </div>
                  <div>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <CheckCircleIcon sx={{ fontSize: 22, color: '#10b981', marginLeft: 'auto' }} />
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIconWrap}>
                    <CloudUploadIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                  </div>
                  <p className={styles.uploadText}>Drag & drop your PDF resume here</p>
                  <p className={styles.uploadSubtext}>or click to browse • PDF only</p>
                </div>
              )}
            </div>
          </div>

          {/* Job description */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>
              <DescriptionIcon sx={{ fontSize: 18 }} />
              <span>Job Description</span>
            </div>
            <textarea
              className={styles.textArea}
              placeholder="Paste the complete job description here..."
              rows={8}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <div className={styles.textAreaFooter}>
              <span>{jobDesc.length} characters</span>
            </div>
          </div>

          {/* Analyze button */}
          <button
            className={styles.analyzeBtn}
            onClick={handleAnalyze}
            disabled={!file || !jobDesc.trim() || loading}
          >
            {loading ? (
              <>
                <div className={styles.btnSpinner}></div>
                <span>Analyzing with AI...</span>
              </>
            ) : (
              <>
                <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                <span>Analyze Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Right column — results */}
        <div className={styles.resultSection}>
          {loading && (
            <div className={styles.loadingCard}>
              <div className={styles.loadingAnimation}>
                <div className={styles.loadingOrb}></div>
                <div className={styles.loadingOrb2}></div>
              </div>
              <h3>AI is analyzing your resume...</h3>
              <p>This may take up to 30 seconds</p>
              <div className={styles.loadingBar}>
                <div className={styles.loadingBarFill}></div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'var(--text-muted)' }} />
              </div>
              <h3>Your Results Will Appear Here</h3>
              <p>Upload a resume and paste a job description to get started</p>
            </div>
          )}

          {result && !result.error && (
            <div className={styles.resultCard}>
              <div className={styles.scoreSection}>
                <div
                  className={styles.scoreCircle}
                  style={{
                    '--score-color': getScoreColor(result.score),
                    '--score-deg': `${(result.score / 100) * 360}deg`
                  }}
                >
                  <div className={styles.scoreInner}>
                    <span className={styles.scoreValue}>{result.score}</span>
                    <span className={styles.scorePercent}>%</span>
                  </div>
                </div>
                <div className={styles.scoreLabel} style={{ color: getScoreColor(result.score) }}>
                  {getScoreLabel(result.score)}
                </div>
              </div>

              <div className={styles.feedbackSection}>
                <h3 className={styles.feedbackTitle}>AI Feedback</h3>
                <p className={styles.feedbackText}>{result.feedback}</p>
              </div>

              <div className={styles.resultMeta}>
                <span>📄 {result.resume_name}</span>
                <span>🕐 {new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {result && result.error && (
            <div className={styles.errorCard}>
              <h3>⚠️ Analysis Failed</h3>
              <p>{result.message}</p>
              <button className={styles.retryBtn} onClick={handleAnalyze}>Try Again</button>
            </div>
          )}

          {/* Info card */}
          <div className={styles.infoCard}>
            <h4>💡 Tips for Best Results</h4>
            <ul>
              <li>Upload your complete resume in PDF format</li>
              <li>Paste the full job description including requirements</li>
              <li>Include specific skills and qualifications mentioned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithAuthHOC(Dashboard)