import React from 'react';
import '../styles/PageWrapper.css';

const PageWrapper = ({ children, className = "", style = {} }) => {
    return (
        <div style={{ ...style, width: "100vw", minHeight: "100vh" }} className={`main ${className}`}>
            {children}
        </div>
    );
}

export default PageWrapper;