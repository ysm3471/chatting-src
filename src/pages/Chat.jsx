import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import Chatting from '../components/Chatting';
import classes from './Chat.module.css'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import getPostList from '../api/getPost';
import Logout from '../components/Logout';
import Loding from '../components/Loding';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const [cookies, setCookie, removeCookie] = useCookies(['id']);
  const [userId, setUserId] = useState(null);
  const [loding,setLoding] = useState(true);
  const [sending,setSending] = useState(true);
  const navigation = useNavigate();
  const cntRef = useRef(0);
  const [page,setPage] = useState(20);
  const pageRef = useRef(0);
  const formRef = useRef();
  const date = new Date();
  const time = date.getTime();

  const [sendingMsg,setSendingMsg ] = useState('입력중')

  useEffect(() => {
    pageRef.current += page;
    queryClient.invalidateQueries(['content']);
  },[page])
  
  useEffect(() => {
    if (cookies.id) {
      setTimeout(()=>{
        setLoding(false);
      },1200)
      setUserId(cookies.id.id)
    }
    else {
      alert('로그인 후 이용가능합니다')
      navigation('/')      
    }
  }, [])

  const { data, isLoading } = useQuery(['content'], async () => {
    const result = await getPostList(pageRef.current)
    return result
  })    // 두번째 인자에는 promise함수가 들어감
  const queryClient = useQueryClient();

  const updateMutaition = useMutation((chat) => {
    fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json', {
      method: "POST",
      body: JSON.stringify({
        id: chat.id,
        content: chat.content,
        time,
        ip:chat.ip[2] + '.' + chat.ip[3]
      })
    })
      .then((res) => {
        res.json();
        pageRef.current++;
        queryClient.invalidateQueries(['content']);
      })
  })

  async function chatBtn(e) {
    e.preventDefault();
    if (sending) {
      setSending(false);
      const interval = setInterval(() => {
        if(cntRef.current < 4){
          setSendingMsg(word => word + '.');
          cntRef.current++
        }
        else {
          cntRef.current = 0;
          setSendingMsg('입력중')
        }
      },200)
      const ipData = await fetch('https://geolocation-db.com/json/');
      const locationIp = await ipData.json();

      const ip = locationIp.IPv4.split('.')
    
      const chat = {
        id: userId,
        content: formRef.current.text.value,
        ip
      }
      updateMutaition.mutate(chat);
      formRef.current.text.value = ''
      clearInterval(interval)
      
      setSending(true); 
      setSendingMsg('입력중')     
    }
  }
  function keydown(e) {   // enter에 반응하는 함수
    if(e.key === 'Enter' && sending) chatBtn(e)
  }

  if (cookies.id) {   // 로그인 정보가 없는 상태에서 채팅방 진입 시에는 렌더링 시키지 않음
    return (
      <>
        {loding && <Loding/>} 
        <div className={classes.chat}>
          {isLoading ? null : <Chatting username={userId} data={data} setPage={setPage} />}
          <div className={classes.logout}>
            <Logout username={userId} removeCookie={removeCookie}/>
          </div>
          <form ref={formRef} onSubmit={chatBtn} onKeyDown={keydown}>
            <div className={classes.chat_form}>
              <textarea name='text'></textarea>
            </div>
            <div className={classes.util}>
              {/* <div className="chat_form_util_plugin">
              </div> */}
              {sending ? <div className={classes.submit}>
                <input type="submit" value="등록" /> 
              </div>:
              <p className={classes.sending}>{sendingMsg}</p>
              }
            </div>
          </form>
        </div>
      </>
    )    
  }
}
