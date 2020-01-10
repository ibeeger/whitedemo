import * as React from 'react'
import White from '../white/index'
import Tools from '../components/tools'
import {WhiteWebSdk} from 'white-web-sdk';
import { createRoom, getRoomInfo } from '../utils/apis'
import "babel-polyfill"
import 'white-web-sdk/style/index.css'
import VideoList from '../components/videos'

import IframeWare from '../ware/iframe'
import VideoWare from '../ware/video'

class Room extends React.Component{
  constructor(props){
    super(props);
    let userid = this.props.match.params.userid
    this.state = {
      room: null,
      room2: null,
      sdk: null,
      userid
    }
    this.sdk = null;
    this.initAndJoinRoom = this.initAndJoinRoom.bind(this);
    this.onPhaseChanged =this.onPhaseChanged.bind(this);
    this.sendMessageToCocos = this.sendMessageToCocos.bind(this);
  }
 
  async componentDidMount() {
     let uuid = this.props.match.params.roomid;
     let rst, room, room2;
       rst = await getRoomInfo(uuid);
       room = await this.initAndJoinRoom(rst, uuid);
       room.disableCameraTransform = true;
       room.zoomChange(0.5);
      this.setState({
        room: room,
        promise: false,
        sdk: this.sdk
      });
      room.addMagixEventListener('permiss', this.reciveRoomEvent.bind(this), false);
      window.addEventListener('message', this.reciveCocosMessage.bind(this), false);
  }

  reciveRoomEvent(data){
    let {room,userid} = this.state;
    console.log('reciveRoomEvent', room.disableDeviceInputs, data);
    data = data[0];
    switch(data.event){
      case 'permiss':
          // room.disableDeviceInputs = true;
          if(data.payload.to == userid) {
            // console.log('reciveRoomEvent', room.disableDeviceInputs, data.payload.action);
            // room.setMemberState({currentApplianceName: data.payload.action})
            this.setState({
              promise: data.payload.action
            })
          }
        break;
    }
  }

  reciveCocosMessage(msg){
    if(!msg.data){
      return
    }
    let data = typeof msg.data == 'string' ? JSON.parse(msg.data) : msg.data;
    if(data.handleData && data.handleData['actType'] == 'requestBaseinfo') {
      var msgdata = {
          method: "h5Message", 
          handleData: {
              actType: 'baseinfo',
              data: {
                  token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImRhaXNodV93eGFwaSJ9.eyJpc3MiOiJkYWlzaHVfd3hhcGkiLCJhdWQiOiJkYWlzaHVfd3hhcGkiLCJqdGkiOiJkYWlzaHVfd3hhcGkiLCJpYXQiOjE1NzMxNzk2MDksImV4cCI6MTU3MzIwMTIwOSwibmJmIjoxNTczMTc5NjA5LCJ1c2VyIjp7InVzZXJJZCI6IjcxIiwiaXNFeHBpcmVkIjowfX0.Tb3PFXEmX8qhYGoUHOl2u4Ko6xpH9fxerEIXTq2fsAk',
                  lessonId: 6829,
                  userId: this.state.userid == 'admin' ?  71 : 'anonymous',
                  role: this.state.userid == 'admin' ? 0 : -1,
                  env: 0,//环境 
                  cv: '1.2.3',//客户端版本
                  clientId: 2, //1-ipad;2-pc
              }
          }
      };
      this.sendMessageToCocos(msgdata);
    }

    if(data.method == 'onPagenum') {
       if(!this.state.room.state.globalState.isbegin){
        let list = [];
        for(let i =1; i<=data.totalPages; i++) {
          list.push({name:'p'+i, width: 1000, height:500});
        }
        this.state.room.setGlobalState({
          isbegin: true
        })
        this.state.room.putScenes("/cocos1", list);
       }
       
    }
  }

  sendMessageToCocos (json) {
    document.getElementById('cocos').contentWindow.postMessage(JSON.stringify(json),'*')
  }
  onPhaseChanged(result){
    let {userid, room} = this.state;
    console.log('sceneState', result, userid);
    if(userid !='admin') {
       if(result.sceneState){
         this.sendMessageToCocos({
          method:'onJumpPage',
          toPage: (result.sceneState.index+1)
         })
       }
    }
    if(result.globalState) {
      console.log('=======', result.globalState)
      room.setCameraBound({
        centerX: 120, // 限制范围（矩形）的中间点的 x 坐标
        centerY: 320, // 限制范围（矩形）的中间点的 y 坐标
        width: 200, // 限制范围（矩形）的宽
        height: 300,
      })
    }

  }

  initAndJoinRoom(json, uuid){
    // 初始化 SDK，初始化 SDK 的参数，仅对本地用户有效，默认可以不传
    var whiteWebSdk = new WhiteWebSdk({
      plugins:[IframeWare,VideoWare],
      preloadDynamicPPT: true
    });
    this.sdk = whiteWebSdk;
    return whiteWebSdk.joinRoom({
      preloadDynamicPPT: true,
      // 这里与
      userPayload: { id: this.props.match.params.userid},
      uuid: uuid,
      roomToken: json.msg.roomToken,
    },{
      onRoomStateChanged: this.onPhaseChanged.bind(this)
    });
  }
  render() {
    let url = "" // "https://doccdn.talk-cloud.net/upload0/20190927_114520_lggquxwp/index.html?isClientPlayAudio=true&fileid=5339331&role="+(this.state.userid == 'admin' ? 0 : -1);
    return (<div>
      {(this.state.room && (this.state.userid == 'admin' || this.state.promise)) ? <Tools room={this.state.room} sdk={this.state.sdk} /> : null }
      {this.state.room ? <White id="white2" room={this.state.room}  sdk={this.state.sdk}/> : null }
      {this.props.match.params.roomid ? <VideoList room={this.state.room} selfid={this.props.match.params.userid} uuid={this.props.match.params.roomid} /> : null}
      <iframe frameBorder={0} src={url} id="cocos" style={{width:1024+'px',height:700+'px'}} />
      </div>)
  }
}

export default Room
