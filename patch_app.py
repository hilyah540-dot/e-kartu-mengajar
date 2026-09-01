import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add useRef to imports
content = re.sub(r"import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect, useRef } from 'react';", content)

# 2. Add viewModeRef
ref_code = """  const [globalData, setGlobalData] = useState<RecordRow[]>([]);
  const viewModeRef = useRef<ViewMode>('splash');

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);"""
content = re.sub(r"  const \[globalData, setGlobalData\] = useState<RecordRow\[\]>\(\[\]\);", ref_code, content)

# 3. Update the timer to set initial state correctly
timer_orig = """    const timer = setTimeout(() => {
      if (savedUser) {
        navigateTo('menu');
      } else {
        setViewMode('login');
      }
    }, 2800);"""
timer_new = """    const timer = setTimeout(() => {
      // Setup trap state for exit app confirmation
      window.history.replaceState({ trap: true }, '', window.location.href);
      if (savedUser) {
        window.history.pushState({ view: 'menu' }, '', window.location.href);
        setViewMode('menu');
      } else {
        window.history.pushState({ view: 'login' }, '', window.location.href);
        setViewMode('login');
      }
    }, 2800);"""
content = content.replace(timer_orig, timer_new)

# 4. Update navigateTo
nav_orig = """  const navigateTo = async (view: ViewMode) => {
    setViewMode(view);
    if (view === 'dashboard' || view === 'admin-dashboard' || view === 'form' || view === 'menu') {
      fetchDataIfNeeded();
    }
  };"""
nav_new = """  const navigateTo = async (view: ViewMode) => {
    window.history.pushState({ view }, '', window.location.href);
    setViewMode(view);
    if (view === 'dashboard' || view === 'admin-dashboard' || view === 'form' || view === 'menu') {
      fetchDataIfNeeded();
    }
  };"""
content = content.replace(nav_orig, nav_new)

# 5. Update the back button confirmation effect
back_orig = """  // Back button confirmation
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
  }, []);"""

back_new = """  // Back button navigation & exit confirmation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && state.trap) {
        // Trapped at the root, ask to exit
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
             // Restore the current view state
             window.history.pushState({ view: viewModeRef.current }, '', window.location.href);
          }
        });
      } else if (state && state.view) {
        // Navigate back to previous view
        setViewMode(state.view);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);"""

content = content.replace(back_orig, back_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

