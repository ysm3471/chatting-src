import React, { useCallback, useEffect, useRef, useState } from 'react';
import classes from './Chatting.module.css'
import Chats from './Chats';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';

export default function Chatting({ username, data, setPage,page,leng }) {
  const [chatList, setChatList] = useState([]);
  const endRef = useRef();
  
  const { ref, inView } = useInView();   // 외부 라이브러리를 사용해서 지정된 돔이 보일때를 체크함

  const setRefs = useCallback(    // 지정된 ref에 다른 ref를 추가하는 방법(공식문서 참조)
    (node) => {
      endRef.current = node;
      ref(node);
    },
    [ref],
  );


  useEffect(() => {
    if (data) {
      const keys = Object.keys(data)
      const copy = keys.map((aa) => data[aa])
      setChatList(copy);
    }
  }, [data])
  

  function goRecent() {
    endRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  function showPrevChat() {
    setPage(num => num += 10)
  }

  const chats = chatList.map((aa, index) => {
    return (
      <Chats data={aa} key={index} username={username} />
    )
  })

  return (
    <div className={classes.container}>
      {chats}
      <AnimatePresence>
        {inView ? null
          :
          <>
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
