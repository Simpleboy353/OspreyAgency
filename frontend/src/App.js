import './App.css';
import { useEffect } from 'react';
import {Switch,Route} from 'react-router-dom';
import Login from './Components/login'
import Home from './Components/home';
import Manageusers from './Components/manageusers';
import Myaccount from './Components/myaccount';
import Error from './Components/error';
import ManageActivities from './Components/manageactivities';
import ManageEvents from './Components/manageevents';
import manageBrandAmbassador from './Components/managebrandambassador';
import Notification from './Components/notification';
import UserSignUp from './Components/userSignUp';
import UserLogin from './Components/userlogin';
import UserHome from './Components/userhome';
import UserViewEvents from './Components/userviewEvents';
import UserViewBrandAmbassador from './Components/userviewbrand';
import UserViewNotification from './Components/userviewnotification';
import UserViewProfile from './Components/userviewprofile';
import UserAppliedActivities from './Components/userappliedActivities';
import userAttendingEvents from './Components/userattendingEvents';
import Membership from './Components/membership';
import ViewUsers from './Components/userpage';


function App() {
  useEffect(()=>{
    document.body.style.overflowX="hidden";
  },[])
  return (
    <div className="App">
     <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/dashboard" component={Home}/>
      <Route path="/manage-users" component={Manageusers}/>
      <Route path="/activities" component={ManageActivities}/>
      <Route path="/events" component={ManageEvents}/>
      <Route path="/brandAmbassadors" component={manageBrandAmbassador}/>
      <Route path="/notification" component={Notification}/>
      <Route path="/setting" component={Myaccount}/>
      {/* User */}
      <Route path="/userSignUp" component={UserSignUp}/>
      <Route path="/userLogin" component={UserLogin}/>
      <Route path="/userHome" component={UserHome}/>
      <Route path='/viewEvents' component={UserViewEvents}/>
      <Route path='/viewBrandAmbassador' component={UserViewBrandAmbassador}/>
      <Route path='/viewNotification' component={UserViewNotification}/>
      <Route path='/userProfile' component={UserViewProfile}/>
      <Route path='/userAppliedactivities' component={UserAppliedActivities}/>
      <Route path='/userAttendingEvents' component={userAttendingEvents}/>
      <Route path='/membership' component={Membership}/>
      <Route path='/viewUsers' component={ViewUsers}/>


      <Route path="/404" component={Error}/>
     </Switch>
    </div>
  );
}

export default App;
