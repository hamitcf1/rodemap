import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

// List of admin email addresses
const ADMIN_EMAILS = ['your-admin@email.com']; // Add your admin emails here

document.addEventListener('DOMContentLoaded', () => {
  const adminAuthButton = document.getElementById('adminAuthButton');
  
  auth.onAuthStateChanged((user) => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      adminAuthButton.textContent = 'Admin Logout';
    } else {
      adminAuthButton.textContent = 'Admin Login';
    }
  });

  adminAuthButton.addEventListener('click', async () => {
    if (auth.currentUser) {
      await signOut(auth);
    } else {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        if (!ADMIN_EMAILS.includes(user.email)) {
          await signOut(auth);
          alert('Unauthorized access. Please use an admin account.');
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    }
  });
}); 