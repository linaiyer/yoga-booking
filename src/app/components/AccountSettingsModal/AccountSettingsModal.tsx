import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../../../firebaseConfig';

interface AccountSettingsModalProps {
  user: any;
  onClose: () => void;
  setUser: (user: any) => void;
}

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  boxShadow: '0 8px 20px rgba(0,0,0,.12)',
  maxWidth: 420,
  width: '90vw',
  padding: '40px 48px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 32, 36, 0.32)',
  zIndex: 1999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(2px)'
};

const inputStyle: React.CSSProperties = {
  height: 48,
  width: '100%',
  border: '1.5px solid #8FA88F',
  borderRadius: 10,
  background: '#F8F8F4',
  padding: '0 14px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 16,
  marginBottom: 18,
  outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimary: React.CSSProperties = {
  height: 48,
  width: '100%',
  background: '#264A2E',
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

const textLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#264A2E',
  fontWeight: 500,
  fontSize: 15,
  textDecoration: 'none',
  margin: '14px 0 0 0',
  cursor: 'pointer',
  display: 'block',
};

export default function AccountSettingsModal({ user, onClose, setUser }: AccountSettingsModalProps) {
  const [name, setName] = useState(user?.displayName || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(firebaseApp);

  // Fetch user profile from Firestore on open
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const fetchProfile = async () => {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.displayName || user.displayName || '');
        setBirthday(data.birthday || '');
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: name,
        birthday,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        uid: user.uid,
      }, { merge: true });
      setUser({ ...user, displayName: name, birthday });
    }
    setSaving(false);
    onClose();
  };

  const handleLogout = () => {
    setUser(null);
    onClose();
  };

  if (loading) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle} role="dialog" aria-modal="true">
        <h2 style={{ fontWeight: 700, fontSize: 28, color: '#264A2E', textAlign: 'center', margin: '0 0 24px 0' }}>Account Settings</h2>
        <form onSubmit={handleSave} style={{ width: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
            placeholder="Your name"
          />
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Email</label>
          <input
            type="email"
            value={user?.email || ''}
            style={{ ...inputStyle, background: '#f1f1f1', color: '#888' }}
            readOnly
          />
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            style={inputStyle}
            placeholder="Birthday"
          />
          <button type="submit" style={btnPrimary} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </form>
        <button type="button" style={textLink} onClick={handleLogout}>Log out</button>
        <button type="button" style={textLink} onClick={onClose}>Close</button>
      </div>
    </>
  );
} 