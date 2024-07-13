import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agentName, setAgentName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [signature, setSignature] = useState<File | null>(null); // Store uploaded file

  useEffect(() => {
    window.scrollTo(0, -10); // Scroll to the top of the page when component mounts
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSignature(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const agentData = {
        AgentName: agentName,
        ContactName: contactName,
        ContactEmail: contactEmail,
        ContactPhone: contactPhone,
        Address: address,
        City: city,
        Country: country,
        PostalCode: postalCode,
        IsSupplier: false, // Example values, adjust as needed
        IsManufacturer: false,
        IsActive: true,
        CreatedBy: 'someUserID', // Example value, adjust as needed
        CreatedDate: new Date(),
        UpdatedBy: 'someUserID', // Example value, adjust as needed
        UpdatedDate: new Date(),
        esignature: signature,
      };

      const response = await fetch('/agent/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, agentData }),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      // Handle successful registration
      console.log('Registration successful');
      navigate('/'); // Redirect to sign-in page after successful registration
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="logo">
          <img src="/PSLOGOFINAL.svg" alt="Logo" />
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* Agent Data Fields */}
          <div className="form-group">
            <label htmlFor="agentName">Agent Name:</label>
            <input
              type="text"
              id="agentName"
              name="agentName"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email:</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone:</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signature">E-Signature (PDF):</label>
            <input
              type="file"
              id="signature"
              name="signature"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          {/* End of Agent Data Fields */}
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
