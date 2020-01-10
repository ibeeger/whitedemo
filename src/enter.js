import React,{lazy, Suspense} from 'react'
import ReactDom from 'react-dom';
// import { Provider } from 'react-redux' 
// import {createStore} from 'redux'
import { HashRouter,  Route, Switch } from 'react-router-dom'
import Index from './pages/index';
// import Room from './pages/room';
// import Play from './pages/replay';
import Error from './error'

const Room = lazy(() => import("./pages/room"));

const Play = lazy(() => import("./pages/replay"));




function WaitingComponent(Component) {
  return props => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}


ReactDom.render((
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Index} />>
      <Route exact path="/room/:roomid/:userid" component={WaitingComponent(Room)} />
      <Route exact path="/replay/:roomid/:roomToken" component={WaitingComponent(Play)} />
      <Route component={Error} />
    </Switch>
  </HashRouter>
), document.getElementById("app-root"));
