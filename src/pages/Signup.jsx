import React, { useRef } from 'react';
import classes from './Signup.module.css'
import assign from '../api/assign';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const formRef = useRef();
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault();

    if(formRef.current.password.value.length < 4) alert('비밀번호는 4자리 이상 입력해주세요')
    else {
      const userInfo = {
        id:formRef.current.id.value,
        password:formRef.current.password.value      
      }
      assign(userInfo)      
      navigate('/')
    }
  }
  return (
    <>
      <div className={classes.login_container}>
        <div>
          <h1>카카오톡</h1>
          <form ref={formRef} onSubmit={submit}>
            <input type="text" name='id' required className={classes.form_id} placeholder="등록할 아이디" />
            <input type="password" name='password' required min={4} className={classes.form_pw} placeholder="비밀번호(4자리 이상)" />
            <input type="submit" className={classes.form_btn} value="회원가입" />
          </form>
        </div>
      </div>
    </>
  )
}
