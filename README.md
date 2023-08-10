Chatting App
========
#### 실시간으로 사용자와 대화할 수 있는 앱 형식의 사이트입니다
*제작기간 7.2 ~ 7.14*

##### 사용 기술 : React, React Query
##### 사용 라이브러리 및 api : firebase, React-router-dom, react-cookie, react-intersection-observer, framer-motion. geolocation
<br><br>
> 주요 코드 1
> * 대화를 전송하면 mutation함수를 실행해서 queryClient를 refetching 시킨다. 사용자는 update된 db의 정보를 바로 받을 수 있게 된다
> * 다만 db 자체의 문제인지 전송하고 받는 과정에서 시간이 소요되었다. 대화를 전송하면 최신 대화를 볼 수 있게 하고 싶었기 때문에 전송에 걸리는 시간에 맞춰서 사용자의 viewpoint를 움직이게 했다

```js
  const updateMutaition = useMutation((chat) => {
    fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json', {
      method: "POST",
      body: JSON.stringify({
        id: chat.id,    // 사용자의 id
        content: chat.content,    // 보낼 메세지
        time,  // 전송 시간
        ip: chat.ip[2] + '.' + chat.ip[3]    // 사용자의 ip. 같은 아이디를 생성 가능하기 때문에 ip로 사용자를 구별한다
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

  async function chatBtn(e) {
    e.preventDefault();

    if (sending) {
      setSending(false);  // 메세지 전송 시작을 알림

      const interval = setInterval(() => {    // 메세지가 전송 중임을 알리기 위한 interval
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
      updateMutaition.mutate(chat);    // 위에서 정의한 mutate 함수
      formRef.current.text.value = ''   // form 텍스트 초기화

      clearInterval(interval)   // interval 초기화
      setSending(true);   // 전송 완료
      setSendingMsg('입력중');    // 전송메세지 초기화
    }
  }
```

<br><br>
> 주요 코드 2
> * db에 정보가 추가되면 refetching을 실행한다. firebase의 내장함수
> * 이로인해 다른 컴퓨터의 사용자가 채팅을 보내면 그 내용이 바로 업데이트 된다.
> * 다만 끊임없이 렌더링을 시키는 문제가 있다. 아마도 db의 상태를 짧은 간격으로 송신받는 듯. 웹사이트의 성능을 저하시킬 것 같다

```js
  const db = getDatabase(app);
  const commentsRef = ref(db, 'chattingList');

  onChildAdded(commentsRef, () => {
    queryClient.invalidateQueries(['content']);
  });
```

<br><br>
> 주요 코드 3
> * 이전의 대화를 보여주는 버튼함수
> * firebase는 특정 구간 검색이 불가능하므로 보여지는 모든 대화목록을 하나의 state에서 관리하는 방식을 선택했다
> * 불러올 대화목록의 개수를 state 값으로 저장하고 버튼을 누르면 개수 값을 변경한 뒤 refetching시킨다.

```js
/* pages/chat.jsx */
  const [page, setPage] = useState(20);   // 이전 페이지의 개수를 관리하는 state
  const newRef = useRef(0);   // 새롭게 추가되는 메세지를 관리하는 ref
  const pageRef = useRef(0);  // 불러올 db의 개수를 관리하는 state

    const { data, isLoading } = useQuery(['content'], async () => {   // 대화목록을 db에서 불러오는 useQuery
    const result = await getPostList(pageRef.current)
    return result
  })    // 두번째 인자에는 promise함수가 들어감  
  
  useEffect(() => {  // page 값이 바뀌면 pageRef의 정보를 갱신하고 query를 refetching시킴
    pageRef.current = page + newRef.current;  
    queryClient.invalidateQueries(['content']);
  }, [page,newRef.current])

/* componets/chatting.jsx */
  function showPrevChat() {    // 이전 대화를 보여주는 함수
    setPage(num => num += 10)
  }
```

<br><br>
>느낀 점
> * React-Query를 활용해보고 싶어서 만든 사이트이다. api 통신으로 변경되는 값을 실시간으로 반영하기에 편리하다고 생각이 들었다.
> * socket io를 활용해서 실시간 통신을 해보고 싶었으나 firebase db로는 불가능했다. 다음에는 꼭 해보고 싶다.

