import './NavigationBar.css'
import { Link, useNavigate } from 'react-router-dom';

type NavigationBarProps = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

function NavigationBar(props : NavigationBarProps) {

  const navigate = useNavigate();

  const handleLogout = async () : Promise<void> => {
    try {
      // backend api expires cookie
      const response = await fetch("http://localhost:4000/api/v1/user/logout", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        props.setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.log("Logout Failed")
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message)
      }
    }
  }

  return (
  <nav className="navbar-container" >
    <div className='navbar-inner'>
    <h1 className='logo'>Solar Irradiance Calculator</h1>
      <ul className="nav-links">
        {props.isAuthenticated? (
          <>
            <li className='li-group'>
              <Link to='/'>Home</Link>
            </li>
            <li className='li-group'>
              <Link to='/Dashboard'>Dashboard</Link>
            </li>
            <li className='li-group'>
              <button className="btn-primary" onClick={handleLogout}> Logout</button>
            </li>
          </>
        ): (
          <>
            <li className='li-group'>
              <Link to='/'>Home</Link>
            </li>
            <li className='li-group'>
              <Link className="btn-secondary" to='/login'>Login</Link>
            </li>
            <li className='li-group'>
              <Link className="btn-primary" to='/register'>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  </nav>
  
  )
};

export default NavigationBar;