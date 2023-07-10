export default async function getPostList(num) {   // 최근게시물을 40개까지 가져옴
  const respone = await fetch(`https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json?orderBy="time"&limitToLast=${num}`);
  const result = await respone.json();

  return result;
}

export async function getPostListLeng() {
  const respone = await fetch(`https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json?shallow=true`);
  const result = await respone.json();
  let leng = [];

  Object.keys(result).forEach((aa) => {
    leng.push(aa)
  })
  return leng;
}