import React, { Component } from 'react';
import './style.css'

class WhiteBox extends Component {
  constructor(props) {
    super(props);
  }
 
  componentDidMount() {
     this.props.room.bindHtmlElement(document.getElementById('white'))
    //  this.props.room.zoomScale = 1;
     this.props.room.refreshViewSize();
  }
  render() {
    return <div id="white" style={{width: window.innerWidth+'px'}}>等待加入房间</div>
  }
}

export default WhiteBox