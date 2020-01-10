import * as React from 'react'
import { createRoom, getRoomInfo } from '../utils/apis'
import {Redirect} from 'react-router-dom'
import "babel-polyfill"
import 'white-web-sdk/style/index.css'

class Index extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      redirectToPath: null
    }
  }
  async componentDidMount() {
    if(this.props.match.params.roomid){
      return;
    } 
    let rst = await createRoom();
    this.setState({
      to: '/room/'+rst.msg.room.uuid
    })
  }
  
  render() {
    if(this.state.to) {
      return <Redirect to={this.state.to} />
    }
    return (<div style={{textAlign:'center', lineHeight:'200px'}} className="main">
      等待创建房间...
      </div>)
  }
}

export default Index
