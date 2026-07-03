import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         "http://localhost:3002/signup",
//         {
//           ...inputValue,
//         },
//         { withCredentials: true }
//       );
//       const { success, message } = data;
//       if (success) {
//         handleSuccess(message);
//         setTimeout(() => {
//           navigate("/");
//         }, 1000);
//       } else {
//         handleError(message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     setInputValue({
//       ...inputValue,
//       email: "",
//       password: "",
//       username: "",
//     });
//   };
const handleSubmit = async (e) => {
  e.preventDefault();

  const { email, username, password } = inputValue;

  // check empty fields
  if (!email || !username || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const { data } = await axios.post(
      "http://localhost:3002/signup",
      { email, username, password },
      { withCredentials: true }
    );

    if (data.success) {
      toast.success(data.message);

      setInputValue({
        email: "",
        username: "",
        password: "",
      });

      setTimeout(() => {
  window.location.href = "http://localhost:3001";
}, 1000);
    } else {
      toast.error(data.message);
    }
  }
  catch (error) {
  console.log("Full Error:", error);
  console.log("Backend Response:", error.response?.data);
  toast.error(error.response?.data?.message || "Server error");
}
  // catch (error) {
  //   console.log(error);
  //   toast.error("Server error");
  // }
};

  return (
    <div className="form_container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="email">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
