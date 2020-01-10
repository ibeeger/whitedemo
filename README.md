## netless 白板和 zego的调研

#### 创建房间（netless）

```
'https://cloudcapiv4.herewhite.com/room?token=' + token;
```


#### 加入房间（netless）

- uuid 房间id

```
https://cloudcapiv4.herewhite.com/room/join?token=${token}&uuid=${uuid};
```


#### 状态保持（netless）

- setMemberState
- setGlobalState
- setScenePath

等等 思路是所有人都维护房间里面的 树形结构。 

```
//全局状态，所有人可读可修改
readonly globalState: GlobalState;
// 只读数组：房间用户状态
readonly roomMembers: ReadonlyArray<RoomMember>;
// 场景状态，详情见[场景管理]文档
readonly sceneState: SceneState;
// 当前用户的教具状态，详情见[教具使用]文档
readonly memberState: MemberState;
// 主播信息，详情见[视角同步]文档
readonly broadcastState: Readonly<BroadcastState>;
// 当前白板的缩放比例
readonly zoomScale: number;

```


#### 加入房间（zego） 

```
zego.login(roomid, role, token, success, error)

```


#### 推流和拉流


```
//推流
startPublishingStream(userid, local_video_tag); 开始推流
stopPublishingStream(userid)// 停止推流
 
 
//拉流
startPlayingStream(userid, remote_video_tag)
stopPlayingStream(userid, remote_video_tag)

```

#### 音视频开关控制

```
zego.enableMicrophone(video_tag, enable);  enable: 0,1
zego.enableCamera(video_tag, enable);
```


##### 服务端部分

- 创建流的回调  https://doc.zego.im/CN/539.html

- 关闭流的回调 （如果关闭时间间隔 小于30秒会合并，时间可调） https://doc.zego.im/CN/540.html

- 关闭后30秒之后 录制文件回调 https://doc.zego.im/CN/910.html

- 还有个推流回调，没让zego 他们配置，也有文档 https://doc.zego.im/CN/972.html


