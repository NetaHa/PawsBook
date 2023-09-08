import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './Register.css';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [dogName, setDogName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); 

  const navigate = useNavigate(); // Use the hook to get the navigate function

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 5 && password.length <= 15;
  };
  //new for pic upload
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    } 

    if (!validatePassword(password)) {
      setErrorMsg('Password should be between 5 to 15 characters');
      return;
    }

    setErrorMsg('');

    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('ownerName', ownerName);
    formData.append('dogName', dogName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profileImage', selectedImage); // Add the selected image

    
    fetch('http://localhost:5000/api/users/register', {  
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify(formData)
      body : formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to register');
        }
      })
      .then(data => {
        console.log('Registration success');
        navigate('/login');  // Redirect to login page after successful registration
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMsg('Registration failed. Please try again.');
      });
  };

return (
  <div className="register-container">
     {errorMsg && <p className="error-message">{errorMsg}</p>}
    <form onSubmit={handleSubmit}>
    <label>
        User Name:
        <input
          type="text"
          placeholder="Enter user's name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <label>
        Owner Name:
        <input
          type="text"
          placeholder="Enter owner's name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
      </label>
      <label>
        Dog's Name:
        <input
          type="text"
          placeholder="Enter dog's name"
          value={dogName}
          onChange={(e) => setDogName(e.target.value)}
        />
      </label>
      <label>
        Profile Image:
        <input
        type="file"
        accept="image/*" // To accept only image files
        onChange={(e) => handleImageChange(e)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  </div>
);

};

export default Register;
