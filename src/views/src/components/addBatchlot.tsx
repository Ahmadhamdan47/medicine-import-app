import React, { useState } from 'react';
import axios from 'axios';
import './addBatchLot.css';
import SubmitButton from '../assets/SubmitButton.svg';

const AddBatchLot: React.FC = () => {
    const [drugName, setDrugName] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [GTIN, setGTIN] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!drugName || !batchNumber || !GTIN || !serialNumber || !expiryDate) {
            setResult('Please fill in all fields.');
            return;
        }

        const batchLotData = {
            DrugName: drugName,
            BatchNumber: batchNumber,
            GTIN,
            ExpiryDate: expiryDate,
        };

        console.log("BatchLot Data:", batchLotData);
        console.log("Serial Number:", serialNumber);

        try {
            const response = await axios.post('/batchLots/addBatchLot', {
                batchLotData,
                serialNumber,
            });
            setResult('Batch lot added successfully!');
            console.log(response.data); // Handle success
        } catch (error) {
            setResult('Error adding batch lot.');
            console.error(error); // Handle error
        }
    };

    return (
        <div className="add-batch-lot-wrapper">
            <form className="add-batch-lot-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="drugName">Drug Name</label>
                    <input type="text" id="drugName" className="oval-input" value={drugName} onChange={(e) => setDrugName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="batchNumber">Batch Number</label>
                    <input type="text" id="batchNumber" className="oval-input" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="GTIN">GTIN</label>
                    <input type="text" id="GTIN" className="oval-input" value={GTIN} onChange={(e) => setGTIN(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="serialNumber">Serial Number</label>
                    <input type="text" id="serialNumber" className="oval-input" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="date" id="expiryDate" className="oval-input" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <button type="submit" className="submit-button">
                        <img src={SubmitButton} alt="Submit" />
                    </button>
                </div>
            </form>
            {result && <div className="result">{result}</div>}
        </div>
    );
};

export default AddBatchLot;
