import * as React from 'react'
import ReactDom from 'react-dom';
import White from './white/index'
import Tools from './components/tools'
import {WhiteWebSdk} from 'white-web-sdk';
import { createRoom, getRoomInfo } from './utils/apis'
import "babel-polyfill"
import * as querystring from 'querystring';

import IframeWare from './ware/iframe'
import VideoWare from './ware/video'



class Index extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      room: null
    }
    this.initAndJoinRoom = this.initAndJoinRoom.bind(this);
    this.onPhaseChanged =this.onPhaseChanged.bind(this);
  }
  async componentDidMount() {
     let search = querystring.parse(location.search.replace('?',''));
     let rst, room;
     if(search.uuid) {
       rst = await getRoomInfo(search.uuid);
       room =await this.initAndJoinRoom(rst);
     } else {
        rst = await createRoom();
        room = await this.initAndJoinRoom(rst);
     }
      console.log('room', room);
      room.disableCameraTransform = true;
      let list = []
      for(let i=0; i<10; i++) {
        list.push({name:i, ppt:{src:'http://zxxb-test.100daishu.com/rooclass-teach/static/img/logo_teach.7ac8a9e.png', width: 200, height:200}});
      }
      room.putScenes("/sc", list);
      this.setState({
        room: room
      })
  }

  onPhaseChanged(){
    console.log(arguments)
  }

  initAndJoinRoom(json){
    // 初始化 SDK，初始化 SDK 的参数，仅对本地用户有效，默认可以不传
    var whiteWebSdk = new WhiteWebSdk({
      plugins:[IframeWare,VideoWare]
    });
    let search = querystring.parse(location.search.replace('?',''));
    return whiteWebSdk.joinRoom({
      // 这里与
      userPayload: { id: Date.now()},
      uuid:  search.uuid || json.msg.room.uuid,
      roomToken: json.msg.roomToken,
    },{
      onRoomStateChanged: this.onPhaseChanged
    });
  }
  render() {
    return (<div>
      {this.state.room ? <Tools room={this.state.room} /> : null }
      {this.state.room ? <White room={this.state.room} /> : null }
      <div id="aabbcc"></div>
      </div>)
  }
}

ReactDom.render(
  <Index />,
  document.getElementById("app-root"),
);
