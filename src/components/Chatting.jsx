import React, { useCallback, useEffect, useRef, useState } from 'react';
import classes from './Chatting.module.css'
import Chats from './Chats';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';

export default function Chatting({ username, data, setPage,page,leng }) {
  const [chatList, setChatList] = useState([]);   // 렌더링시킬 chat을 관리하는 state
  const endRef = useRef();    // 마지막 DOM을 지정하기 위한 ref

  const { ref, inView } = useInView();   // 외부 라이브러리를 사용해서 지정된 돔이 보일때를 체크함
  const setRefs = useCallback(    // useInView 사용 시 ref 변수에 다른 ref를 추가하는 방법(공식문서 참조)
    (node) => {
      endRef.current = node;
      ref(node);
    },
    [ref],
  );

  /* 대화정보가 추가될 때마다 chatList에 저장함 */
  useEffect(() => {
    if (data) {
      const keys = Object.keys(data)
      const copy = keys.map((aa) => data[aa])
      setChatList(copy);
    }
  }, [data])
  
  /* 최근 대화로 이동하는 함수 */
  function goRecent() { 
    endRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  /* 이전 대화를 보여주는 함수 */
  function showPrevChat() {
    setPage(num => num += 10)
  }
  const chats = chatList.map((aa) => {
    return (
      <Chats data={aa} key={aa.time} username={username} />
    )
  })

  return (
    <div className={classes.container}>
      {chats}
      <AnimatePresence>
        {inView ? null
          :
          <>
          {/* db와 불러온 page의 길이를 체크해서 이전 대화기록이 존재할 때만 버튼을 보여줌 */}
            {(page <= leng) && <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: .6 }}
              whileHover={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .2 }}
              className={classes.prevChat}
              onClick={showPrevChat}
              >이전 채팅 보기</motion.div>}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: .6 }}
              whileHover={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .2 }}
              className={classes.recentBtn} onClick={goRecent}><img src="img/recentBtn.png" alt="recentBtn" /></motion.div>
          </>}
      </AnimatePresence>
      <div ref={setRefs} className={classes.end}></div>
    </div>
  )
}
