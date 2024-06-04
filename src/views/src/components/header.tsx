// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from 'rizzui';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center">
        <Link to="/" aria-label="Site Logo">
          <Title>LOGO</Title>
        </Link>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="mr-4 p-2 border rounded"
        />
        <button className="p-2 border rounded">Search</button>
      </div>
      <div className="flex items-center">
        <Link to="/profile" className="p-2">
          Profile
        </Link>
      </div>
    </header>
  );
}
