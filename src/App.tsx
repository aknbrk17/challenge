import {useState} from 'react';
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

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar
        sx={{
          p: 1,
          mt: 3      
        }} 
      >
        <Toolbar>          
            <IconButton onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="left-menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon/>
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>  
            <Typography sx={{ flexGrow: 1, textAlign: 'center', fontSize: 'clamp(2rem, .0774rem + 3.7976vw, 3.625rem)' }}>
              This is a header!
            </Typography>        
        </Toolbar>
      </AppBar>
    </Box>

  );
}
