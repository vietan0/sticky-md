export default function getDateNow() {
  const utc = new Date(Date.now()).toUTCString();

  return utc;
}
