import React from 'react';
import '../styles/NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top" style={{ backgroundColor: 'var(--nav-bg)' }}>
            <div className="container-fluid d-flex flex-row-reverse">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                        <li className="nav-item mx-5">
                            <a className="nav-link active" style={{ color: 'var(--text)' }} href="#">Home</a>
                        </li>
                        <li className="nav-item mx-5">
                            <a className="nav-link" style={{ color: 'var(--text)' }} href="#about">About</a>
                        </li>
                        <li className="nav-item mx-5">
                            <a className="nav-link" style={{ color: 'var(--text)' }} href="#projects">Projects</a>
                        </li>
                        <li className="nav-item mx-5">
                            <a className="nav-link" style={{ color: 'var(--text)' }} href="#timeline">Timeline</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;