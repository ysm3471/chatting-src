import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import Chatting from '../components/Chatting';
import classes from './Chat.module.css'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import getPostList, { getPostListLeng } from '../api/getPost';
import Logout from '../components/Logout';
import Loding from '../components/Loding';
import { useNavigate } from 'react-router-dom';
import { getDatabase, onChildAdded, ref } from 'firebase/database'
import { app } from '../Firebase/FirebaseClient';
import loadIp from '../api/loadIp';


export default function Chat() {
  const [cookies, setCookie, removeCookie] = useCookies(['id']);
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState();     // 유저의 정보를 저장하는 state
  const [loding, setLoding] = useState(true);   // 로딩페이지를 관리하는 state
  const [sending, setSending] = useState(true);   // 정보의 전송을 체크하는 state

  const [page, setPage] = useState(20);   // 이전 페이지의 개수를 관리하는 state
  const newRef = useRef(0);   // 새롭게 추가되는 메세지를 관리하는 ref
  const pageRef = useRef(0);  // 불러올 db의 개수를 관리하는 state

  const formRef = useRef();
  const lengRef = useRef();   // 불러오는 db의 길이을 저장하는 ref
  const ipRef = useRef();     // 유저의 ip 정보를 저장하는 ref
  const date = new Date();
  const time = date.getTime();  // 메세지 입력 시에 시간 정보를 저장하기 위한 변수
  const endRef = useRef();    // html의 마지막 DOM을 지정하기 위한 ref

  /* 이전 대화목록을 보려고 하면 현재 페이지개수 정보를 갱신하고 refetching시킴 */
  useEffect(() => {
    pageRef.current = page + newRef.current;
    queryClient.invalidateQueries(['content']);
  }, [page,newRef.current])

  const { data, isLoading } = useQuery(['content'], async () => {   // 대화목록을 db에서 불러옴
    const result = await getPostList(pageRef.current)
    return result
  })    // 두번째 인자에는 promise함수가 들어감    

  /* 대화를 전송하면 실행할 mutation */
  const updateMutaition = useMutation((chat) => {
    fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json', {
      method: "POST",
      body: JSON.stringify({
        id: chat.id,
        content: chat.content,
        time,
        ip: chat.ip[2] + '.' + chat.ip[3]
      })
    })
      .then((res) => {
        res.json();
        newRef.current++;
        queryClient.invalidateQueries(['content']);   // 전송 후에 refetching시킴
        setTimeout(() => {    // 채팅이 로딩되는 시간차이에 맞춰서 동기적으로 실행시킴
          endRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 170)
      })
  })

  useEffect(() => {
    if (cookies.id) {
      setTimeout(() => {
        setLoding(false);   // 로딩페이지를 언마운트시킴
      }, 1200)

      loadIp()    // 사용자의 ip를 불러오는 함수
      .then((res) => {
        ipRef.current = res.split('.');
        setCookie('ip',ipRef.current)   // 쿠키 형태로 저장
      })

      setUserId(cookies.id.id)
      getPostListLeng() // db의 길이를 가져오는 함수
        .then((res) => lengRef.current = res.length)
    }
    else {    // 로그인 정보가 없으면 뒤로 이동
      alert('로그인 후 이용가능합니다')
      navigation('/')
    }
  }, [])

  

  /* 전송중 텍스트 관련 */
  const cntRef = useRef(0);
  const [sendingMsg, setSendingMsg] = useState('입력중');

  /* db에 정보가 추가되면 refetching시킴 */
  const db = getDatabase(app);
  const commentsRef = ref(db, 'chattingList');

  onChildAdded(commentsRef, () => {
    queryClient.invalidateQueries(['content']);
  });

  /* 채팅을 전송하는 함수 */
  async function chatBtn(e) {
    e.preventDefault();

    if (sending) {
      setSending(false);  // 메세지 전송 시작을 알림

      const interval = setInterval(() => {    // 전송중 메세지를 위한 interval
        if (cntRef.current < 4) {
          setSendingMsg(word => word + '.');
          cntRef.current++
        }
        else {
          cntRef.current = 0;
          setSendingMsg('입력중')
        }
      }, 200)

      const chat = {
        id: userId,
        content: formRef.current.text.value,
        ip:ipRef.current
      }
      updateMutaition.mutate(chat);
      formRef.current.text.value = ''   // form 텍스트 초기화

      clearInterval(interval)   // interval 초기화
      setSending(true);   // 전송 완료
      setSendingMsg('입력중');    // 전송메세지 초기화
    }
  }

  function keydown(e) {   // enter에 반응애서 전송
    if (e.key === 'Enter' && sending) chatBtn(e)
  }

  if (cookies.id) {   // 로그인 정보가 없는 상태에서 채팅방 진입 시에는 렌더링 시키지 않음
    return (
      <>
        {loding && <Loding />}
        <div className={classes.chat}>
          {isLoading ? 
          null 
          : 
          <Chatting data={data} setPage={setPage} page={page} leng={lengRef.current}/>}
          <div className={classes.end} ref={endRef}></div>
          <div className={classes.logout}>
            <Logout username={userId} removeCookie={removeCookie} />
          </div>
          <form ref={formRef} onSubmit={chatBtn} onKeyDown={keydown}>
            <div className={classes.chat_form}>
              <textarea name='text'></textarea>
            </div>
            <div className={classes.util}>
              {sending ? 
              <div className={classes.submit}>
                <input type="submit" value="등록" />
              </div> 
              :
              <p className={classes.sending}>{sendingMsg}</p>
              }
            </div>
          </form>
        </div>
      </>
    )
  }
}
