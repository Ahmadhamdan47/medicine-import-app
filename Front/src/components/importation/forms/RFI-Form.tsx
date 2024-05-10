import { useState } from 'react';
import axios from 'axios';

// User-side RFI Creation Form
export function UserRFIForm({ onCreateRFI }) {
    const [quantity, setQuantity] = useState('');
    const [offerType, setOfferType] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send request to create RFI
            const response = await axios.post('/api/create-rfi', {
                quantity,
                offerType,
                notes,
            });
            onCreateRFI(response.data); // Pass created RFI to parent component
            // Reset form fields
            setQuantity('');
            setOfferType('');
            setNotes('');
        } catch (error) {
            console.error('Error creating RFI:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                required
            />
            <input
                type="text"
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                placeholder="Offer Type"
                required
            />
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
            />
            <button type="submit">Submit RFI</button>
        </form>
    );
}