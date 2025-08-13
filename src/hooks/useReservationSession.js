// 예약 진행 중 임시 상태를 세션스토리지로 관리
const KEY = "reservation.flow";

function read() {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function write(obj) {
  sessionStorage.setItem(KEY, JSON.stringify(obj || {}));
}

export function getReservation() {
  return read();
}

export function setReservation(patch) {
  const cur = read();
  write({ ...cur, ...patch });
}

export function clearReservation() {
  sessionStorage.removeItem(KEY);
}
