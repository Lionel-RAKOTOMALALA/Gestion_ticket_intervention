import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import swal from 'sweetalert';
import axios from 'axios';
import Dashboard from './components/admin/Dashboard';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(() => {
      try {
            axios.get('http://127.0.0.1:8000/api/checkingAuthenticated', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
        })
          .then((res) => {
            if (res.data.status === 200 && localStorage.getItem('auth_token')) {
              setIsAuthenticated(true);
              console.log(res.data);
            } else {
              setIsAuthenticated(false);
              console.log(res.data);
            }
          })
          .catch((err) => {
            setIsAuthenticated(false);
            if (err.response && err.response.status === 401) {
              // Rediriger vers la page de connexion en cas d'erreur d'authentification
              // Vous devez également utiliser un composant de routage pour gérer la navigation
              localStorage.removeItem('auth_token');
              // window.location.href = "/login"
              // Afficher une alerte
              // swal('Unauthorized', err.response.data.message, 'warning');
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
  }, []);
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err){
    if(err.response.status === 401)
    { 
      localStorage.clear();
      window.location.href = "/login"
      swal('Unauthorized', err.response.data.message,"warning");
      
    }
    return Promise.reject(err);
  })
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
};

export default PrivateRoute;
