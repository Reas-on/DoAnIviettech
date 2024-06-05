import React, { useState } from "react";
import { Button, message, Checkbox } from "antd";
import "./CSS/LoginSignup.scss";
import { loginUser, signupUser } from "../Api/AuthApi";  // Adjust the import path as needed

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const responseData = await loginUser(formData);
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.authToken);
        window.location.replace("/");
      } else {
        message.error(responseData.errors);
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const checkbox = document.querySelector('.loginsignup-agree input[type="checkbox"]');
    if (!checkbox.checked) {
      message.error('You must agree to the Terms of Service and Privacy Policy to sign up.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const responseData = await signupUser(formData);
      if (responseData.success) {
        setMessageText("Vui Lòng Xác Minh Email Để Login");
        message.success("Vui Lòng Xác Minh Email Để Login ");
        setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
      } else {
        message.error(responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      message.error("Signup failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
          {state === "Sign up" && (
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={changeHandler}
              type="password"
              placeholder="Confirm Password"
            />
          )}
        </div>
        <Button 
          type="primary" 
          loading={loading} 
          style={{ width: "100%", marginTop: "20px", height: "50px", fontSize: "16px", textTransform: "uppercase" }}
          onClick={() => (state === "Sign up" ? handleSignup() : handleLogin())}
        >
          Continue
        </Button>
        {state === "Sign up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Log In</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign up")}>Click here</span>
          </p>
        )}
        {state === "Sign up" && (
          <div className="loginsignup-agree">
            <Checkbox>
              I agree to the <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>
            </Checkbox>
          </div>
        )}
        {messageText && (
          <div className="loginsignup-message">
            <p>{messageText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
