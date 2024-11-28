import styled from "styled-components";
import React, { useEffect, useState } from "react";
import img1 from "../assests/images/mustang.jpg";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";  // Import useSnackbar
import { URL } from "../assests/mocData/config";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();  // Destructure enqueueSnackbar
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);

    const handleToggle = () => {
        if (type === "password") {
            setIcon(eye);
            setType("text");
        } else {
            setIcon(eyeOff);
            setType("password");
        }
    };
    
    const [rememberMe, setRememberMe] = useState(true);
    const [textIndex, setTextIndex] = useState(0);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    
    const texts = [
        {
            header: "ABOUT US",
            content: "Innovative Entrepreneurship: We foster innovative entrepreneurship by providing a platform for visionary individuals to explore their ideas.",
        },
        {
            header: "CONTACT US",
            content: "Get in Touch: Reach out to us to learn more about our initiatives, programs, and how you can get involved.",
        },
        {
            header: "JOIN US",
            content: "Be Part of Innovation: Join our vibrant community and become part of an ecosystem that nurtures innovation and creativity.",
        },
    ];

    const backgrounds = [img1, img1, img1, img1, img1, img1];

    useEffect(() => {
        const textIntervalId = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 2000);

        const backgroundIntervalId = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 2000);

        return () => {
            clearInterval(textIntervalId);
            clearInterval(backgroundIntervalId);
        };
    }, [texts.length, backgrounds.length]);

    const handleForgetPassword = () => {
        navigate('/forgot'); // Navigate to the /forgot route
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(); // Trigger login on Enter key press
        }
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axios.post(`${URL}/users/login`, { email, password });
            localStorage.setItem('token', response.data.token);

            // Show success message using enqueueSnackbar
            enqueueSnackbar('Login successful', { variant: 'success' });

            navigate('/hosstaff'); // Redirect after login
        } catch (err) {
            setError(err.response.data.msg || 'Something went wrong');

            // Show error message using enqueueSnackbar
            enqueueSnackbar('Login failed: ' + (err.response?.data?.msg || 'Something went wrong'), { variant: 'error' });
        }
    };

    return (
        <MainContainer>
            <VipLoginContainer>
                <div className="content ">
                    <div className="login-text-container">
                        <p>TALENT INITIATORS & ACCELERATORS</p>
                    </div>
                    <div className="message">
                        <h1>EMPOWERING</h1>
                        <h1>ENTREPRENEURS TO</h1>
                        <h1>BRING IDEAS ALIVE</h1>
                        <p>Login to build your ideas</p>
                    </div>
                    <div className="about-us-container">
                        <div className="row">
                            <div className="col-md-4 d-flex flex-column justify-content-start">
                                <h2>{texts[textIndex].header}</h2>
                            </div>
                            <div className="col-md-8">
                                <p>{texts[textIndex].content}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <BackgroundImageContainer>
                    <img src={backgrounds[backgroundIndex]} alt="Background" />
                    <LoginFormContainer>
                        <div className="input-container">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="input-field" // Listen for Enter key press
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={type}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="input-field" // Listen for Enter key press
                            />
                            <span
                                style={{ position: "absolute", paddingTop: "1rem", paddingRight: "0.5rem" }}
                                className="flex justify-around items-center"
                                onClick={handleToggle}
                            >
                                <Icon className="absolute mr-10" icon={icon} size={20} />
                            </span>
                        </div>
                       
                        <button className="login-button" onClick={() => handleSubmit()}>
                            Login
                        </button>
                    </LoginFormContainer>
                </BackgroundImageContainer>
            </VipLoginContainer>
        </MainContainer>
    );
};

export default Login;


const MainContainer = styled.div`
  background-color: #15181e;
  height: 100vh;
  overflow: auto;
`;

const VipLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  background-color: #15181e;
  color: white;
  padding-left: 60px;
  padding-top: 2rem;

  .content {
    width: 80%;
    max-width: 800px;
    text-align: center;
    padding: 20px;
  }

  .login-text-container {
    margin-bottom: 50px;
    font-size: 1rem;
    font-weight: 600;
    color: #c50274;
  }

  .message {
    margin-bottom: 20px;
  }

  .message h1 {
    font-size: 3.3rem;
    margin: 30px 0;
  }

  .message p {
    font-size: 1rem;
  }

  .about-us-container {
    border-radius: 20px;
    padding: 33px;
    background-image: url(${img1});
    background-size: cover;
    background-position: center;
    opacity: 0.7;
    margin-top: 90px;
    overflow: auto;
  }

  .col-md-4 h2 {
    font-size: 1rem;
    font-weight: bold;
  }

  .col-md-8 p {
    color: white;
    font-weight: bold;
    text-align: left;
    font-size: 0.9rem;
  }

  .about-us-container p {
    color: white;
    font-size: 1rem;
  }

  html,
  body {
    overflow: auto;
    font-family: Helvetica, sans-serif;
    background-color: #15181e;
  }

  @media (min-width: 1751px) and (max-width: 2560px) {
    padding-left: 50px;
  }

  @media (min-width: 1441px) and (max-width: 1750px) {
    padding-left: 20px;
    .about-us-container {
      width: 700px;
      height: 200px;
    }
    .message h1 {
      font-size: 3.7rem;
      margin: 30px 0;
    }
    .content {
      width: 700px;
    }
  }

  @media (min-width: 1024px) and (max-width: 1440px) {
    padding-left: 45px;
    .about-us-container {
      width: 500px;
      height: 200px;
    }
    .message h1 {
      font-size: 3rem;
      margin: 30px 0;
    }
    .content {
      width: 500px;
    }
  }

  @media (min-width: 700px) and (max-width: 1023px) {
    padding-left: 3px;
    .about-us-container {
      max-width: 350px;
      height: 330px;
    }
    .message h1 {
      font-size: 2rem;
      margin: 30px 0;
    }
    .content {
      max-width: 380px;
      padding-left: 50px;
    }
    .message {
      max-width: 380px;
    }
  }

  @media (min-width: 320px) and (max-width: 699px) {
    flex-direction: column;
    padding-left: 10px;
    max-height: 200vh;
    overflow: auto;

    .message h1 {
      font-size: 1.3rem;
    }
    .content {
      display: none;
      min-width: 320px;
    }
    .about-us-container {
      min-width: 200px;
      height: 260px;
      margin-top: 40px;
    }
  }
