// src/components/Auth/Signup.js
import React, { useState, useContext } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signup`,
        {
          email: email,
          password: password,
        }
      );
      console.log(res, 'Signup Successful');
      const { token } = res.data;
      handleLogin(token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup Error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <Box bgcolor="#263b5e">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '40%',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ bgcolor: '#263b5e', marginBottom: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 3 }}>
            Sign up with your email and password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" sx={{ marginBottom: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: 3, marginBottom: 2, backgroundColor: '#263b5e' }}
            >
              Sign Up
            </Button>
          </form>
          <Typography variant="body2">
            Already have an account?{' '}
            <a style={{ color: '#263b5e' }} href="/login">
              Login here
            </a>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
