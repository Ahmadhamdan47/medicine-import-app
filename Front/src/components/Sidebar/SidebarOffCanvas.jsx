/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import { Link } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import { useClickAway } from "react-use";
import { Pivot as Hamburger } from "hamburger-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

import "./SideBar.css";
import ThemeToggle from "../Header/ThemeToggle.tsx";
import AddIcon from "./icons/AddIcon.jsx";
import ImportIcon from "./icons/ImportIcon.jsx";
import HomeGrayIcon from "./icons/HomeGrayIcon.jsx";
import SearchGrayIcon from "./icons/SearchGrayIcon.jsx";
import InspectionIcon from "./icons/InspectionIcon.jsx";
import DistributionIcon from "./icons/DistributionIcon.jsx";
import TrackRecordsIcon from "./icons/TrackRecordsIcon.jsx";
import MedLebLogoMobileDrawer from "./icons/MedLebLogoMobileDrawer";
import DashboardGrayIcon from "./icons/DashboardGrayIcon.jsx";
import { useSidebar } from "../../Contexts/SidebarsContext";
import CircleButton from "../../shared/CircleButton";
export const SidebarOffCanvas = () => {
  const { open, setOpen, toggleSidebar, ref, useClickAway } = useSidebar();
  const controls = useAnimation();

  return (
    <>
      {/* <div className="absolute top-0 left-2 ">
        <CircleButton padding={4} onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </CircleButton>
      </div> */}
      <div className="absolute top-2 left-2 ">
        <Hamburger toggled={open} size={30} color="#00a651" toggle={setOpen} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {open && (
          <>
            <motion.div
              {...framerSidebarBackground}
              aria-hidden="true"
              className="fixed inset-0 z-50 backdrop-blur-sm dark:backdrop-blur-sm"
            />
            <motion.div
              {...framerSidebarPanel}

              className="custom-scrollbar fixed inset-y-0 left-0 z-50 h-[100dvh] w-[18em] overflow-y-hidden overflow-x-hidden bg-white-contents dark:bg-[#292929] sm:w-[20em]"
              ref={ref}
              aria-label="Sidebar"
            >
              <div className="flex items-center justify-between border-[#00a65173] mb-4 px-5 pr-0 py-4 pb-0 text-gray-900 dark:text-[#ffffffaf]">
                <div className="flex">
                  <MedLebLogoMobileDrawer />
                </div>
                <div className="">
                  <div className="pr-6 flex gap-2 items-center">
                    <ThemeToggle />
                    {/* <FullscreenButton /> */}
                  </div>
                </div>
              </div>

              <div className="items flex h-full max-h-[calc(100vh-72px)] overflow-y-scroll flex-col justify-start pt-2">
                <ul className="">
                  {sections.map((section) => (
                    <div key={section.title} className="ml- ">
                      <h2 className="ml-10 mb-4 text-sm font-normal text-gray-700 dark:text-[#ffffffaf]">
                        {section.title}
                      </h2>
                      {section.items.map((item, idx) => (
                        <li
                          key={item.title}
                          className="mt-[-15px] flex flex-col"
                        >
                          {" "}
                          {/* Adjust mt value */}
                          <Link
                            onClick={toggleSidebar}
                            to={item.to}
                            className="flex items-center gap-3 p-5 pl-10 text-gray-900 transition-all hover:text-[#00a651] dark:text-[#ffffffaf] dark:hover:bg-black"
                          >
                            <motion.div {...framerIcon}>
                              <item.Icon className="text-3xl" />
                            </motion.div>
                            <motion.span
                              {...framerText(idx)}
                              className={item.title === "Home" ? "mt-3" : ""}
                            >
                              {item.title}
                            </motion.span>
                          </Link>
                          {/* Conditionally render a divider after "Dashboard" icon */}
                          {item.title === "Dashboard" && (
                            <div className="divider my-6 ml-[-2px] h-px w-[80%] self-center bg-gray-500 dark:bg-[#ffffffaf]" />
                          )}
                        </li>
                      ))}
                    </div>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const sections = [
  {
    title: "Menu",
    items: [
      { title: "Home", Icon: HomeGrayIcon, to: "/" },
      { title: "Search", Icon: SearchGrayIcon, to: "/search" },
      { title: "Dashboard", Icon: DashboardGrayIcon, to: "/dashboard" },
    ],
  },
  {
    title: "Drug",
    items: [
      { title: "Add", Icon: AddIcon, to: "/add" },
      { title: "Import", Icon: ImportIcon, to: "/import" },
      { title: "Inspection", Icon: InspectionIcon, to: "/inspection" },
      {
        title: "Distribution",
        Icon: DistributionIcon,
        to: "/distribution",
      },

      { title: "Track Records", Icon: TrackRecordsIcon, to: "/tracking" },
    ],
  },
  // Add more sections as needed
];

const framerSidebarBackground = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.2 } },
  transition: { duration: 0.3 },
};

const framerSidebarPanel = {
  initial: { x: "-100%", zIndex: 1000 },
  animate: { x: 0, boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" },
  exit: { x: "-100%" },
  transition: { duration: 0.3 },
};

const framerText = (delay) => ({
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: {
    delay: 0.2 + delay / 10,
  },
});

const framerIcon = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: 0.6,
  },
};
