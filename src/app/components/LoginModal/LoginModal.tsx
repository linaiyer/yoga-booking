"use client";
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseApp } from '../../../firebaseConfig';

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
  borderRadius: 20,
  boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
  maxWidth: 400,
  width: '90vw',
  padding: '2.5rem 2rem 2rem 2rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 18,
  right: 18,
  background: 'none',
  border: 'none',
  fontSize: 24,
  cursor: 'pointer',
  color: '#888'
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

export default function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState<'main' | 'email' | 'loggedin'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close login modal">×</button>
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
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8, marginTop: 0 }}>Email Login</h2>
          <form onSubmit={handleEmail} style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: 8, border: '1.5px solid #e0e0e0', marginBottom: 12, fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: 8, border: '1.5px solid #e0e0e0', marginBottom: 12, fontSize: '1rem' }}
            />
            {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
            <button type="submit" style={{ ...buttonStyle, background: '#00bcd4', color: '#fff', marginBottom: 0 }} disabled={loading}>
              Continue
            </button>
            <button type="button" style={{ ...buttonStyle, background: '#fff', color: '#222', border: '1.5px solid #e0e0e0', marginTop: 0 }} onClick={() => setStep('main')}>
              Back
            </button>
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