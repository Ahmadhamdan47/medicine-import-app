 
import { useState, useEffect, useContext, createContext } from 'react';

import axios from './axios';

// Create a context
const TrackingContext = createContext();

// Custom hook to consume the context
export const useTrackingContext = () => useContext(TrackingContext);

export default function TracingProvider({ children }) {
  // Initial state
  const [editing, setEditing] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderName, setOrderName] = useState('');
  const [orderRFI, setOrderRFI] = useState('');
  const [orderResult, setOrderResult] = useState('');
  const [orderPI, setOrderPI] = useState(false);
  const [orderSwift, setOrderSwift] = useState('');
  const [orderInvoice, setOrderInvoice] = useState(null);
  const [orderRFD, setOrderRFD] = useState('');
  const [stock, setStock] = useState('');
  const [pos, setPOS] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [orderss, setOrder] = useState([]);

  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('orderName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editing) {
        // Update existing order
        await axios.put(`/api/orders/${editingOrderId}`, {
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
      setOrders(response.data);

      // Reset form inputs and orderInvoice
      setOrderName('');
      setOrderRFI('');
      setOrderResult('');
      setOrderPI(false);
      setOrderSwift('');
      setOrderInvoice(null);
      setOrderRFD('');
      setStock('');
      setPOS('');

      setEditing(false);
      setEditingOrderId(null);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);

      // Fetch updated list of orders after delete operation
      const response = await axios.get('/api/orders');
      setOrders(response.data);

      setOrders(orders.filter((order) => order.id !== orderId));
      setSelected(selected.filter((selectedItem) => selectedItem.id !== orderId));
      if (selectedOrderId === orderId) {
        setOrderName('');
        setOrderRFI('');
        setOrderResult('');
        setOrderPI(false);
        setOrderSwift('');
        setSelectedOrderId(null);
        setOrderRFD('');
        setStock('');
        setPOS('');
      }
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Delete all selected orders
      await Promise.all(
        selected.map(async (selectedOrderName) => {
          const selectedOrder = orders.find((order) => order.orderName === selectedOrderName);
          if (selectedOrder) {
            await axios.delete(`/api/orders/${selectedOrder.id}`);
          }
        })
      );

      // Fetch updated list of orders after delete operation
      const response = await axios.get('/api/orders');
      const updatedOrders = response.data;

      // Update orders state with the updated list of orders
      setOrders(updatedOrders);

      // Clear selected orders
      setSelected([]);
      setOrderInvoice(null); // Reset orderInvoice input
    } catch (error) {
      console.error('Error deleting selected orders:', error);
    }
  };

  const handleEdit = async (orderId) => {
    const selectedOrder = orders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setOrderName(selectedOrder.orderName);
      setOrderRFI(selectedOrder.orderRFI);
      setOrderResult(selectedOrder.orderResult);
      setOrderPI(selectedOrder.orderPI);
      setOrderSwift(selectedOrder.orderSwift);
      setOrderInvoice(selectedOrder.orderInvoice);
      setOrderRFD(selectedOrder.orderRFD);
      setStock(selectedOrder.stock);
      setPOS(selectedOrder.pos);
      setEditing(true);
      setEditingOrderId(orderId);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.orderName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, clickedOrderName) => {
    const selectedIndex = selected.indexOf(clickedOrderName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, clickedOrderName);
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

  const contextValue = {
    editing,
    setEditing,
    editingOrderId,
    setEditingOrderId,
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
    selectedOrderId,
    setSelectedOrderId,
    page,
    setPage,
    selected,
    setSelected,
    orderBy,
    filterName,
    rowsPerPage,
    setRowsPerPage,
    // addOrder,
    // editOrder,
    // deleteOrder,
    // deleteSelectedOrders,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDeleteSelected,
    handleOrderNameChange,
    handleOrderRFIChange,
    handleResultChange,
    handleOrderPIChange,
    handleOrderSwiftChange,
    handleOrderInvoiceChange,
    handleOrderRFDChange,
    handleStockChange,
    handlePosChange,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
  };

  return <TrackingContext.Provider value={contextValue}>{children}</TrackingContext.Provider>;
}
