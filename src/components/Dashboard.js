import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const { handleLogout } = React.useContext(AuthContext);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* AppBar at the top */}
      <AppBar position="static" sx={{ backgroundColor: "#263b5e" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Charts
          </Typography>
         

          <Button color="inherit" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
