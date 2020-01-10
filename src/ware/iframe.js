import React, { Component } from 'react';
import { CNode, CNodeKind } from "white-web-sdk";

class IframeWare extends Component {
    constructor (props) {
      super(props);
    }
    componentDidMount() {
       console.log("props", this.props);
    }
   
   render() {
        return (
            <CNode kind={CNodeKind.HTML} >
                <iframe src={this.props.url} style={{pointerEvents: this.props.active}} width={this.props.width} height={this.props.height}></iframe>
            </CNode>
        );
    }
}

IframeWare.protocol = "abc"
IframeWare.backgroundProps = {url: "//abc123.com", active: 'none'};
IframeWare.willInterruptEvent = function() {return true};

export default IframeWare