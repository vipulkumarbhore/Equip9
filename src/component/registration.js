import React, { useState } from 'react';
import './registration.css';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIA3KZVK3RM6V72UAHV',
  secretAccessKey: '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',
  region: 'ap-south-1',
});


const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Upload profile picture to S3
    if (profilePicture) {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'equip9-testing',
        // Key: `profilePictures/${profilePicture.name}`,
        key: (req,file,cb) => {
            cb(null,file.profilePicture)
        },
        
        Body: profilePicture,
        ACL: 'public-read', // Optional: set the ACL permissions for the uploaded file
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading file:', err);
          
        } else {
          console.log('File uploaded successfully:', data.Location);
          // Proceed with form submission or further processing
        }
      });
    } else {
      // No profile picture selected
      // Proceed with form submission or further processing
    }
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={handleLastNameChange} />
        </label>
        <br />
        <label>
          Mobile Number:
          <input type="tel" pattern="[0-9]{10}" value={mobileNumber} onChange={handleMobileNumberChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
