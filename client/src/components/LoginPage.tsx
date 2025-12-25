import { useState, FormEvent } from "react";
import './LoginPage.css'
import sppImage from '../assets/login-spp.webp'

type LoginPageProps = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

function LoginPage(props: LoginPageProps) {
  
  const [resultMessage, setResultMessage] = useState<string>("")

  async function handleLogin(event: FormEvent<HTMLFormElement>
    ): Promise<void> {
      event.preventDefault();
      try {

        const formEl = new FormData(event.currentTarget);
        const data = Object.fromEntries(formEl.entries())

        const response = await fetch("http://localhost:4000/api/v1/user/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await response.json()

        // user wasn't logged in 
        if(!response.ok){
          setResultMessage(result.message || "Something Went Wrong")
        } else {
          setResultMessage(result.message || "Logged in")
          props.setIsAuthenticated(true)
        }
        
        event.currentTarget.reset();

      } catch (error) {
        console.error(error)
      }
    }

return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left-container">
          <img className="login-left-img" alt="Welcome img" src={sppImage} />
          <div className="login-left-text-container">
            <h1>Welcome Back!</h1>
            <p>Log into your account to access all your past results.</p>
          </div>
        </div>

      <div className="login-right-container">
        <div className="login-right-text-container">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <div className='login-form-group'>
              <label>Email:</label>
              <input name="email" className="login-input-field" type="email" required />
            </div>

            <div className='login-form-group'>
              <label>Password:</label>
              <input name="password" className="login-input-field"  type="password" required />
            </div>

            <button>Login</button>
            {resultMessage ? (
              <div className="login-result-message">
                {resultMessage}
              </div>
            ): (
              <div></div>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
)
}


export default LoginPage;