import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Signup from './Components/Auth/SignUp'
import Login from './Components/Auth/LogIn'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import RedirectIfAuth from './Components/Auth/RedirectIfAuth'

function App() {
  console.log('Firebase API key:', import.meta.env.VITE_FIREBASE_API_KEY);
  console.log('Firebase Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log('Firebase Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <Signup />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
