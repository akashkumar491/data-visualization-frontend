// src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { AuthContext} from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
try {
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/auth/login`,
      {
        email: email,
        password: password
      }
    )
    const { token } = res.data;
    handleLogin(token);
    navigate("/dashboard")
  } catch (error) {
    console.log(error);
  }

    
  };

  return (
    <Box bgcolor={"#263b5e"}>
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
        <Avatar  sx={{ bgcolor: '#263b5e', marginBottom: 2 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 3 }}>
          Please login to your account
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 3, marginBottom: 2, backgroundColor: "#263b5e" }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2">
          Don't have an account? <a style={{ color: "#263b5e"}} href="/signup">Sign up here</a>
        </Typography>
      </Paper>
    </Container>
    </Box>
  );
};

export default Login;
