import { useState, useEffect } from 'react';
import { filter } from 'lodash';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles} from '@mui/styles';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  Switch,
  Avatar,
  TableBody,
  TableCell,
  Box,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { WithdrawalListHead, WithdrawalListToolbar } from './index';
import {FetchWithdrawalList} from '../../../redux/withdraw/fetchAll/action';
import {MerchantStatusToggler} from '../../../redux/withdraw/ApproveToggler/actions';
import Spinner from 'src/components/Spinner';
import {CapitalizeFirstLetter} from 'src/helperFunctions';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  tableCell: {
    padding: "10px 16px",
  }
});

const TABLE_HEAD = [
  { 
    label: 'ID',
    id: 'id', 
    alignRight: false 
  },
  { 
    label: 'NAME', 
    id: 'name', 
    alignRight: false 
  },
  { 
    label: 'PROFILE IMAGE', 
    id: 'profile_image', 
    alignRight: false 
  },
  { 
    label: 'EMAIL',
    id: 'email', 
    alignRight: false 
  },
  { 
    label: 'PHONE NUMBER',
    id: 'phone_number', 
    alignRight: false 
  },
  { 
    label: 'ACCOUNT HOLDER NAME', 
    id: 'account_holder_name', 
    alignRight: false 
  },
  { 
    label: 'BANK NAME', 
    id: 'bank_name', 
    alignRight: false 
  },
  { 
    label: 'ACCOUNT NUMBER', 
    id: 'account_number',
    alignRight: false 
  },
  { 
    label: 'AMOUNT', 
    id: 'amount',
    alignRight: false 
  },
  { 
    label: 'DATE', 
    id: 'date', 
    alignRight: false 
  },
  { 
    label: 'APRROVAL', 
    id: 'approval', 
    alignRight: false 
  },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.store?.restaurant_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Withdrawal() {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const loading = useSelector(state => state.Withdrawal.loading);

  useEffect(()=>{
    dispatch(FetchWithdrawalList(filterName, page, rowsPerPage, order));
  },[dispatch, filterName, page, rowsPerPage, order])

  const WithdrawList = useSelector(state => state.Withdrawal.data);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(WithdrawList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  const StatusChangeHandler = (id) => {
    dispatch(MerchantStatusToggler(id))
  }

  return (
    <Page title="Munchh | Withdrawal">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Merchant Withdrawal
          </Typography>
        </Stack>
        <Card>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
              <WithdrawalListToolbar
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
          </div>
          {loading? <Spinner/> :  <Box> 
          <Scrollbar>
            <TableContainer sx={{ minWidth: 1800 }}>
              <Table>
                <WithdrawalListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    .map((row) => {
                      const { id, store, accountNumber, amount, store_bank, is_withdrawn, created_at } = row;
      
                      return (
                        <TableRow
                          hover
                          key={id}
                        >
                          <TableCell className= {classes.tableCell} align="left">{id}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{CapitalizeFirstLetter(store?.restaurant_name)}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">
                             <Avatar  variant="square" style={{width : "70px"}} src= {store?.images[0]?.image} />
                          </TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{store?.email}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{store?.contact_no}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{CapitalizeFirstLetter(store_bank?.holder_name)}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{store_bank?.bank?.name}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">{store_bank?.account_number}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">RM {amount?.toFixed(2)}</TableCell>
                          <TableCell className= {classes.tableCell}  align="left">
                            <Moment format="DD-MM-YYYY hh:mm a" >{created_at}</Moment> 
                          </TableCell>   
                          <TableCell className= {classes.tableCell}  align="left">
                              <Switch 
                                onChange={()=> StatusChangeHandler(id)}
                                defaultChecked = {is_withdrawn === 1? true: false}
                              />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={-1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ page }) => {
              return `Page: ${page}`;
            }}
            backIconButtonProps={
              page === 1 ? {disabled: true} : undefined
            }
            nextIconButtonProps={
              filteredUsers.length === 0 || filteredUsers.length < rowsPerPage? {disabled: true} : undefined
            }
          />
        </Box>}  
        </Card>
      </Container>
    </Page>
  );
}