import { useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import axios from '../axios';
import TableNoData from '../table-no-data';
import UserTableRow from '../tracking-table-row';
import TableEmptyRows from '../table-empty-rows';
import UserTableHead from '../tracking-table-head';
import { useTrackingContext } from '../TrackingProvider';
import Scrollbar from '../../../../components/scrollbar';
import UserTableToolbar from '../tracking-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const {
    orders,
    setOrders,
    page,
    setPage,
    order,
    setOrder,
    selected,
    orderBy,
    setOrderBy,
    filterName,
    setFilterName,
    rowsPerPage,
    handleEdit,
    handleDelete,
    handleDeleteSelected,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTrackingContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchUsers();
  }, [orders]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container sx={{ width: '100%', backgroundColor: '#f0f0f0' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        {/* <Typography variant="h4">Users</Typography> */}
      </Stack>

      <Card sx={{ width: '100%', backgroundColor: '#ffffff' }}>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected} // onDeleteSelected prop
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'orderID', label: 'Order ID' },
                  { id: 'orderRFI', label: 'RFI' },
                  { id: 'orderResult', label: 'Result' },
                  { id: 'orderPI', label: 'PI' },
                  { id: 'orderSwift', label: 'Swift' },
                  { id: 'orderInvoice', label: 'Invoice' },
                  { id: 'orderRFD', label: 'RFD' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'pos', label: 'PoS' },
                 
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      orderID={row.orderID}
                      orderRFI={row.orderRFI}
                      orderResult={row.orderResult}
                      orderPI={row.orderPI}
                      orderSwift={row.orderSwift}
                      orderInvoice={row.orderInvoice}
                      orderRFD={row.orderRFD}
                      stock={row.stock}
                      pos={row.pos}
                      selected={selected.indexOf(row.orderID) !== -1}
                      handleClick={(event) => handleClick(event, row.orderID)}
                      handleEdit={() => handleEdit(row.id)}
                      handleDelete={() => handleDelete(row.id)}
                      showEditDeleteIcons={false} // Set to false to hide edit and delete icons
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
