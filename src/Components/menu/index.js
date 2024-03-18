import { Component } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import {Link, Redirect} from 'react-router-dom'

import './index.css'

const cardList = [
    {
        name: 'Followers', 
        path: '/user/followers'
    },{
        name: 'Followering', 
        path: '/user/following'
    },{
        name: 'Posts', 
        path: '/posts'
    },{
        name: 'Requested', 
        path: '/Requestes'
    },{
        name: 'Suggestions', 
        path: '/suggested/user'
    },]
class Menu extends Component {
    state={userDetails:{}, redirect: false}

    componentDidMount() {
        this.gettingUserDetails()
    }

    onClickLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('user_id')
        this.setState({redirect: true})
    }

    gettingUserDetails = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
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
        console.log(data)
        this.setState({userDetails: data.userDetails})
    }

    render() {
        const {userDetails, redirect} = this.state
        const {profile_photo, username} = userDetails

        if (redirect) {
            return <Redirect to='login' />
          }
        return (
            <>
                <Header />
                <div className="menu-main-container">
                    <Link to="/my/profile" className="view-profile-card-in-menu">
                        {profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profile" className='profile-image-menu' />}
                        <p className="username-menu">{username}</p>
                    </Link>
                    <div className="all-elements-in-menu">
                        {cardList.map((each, index) => (
                            <Link to={`${each.path}`} className="additional-cards">
                                <p className="tesxt-in-card">{each.name}</p>
                            </Link>
                            ))}
                    </div>
                    <button onClick={this.onClickLogout}>Logout</button>
                </div>
            </>
        )
    }
}

export default Menu;
