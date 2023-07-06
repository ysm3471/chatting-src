export default async function getUserList() {
  const respone = await fetch(`https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app/usersInfo.json`);
  const result = await respone.json();

  return result;
}