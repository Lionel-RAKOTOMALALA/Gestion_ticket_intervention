import React from "react";
import './loader.css';

const Loader = () => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="loader">
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
};

export default Loader;
