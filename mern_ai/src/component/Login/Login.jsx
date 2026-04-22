import React, { useContext, useState } from 'react'
import styles from './Login.module.css';
import GoogleIcon from '@mui/icons-material/Google';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {
  const { setLogin, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const baseUserData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }

      let userDataToSave = baseUserData;

      try {
        const response = await axios.post('/api/user', baseUserData);
        if (response.data && response.data.user) {
          userDataToSave = {
            ...baseUserData,
            role: response.data.user.role
          };
        }
      } catch (error) {
        console.log(error);
      }

      setLogin(true);
      setUserInfo(userDataToSave);
      localStorage.setItem('isLogin', true);
      localStorage.setItem('userInfo', JSON.stringify(userDataToSave));
      navigate('/dashboard');
    }
    catch (error) {
      alert("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.Login}>
      {/* Animated background orbs */}
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>
      <div className={styles.orb3}></div>

      <div className={styles.loginContainer}>
        {/* Left side — branding */}
        <div className={styles.brandingSide}>
          <div className={styles.brandLogo}>
            <InsightsIcon sx={{ fontSize: 42 }} />
            <span>SkillSync AI</span>
          </div>
          <h1 className={styles.brandTitle}>
            Your Resume,<br />
            <span className={styles.gradientText}>Supercharged</span>
          </h1>
          <p className={styles.brandSubtitle}>
            AI-powered resume analysis that matches your skills against any job description in seconds.
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <AutoAwesomeIcon sx={{ fontSize: 20, color: '#a78bfa' }} />
              <span>AI-Powered Scoring</span>
            </div>
            <div className={styles.featureItem}>
              <WorkspacePremiumIcon sx={{ fontSize: 20, color: '#06b6d4' }} />
              <span>Actionable Feedback</span>
            </div>
            <div className={styles.featureItem}>
              <InsightsIcon sx={{ fontSize: 20, color: '#10b981' }} />
              <span>Skill Gap Analysis</span>
            </div>
          </div>
        </div>

        {/* Right side — login card */}
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to continue your analysis</p>
          </div>

          <button
            className={styles.googleBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <GoogleIcon sx={{ fontSize: 22 }} />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;