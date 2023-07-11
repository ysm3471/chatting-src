export default async function getPostList(num) { 
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