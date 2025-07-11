"use client";
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseApp } from '../../../firebaseConfig';
import { useRef } from 'react';

// Color tokens
const MOSS = '#264A2E';
const SAGE = '#8FA88F';
const SAGE_LIGHT = '#F8F8F4';
const ERROR = '#C64840';

interface LoginModalProps {
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 32, 36, 0.32)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(2px)'
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  boxShadow: '0 8px 20px rgba(0,0,0,.12)',
  maxWidth: 420,
  width: '90vw',
  padding: '40px 48px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: 'fadeInScale 180ms cubic-bezier(.4,0,.2,1)'
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  width: 36,
  height: 36,
  background: 'none',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  color: '#6F6F6F',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem',
  borderRadius: 10,
  border: 'none',
  fontWeight: 600,
  fontSize: '1.08rem',
  margin: '0.5rem 0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10
};

const inputStyle: React.CSSProperties = {
  height: 48,
  width: '100%',
  border: `1.5px solid ${SAGE}`,
  borderRadius: 10,
  background: SAGE_LIGHT,
  padding: '0 14px 0 44px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 16,
  marginBottom: 0,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: MOSS,
  boxShadow: '0 0 0 2px rgba(38,74,46,.15)'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  top: 14,
  width: 20,
  height: 20,
  color: SAGE,
  pointerEvents: 'none',
};

const eyeIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: 16,
  top: 14,
  width: 20,
  height: 20,
  color: SAGE,
  cursor: 'pointer',
};

const btnPrimary: React.CSSProperties = {
  height: 48,
  width: '100%',
  background: MOSS,
  color: '#FFF',
  fontWeight: 600,
  fontSize: 16,
  fontFamily: 'Inter, sans-serif',
  borderRadius: 12,
  border: 'none',
  margin: '18px 0 0 0',
  transition: 'background 0.15s',
  cursor: 'pointer',
  boxShadow: 'none',
  outline: 'none',
  display: 'block',
};

const btnPrimaryDisabled: React.CSSProperties = {
  ...btnPrimary,
  background: SAGE,
  cursor: 'not-allowed',
};

const textLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: MOSS,
  fontWeight: 500,
  fontSize: 15,
  textDecoration: 'underline',
  margin: '14px 0 0 0',
  cursor: 'pointer',
  display: 'block',
};

const forgotStyle: React.CSSProperties = {
  color: '#6F6F6F',
  fontSize: 14,
  textAlign: 'right',
  width: '100%',
  margin: '8px 0 0 0',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const errorStyle: React.CSSProperties = {
  color: ERROR,
  fontSize: 13,
  margin: '6px 0 0 0',
  minHeight: 18,
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState<'main' | 'email' | 'loggedin'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);

  const auth = getAuth(firebaseApp);

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setStep('loggedin');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setStep('loggedin');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setStep('main');
  };

  // Stubs for phone, Facebook, Apple
  const handlePhone = () => alert('Phone login coming soon! Enable in Firebase Console.');
  const handleFacebook = () => alert('Facebook login coming soon! Enable in Firebase Console.');
  const handleApple = () => alert('Apple login coming soon! Enable in Firebase Console.');

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} role="dialog" aria-modal="true">
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close login modal">
          <img src="/assets/close.png" alt="Close" width={20} height={20} />
        </button>
        {step === 'main' && <>
          <h2 style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: 8, marginTop: 0 }}>Welcome to YogaLink!</h2>
          <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: 24, textAlign: 'center' }}>
            Log in or Sign Up
          </div>
          {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
          <button style={{ ...buttonStyle, background: '#fff', border: '1.5px solid #e0e0e0', color: '#222' }} onClick={handlePhone} disabled={loading}>
            <img src="/assets/phone.png" alt="Phone" style={{ width: 22, height: 22 }} /> Continue with Phone Number
          </button>
          <button style={{ ...buttonStyle, background: '#fff', border: '1.5px solid #e0e0e0', color: '#222' }} onClick={handleGoogle} disabled={loading}>
            <img src="/assets/google.png" alt="Google" style={{ width: 22, height: 22 }} /> Continue with Google
          </button>
          <button style={{ ...buttonStyle, background: '#fff', border: '1.5px solid #e0e0e0', color: '#222' }} onClick={() => setStep('email')} disabled={loading}>
            <img src="/assets/email.png" alt="Email" style={{ width: 22, height: 22 }} /> Continue with Email
          </button>
        </>}
        {step === 'email' && <>
          <h2 style={{ fontWeight: 700, fontSize: 28, color: MOSS, textAlign: 'center', margin: '0 0 24px 0' }}>Email Login</h2>
          <form onSubmit={handleEmail} style={{ width: '100%', marginTop: 0 }} id="login">
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <img src="/assets/email.png" alt="Email" style={{ ...iconStyle, filter: 'grayscale(0.2)' }} />
              <input
                id="email"
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                ref={emailInputRef}
                style={{ ...inputStyle, ...(emailFocus ? inputFocusStyle : {}) }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                aria-describedby="email-error"
              />
              <p style={errorStyle} id="email-error" aria-live="polite">{error && !password ? error : ''}</p>
            </div>
            <div style={{ position: 'relative', marginBottom: 0 }}>
              <img src="/assets/padlock.png" alt="Password" style={iconStyle} />
              <input
                id="pwd"
                className="input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                ref={pwdInputRef}
                style={{ ...inputStyle, ...(pwdFocus ? inputFocusStyle : {}) }}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                aria-describedby="pwd-error"
              />
              <p style={errorStyle} id="pwd-error" aria-live="polite">{error && password ? error : ''}</p>
            </div>
            <a style={forgotStyle} href="#" onClick={e => { e.preventDefault(); alert('Forgot password coming soon!'); }}>Forgot password?</a>
            <button
              type="submit"
              style={loading ? btnPrimaryDisabled : btnPrimary}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Log in'}
            </button>
            <button type="button" style={{ ...textLink, textDecoration: 'none', margin: '14px 0 0 0' }} onClick={() => setStep('main')}>← Back</button>
          </form>
        </>}
        {step === 'loggedin' && user && <>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8, marginTop: 0 }}>Welcome, {user.displayName || user.email || user.phoneNumber}!</h2>
          <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: 24, textAlign: 'center' }}>
            You are now logged in.
          </div>
          <button style={{ ...buttonStyle, background: '#eee', color: '#222' }} onClick={handleLogout}>Log out</button>
        </>}
      </div>
    </div>
  );
} 