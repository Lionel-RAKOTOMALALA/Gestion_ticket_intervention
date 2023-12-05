import React from 'react'
import './Dashboard.css';
import MyBox from './Boxs';
import Chart from './chart';
import Recap from './Recap';
import PostHeader from './PostHeader';


const Content_dashboard = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user.username); 
  // console.log(user.photo_profil_user);
  return (
    <div className="container-fluid">
    {/*  <!-- Page Heading --> */}
      <PostHeader/>

      {/*  <!-- Content Row --> */}
      <Recap/>

      {/*  <!-- Content Row --> */}
      {/* <Chart/> */}

      {/*   <!-- Content Row --> */}
      <MyBox/>
    </div>


  )
}

export default Content_dashboard