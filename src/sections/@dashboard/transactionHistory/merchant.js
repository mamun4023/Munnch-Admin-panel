import { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { CSVLink } from 'react-csv';
import Moment from 'react-moment';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Box,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { WithdrawalListHead, WithdrawalListToolbar } from './index';
import {FetchMerchantTransactionList} from '../../../redux/transactionHistory/merchant/action';
import Spinner from 'src/components/Spinner';
import {CapitalizeFirstLetter} from 'src/helperFunctions';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { 
    label: 'ID',
    id: 'id', 
    alignRight: false 
  },
  { 
    label: 'MERCHANT NAME', 
    id: 'merchantName', 
    alignRight: false 
  },
  { 
    label: 'EMAIL', 
    id: 'email', 
    alignRight: false 
  },
  { 
    label: 'PHONE NUMBER',
    id: 'phoneNumber', 
    alignRight: false 
  },
  { 
    label: 'AMOUNT',
    id: 'amount', 
    alignRight: false 
  },
  { 
    label: 'TYPE',
    id: 'type', 
    alignRight: false 
  },
  { 
    label: 'CREATED AT', 
    id: 'date', 
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
    return filter(array, (_user) => _user.vendor?.personal_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Withdrawal() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const loading = useSelector(state => state.MerchantTransaction.loading);

  useEffect(()=>{
    dispatch(FetchMerchantTransactionList(filterName, page, rowsPerPage, order));
  },[filterName, page, rowsPerPage, order])

  const TransactionList = useSelector(state => state.MerchantTransaction.data);

  let csvDATA = [];

  TransactionList?.forEach(data => {
    let obj = {
      id : data?.id,
      merchantName : data?.vendor?.personal_name,
      email : data?.vendor?.email,
      phoneNumber : data?.vendor?.phone,
      amount : data?.amount?.toFixed(2),
      type : data?.type,
      date :  moment(data?.created_at).format("DD-MM-YYYY hh:mm a")
    }
    csvDATA.push(obj)
  })

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

  const filteredTransaction = applySortFilter(TransactionList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredTransaction.length === 0;

  const headers = [
    { label: "ID", key: "id" },
    { label: "MERCHANT NAME", key: "merchantName" },
    { label: "EMAIL", key: "email" },
    { label: "PHONE NUMBER",  key: "phoneNumber" },
    { label: "AMOUNT", key: "amount"},
    { label: "TYPE", key: "type" },
    { label: "CREATED AT", key: "date" },
  ];

  return (
    <Page title="Munchh | Merchant Transaction">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
           Merchant Transaction History
          </Typography>
        </Stack>
        <Card>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
              <WithdrawalListToolbar
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
            <div style={{ marginTop : "25px" }}>
            <Button 
                variant='outlined'
                sx={{marginRight : 10}} 
                color ="primary"
              > 
                  <CSVLink
                    headers={headers}
                    filename="transactions.csv"
                    data={csvDATA}
                    style = {{
                      textDecoration : "none",
                      color : "black"
                    }}
                  >
                    Download CSV
                  </CSVLink>
              </Button>
            </div>
          </div>
          {loading? <Spinner/> :  <Box> 
          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <WithdrawalListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredTransaction
                    .map((row) => {
                      const { id, vendor, type, amount, created_at } = row;
                      return (
                        <TableRow
                          hover
                          key={id}
                        >
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{CapitalizeFirstLetter(vendor?.personal_name)}</TableCell>
                          <TableCell align="left">{vendor?.email}</TableCell>
                          <TableCell align="left">{vendor?.phone}</TableCell>
                          <TableCell align="left">{amount?.toFixed(2)}</TableCell>
                          <TableCell align="left">{type}</TableCell>
                          <TableCell align="left">
                            <Moment format="DD-MM-YYYY hh:mm a" >{created_at}</Moment> 
                          </TableCell>   
                        </TableRow>
                      );
                    })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
              filteredTransaction.length === 0 || filteredTransaction.length < rowsPerPage? {disabled: true} : undefined
            }
          />
        </Box>}  
        </Card>
      </Container>
    </Page>
  );
}