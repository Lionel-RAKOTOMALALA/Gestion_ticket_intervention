import React from 'react';
import Navbar from './Layouts/Navbar';

const Login = () => {
  return (
    <div>
      <Navbar/>
      <div className='container py-5 mt-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-header'>
                <h4>Authentification</h4>
              </div>
              <div className='card-body'>
                <form>
                  <div className='form-group mb-3'>
                    <label>Nom d'utilisateur</label>
                    <input type='text' name='username' className='form-control' value=''/>
                  </div>
                  <div className='form-group mb-3'>
                    <label>Mot de passe</label>
                    <input type='text' name='password' className='form-control' value=''/>
                  </div>
                  
                  <div className='form-group mb-3'>
                    <button type='submit' className='btn btn-primary'>S'inscrire</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login