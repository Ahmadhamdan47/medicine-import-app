// import React, { useState } from 'react';
// import axios from 'axios';

// const LoginForm = ({ setAccessToken }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await axios.post('https://2b5a-85-112-70-8.ngrok-free.app/api/users/v1.0/authenticate', {
//         username,
//         password,
//       });

//       const newAccessToken = response.data.access_token;
//       setAccessToken(newAccessToken);

//       console.log('Login successful. Access Token:', newAccessToken);
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleLogin}>
//         <label>
//           Username:
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </label>
//         <br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import axios from "axios";
import React, { useState, useContext } from "react";

// Create a context to hold the accessToken state
const AccessTokenContext = React.createContext();

const LoginForm = () => {
  // Use the useContext hook to get the setAccessToken function from the context
  const setAccessToken = useContext(AccessTokenContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://2b5a-85-112-70-8.ngrok-free.app/api/users/v1.0/authenticate",
        {
          username,
          password,
        }
      );

      const newAccessToken = response.data.access_token;

      // Use the setAccessToken function from the context
      setAccessToken(newAccessToken);

      console.log("Login successful. Access Token:", newAccessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default LoginForm;
