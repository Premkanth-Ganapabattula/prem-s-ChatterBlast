import React,{Component, memo} from 'react'
import Cookies from 'js-cookie'
import UserDetails from '../userDetails';
import StatusCard from '../statusCards';
import RequestedUsers from '../RequestedUsers';
import PostDetails from '../postDetails';
import UploadPosts from '../uploadPosts';
import { Link } from 'react-router-dom';
import AdsSlider from '../adsSilder';
import StatusUploader from '../statusUploader';
import ReactLoaderSpinner from '../reactSpinner';
import Model from 'react-modal';

import Header from '../Header'

import './index.css'

class Home extends Component {
  state = {userDetails: '', requests: '', statusUploadCard: ''}

  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      userDetails: [],
      acceptedUserId: '',
      posts: '',
      statusUploadCard: false,
      statusDetails: [],
      suggestedUsers: [],
      loadingProfile: false,
      loadingSuggestions: false,
      loadingStatus: false,
      loadingPosts: false,
      loadingAds: false,
      loadingRequests: false,
      scrollPosition: 0
    };
    this.userListRef = React.createRef();
    this.socket = null;
  }

  componentDidMount() {
    this.setupWebSocket()
    this.gettingusers();
    this.gettingSuggestedusers();
    this.gettingPosts()
    this.gettingStatusDetails()
    this.gettingRequestOfUser();
  }

  componentWillUnmount() {
    this.closeWebSocket();
  }

  /*scrollToBottom() {
    if (this.containerRef.current) {
      this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
    }
  }*/

  setupWebSocket = () => {
    this.socket = new WebSocket(`wss://chatterblast-server.onrender.com/`);
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'newFriendRequest') {
        /*const newRequest = message.payload;
        this.setState((prevState) => ({
          requests: [...prevState.requests, newRequest],
        })); */
        this.gettingRequestOfUser()
      } else if (message.type === 'newFriend') {
        this.gettingRequestOfUser()
        const acceptedUserId = message.payload;
        this.setState({acceptedUserId: acceptedUserId.following})
      }
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  closeWebSocket = () => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      console.log('WebSocket connection closed');
    }
  };

  restoreScrollPosition = () => {
    if (this.userListRef.current) {
      this.userListRef.current.scrollTop = this.state.scrollPosition;
    }
  };

  onCilckStatusUpload = () => {
    this.setState({statusUploadCard: true})
  }

  onClickStatusClose = () => {
    this.setState({statusUploadCard: false})
  }

  gettingPosts = async() => {
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://chatterblast-server.onrender.com/posts/get/`
    this.setState({loadingPosts: true})
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({posts: data.postsDetails, loadingPosts: false})
  }

  gettingStatusDetails = async() => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingStatus: true})
    const url = `https://chatterblast-server.onrender.com/get/status/${userId}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({statusDetails: data.statusDetails, loadingStatus: false})
  }

  gettingRequestOfUser = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingRequests: true})
    const url = `https://chatterblast-server.onrender.com/requests/user/${userId}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({requests: data.requests, loadingRequests: false})
  }

  gettingusers = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingProfile:true})
    const url = `https://chatterblast-server.onrender.com/profile/details/${userId}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({userDetails: data.userDetails, loadingProfile:false})
  }

  gettingSuggestedusers = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingSuggestions: true})
    const url = `https://chatterblast-server.onrender.com/user/details/${userId}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({suggestedUsers: data.userDetails, loadingSuggestions: false})
  }
  
  
  render() {
    const {
      userDetails,
      suggestedUsers, 
      requests, 
      acceptedUserId, 
      statusUploadCard, 
      statusDetails, 
      posts,
      loadingAds,
      loadingPosts,
      loadingStatus,
      loadingProfile,
      loadingRequests,
      loadingSuggestions
    } = this.state
    const {username, first_name, last_name, bio, followersCount, followingsCount, profile_photo, postsCount} = userDetails;
    const backgroundImageUrl1 = 'url("https://marketplace.canva.com/EAE89qUYCic/1/0/1600w/canva-blue-ocean-tide-beach-motivational-quote-facebook-cover-UlayDxq20Mo.jpg")'
    const backgroundImageUrl2 = 'url("https://png.pngtree.com/background/20210715/original/pngtree-line-white-background-business-picture-image_1326839.jpg")'
    return (
      <>
        <Header />
        {loadingProfile? <ReactLoaderSpinner /> : 
        <div className='home-main-container'>
          <div className='left-screen-container'>
            <div className='profile-card-home' style={{ 
              backgroundImage: backgroundImageUrl1, backgroundImageUrl2
            }}>
              <div>
                {profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt={username} className='profile-photo-profile-card' />}
              </div>
              <div className='profile-content-card'>
                <p className='username-profile-card'>{username}</p>
                <p className='full-name-profile-card'>{first_name + " " + last_name}</p>
                <p className='bio-profile-card'>{bio}</p>
              </div>
              <div className='posts-followers-container'>
                <Link to="/user/followers" className="links-home-page">
                  <div className='details-card-profile-container'>
                    <p className='details-heading'>Posts</p>
                    <hr className='line-between-counts'/>
                    <p className='count_of_details'>{postsCount}</p>
                  </div>
                </Link>
                <Link to="/user/followers" className="links-home-page">
                  <div className='details-card-profile-container'>
                    <p className='details-heading'>Followers</p>
                    <hr className='line-between-counts'/>
                    <p className='count_of_details'>{followersCount}</p>
                  </div>
                </Link>
                <Link to="/user/following" className="links-home-page">
                  <div className='details-card-profile-container'>
                    <p className='details-heading'>Following</p>
                    <hr className='line-between-counts'/>
                    <p className='count_of_details'>{followingsCount}</p>
                  </div>
                </Link>
              </div>
              <Link to="/my/profile">
                <div className='view-profile-button-card'>
                  <button type='button' className='view-profile-button'>View Profile</button>
                </div>
              </Link>
            </div>
            {loadingSuggestions? <ReactLoaderSpinner /> : <div className='left-screen-card-2'>
              <div className='users-details-card'>
                <div className='heading-arrow'>
                  <p className='card-heading-2-card-home'>Suggestions</p>
                </div>
                <div className="display-card" ref={this.userListRef} onScroll={this.restoreScrollPosition}>
                  {suggestedUsers.length !== 0? <div className='users-list'>
                    {suggestedUsers && suggestedUsers.length > 0 ? (
                        suggestedUsers.map((each, index) => (
                        <UserDetails key={index} userDetails={each} isAccepted={each.user_id === acceptedUserId} />
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                  </div> : <ReactLoaderSpinner />}
                </div>
              </div>
            </div>}
          </div>
          <div className='middle-screen-container'>
            {statusDetails.length !== 0 ?<div className='status-container-home'>
              <div>
              <div className='status-uploading-card'>
                <StatusUploader />
              </div>
              <p className='user-name-status-card'>{username}</p>
              </div>
              <div className='active-users-status'>
                {console.log(statusDetails)}
              {statusDetails && statusDetails[0].profile_photo !== null ? (
                  statusDetails.map((each, index) => (
                    <StatusCard userDetails={each} key={index} />
                  ))
                  ) : (
                      <p>No users found</p>
                  )}
              </div>
            </div> : <ReactLoaderSpinner />}
            <div className='upload-posts-container'>
              <UploadPosts />
            </div>
            {loadingPosts? <ReactLoaderSpinner /> : <div className='posts-middle-container'>
              {posts && posts.length > 0 ? (
                posts.map((each, index) => (
                <PostDetails key={index} postDetails={each} />
                  ))
                ) : (
                  <p>No posts found</p>
              )}
            </div>}
          </div>
          <div className='right-screen-container'>
            <div className='ads-container'>
                  {loadingProfile? <ReactLoaderSpinner /> : <AdsSlider adsDetails={suggestedUsers} />}
            </div>
            {loadingRequests? <ReactLoaderSpinner /> : <div className='left-screen-card-2'>
              <p className='side-heading-requests'>Requests</p>
              <div className='users-list'>
                  {requests && requests.length > 0 ? (
                      requests.map((each, index) => (
                      <RequestedUsers key={index} userDetails={each} />
                      ))
                  ) : (
                      <p>No users found</p>
                  )}
              </div>
            </div>}
          </div>
        </div>}
      </>
    )
  }
  }

export default memo(Home);
