import { useState, FormEvent } from "react";
import './RegisterPage.css';
import sppImage from '../assets/login-spp.webp'


function SignUpPage() {

  const [resultMessage, setResultMessage] = useState<string>("")

  async function handleSignUp(event:FormEvent<HTMLFormElement>)
  : Promise<void> {
    event.preventDefault();
    try {

      const formEl = new FormData(event.currentTarget);
      const data = Object.fromEntries(formEl.entries())

      const response = await fetch("http://localhost:4000/api/v1/user/register", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          credentials: "include",
          body: JSON.stringify(data)
      });

      const result = await response.json()

      // render results
      if (!response.ok) {
        setResultMessage(result.message || "something went wrong");
      } else{
        setResultMessage(result.message || "Successfully Registered!")
      }
      
      event.currentTarget.reset();

    } catch (error) {
      console.error(error)
      setResultMessage("please try again")
    }
  }

return (
  <div className="register-page-container">
    <div className="register-card">
      <div className="register-left-container">

        <form onSubmit={handleSignUp}>
          <div className="register-left-text-container">

            <h1>Register An Account</h1>
            <div className="register-form-group">
              <label htmlFor="username">Username:</label>
              <input className="register-input-field" type="text" id="username" name="username" required></input>
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email:</label>
              <input className="register-input-field" type="email" id="email" name="email" required></input>
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password:</label>
              <input className="register-input-field" type="password" id="password" name="password" required></input>
            </div>

          </div>
          <button>Sign Up</button>
        </form>
          <div className="render-register-message">
            {/* Render message */}
            {resultMessage ? <h2>{resultMessage}</h2> : null }
          </div>
      </div>

      <div className="register-right-container">
          <img className="register-right-img" src={sppImage} alt="Welcome img" />
        <div className="register-right-text-container">
          <h1>New Here?</h1>
          <p>Sign up now and keep all your results in one place</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SignUpPage;