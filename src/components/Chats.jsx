import React from 'react';
import classes from './Chats.module.css'

export default function Chats({ data,username }) {
  const {id,content,time,ip} = data;
  
  const today = new Date();   
  const now = today.getTime();    // 현재 시간을 밀리세컨드 단위로 바꿈
  const timestamp = (now-time)/1000;    // 게시물을 현재 시간 기준으로 몇 초 지났는지 저장하는 변수
  let when;   // 작성 날짜를 표기하는 변수

  switch(true) {
    case (timestamp<60) :   // 게시물이 1분 이전에 작성된 게시물일 경우 1분전으로 표시
      when = '1분전';
      break;
    case (timestamp<3600) : // 게시물이 1시간 이전에 작성된 게시물일 경우 몇 분 전인지 표시
      when = Math.floor(timestamp/60) + '분전'
      break;
    case (timestamp<86400) :  // 게시물이 하루 전에 작성된 게시물일 경우 몇 시간 전인지 표시
      when = Math.floor(timestamp/3600) + '시간전'
      break;
    default:    // 하루가 지난 게시물일 경우 작성 날짜로 표기
      const date = new Date(time);
      const month = date.getMonth() + 1;
      const day = date.getDate();

      when = month + "/" + day;
  }


  return (
    <div className={classes.preview}>
      <div>
        <div className={classes.pic}></div>
      </div>
      <div className={classes.bubble_wrap}>
        {username === id ? <h4>{id}<span>({ip})</span></h4> : <h4><b>{id}</b><span>({ip})</span></h4> }
        <div className={classes.content}>
          <p>{content}</p>
          <span>{when}</span>
        </div>
      </div>
    </div>
  )
}
