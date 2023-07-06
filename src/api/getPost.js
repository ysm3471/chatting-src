export default async function getPostList() {
  const respone = await fetch(`https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/chattingList.json`);
  const result = await respone.json();

  console.log('working??')
  return result;
}