import React, { Component } from 'react';
import './style.css'

class WhiteBox extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
     this.props.room.bindHtmlElement(document.getElementById(this.props.id))
    //  this.props.room.zoomScale = 1;
     this.props.room.refreshViewSize();
  }
  render() {
    return <div className="white" id={this.props.id}>等待加入房间</div>
  }
}

export default WhiteBox