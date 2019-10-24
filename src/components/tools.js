import React, { Component } from 'react';
import './style.css'
class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  MouseHandle(type){
    this.props.room.setMemberState({
      currentApplianceName: type
    })
  }

  changeScene(){
    this.props.room.setScenePath("/sc/"+Math.floor(Math.random() * 10));
  }

  wareHandle() {
    this.props.room.insertPlugin({
      protocal: "abc", // 自定义教具的名字
      centerX:0, // 中心点为 0，0
      centerY:0, // 中心点为 0，0
      width: window.innerWidth,
      height: 400,
      props: {
        url: 'http://localhost/courseware/move.html' // 自定义传入属性，可以不传
        // url: 'http://localhost:7456/?account=c'+Date.now()+'&roleType=2' // 自定义传入属性，可以不传
      },
    })
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

  render() {
    return <ul className="tools">
      <li onClick={this.MouseHandle.bind(this,'selector')}>鼠标</li>
      <li onClick={this.MouseHandle.bind(this,'pencil')}>铅笔</li>
      <li onClick={this.MouseHandle.bind(this,'ellipse')}>图形</li>
      <li onClick={this.wareHandle.bind(this)}>课件教具</li>
      <li onClick={this.wareHandleVideo.bind(this)}>视频</li>
      <li onClick={this.changeScene.bind(this)}>场景改变</li>
    </ul>
  }
}

export default Tools;