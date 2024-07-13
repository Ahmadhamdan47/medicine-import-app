// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Title } from 'rizzui';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Profile', href: '/profile' },
  // Add more menu items as needed
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="fixed bottom-0 left-0 top-0 w-64 bg-white shadow-md">
      <div className="p-4">
        <Link to="/" aria-label="Site Logo">
          <Title>LOGO</Title>
        </Link>
      </div>
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.href}>
            <div
              className={`block p-2 rounded ${
                pathname === item.href ? 'bg-gray-200' : ''
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
