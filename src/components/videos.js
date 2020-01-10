import * as React from 'react'
import {ZegoClient} from 'webrtc-zego'
import {appid_demo, appsign_demo, appid, appsign} from '../config/index'
import "babel-polyfill"

const env = process.env.NODE_ENV;

const _appid = appid;
const _appsign_demo = appsign;

const server = env !== 'test' ? `wss://wsliveroom${_appid}-api.zego.im:8282/ws` : "wss://wsliveroom-test.zego.im:8282/ws"
const log_server = "wss://wslogger-test.zego.im:8282/log"
const valdturl  = env == 'test' ? 'https://sig-wstoken.zego.im:8282/tokenverify?' : "http://qianduan.100daishu.com/zego/token?json=1&";
    

class VideoList extends  React.Component{
   constructor(props){
      super(props);
      const zego = new ZegoClient();
      const _config = {
        appid: _appid,
        idName: this.props.selfid+'',
        nickName: 'u'+this.props.selfid,
        logLevel: 0,
        server: server,
        logUrl: log_server,
        remoteLogLevel: 0,
        audienceCreateRoom: true,
        testEnvironment: false,
      }
      this.up = false;
      this.state = {
        videolist: [{
          stream_id: _config.idName //把自己放进去
        }]
      }
      this.renderCtrl = this.renderCtrl.bind(this);
      this.initZegoLocal = this.initZegoLocal.bind(this);
      this.doPlayRemote = this.doPlayRemote.bind(this);
      this.doPlayRemoteOther = this.doPlayRemoteOther.bind(this);
      this.doStop = this.doStop.bind(this);
      this.onStreamUpdated = this.onStreamUpdated.bind(this);
      zego.enumDevices((deviceInfo)=>{
        this.audioInput = deviceInfo['microphones'][0]['deviceId'];
        this.videoInput = deviceInfo['cameras'][0]['deviceId'];
      });
      zego.config(_config);
      this.selfid = _config.idName;
      this._config = _config;
      this.zego = zego;
      zego.onStreamUpdated = this.onStreamUpdated;
   }

   doPlayRemoteOther(others){
     let {videolist} = this.state;
     let selfid = this.selfid
     let _this = this;

     console.log('lis=====',others);
     if(others) {
      //如果是老师
      if('admin' == selfid) {
       others.forEach((item)=>{
          videolist.push(item);
       })
      } else {
        videolist = videolist.concat(others.filter(item => item.stream_id == 'admin'));
      }
       this.setState({
        videolist: videolist
      }, function(){
          videolist.forEach((item)=>{
              let remotevideo = document.querySelector("#video_"+item.stream_id);
              _this.zego.startPlayingStream(item.stream_id, remotevideo);
          })
        
      })
     }
   }

   doPlayRemote(id){
    let remotevideo = document.querySelector("#video_"+id);
    this.zego.startPlayingStream(id, remotevideo);
  }

   initZegoLocal(token){
    let uuid = this.props.uuid;
    let _this = this;
    console.log('====123',token);
    this.zego.login(uuid, 2, token, function(others){
      const avConstraints = {
        audio: true,
        audioInput: _this.audioInput,
        video: true,
        videoInput: _this.videoInput,
        videoQuality: 1,
        horizontal: true
      };
      console.log('====123',others);
      const localVideo = document.querySelector('#video_'+_this.selfid);
      _this.zego.startPreview(localVideo, avConstraints, function () {
        _this.zego.startPublishingStream(_this.selfid, localVideo);
        _this.doPlayRemoteOther(others);
      }, function (error) {
        alert("start device error ", error);
      });
    }, function(error){
      console.error('login', error, arguments);
    })
   }
   doStop(streamId){
    let remotevideo = document.querySelector('#videoplayer_' + streamId + " video");
    let result = this.zego.stopPlayingStream(streamId, remotevideo);
    // this.zego.stopPublishingStream(streamId);
    if (!result) {
      // console.error('zego stop error', result);
    }
   }

   onStreamUpdated (isdel, streamList) {
    let _this = this;
    let selfid = this.selfid;
     let {videolist} = this.state;
     console.log('lis===update', streamList)
    //是否离开 0 进来  1 离开
      if (isdel == 0) {
        if(selfid == 'admin') {
          this.setState({
            videolist: videolist.concat(streamList)
          },function(){
            console.log('lis=====', this.state.videolist);
            for (let i = 0; i < streamList.length; i++) {
              _this.doPlayRemote(streamList[i].stream_id);
            }
          })
        } else {
          this.setState({
            videolist: videolist.concat(streamList.filter(item => item.stream_id == 'admin'))
          },function(){
            let list = _this.state.videolist
            console.log('lis=====', list);
            for (let i = 0; i < list.length; i++) {
              _this.doPlayRemote(list[i].stream_id);
            }
          })
        }
      } else if(isdel == 1) {
        for (let i = 0; i < streamList.length; i++) {
           this.doStop(streamList[i]['stream_id']);
           videolist = videolist.filter(item => streamList[i]['stream_id'] != item.stream_id);
        }
        this.setState({
          videolist: videolist
        })
      }
     
  }
  componentWillUnmount() {
    this.zego.stopPublishingStream(this.selfid);
  }

   componentDidMount () {
     let now = Date.now();
     let _this = this;
     let json = {
      app_id: this._config.appid,
      id_name: this._config.idName,
      app_secret: _appsign_demo,
      nonce: now,
      expired: Math.floor(now / 1000 + 30 * 60)
    }
    let url = valdturl;
    Object.keys(json).forEach(key => url+=(key+'='+json[key]+'&'));
    url = url.slice(0,url.length-1);
    fetch(url).then(res => res.text()).then(function(token){
      token = /token:(.+)/.exec(token) && /token:(.+)/.exec(token)[1] && /token:(.+)/.exec(token)[1].replace(' ', '');
      if(token) {
       console.log('=========',token)
        _this.initZegoLocal(token);
      }
    })
   }

   changeDevice(type, stream_id) {
     let {room, selfid} = this.props;
      room.dispatchMagixEvent("permiss", {
         from: selfid,
         to: stream_id,
         action: type
      });
   }

   changeUpDown(type, stream_id){
     let {room}  = this.props;
     room.setGlobalState({
       ['userid'+stream_id]: {
         up: !this.up
       }
     })
     this.setState({
       now: Date.now()
     })
     this.up = !this.up;
   }

   renderCtrl (_streamId) {
      if(this.selfid != 'admin') {
        return null;
      }
      return (<p className="ctrl"><span  onClick={this.changeDevice.bind(this,true, _streamId)}>授权</span>  <span  onClick={this.changeDevice.bind(this,false, _streamId)}>取消</span> <span  onClick={this.changeUpDown.bind(this,false, _streamId)}>{this.up ? '下台' : '上台'}</span></p>)
   }

   render() {
      let _this = this; 
      return(<ul className="videlist">
        {this.state.videolist.map(function(item, index){
          return (<li key={index}>
            <span className="tip">{item.stream_id}</span>
            <video muted={_this.selfid == item.stream_id ? true : false} style={{backgroundColor: _this.selfid == item.stream_id ? '#c00': '#000'}} id={'video_'+item.stream_id} playsInline autoPlay></video>
            {_this.renderCtrl(item.stream_id)}
          </li>)
        })}
      </ul>)
   }
}

// VideoList.propTypes = {
//   uuid: 'string'
// }

export default VideoList;