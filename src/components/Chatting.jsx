import React, { useEffect, useState } from 'react';
import classes from './Chatting.module.css'
import { useQueryClient } from 'react-query';

export default function Chatting({ username, data }) {
  const [chatList, setChatList] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      const keys = Object.keys(data)

      const copy = keys.map((aa) => data[aa])
      setChatList(copy);      
    }

  }, [data])

  const chats = chatList.map((aa,index) => {
    return (
      <div className={classes.preview} key={index}>
        <div>
          <div className={classes.pic}></div>
        </div>
        <div className={classes.bubble_wrap}>
          <h4>{aa.id}</h4>
          <div className={classes.content}>
            <p>{aa.content}</p>
            <span>오후 2:33</span> 
          </div>
        </div>
      </div>
    )
  })
  return (
    <div className={classes.container}>
      {chats}
    </div>
  )
}
