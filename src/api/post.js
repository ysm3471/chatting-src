// 처음에는 따로 뺐는데 자꾸 순서가 post 완료 전에 쿼리초기화가 진행되어서 부득이하게 합쳐버림

export default async function post(chat) {
  const date = new Date();
  const time = date.getTime();

  const ipData = await fetch('https://geolocation-db.com/json/');
  const locationIp = await ipData.json();
  
  const ip = locationIp.split('.')

  console.log(ip);

  fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json',{
    method:"POST",
    body:JSON.stringify({
      id:chat.id,
      content:chat.content,
      time
    })
  })
  .then((res) => {
    res.json()
    console.log('done')
  })
}