// Login.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import './Login.css';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton,DialogActions,Button} from '@mui/material';
import {MdOutlineCall} from 'react-icons/md';
import { RiLockPasswordLine } from "react-icons/ri";
import { login ,currentUser} from '../../../apis/api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');  

const Login = ({ isOpen, onClose }) => {
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async(event)=>{
        event.preventDefault();
        console.log(userName,password)
        try {
            const token = await login(userName,password);
          
            if(token){
              console.log("inside handle login",token)
              currentUser(token)
              .then((response)=>{
                console.log("responce check",JSON.stringify(response.data));
                if(response?.data?.username){
                  setUserName(response.data.username);
                  localStorage.setItem("username",response.data.username);
                }
              })
              .catch((error)=>{
                console.error("Failed to fetch user details:",error);
              })
            }
              console.log("login token",token)
            // console,log("userName",userName)
            console.log("Login Successfully",token);
            navigate('/dashboard');
            onClose();
            setUserName("");
            setPassword("");
            setError("");
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please check your credentials.");
            
        }
    }
  return (
  
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { width: '800px', height: '450px', maxWidth: 'none',marginTop:'20px' } }}>
     <IconButton 
    onClick={onClose} 
    style={{ position: 'absolute', top: '10px', right: '10px', color: '#000' }}
  >
    <CloseIcon />
  </IconButton> 
    <div className="login-modal">
      <div className="l-container">
        <div className="logo">
          <img src="./images/logo.jpg" alt="Invest Mango Logo" />
        </div>
        <div className="image">
          <img src="./images/popupImage.png" alt="House" className="house-image" />
        </div>
      </div>
      <div className="r-container">
        <div className='full-form'>
        <h2 >
            WelocomeBack!
        </h2>
        <p>Login to continue</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className='login-form' onSubmit={handleLogin}> 
           <div className="inputDiv">
            <label htmlFor='mobileNo'>Mobile No</label>
            <div className='input flex'>
            <MdOutlineCall className='icon'/>
            <input type="tel" name='mobile' id='mobile' value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder='Enter Mobile Number'/>
            </div>

           </div>
           <div className="inputDiv">
            <label htmlFor='mobileNo'>Password</label>
            <div className='input flex'>
            <RiLockPasswordLine className='icon' />
            <input type="password" name='password' id='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Enter Password'/>
            </div>
           </div>
           
          <DialogActions>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Log in
            </Button>
          </DialogActions>
        </form>
        </div>
      </div>
    </div>
  </Dialog>
  );
};

export default Login;
