import { React, Component } from "react";
import { FaFileVideo } from "react-icons/fa";
import Modal from 'react-modal'
import Cookies from "js-cookie";
import { IoCloseSharp } from "react-icons/io5";
import { BsFillEmojiHeartEyesFill } from "react-icons/bs";
import moment from "moment";
import ReactLoaderSpinner from "../reactSpinner";
import EmojiPicker from 'emoji-picker-react';

import './index.css';

Modal.setAppElement('#root');

class UploadPosts extends Component {
    state = {
        uploadedFile : '',
        displayPostCard: false,
        displayEmojiPicker: '',
        textAreaValue: '',
        postSecurity: '',
        loadingUploadPost: false
    }

    onUploadPost = (event) => {
        const file = event.target.files[0]; 
        if (file) {
            this.setState({uploadedFile: file, displayPostCard: true})        
        }
    }

    onChangeTextArea = event => {
        this.setState({textAreaValue: event.target.value})
    }

    onChangePostSecurity = event => {
        this.setState({postSecurity: event.target.value})
    }

    onClickpostUpload = async () => {
        const {uploadedFile, textAreaValue, postSecurity} = this.state
        this.setState({loadingUploadPost: true})
        const words = textAreaValue.split(/\s+/);
        const hashtags = words.filter(word => word.startsWith('#'));;
        const newText = words.filter(word => !word.startsWith('#')).join(' ');
        const userId = Cookies.get('user_id')
        const jwtToken = Cookies.get('jwt_token')
        const time = new Date()
        const postedTime = moment(time).utc().format();
        const formDataForPosts = new FormData()
        formDataForPosts.append('userId', userId)
        formDataForPosts.append('postFile', uploadedFile)
        formDataForPosts.append('caption', newText)
        formDataForPosts.append('hashTags', hashtags)
        formDataForPosts.append('postSecurity', postSecurity)
        formDataForPosts.append('postedTime', postedTime)
        const url = "https://chatterblast-server.onrender.com/posts/users"
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}` 
            },
            body: formDataForPosts
        }

        const response = await fetch(url, options)
        if (response.status === 200) {
            this.setState({displayPostCard: false, loadingUploadPost: false})
        }
    }

    onCilckClosePostCard = () => {
        this.setState({displayPostCard: false, uploadedFile: '', textAreaValue:'', postSecurity: ''})
    }

    render() {
        const {uploadedFile, displayPostCard, loadingUploadPost} = this.state
        return (
            <div className="upload-posts-container">
                <div className='profile-photo-in-post-input-element'>
                    <div className="posts-uploadig-container">
                        <label className="post-upload-label" htmlFor="fileInput">
                            <FaFileVideo className="post-uploading-icon" />
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*, video/*" 
                            name="file"
                            className="post-file-input"
                            onChange={this.onUploadPost}
                        />
                        <p className='text-uploading-card'>Image/Video</p>
                    </div>
                </div>
                {displayPostCard ? 
                    <Modal isOpen={displayPostCard} className="modal-post-card" shouldCloseOnOverlayClick={true}>
                        <div className="close-model-card">
                            <IoCloseSharp onClick={this.onCilckClosePostCard} className="close-icon"/>
                        </div>
                        <div className="editing-content">
                            <div className="emoji-picker">
                                <BsFillEmojiHeartEyesFill className="emoji-display"/>
                            </div>
                        </div>
                        <div className="post-display-card-before-upload">
                            {uploadedFile.type.startsWith('video/') ? (
                                <video controls className="post-before-upload">
                                <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type}/>
                                </video>
                            ) : (
                                <img src={URL.createObjectURL(uploadedFile)} alt="Uploaded file" className="post-before-upload"/>
                            )}
                            <div className="post-security-container">
                                <select onChange={this.onChangePostSecurity}>
                                    <option selected disabled value=''>Who can See</option>
                                    <option value='Public'>Public</option>
                                    <option value='Only Followers'>Only Followers</option>
                                    <option value='Only me'>Only Me</option>
                                </select>
                            </div>
                            <textarea rows={10} cols={10} className="post-caption" onChange={this.onChangeTextArea} placeholder="Add Caption" />
                            <div className="post-button-container">
                                <button type="button" className="post-button" onClick={this.onClickpostUpload}>
                                    {loadingUploadPost? <ReactLoaderSpinner /> :'Post'}
                                </button>
                            </div> 
                        </div>
                    </Modal>
                    :""
                }
            </div>
        )
    }
}

export default UploadPosts;
