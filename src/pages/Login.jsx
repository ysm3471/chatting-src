import React, { useEffect, useRef, useState } from 'react';
import classes from './Login.module.css'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import getUserList from '../api/getUserList';

export default function Login() {
  const navigate = useNavigate();
  const formRef = useRef();   // form에서 input의 value를 가져오는 방법
  const [cookies,setCookies] = useCookies(['id']);    // 외부 라이브러리를 사용해 쿠키를 저장
  const [userList,setUserList] = useState([])   // 로그인 시에 등록된 유저의 목록을 저장하는 state

  useEffect(() => {   // 함수를 사용해 가입된 유저리스트를 가져옴
    getUserList()
    .then((res) => setUserList([res]))
  },[])

  function login(e) {   // 로그인 버튼을 누르면 작동하는 함수
    e.preventDefault();

    const userInfo = {    // 유저의 id와 비밀번호를 저장
      id:formRef.current.id.value,
      password:formRef.current.password.value      
    }

    const keyList = Object.keys(userList[0])    
    const userCheck = keyList.find((aa) => {    // 입력한 정보와 등록된 정보가 일치하는지 확인
      return userList[0][aa].id === userInfo.id && userList[0][aa].password === userInfo.password
    })
    if (userCheck) {    // 일치하면 쿠키에 정보를 저장하고 페이지 이동
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
