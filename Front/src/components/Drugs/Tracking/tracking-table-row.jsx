import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from '../../../components/iconify';

export default function OrderTableRow({
  selected,
  orderName,
  orderRFI,
  orderResult,
  orderPI,
  orderSwift,
  orderInvoice,
  orderRFD,
  stock,
  pos,
  handleClick,
  handleEdit,
  handleDelete,
  showEditDeleteIcons, // New prop
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {orderName}
          </Typography>
        </TableCell>

        <TableCell>{orderRFI}</TableCell>

        <TableCell>{orderResult}</TableCell>

        <TableCell align="center">
          <FormControlLabel
            control={<Checkbox checked={orderPI} color="primary" />}
            label={orderPI ? 'Yes' : 'No'}
            labelPlacement="end"
          />
        </TableCell>

        <TableCell>{orderSwift}</TableCell>

        <TableCell>{orderInvoice}</TableCell>

        <TableCell>{orderRFD}</TableCell>

        <TableCell>{stock}</TableCell>

        <TableCell>{pos}</TableCell>

        {showEditDeleteIcons && ( // Render icons conditionally based on showEditDeleteIcons prop
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      {showEditDeleteIcons && ( // Render popover conditionally based on showEditDeleteIcons prop
        <Popover
          open={!!open}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 140 },
          }}
        >
          <MenuItem
            onClick={() => {
              handleEdit();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleDelete();
              handleCloseMenu();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      )}
    </>
  );
}

OrderTableRow.propTypes = {
  handleClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  selected: PropTypes.bool,
  showEditDeleteIcons: PropTypes.bool, // New prop type
  orderName: PropTypes.string,
  orderRFI: PropTypes.string,
  orderResult: PropTypes.string,
  orderPI: PropTypes.bool,
  orderSwift: PropTypes.string,
  orderInvoice: PropTypes.string,
  orderRFD: PropTypes.string,
  stock: PropTypes.string,
  pos: PropTypes.string,
};
