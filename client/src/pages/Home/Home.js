import React from 'react';
import logo from '../../Assets/logo.jpg'
import { Link } from 'react-router-dom';
import "./Home.scss";
import { ShowOnLogin, ShowOnLogout } from '../../components/protect/HiddenLink';


const Home = () => {
  return (
    <div className='home'>
        <nav className='container --flex-between'>
            <div className='logo'>
                <img src={logo} width={45} height={45} />
            </div>
            <ul className='home-links'>
              <ShowOnLogout>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                </ShowOnLogout>

                <ShowOnLogout>
                <li>
                    <button className='--btn --btn-primary'>
                    <Link to="/login">Login</Link>
                    </button>
                </li>
                </ShowOnLogout>

                <ShowOnLogin>
                <li>
                    <button className='--btn --btn-primary'>
                    <Link to="/dashboard">Dashboard</Link>
                    </button>
                </li>
                </ShowOnLogin>
            </ul>
        </nav>
        <section className="container hero">
        <div className="hero-text">
          <h2>EcoPantry</h2>
          <h3> Simplify Your Refrigerator, Elevate Your Health</h3>
          <p>
            Are you tired of an overstuffed refrigerator and wasted food? EcoPantry is here to revolutionize the way you manage your kitchen inventory. Our mission is to help you simplify your refrigerator, save time and money, and embrace a healthier, more sustainable lifestyle.
          </p>
          <p>
            At EcoPantry, we provide innovative solutions for organizing your kitchen efficiently. Our user-friendly platform allows you to keep track of your groceries, reduce food waste, and ensure that you always have fresh, healthy ingredients on hand. Say goodbye to clutter and hello to a streamlined, eco-friendly kitchen experience.
          </p>
          <p>
          Join the EcoPantry community today and discover the joy of a well-organized kitchen. Simplify your refrigerator, elevate your health, and make a positive impact on the environment—all with EcoPantry.
          </p>
          <div className="hero-buttons">
            <button className="--btn --btn-primary">
              <Link to="/dashboard">Join NOW!!!</Link>
            </button>
          </div>
          
        </div>

    
      </section>
    </div>
  )
}

export default Home