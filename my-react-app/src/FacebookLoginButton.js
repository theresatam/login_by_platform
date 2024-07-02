import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookLoginButton = () => {
  const responseFacebook = (response) => {
    if (response.accessToken) {
      console.log('Access Token:', response.accessToken);

      const platformId = response.id || null;
      const email = response.email || null;

      fetch('http://localhost:3000/facebook/redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          platformId,
          email,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log('Backend response:', data))
        .catch((error) => console.error('Error:', error));
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  };

  return (
    <FacebookLogin
      appId="839434794754169"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      cssClass="facebook-login-btn"
      textButton="Login with Facebook"
    />
  );
};

export default FacebookLoginButton;
