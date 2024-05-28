import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { verifyEmail } from '../../Api/VerifyMailApi';

const EmailVerify = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyEmail(token)
        .then((responseMessage) => {
          setMessage(responseMessage);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
          setMessage('Error verifying email.');
          setLoading(false);
        });
    } else {
      setMessage('Invalid verification link.');
      setLoading(false);
    }
  }, [location]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Result
          status={message.includes('successfully') ? 'success' : 'error'}
          title="Email Verification"
          subTitle={message}
          extra={
            <Button type="primary" href={message.includes('successfully') ? "/login" : "/"}>
              {message.includes('successfully') ? 'Go to Login' : 'Go Home'}
            </Button>
          }
        />
      )}
    </div>
  );
};

export default EmailVerify;
