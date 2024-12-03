const checkAdminAccess = async () => {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      return false; 
    }

    const response = await fetch(`https://kiemhieptinhduyen.one/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token 
      }
    });

    if (!response.ok) {
      return false; 
    }

    const data = await response.json();
    return data.isAdmin; 
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false; 
  }
};