import React, { useEffect, useRef, useState } from 'react';
import classes from './Login.module.css'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import getUserList from '../api/getUserList';

export default function Login() {
  const navigate = useNavigate();
  const formRef = useRef();
  const [cookies,setCookies] = useCookies(['id']);
  const [userList,setUserList] = useState([])

  useEffect(() => {
    getUserList()
    .then((res) => setUserList([res]))
  },[])

  function login(e) {
    e.preventDefault();

    const userInfo = {
      id:formRef.current.id.value,
      password:formRef.current.password.value      
    }

    const keyList = Object.keys(userList[0])

    const userCheck = keyList.find((aa) => {
      return userList[0][aa].id === userInfo.id && userList[0][aa].password === userInfo.password
    })
    if (userCheck) {
      setCookies('id',userInfo)
      navigate('/chat');
    }
    else alert('입력하신 정보가 올바르지 않습니다')
  }

  return (
    <>
      <div className={classes.login_container}>
        <div>
          <h1>카카오톡</h1>
          <form onSubmit={login} ref={formRef}>
            <input type="text" name='id' className={classes.form_id} placeholder="아이디" />
            <input type="password" name='password' className={classes.form_pw} placeholder="비밀번호" />
            <input type="submit" className={classes.form_btn} value="로그인" />
          </form>
          <p onClick={()=>{navigate('/signup')}}>회원가입</p>
        </div>
      </div>
    </>
  )
}
