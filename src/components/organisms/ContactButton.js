import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TiArrowSortedDown } from "react-icons/ti";

const ContactButton = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'contact-us-popover' : undefined;

  return (
    <div>
      <Button 
        id="contact-us-button"
        variant="outlined"
        color="secondary"
        aria-describedby={id}
        onClick={handleClick}
        endIcon={<TiArrowSortedDown />}
      >
        Contact Us
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Mobile No:</b> 951 396 279
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Email:</b> manager@sigobras.com
          </Typography>
        </Box>
      </Popover>
    </div>
  );
};

export default ContactButton;
