export default async function loadIp() {
  const ipData = await fetch('https://geolocation-db.com/json/');
  const locationIp = await ipData.json();

  return locationIp.IPv4
}
