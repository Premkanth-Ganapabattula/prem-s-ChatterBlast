import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './Components/LoginForm'
import Home from './Components/Home'
import NotFound from './Components/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import RegistrationForm from './Components/RegistrationForm'
import UserProfileSetup from './Components/userProfileSetup'
import FollowersList from './Components/followersList'
import FollowingList from './Components/followingsList'
import Map from './Components/mapFolder'
import SuggestionsRequests from './Components/suggestionsRequests'
import MyProfile from './Components/myProfile'
import Messages from './Components/messages'
import ConverstionDetails from './Components/converstionDetails'
import VoiceMessagePlayerRecorder from './Components/mikeText'
import VoiceMessagePlayerRecorderText from './Components/text2'
import ReelsDetails from './Components/reelsDetails'
import SuggestedUserList from './Components/suggestedUsersList'
import VoiceControlledComponent from './Components/mikeTest3'
import AiBot from './Components/aiBot'
import Notifications from './Components/notifications'
import Menu from './Components/menu'
import UserProfile from './Components/userProfile'
import TranslatorComponent from './Components/language'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/registration" component={RegistrationForm} />
        <Route exact path="/login" component={LoginForm} />
        <ProtectedRoute exact path="/user/profile/setup" component={UserProfileSetup} />
        <ProtectedRoute exact path="/map" component={Map} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/friends" component={SuggestionsRequests} />
        <ProtectedRoute exact path="/user/followers" component={FollowersList} />
        <ProtectedRoute exact path="/user/following" component={FollowingList} />
        <ProtectedRoute exact path="/mike" component={VoiceMessagePlayerRecorder} />
        <ProtectedRoute exact path="/my/profile" component={MyProfile} />
        <ProtectedRoute exact path="/reels" component={ReelsDetails} />
        <ProtectedRoute exact path="/messages" component={Messages} />
        <ProtectedRoute exact path="/converstion" component={ConverstionDetails} />
        <ProtectedRoute exact path="/suggested/user" component={SuggestedUserList} />
        <ProtectedRoute exact path="/test2" component={VoiceMessagePlayerRecorderText} />
        <ProtectedRoute exact path="/test3" component={VoiceControlledComponent} />
        <ProtectedRoute exact path="/notifications" component={Notifications} />
        <ProtectedRoute exact path="/suggestions/user" component={UserProfile} />
        <ProtectedRoute exact path="/ai/bot" component={AiBot} />
        <ProtectedRoute exact path="/menu" component={Menu} />
        <ProtectedRoute exact path="/lan" component={TranslatorComponent} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
