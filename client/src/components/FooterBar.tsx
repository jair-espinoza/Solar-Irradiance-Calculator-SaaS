import './FooterBar.css'

function FooterBar(){

  const currentYear = new Date().getFullYear()
  
  return(
    <div className="footer-container">
      <div className="footer-container-inner">
        <div className="footer-links">
          <p> &copy;{currentYear} Low Fidelity Prototype Solar Irradiance Calculator</p>
        </div>
      </div>
    </div>
  )
}

export default FooterBar;