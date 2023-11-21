import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../Layouts/TopBar';
const Login = () => {

  localStorage.getItem('auth_token')
  
  const navigate = useNavigate();
  const [loginInput, setLogin] = useState({
    username: '',
    password: '',
    error_list: [],

  });

  const handleInput = (e)=>{
    e.persist();
    setLogin({...loginInput, [e.target.name]: e.target.value});

  }

  const loginSubmit = (e)=>{
    e.preventDefault();
    
    const data ={
      username: loginInput.username,
      password: loginInput.password,
    }
    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
      axios.post(`http://127.0.0.1:8000/api/login`,data).then(res =>{
      if(res.data.status === 200){
        alert(res.data.token);
        const user = JSON.stringify(res.data.user);
        localStorage.setItem("user",user);
        console.log(localStorage.getItem("user"));
        localStorage.setItem('role',res.data.role);
        localStorage.setItem('auth_token', res.data.token);
        swal('Success',res.data.message,"success");
        if(res.data.role === 'admin'){
          navigate('/admin')
        }else if(res.data.role === 'userSimple' ){
          navigate('/Acceuil_client')
        }
        //  window.location.reload();
        // alert(localStorage.getItem('auth_token'))
      }else if(res.data.status === 401)
      {
        swal('Avertissement',res.data.message,"warning");

      }else{
        setLogin({...loginInput, error_list : res.data.validation_errors});

      }
    })
  })
}
  

  return (
    <div>
      <TopBar/>
      <div className='container py-5 mt-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-header'>
                <h4>Authentification</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={loginSubmit}>
                  <div className='form-group mb-3'>
                    <label>Nom d'utilisateur</label>
                    <input type='text' name='username' onChange={handleInput} value={loginInput.username} className='form-control'/>
                    <span className='text-danger'>{loginInput.error_list.username}</span>
                  </div>
                  <div className='form-group mb-3'>
                    <label>Mot de passe</label>
                    <input type='password' name='password' onChange={handleInput} value={loginInput.password} className='form-control' />
                    <span className='text-danger'>{loginInput.error_list.password}</span>
                  </div>
                  
                  <div className='form-group mb-3'>
                    <button type='submit' className='btn btn-primary'>Se connecter</button>
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