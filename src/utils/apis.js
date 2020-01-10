
import { token } from '../config/index'



export const createRoom = () => {
  const url = 'https://cloudcapiv4.herewhite.com/room?token=' + token;
  var requestInit = {
    method: 'POST',
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mode: 'historied',
      name: new Date().toLocaleDateString() + "房间",
      limit: 32, // 房间人数限制
    }),
  };
  return fetch(url, requestInit).then(res => res.json());
}

export const getRoomInfo = (uuid) => {
  var url = `https://cloudcapiv4.herewhite.com/room/join?token=${token}&uuid=${uuid}`;
  var requestInit = {
    method: 'POST',
    headers: {
      "content-type": "application/json",
    },
  };
  return fetch(url, requestInit).then(res => res.json());
}
