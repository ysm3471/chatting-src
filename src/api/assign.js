export default async function assign(info) {
  fetch('https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/usersInfo.json',{
    method:"POST",
    body:JSON.stringify({
      id:info.id,
      password:info.password
    }),
  })
  .then((res) => res.json())
}