import React from "react";
import "./CSS/LoginSignup.scss";
import { useState } from "react";

const LoginSignup = () => {
  
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const login = async () => {
    console.log("Signup", formData);
    let responseData;
    await fetch ("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(response => response.json()).then((data) => {
      responseData = data;
    })
    if(responseData.success) {
      localStorage.setItem("auth-token", responseData.authToken);
      window.location.replace("/");
    }else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    const checkbox = document.querySelector('.loginsignup-agree input[type="checkbox"]'); //TODO: using state, not use DOM
    if (!checkbox.checked) {
      alert('You must agree to the Terms of Service and Privacy Policy to sign up.');
      return;
    }
    console.log("Signup", formData);
    let responseData;
    await fetch ("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(response => response.json()).then((data) => {
      responseData = data;
    })
    if(responseData.success) {
      window.location.replace("/login");
    }else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign up" ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler
  }
              type="text"
              placeholder="Your Name"
            />
          ) : (
            <></>
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
        </div>
        <button onClick={() => (state === "Sign up" ? signup() : login())}>
          Continue
        </button>
        {
  state === "Sign up" ? (
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
            <input type="checkbox" name="" id="check-button" />
            <p>
              I agree to the <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default LoginSignup;