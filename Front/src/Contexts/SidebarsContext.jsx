import React, { useState, useRef, useContext } from "react";
import { useClickAway } from "react-use";

// Create Context
const SidebarContext = React.createContext();

// Sidebar Provider Component
export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));

  return (
    <SidebarContext.Provider value={{ open,setOpen, toggleSidebar, ref, useClickAway }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
