import { Component } from 'react';
import Cookies from 'js-cookie';
import { FiUpload } from 'react-icons/fi';
import {Redirect} from 'react-router-dom';
import ReactLoaderSpinner from '../reactSpinner';
import './index.css';

const noProfilePhoto = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

class UserProfileSetup extends Component {
    state = {redirectToHome: false,
             displayImage: noProfilePhoto, 
             username: '', 
             profilePhoto: '', 
             userFirstName:'', 
             bio: '', 
             relationshipStatus: '',
             test: '',
             loadingSaveButton: false,
             loadingPage: false
            }

    componentDidMount (){
        this.getFirstName()
    }

    onUploadProfilePhoto = event => {
        const file = event.target.files[0];
        this.setState({profilePhoto: file})
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                console.log(reader.result)
                this.setState({ displayImage: reader.result });
            };

            reader.readAsDataURL(file);
        }
    } 



    getFirstName = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingPage: true})
        const url = `https://chatterblast-server.onrender.com/profile/upload/${userId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
            }
        }

        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({
            userFirstName: data.userDetails.first_name, 
            username: data.userDetails.first_name + " " + data.userDetails.last_name,
            loadingPage:false
        })
    }

    onChangeUserName = event => {
        this.setState({username: event.target.value})
    }

    onChangeBio = event => {
        this.setState({bio: event.target.value})
    }

    onChangeRelationshipStatus = event => {
        this.setState({relationshipStatus: event.target.value})
    }

    onSubmitDetails = async event => {
        event.preventDefault()
        this.setState({loadingSaveButton: true})
        const userId = Cookies.get('user_id')
        const jwtToken = Cookies.get('jwt_token')
        const {profilePhoto, username, bio, relationshipStatus} = this.state
        const userAdditionalDetails = new FormData();
        userAdditionalDetails.append('userId', userId);
        userAdditionalDetails.append('file', profilePhoto); // Assuming profilePhoto is a File object
        userAdditionalDetails.append('username', username);
        userAdditionalDetails.append('bio', bio);
        userAdditionalDetails.append('relationshipStatus', relationshipStatus);

        const url = "https://chatterblast-server.onrender.com/user/additional/details"
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}` 
            },
            body: userAdditionalDetails
        }

        const response = await fetch(url, options)
        if (response.status === 200) {
            this.setState({redirectToHome: true, loadingSaveButton: false})
        }
    }

    renderRelationshipStatusfeild = () => {
        const {relationshipStatus} = this.state
        
        return (
            <div className='element-container'>
                <label className='label-names-details' htmlFor='relationShipStatus'>Relationship Status</label>
                <select className='select-element' onChange={this.onChangeRelationshipStatus} id='relationShipStatus' value={relationshipStatus}>
                    <option selected value='Single'>Single</option>
                    <option value='In a relationship'>In a relationship</option>
                    <option value='Engaged'>Engaged</option>
                    <option value='Married'>Married</option>
                    <option value='Separated'>Separated</option>
                    <option value='Divorced'>Divorced</option>
                    <option value='Widowed'>Widowed</option>
                </select>
            </div>
        )
    }

    renderBioFeild = () => {
        const {bio} = this.state

        return (
            <div className='element-container'>
                <label className='label-names-details' htmlFor='bioElement'>Bio</label>
                <br />
                <textarea
                    rows="4"
                    cols="61"
                    className='textarea-element'
                    id="bioElement"
                    value={bio}
                    autoComplete='off'
                    placeholder='Add Bio'
                    onChange={this.onChangeBio}
                />
            </div>
        )
    }

    renderUserName = () => {
        const {username} = this.state

        return (
            <div className='element-container'>
                <label className='label-names-details' htmlFor='userName'>User Name</label>
                <br />
                <input 
                    type='text'
                    className='input-element-feild'
                    id='userName'
                    value={username}
                    placeholder='Username'
                    autoComplete='off'
                    onChange={this.onChangeUserName}
                />
            </div>
        )
    }

    render() {
        const {userFirstName, displayImage, redirectToHome, loadingPage, loadingSaveButton} = this.state
        if (redirectToHome) {
            return <Redirect to="/" />
        }
        return(
            <div className='user-profile-setup-container'>
                {loadingPage? <ReactLoaderSpinner /> :
                <form className='content-container' onSubmit={this.onSubmitDetails}>
                    <input type='hidden' value={``} />
                    <div className='greeting-container'>
                        <h1 className='greeting-user'>Hi, <span className='user-firstname'>{userFirstName}</span><br />
                        <span>Welcome to ChatterBlast</span></h1>
                    </div>
                    <div className='profile-container'>
                        <img src={displayImage} alt='profile' className='profile-photo' />
                    </div>
                    <div className='upload-element'>
                        <div className="file-input-container">
                            <label className="file-input-label" htmlFor="fileInput">
                                <FiUpload className="upload-icon" />
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                name="file"
                                className="file-input"
                                onChange={this.onUploadProfilePhoto}
                                required
                            />
                        </div>
                    </div>
                    <div className='input-elements'>
                        {this.renderUserName()}
                        {this.renderBioFeild()}
                        {this.renderRelationshipStatusfeild()}
                    </div>
                    <div className='save-button-card'>
                        <button className='save-button-element' type="submit">
                            {loadingSaveButton? <ReactLoaderSpinner /> : 'Save'}
                        </button>
                    </div>
                </form> }
            </div>
        )
    }
}

export default UserProfileSetup;


