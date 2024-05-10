import axios from 'axios';
import React, { useState } from 'react';

const DrugsComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const token = btoa(`${username}:${password}`);
            const response = await axios.get('http://85.112.70.8:3013/api/drugs/v1.0/drugsDetails', {
                headers: {
                    Authorization: `Basic ${token}`
                }
            });
            setData(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreate = async () => {
        try {
            const token = btoa(`${username}:${password}`);
            await axios.post('api/drugs/v1.0/Create', {}, {
                headers: {
                    Authorization: `Basic ${token}`
                }
            });
            // Handle successful creation
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={fetchData}>Fetch Data</button>
            <button onClick={handleCreate}>Create</button>
            {data && (
                <div>
                    {/* Render data */}
                </div>
            )}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default DrugsComponent;
