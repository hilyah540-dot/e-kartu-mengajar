import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

logout_orig = """  const handleLogout = () => {
    try {
      localStorage.removeItem('elmadina_user');
    } catch (e) {
      console.log('Error removing stored user:', e);
    }
    setUser(null);
    setViewMode('login');
  };"""
  
logout_new = """  const handleLogout = () => {
    try {
      localStorage.removeItem('elmadina_user');
    } catch (e) {
      console.log('Error removing stored user:', e);
    }
    setUser(null);
    // Clear history and reset trap
    window.history.replaceState({ trap: true }, '', window.location.href);
    window.history.pushState({ view: 'login' }, '', window.location.href);
    setViewMode('login');
  };"""

content = content.replace(logout_orig, logout_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

