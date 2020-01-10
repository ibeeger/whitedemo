import * as React from 'react'
import White from '../white/index'
import Tools from '../components/tools'
import {WhiteWebSdk} from 'white-web-sdk';
import { createRoom, getRoomInfo } from '../utils/apis'
import "babel-polyfill"
import * as querystring from 'querystring';
import 'white-web-sdk/style/index.css'

import './style.css'

import IframeWare from '../ware/iframe'
import VideoWare from '../ware/video'

class Play extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      room: null,
      room2: null,
      sdk: null,
      members:[]
    }
    this.sdk = null;
    this.initAndJoinRoom = this.initAndJoinRoom.bind(this);
    this.sendMessageToCocos = this.sendMessageToCocos.bind(this);
  }
 
  onPhaseChanged(e, a){
    console.log('====aaa', a);
    if(a.sceneState) {
      this.sendMessageToCocos({
        method:'onJumpPage',
        toPage: (a.sceneState.index+1)
      })
    }
    if(a.roomMembers){
       this.setState({
         members: a.roomMembers
       })
    }

    if(a.globalState) {
      if(a.globalState['useridadmin']['up']) {
        document.querySelector('#admin video').style.visibility ='visible';
        document.querySelector('#admin video').src = 'http://dianbo-wsdemo.zego.im/miniapp-zegotest-2989090888-admin--20191114152130.mp4';
      } else {
        document.querySelector('#admin video').style.visibility ='hidden';
      }
    }
    // http://dianbo-wsdemo.zego.im/miniapp-zegotest-2989090888-8888999--20191113101324.mp4
  }

  onScheduleTimeChanged(e,a){
    console.log('====b',e,a)
  }

  async componentDidMount() {
     let uuid = this.props.match.params.roomid;
     let roomToken = this.props.match.params.roomToken
     this.initAndJoinRoom(roomToken, uuid);
  }
  sendMessageToCocos(json) {
    document.getElementById('cocos').contentWindow.postMessage(JSON.stringify(json),'*')
  }
  initAndJoinRoom(roomToken, uuid){
    var whiteWebSdk = new WhiteWebSdk();
    let _this = this;
    return whiteWebSdk.replayRoom({
      room: uuid,
      roomToken: roomToken,
    },{
      onScheduleTimeChanged: _this.onScheduleTimeChanged.bind(this),
      onPlayerStateChanged: _this.onPhaseChanged.bind(this,'onPlayerStateChanged')
    }).then(function(player){
      console.log('====',player);
      player.bindHtmlElement(document.getElementById('white2'));
      player.play()
    }).catch(function(e){
      console.error('err', e);
    });
  }
  render() {
    let {members} = this.state;
    let url = "https://doccdn.talk-cloud.net/upload0/20190927_114520_lggquxwp/index.html?isClientPlayAudio=true&fileid=5339331&role=-2"
    return (<div>
      <div id="playlist">
         {members.map(item => {
           return <div key={item.payload.id} className="replaylist" id={item.payload.id}><video autoPlay></video></div>
         })}
      </div>
      <div id="white2" style={{width:window.innerWidth+'px',height:window.innerHeight+'px', position:'absolute'}}></div>
        <iframe frameBorder={0} id="cocos" src={url} style={{width:window.innerWidth+'px',height:window.innerHeight+'px'}} />
      </div>)
  }
}

export default Play
