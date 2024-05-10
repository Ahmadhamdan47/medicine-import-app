import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

import axios from '../axios';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import TrackingTableRow from '../tracking-table-row';
import Iconify from '../../../../components/iconify';
import TrackingTableHead from '../tracking-table-head';
import { useTrackingContext } from '../TrackingProvider';
import Scrollbar from '../../../../components/scrollbar';
import TrackingTableToolbar from '../tracking-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function TrackingPage() {
  const {
    editing,
    setEditing,
    editingOrderID,
    setEditingOrderID,
    orderName,
    setOrderName,
    orderRFI,
    setOrderRFI,
    orderResult,
    setOrderResult,
    orderPI,
    setOrderPI,
    orderSwift,
    setOrderSwift,
    orderInvoice,
    setOrderInvoice,
    orderRFD,
    setOrderRFD,
    stock,
    setStock,
    pos,
    setPOS,
    selectedOrderID,
    setSelectedOrderID,
    orders,
    page,
    setPage,
    order,
    setOrder,
    selected,
    setSelected,
    orderBy,
    setOrderBy,
    filterName,
    setFilterName,
    rowsPerPage,
    setRowsPerPage,
    // avatarInputRef,
  } = useTrackingContext();

  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/orders');
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Inside orderPage component
  const resetOrderInvoice = () => {
    setOrderInvoice(null);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        // Update existing order
        await axios.put(`/api/orders/${editingOrderID}`, {
          orderName,
          orderRFI,
          orderResult,
          orderPI,
          orderSwift,
          orderInvoice,
          orderRFD,
          stock,
          pos,
        });
      } else {
        // Add new order
        await axios.post('/api/orders', {
          orderName,
          orderRFI,
          orderResult,
          orderPI,
          orderSwift,
          orderInvoice,
          orderRFD,
          stock,
          pos,
        });
      }

      // Fetch updated list of orders after CRUD operation
      const response = await axios.get('/api/orders');
      setOrder(response.data);

      // Reset form inputs and orderInvoice
      setOrderName('');
      setOrderRFI('');
      setOrderResult('');
      setOrderPI('');
      setOrderSwift('');
      setOrderInvoice('');
      setOrderRFD('');
      setStock('');
      setPOS('');

      setEditing(false);
      setEditingOrderID(null);
    } catch (error) {
      console.error('Error:', error.response.data);
      // Set state to display error message to the order
      setError('An error occurred. Please try again later.');
    }
  };

  const handleDelete = async (orderID) => {
    try {
      await axios.delete(`/api/orders/${orderID}`);

      // Fetch updated list of orders after delete operation
      const response = await axios.get('/api/orders');
      setOrder(response.data);

      setOrder(orders.filter((order) => order.id !== orderID));
      setSelected(selected.filter((selectedItem) => selectedItem.id !== orderID));
      if (selectedOrderID === orderID) {
        setOrderName('');
        setOrderRFI('');
        setOrderResult('');
        setOrderPI(false);
        setOrderSwift('');
        setSelectedOrderID(null);
        setOrderRFD('');
        setStock('');
        setPOS('');
      }
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  // Inside orderPage component
  const handleDeleteSelected = async () => {
    try {
      // Delete all selected orders
      await Promise.all(
        selected.map(async (orderName) => {
          const selectedOrder = orders.find((order) => order.orderName === orderName);
          if (selectedOrder) {
            await axios.delete(`/api/orders/${selectedOrder.id}`);
          }
        })
      );

      // Fetch updated list of orders after delete operation
      const response = await axios.get('/api/orders');
      const updatedOrders = response.data;

      // Update orders state with the updated list of orders
      setOrder(updatedOrders);

      // Clear selected orders
      setSelected([]);
      resetOrderInvoice(); // Reset orderInvoice input
    } catch (error) {
      console.error('Error deleting selected orders:', error);
    }
  };

  const handleEdit = async (orderID) => {
    const selectedOrder = orders.find((order) => order.id === orderID);
    if (selectedOrder) {
      setOrderName(selectedOrder.orderName);
      setOrderRFI(selectedOrder.orderRFI);
      setOrderResult(selectedOrder.orderResult);
      setOrderPI(selectedOrder.isVerified);
      setOrderSwift(selectedOrder.orderSwift);
      setOrderInvoice(selectedOrder.orderSwift);
      setOrderSwift(selectedOrder.orderSwift);
      setOrderSwift(selectedOrder.orderSwift);
      setOrderSwift(selectedOrder.orderSwift);
      setEditing(true);
      setEditingOrderID(orderID);
      setOrderInvoice(selectedOrder.avatarUrl);
      openModal();
    }
  };

  const handleOrderNameChange = (event) => setOrderName(event.target.value);
  const handleOrderRFIChange = (event) => setOrderRFI(event.target.value);
  const handleResultChange = (event) => setOrderResult(event.target.value);
  const handleOrderPIChange = (event) => setOrderPI(event.target.checked);
  const handleOrderSwiftChange = (event) => setOrderSwift(event.target.value);
  const handleOrderInvoiceChange = (event) => setOrderInvoice(event.target.value);
  const handleOrderRFDChange = (event) => setOrderRFD(event.target.value);
  const handleStockChange = (event) => setStock(event.target.value);
  const handlePosChange = (event) => setPOS(event.target.value);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.orderName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, orderName) => {
    const selectedIndex = selected.indexOf(orderName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, orderName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const openModal = () => setIsModalOpen(true); // Function to open modal

  const resetModalInputs = () => {
    setOrderName('');
    setOrderRFI('');
    setOrderResult('');
    setOrderPI('');
    setOrderSwift('');
    setOrderInvoice('');
    setOrderRFD('');
    setStock('');
    setPOS('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalInputs(); // Reset the input values when closing the modal
  };

  return (
    <Container sx={{ width: '100%', backgroundColor: '#f0f0f0' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={openModal} // Open the modal when clicking this button
        >
          Add New
        </Button>
      </Stack>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Card
          sx={{
            width: '100%',
            height: '80%',
            backgroundColor: '#ffffff',
            p: 3,
            marginBottom: '2rem',
            position: 'relative', // Add position relative to allow absolute positioning of close icon
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1, // Make sure the close icon appears above other content
            }}
          >
            <CloseIcon />
          </IconButton>

          <Stack spacing={2} alignItems="flex-start">
            <Card
              sx={{
                width: '100%',
                height: '80%',
                backgroundColor: '#ffffff',
                p: 3,
                marginBottom: '2rem',
              }}
            >
              <Stack spacing={2} alignItems="flex-start">
                <Stack
                  spacing={2}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  width="100%"
                >
                  <TextField
                    fullWidth
                    label="Order"
                    value={orderName}
                    onChange={handleOrderNameChange}
                  />
                  <TextField
                    fullWidth
                    label="RFI"
                    value={orderRFI}
                    onChange={handleOrderRFIChange}
                  />
                  <TextField
                    fullWidth
                    label="Result"
                    value={orderResult}
                    onChange={handleResultChange}
                  />
                  <TextField fullWidth label="PI" value={orderPI} onChange={handleOrderPIChange} />
                  <TextField
                    fullWidth
                    label="Swift"
                    value={orderSwift}
                    onChange={handleOrderSwiftChange}
                  />
                  <TextField
                    fullWidth
                    label="Invoice"
                    value={orderInvoice}
                    onChange={handleOrderInvoiceChange}
                  />
                  <TextField
                    fullWidth
                    label="RFD"
                    value={orderRFD}
                    onChange={handleOrderRFDChange}
                  />
                  <TextField fullWidth label="Stock" value={stock} onChange={handleStockChange} />
                  <TextField fullWidth label="PoS" value={pos} onChange={handlePosChange} />
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  width="100%"
                >
                  <FormControlLabel
                    control={
                      <Checkbox checked={orderPI} onChange={handleOrderPIChange} color="primary" />
                    }
                    label="Verified"
                  />

                  <Select
                    sx={{ width: '50%' }}
                    value={orderSwift}
                    onChange={handleOrderSwiftChange}
                    fullWidth
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Input
                      type="file"
                      id="orderInvoice-input"
                      accept="image/*"
                      style={{ display: 'none' }} // Hide the actual file input
                      onChange={handleOrderInvoiceChange}
                      // ref={avatarInputRef}
                    />
                    <label htmlFor="orderInvoice-input">
                      <Button
                        variant="outlined"
                        component="span" // Make the button act as a file input trigger
                        startIcon={<CloudUploadIcon />} // Optional: Icon for the button
                      >
                        Upload Avatar
                      </Button>
                    </label>
                  </Stack>
                </Stack>

                <Stack width="100%" alignItems="center">
                  <Button
                    fullWidth
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleSubmit}
                    sx={{ width: '20%' }}
                  >
                    {editing ? 'Update Order' : 'New Order'}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Card>
      </Modal>

      <Card sx={{ width: '100%', backgroundColor: '#ffffff' }}>
        <TrackingTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected} // onDeleteSelected prop
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TrackingTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'orderName', label: 'Order' },
                  { id: 'orderRFI', label: 'RFI' },
                  { id: 'orderResult', label: 'Result' },
                  { id: 'orderPI', label: 'PI', align: 'center' },
                  { id: 'orderSwift', label: 'Swift' },
                  { id: 'orderInvoice', label: 'Invoice' },
                  { id: 'orderRFD', label: 'RFD' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'pos', label: 'PoS' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TrackingTableRow
                      key={row.id}
                      orderName={row.orderName}
                      orderRFI={row.orderRFI}
                      orderResult={row.orderResult}
                      orderPI={row.orderPI}
                      orderSwift={row.orderSwift}
                      orderInvoice={row.orderInvoice}
                      orderRFD={row.orderRFD}
                      stock={row.stock}
                      pos={row.pos}
                      selected={selected.indexOf(row.orderName) !== -1}
                      handleClick={(event) => handleClick(event, row.orderName)}
                      handleEdit={() => handleEdit(row.id)}
                      handleDelete={() => handleDelete(row.id)}
                      showEditDeleteIcons
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
