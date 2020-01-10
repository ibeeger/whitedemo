import React, { Component } from 'react';
import './style.css'
import {token} from '../config/index'
import {Link} from 'react-router-dom'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'auto',
      recordurl: '/replay/'+props.room.uuid+'/'+props.room._roomToken
    }
  }
 
  componentDidMount () {
    this.currentApplianceName = this.props.room.state.memberState;
    
    window.addEventListener('message', this.reciveCocosMessage.bind(this), false);
    window.addEventListener('keydown', this.changeMouseState.bind(this), false);
    window.addEventListener('keyup', this.leaveMouseState.bind(this),false);
    
  }

  leaveMouseState(event){
    // this.props.room.setMemberState({
    //   currentApplianceName: this.currentApplianceName
    // })
  }
  changeMouseState(event){
    if(event.keyCode == 17){
      this.props.room.setMemberState({
        currentApplianceName: 'selector'
      })
    }
  }

  reciveCocosMessage(msg){
    if(msg.data) {
      let data = typeof msg.data == 'string' ? JSON.parse(msg.data) : msg.data;
      if(data.method == 'onJumpPage') {
        this.props.room.setScenePath('/cocos1/p'+data.toPage);
      }
    }
  }
  
  SetViewModel(){
    this.props.room.setGlobalState({
      ['userid'+8888999]: {
        view: Date.now()
      }
    })
  }

  MouseHandle(type){
    this.setState({
      active: 'none'
    })
    if(type == 'selector') {
      document.getElementById('white2').style.pointerEvents='none';
    } else {
      document.getElementById('white2').style.pointerEvents='auto';
    }
    
    this.props.room.setMemberState({
      currentApplianceName: type
    })
    this.currentApplianceName = type;
    console.log('=====',this.props.room.state)
  }

  changeScene(){
    this.props.room.setScenePath("/sc/"+Math.floor(Math.random() * 10));
  }

  pptConverter() {
    // console.log(this.props.room)
    let pptConverter =  this.props.sdk.pptConverter(this.props.room._roomToken);
    let {room} = this.props;
    pptConverter.convert({
       url: 'http://sketchpad.oss-cn-hangzhou.aliyuncs.com/%E5%9B%9B%E5%B9%B4%E7%BA%A7A%2B%E7%89%88%E7%AC%AC%E5%85%AD%E8%AE%B2.pptx',
       kind: "dynamic",
       onProgressUpdated: function(e){
         console.log('process', e);
       }
    }).then(function(result){
      room.putScenes('/hello', result.scenes);
      room.setScenePath('/hello/1')
    })
  }

  wareHandle() {
   let s =  this.props.room.insertPlugin({
      protocal: "abc", // 自定义教具的名字
      centerX:0, // 中心点为 0，0
      centerY:0, // 中心点为 0，0
      width: 300,
      height: 300,
      props: {
        active: this.state.active,
        // url: 'http://localhost/courseware/move.html' // 自定义传入属性，可以不传
        url: 'http://localhost:7456/?account=c'+Date.now()+'&roleType=2' // 自定义传入属性，可以不传
      },
    })
    console.log(s);
  }
  wareHandleVideo() {
    this.props.room.insertPlugin({
      protocal: "video", // 自定义教具的名字
      centerX: Math.floor(Math.random() * 600), // 中心点为 0，0
      centerY: Math.floor(Math.random() * 400), // 中心点为 0，0
      width: 200,
      height: 200,
      props: {
        // url: 'http://link.ibeeger.com' // 自定义传入属性，可以不传
      },
    })
  }

  previewScene(){
     
  }

  goToPlay(){
    console.log('====',this.props.room._roomToken);
  }

  prePage(){
    this.props.room.pptPreviousStep();
  }

  nextPage(){
    this.props.room.pptNextStep();
  }

  render() {
    return <div><ul className="tools">
      <li onClick={this.MouseHandle.bind(this,'selector')}>鼠标</li>
      <li onClick={this.MouseHandle.bind(this,'pencil')}>铅笔</li>
      <li onClick={this.MouseHandle.bind(this,'ellipse')}>图形</li>
      <li onClick={this.MouseHandle.bind(this,'eraser')}>橡皮</li>
      <li onClick={this.SetViewModel.bind(this)}>调整视窗</li>
      {/* <li onClick={this.previewScene.bind(this,'eraser')}>预览场景</li> */}
      {/* <li onClick={this.pptConverter.bind(this)}>ppt转换</li> */}
      {/* <li onClick={this.wareHandle.bind(this)}>课件教具</li> */}
      {/* <li onClick={this.wareHandleVideo.bind(this)}>视频</li> */}
      {/* <li onClick={this.changeScene.bind(this)}>场景改变</li> */}
      <li><Link to={this.state.recordurl}>查看回放</Link></li>
    </ul>
    {/* <p><a onClick={this.prePage.bind(this)}>上一页</a><a onClick={this.nextPage.bind(this)}>下一页</a></p> */}
    </div>
  }
}

export default Tools;