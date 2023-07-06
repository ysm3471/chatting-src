import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Chatting from '../components/Chatting';
import classes from './Chat.module.css'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import getPostList from '../api/getPost';

export default function Chat() {
  const [cookies, setCookie, removeCookie] = useCookies(['id']);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef();
  const date = new Date();
  const time = date.getTime();

  useEffect(() => {
    setUserId(cookies.id.id)
  }, [])

  const { data, isLoading } = useQuery(['content'], getPostList)    // 두번째 인자에는 promise함수가 들어감
  const queryClient = useQueryClient();

  const updateMutaition = useMutation((chat) => {
    fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json', {
      method: "POST",
      body: JSON.stringify({
        id: chat.id,
        content: chat.content,
        time,
      })
    })
      .then((res) => {
        res.json()
        queryClient.invalidateQueries(['content']);
      })
  })

  function chatBtn(e) {
    e.preventDefault();

    const chat = {
      id: userId,
      content: formRef.current.text.value,
    }
    updateMutaition.mutate(chat);
    formRef.current.text.value = ''
  }


  return (
    <>
      <div className={classes.chat}>
        {isLoading ? null : <Chatting username={userId} data={data} />}
        <form ref={formRef} onSubmit={chatBtn}>
          <div className={classes.chat_form}>
            <textarea name='text'></textarea>
          </div>
          <div className={classes.util}>
            {/* <div className="chat_form_util_plugin">
            </div> */}
            <div className={classes.submit}>
              <input type="submit" value="등록" />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
