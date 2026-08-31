import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { User, ViewMode, RecordRow } from './types';
import { GAS_URL } from './constants';

import { SplashScreen } from './components/SplashScreen';
import { LoginView } from './components/LoginView';
import { MenuView } from './components/MenuView';
import { FormView } from './components/FormView';
import { DashboardView } from './components/DashboardView';
import { CekDataView } from './components/CekDataView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { PusatInformasiView } from './components/PusatInformasiView';
import { DocumentUploadView } from './components/DocumentUploadView';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [globalData, setGlobalData] = useState<RecordRow[]>([]);

  // State passed to CekDataView
  const [cekDataRows, setCekDataRows] = useState<RecordRow[]>([]);
  const [cekDataTeacher, setCekDataTeacher] = useState('');
  const [cekDataPeriode, setCekDataPeriode] = useState('');
  const [showDashboardNotif, setShowDashboardNotif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration skipped or error:', err);
      });
    }
  }, []);

  // Initial Splash Delay ONLY
  useEffect(() => {
    let savedUser: User | null = null;
    try {
      const stored = localStorage.getItem('elmadina_user');
      if (stored) {
        savedUser = JSON.parse(stored);
        if (savedUser && savedUser.teacherName) {
          setUser(savedUser);
        } else {
          savedUser = null;
        }
      }
    } catch (e) {
      console.log('Error parsing stored user:', e);
    }

    const timer = setTimeout(() => {
      if (savedUser) {
        navigateTo('menu');
      } else {
        setViewMode('login');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const fetchDataIfNeeded = async () => {
    // If we already have data in memory, just return
    if (globalData.length > 0) return; 

    // Try to load from cache first for instant display
    try {
      const cached = localStorage.getItem('elmadina_data_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGlobalData(parsed);
        }
      }
    } catch (e) {
      console.log('Error reading cache:', e);
    }

    // Then fetch fresh data in the background silently
    await refreshData();
  };

  const refreshData = async (isManualRefresh = false) => {
    // Show skeleton loading ONLY if we have absolutely no data
    if (globalData.length === 0) {
      setIsLoading(true);
    }
    
    // For manual refreshes, show the button spinner
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      const res = await fetch(GAS_URL);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          setGlobalData(json);
          // Save to cache for next time
          try {
            localStorage.setItem('elmadina_data_cache', JSON.stringify(json));
          } catch (e) {
            console.log('Error saving cache:', e);
          }
          
          // Notify on success if it was a manual refresh
          if (isManualRefresh && globalData.length > 0) {
             // Optional: could show a success toast here
          }
        }
      }
    } catch (err) {
      console.log('GAS Fetch error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const navigateTo = async (view: ViewMode) => {
    setViewMode(view);
    if (view === 'dashboard' || view === 'admin-dashboard' || view === 'form' || view === 'menu') {
      fetchDataIfNeeded();
    }
  };

  // Check if today has been filled by current user
  const hasFilledToday = false;

  const handleLoginSuccess = async (loggedInUser: User) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem('elmadina_user', JSON.stringify(loggedInUser));
    } catch (e) {
      console.log('Error saving user to localStorage:', e);
    }
    navigateTo('menu');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('elmadina_user');
    } catch (e) {
      console.log('Error removing stored user:', e);
    }
    setUser(null);
    setViewMode('login');
  };

  // Back button confirmation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = (e: PopStateEvent) => {
      Swal.fire({
        title: 'Keluar Aplikasi?',
        text: 'Apakah Anda yakin ingin keluar dari aplikasi?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Tidak'
      }).then((result) => {
        if (result.isConfirmed) {
           window.close();
           setTimeout(() => {
             if (!window.closed) {
               window.location.href = 'about:blank';
             }
           }, 100);
        } else {
           window.history.pushState(null, '', window.location.href);
        }
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto Logout Timer (5 minutes)
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        const stored = localStorage.getItem('elmadina_user');
        if (stored) {
          handleLogout();
          Swal.fire({
            icon: 'info',
            title: 'Sesi Habis',
            text: 'Anda telah logout otomatis karena tidak ada aktivitas selama 5 menit.',
            confirmButtonColor: '#10b981'
          });
        }
      }, 5 * 60 * 1000); 
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, []);

  const devAlert = () => {
    Swal.fire({
      icon: 'info',
      title: 'Tahap Pengembangan',
      text: 'Fitur ini sedang dalam tahap pengembangan.',
      confirmButtonColor: '#10b981'
    });
  };

  const handleDataAdded = (newRow: RecordRow) => {
    setGlobalData((prev) => [...prev, newRow]);
  };

  const handleOpenCekData = (filteredRows: RecordRow[], teacherName: string, periodText: string) => {
    setCekDataRows(filteredRows);
    setCekDataTeacher(teacherName);
    setCekDataPeriode(periodText);
    setViewMode('cek-data');
  };

  if (viewMode === 'splash') {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans relative">
      {/* Main View Router */}
      <main className="flex-1">
        {viewMode === 'login' && (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        )}

        {viewMode === 'menu' && user && (
          <MenuView
            user={user}
            onNavigate={(v) => navigateTo(v)}
            onLogout={handleLogout}
            devAlert={devAlert}
            globalData={globalData}
          />
        )}

        {viewMode === 'form' && user && (
          <FormView
            user={user}
            globalData={globalData}
            onDataAdded={handleDataAdded}
            onBack={() => navigateTo('menu')}
            onSuccessNavigateDashboard={() => { setShowDashboardNotif(true); navigateTo('dashboard'); }}
            isLoading={isLoading}
          />
        )}

        {viewMode === 'dashboard' && user && (
          <DashboardView
            user={user}
            globalData={globalData}
            onOpenCekData={handleOpenCekData}
            onNavigateForm={() => navigateTo('form')}
            onBackMenu={() => navigateTo('menu')}
            showNotif={showDashboardNotif}
            onNotifClosed={() => setShowDashboardNotif(false)}
            onRefresh={() => refreshData(true)}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
          />
        )}

        {viewMode === 'cek-data' && (
          <CekDataView
            rows={cekDataRows}
            teacherName={cekDataTeacher}
            periodeText={cekDataPeriode}
            onBack={() => navigateTo('dashboard')}
          />
        )}

        {viewMode === 'admin-dashboard' && (
          <AdminDashboardView
            globalData={globalData}
            onBack={() => navigateTo('menu')}
            onRefresh={() => refreshData(true)}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
          />
        )}
        {viewMode === 'pusat-informasi' && (
          <PusatInformasiView
            onBack={() => navigateTo('menu')}
          />
        )}
        {(viewMode === 'arsip' || viewMode === 'perangkat') && (
          <DocumentUploadView
            title={viewMode === 'arsip' ? 'Arsip' : 'Perangkat Pembelajaran'}
            onBack={() => navigateTo('menu')}
          />
        )}
      </main>

      {/* Footer Copyright */}
      <footer className="py-4 text-center text-xs text-slate-400 font-medium">
        E-Kartu Mengajar &copy; 2026 Al-Madina Apps
      </footer>
    </div>
  );
}
