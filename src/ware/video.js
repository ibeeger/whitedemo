import React, {Component} from 'react'
import { CNode, CNodeKind } from "white-web-sdk";

class VideoWare extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return <CNode kind={CNodeKind.HTML} width={this.props.width} height={this.props.height}>
        <video autoPlay={true} style={{backgroundColor:"#000"}} src={this.props.url}  width={this.props.width} height={this.props.height}></video>
    </CNode> 
  }
}

VideoWare.protocol = "video"
VideoWare.backgroundProps = {url: "//localhost/file/a.mp4"};

export default VideoWare