`;

const BackgroundImageContainer = styled.div`
  position: relative;

  max-width: 900px;
  height: 900px;
  overflow: auto;
  margin-top: 70px;
  opacity: 0.7;

  img {
    width: 80%;
    height: 85%;
    object-fit: cover;
    border-radius: 15px;
  }

  @media (min-width: 1024px) and (max-width: 1440px) {
    min-width: 570px;
    height: 850px;
  }
  @media (min-width: 700px) and (max-width: 1023px) {
    min-width: 418px;
    height: 800px;
    .col-md-8 p {
      font-size: 0.5rem;
    }
    .about-us-container p {
      font-size: 0.5rem;
    }
  }
  @media (min-width: 320px) and (max-width: 699px) {
    min-width: 270px;
    min-height: 350px;
    max-height: 650px;
  }
`;

const LoginFormContainer = styled.div`
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #212529;
  padding: 20px;
  border-radius: 10px;
  width: 65%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .input-container {
    margin-bottom: 70px;
    padding: 5px;
  }

  label {
    display: block;
    color: white;
    margin-bottom: 1px;
    margin-right: 23rem;
    font-size: 0.8rem;
  }

  label1 {
    display: block;
    color: white;
    margin-bottom: 5px;
    font-size: 0.7rem;
  }
.input-field {
  padding: 8px;
  width: 100%; /* Ensures both fields are the same width */
  max-width: 300px; /* Set a maximum width if desired */
  box-sizing: border-box; /* Ensure padding does not affect width */
  border: 1px solid #ccc;
  border-radius: 4px;
}
  .input-container input[type="text"],
  .input-container input[type="password"] {
    width: calc(100% - 10px);
    padding: 10px;
    border: none;
    background-color: transparent;
    color: #ccc;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    outline: none;
    transition: border-bottom-color 0.3s;
  }

  input[type="text"]:focus,
  input[type="password"]:focus,
  input[type="text"]:not(:placeholder-shown),
  input[type="password"]:not(:placeholder-shown) {
    border-bottom-color: white;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-size: 0.8rem;
    margin-bottom: 40px;
  }

  .forget-password {
    color: #ccc;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: none;
    margin-left: 10rem;
  }

  .login-button {
    width: 50%;
    padding: 18px;
    background-color: #c50274;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }

  .checkbox-label {
    position: relative;
    color: white;
    font-size: 0.7rem;
    display: flex;
    font-weight: bold;
    align-items: center;
  }

  .custom-checkbox {
    position: absolute;
    opacity: 0;
  }

  .checkmark {
    position: relative;
    width: 16px;
    height: 16px;
    border: 1px solid pink;
    border-radius: 3px;
    margin-right: 5px;
  }

  .checkmark::after {
    content: "";
    position: absolute;
    display: none;
  }

  .custom-checkbox:checked + .checkmark::after {
    display: block;
    content: "";
    position: absolute;
    left: 4px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid pink;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .custom-checkbox {
    opacity: 0;
    position: absolute;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .custom-checkbox:checked + .checkmark {
    background-color: pink;
  }
  label {
    margin-right: 19rem;
  }
  .input-container input[type="text"],
  .input-container input[type="password"] {
    width: calc(100% - 10px);
    padding: 13px;
  }
  .forget-password {
    margin-left: 7rem;
  }
  .checkbox-label {
    font-size: 0.7rem;
  }

  @media (min-width: 1441px) and (max-width: 1750px) {
    max-width: 60%;
    max-width: 420px;
    max-height: 85%;
    padding: 60px;
  }

  @media (min-width: 1024px) and (max-width: 1440px) {
    width: 65%;
    max-width: 460px;
    height: 65%;
    padding: 20px;
  }
  @media (min-width: 700px) and (max-width: 1023px) {
    width: 60%;
    max-width: 420px;
    height: 65%;
    padding: 12px;
    .forget-password {
      margin-left: 1.8rem;
    }
    label {
      display: block;
      color: white;
      margin-bottom: 1px;
      margin-right: 13rem;
      font-size: 0.6rem;
    }
  }
  @media (min-width: 320px) and (max-width: 699px) {
    width: 60%;

    padding: 20px;

    .forget-password {
      margin-left: 0.5rem;
      font-size: 0.6rem;
    }
    .input-container {
      margin-bottom: 0px;
      margin-top: 20px;
      padding: 0px;
    }
    label {
      margin-right: 9rem;
      font-size: 0.5rem;
    }
    .checkbox-label {
      font-size: 0.6rem;
    }

    .checkbox-container {
      padding-top: 12px;
    }

    .login-button {
      width: 40%;

      padding: 10px;
    }
  }
`;