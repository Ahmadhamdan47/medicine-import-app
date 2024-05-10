import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function OrderForm({
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
  handleSubmit,
  handleAvatarChange,
}) {
  const handleOrderNameChange = (event) => setOrderName(event.target.value);
  const handleOrderRFIChange = (event) => setOrderRFI(event.target.value);
  const handleOrderResultChange = (event) => setOrderResult(event.target.value);
  const handleOrderPIChange = (event) => setOrderPI(event.target.checked);
  const handleOrderSwiftChange = (event) => setOrderSwift(event.target.value);
  const handleOrderInvoiceChange = (event) => setOrderInvoice(event.target.value);
  const handleOrderRFDChange = (event) => setOrderRFD(event.target.value);
  const handleStockChange = (event) => setStock(event.target.value);
  const handlePOSChange = (event) => setPOS(event.target.value);

  return (
    <Card>
      <TextField fullWidth label="Order Name" value={orderName} onChange={handleOrderNameChange} />
      <TextField fullWidth label="Order RFI" value={orderRFI} onChange={handleOrderRFIChange} />
      <TextField fullWidth label="Order Result" value={orderResult} onChange={handleOrderResultChange} />
      <FormControlLabel
        control={<Checkbox checked={orderPI} onChange={handleOrderPIChange} color="primary" />}
        label="Order PI"
      />
      <TextField fullWidth label="Order Swift" value={orderSwift} onChange={handleOrderSwiftChange} />
      <TextField fullWidth label="Order Invoice" value={orderInvoice} onChange={handleOrderInvoiceChange} />
      <TextField fullWidth label="Order RFD" value={orderRFD} onChange={handleOrderRFDChange} />
      <TextField fullWidth label="Stock" value={stock} onChange={handleStockChange} />
      <TextField fullWidth label="POS" value={pos} onChange={handlePOSChange} />

      <input type="file" accept="image/*" onChange={handleAvatarChange} />

      <button onClick={handleSubmit}>Submit</button>
    </Card>
  );
}
