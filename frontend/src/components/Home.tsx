import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AxiosError } from 'axios';
import '../styles/Minecraft.css';

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const Home = () => {
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setSuccessMessage("");  // reset the success message
  };

  const toggleGameType = () => {
    setGameType(prevGameType => prevGameType === "" || prevGameType === "Bedrock" ? "Java Edition" : "Bedrock");
    setSuccessMessage("");  // reset the success message
  }

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  const isValidUsername = (username: string) => {
    // Username must be between 3 and 16 characters
    if (username.length < 3 || username.length > 16) {
      return false;
    }
  
    // Username cannot start or end with an underscore
    if (username.startsWith('_') || username.endsWith('_')) {
      return false;
    }
  
    // Username cannot have two underscores in a row
    if (username.includes('__')) {
      return false;
    }
  
    // Username can only contain alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return false;
    }
  
    return true;
  }
  

  const createUser = async () => {
    if (username === "") {
      setErrorMessage("Please enter a username");
      return;
    } else if (!isValidUsername(username)) {
      setErrorMessage("Pleaser enter a valid username");
      return;
    } else if (gameType === "") {
      setErrorMessage("Please select a game type");
      return;
    }

    try {
      const response = await api.post('/user', { minecraftUsername: username, gameType: gameType });

      setErrorMessage("");
      setUsername("");
      setGameType("");
      setSuccessMessage("Success");
  
    } catch (error) {
      setSuccessMessage("");
      if (isAxiosError(error)) {
        if (error.response) {
          const responseData = error.response.data as { message: string };
          setErrorMessage(responseData.message);
        } else if (error.request) {
          setErrorMessage('Unable to make request to backend');
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="mc-menu">
        <div className="mc-button full">
          <div className="mc-input-wrapper full">
            <input 
              type="text" 
              className="mc-input full" 
              placeholder="Enter Minecraft Username"
              value={username}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mc-button full" onClick={toggleGameType}>
          <div className="title">{gameType === "" ? "Select Game Type" : gameType}</div>
        </div>
        <div className="mc-button full" onClick={createUser}>
          <div className="title">
            {successMessage ? <span style={{color: 'lightgreen'}}>{successMessage}</span> : errorMessage ? <span style={{color: 'red'}}>{errorMessage}</span> : "Submit to Whitelist"}
          </div>
        </div>
        <div className="double">
          <div className="mc-button full" onClick={handleAdminLogin}>
            <div className="title">Admin Login</div>
          </div>
          <div className="mc-button full">
            <a style={{ textDecoration: 'none' }} href="http://server.r-nold.eu:5000" target="_blank" rel="noreferrer">
              <div className="title">Server Status</div>
            </a>
          </div>
        </div>
        <div className="mc-button full lang">
          <div className="title">
            <img src="https://i.ibb.co/99187Lk/lang.png" alt=" Lang"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
