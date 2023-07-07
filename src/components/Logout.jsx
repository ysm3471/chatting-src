import React from 'react';
import classes from './Logout.module.css'
import { useNavigate } from 'react-router-dom';

export default function Logout({username,removeCookie}) {
  const navigate = useNavigate();

  function logout() {
    const result = window.confirm("로그하웃 하시겠습니까?")

    if(result) {
      removeCookie(['id']);
      navigate('/');
    }
  }
  return (
    <div className={classes.Logout}>
      <p>{username}님</p>
      <p onClick={logout}>Logout</p> 
    </div>
  )
}
