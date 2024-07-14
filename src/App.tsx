import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import Phonebook from './Phonebook';

export default function App() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const sampleData = [
    { id: 1, name: 'Burak', surname: 'Akın', phoneNumber: '0531*****75' },
    { id: 2, name: 'Fatih', surname: 'Batuk', phoneNumber: '123456789' }
  ];
  
  localStorage.setItem('phonebook', JSON.stringify(sampleData));
  
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Item 1', 'Item 2', 'Item 4', 'Item 5', 'Phonebook'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ p: 1, mt: 3 }}>
          <Toolbar>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="left-menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
            <Typography
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                fontSize: 'clamp(2rem, .0774rem + 3.7976vw, 3.625rem)'
              }}
            >
              This is a header!
            </Typography>
          </Toolbar>
        </AppBar>
        <Box >
          <Routes>
            <Route path="/phonebook" element={<Phonebook />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
