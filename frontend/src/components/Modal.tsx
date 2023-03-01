import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IBasicModalProps, ISkeletonModalProps } from './../context/types.d';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  color: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function SkeletonModal({ title, description, button }: ISkeletonModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>

          {button && <button>check</button>}
        </Box>
      </Modal>
    </div>
  );
}

export function BasicModal({ children, isModal }: IBasicModalProps) {
  const [isActive, setIsActive] = React.useState(isModal);
  const handleClose = () => setIsActive(false);

  return (
    <Modal
      open={isModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}
