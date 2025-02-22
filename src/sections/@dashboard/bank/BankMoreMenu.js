import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import {RemoveBank} from '../../../redux/bank/remove/action';
import {FetchBankList} from '../../../redux/bank/fetchAll/action';

// ----------------------------------------------------------------------

export default function UserMoreMenu({id, status, filter, page, limit, order}) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const RemoveHandler =(id)=>{
    dispatch(RemoveBank(id))
    setTimeout(()=>{
      dispatch(FetchBankList(status, filter, page, limit, order))
    },1000)
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to= {`/dashboard/bank/update/${id}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="clarity:note-edit-solid" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem 
          sx={{ color: 'text.secondary' }}
          onClick = {()=> RemoveHandler(id)}
          >
          <ListItemIcon>
            <Iconify icon="ant-design:delete-filled" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
