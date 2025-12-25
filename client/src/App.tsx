import './App.css'
import NavigationBar from './components/NavigationBar.tsx'
import CalculatorPage from './components/CalculatorPage.tsx'; 
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import DashboardPage from './components/DashboardPage.tsx';
import FooterBar from './components/FooterBar.tsx';


type JsonResponse = {
  authenticated: boolean
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect( () => {
    async function checkSession(): Promise<void> {
      try{
        const response = await fetch("http://localhost:4000/api/v1/user/me", {
          credentials: "include"
        })
        
        const data :JsonResponse = await response.json();
        setIsAuthenticated(data.authenticated)
        
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  // render empty page while loading
  if (isLoading) {
    return <h1></h1>;
  }

  return (
    <Router>
      <NavigationBar isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}/>

      <Routes>
        <Route
          path="/"
          element={<CalculatorPage />}
        />
        
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/login"
          element={ 
            <LoginPage 
              isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/register"
          element={ 
            <RegisterPage />
          }
        />

      </Routes>
      <FooterBar />
    </Router>
  )
}

export default App;