import React, { Component } from 'react';
import { CNode, CNodeKind } from "white-web-sdk";

class IframeWare extends Component {
    constructor (props) {
      super(props);
    }
    componentDidMount() {
       console.log("props", this.props);
    }
    willInterruptEvent(){
      return true
    }
   render() {
        return (
            <CNode kind={CNodeKind.HTML} style={{pointerEvents:'auto'}} >
                <iframe src={this.props.url} style={{pointerEvents:'auto'}} width={this.props.width} height={this.props.height}></iframe>
            </CNode>
        );
    }
}

IframeWare.protocol = "abc"
IframeWare.backgroundProps = {url: "//abc123.com"};
IframeWare.willInterruptEvent = function() {return true};

export default IframeWare