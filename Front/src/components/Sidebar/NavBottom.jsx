// // /* eslint-disable tailwindcss/no-custom-classname */
// // import React from "react";
// // import { NavLink } from "react-router-dom";
// // import HomeIcon from "@mui/icons-material/Home";
// // import SearchIcon from "@mui/icons-material/Search";
// // import ListIcon from "@mui/icons-material/List";
// // import AddIcon from "@mui/icons-material/Add";
// // import ThemeToggle from "./ThemeToggle";
// // import { RiUserLine } from "react-icons/ri";
// // // import "../../App.css";
// // import "../../index.css";
// // const NavBottom = () => {
// //   const navigation = [
// //     { path: "/", name: "Home", icon: <HomeIcon fontSize="medium" /> },
// //     {
// //       path: "/search",
// //       name: "Search",
// //       icon: <SearchIcon fontSize="medium" />,
// //     },
// //     {
// //       path: "/list",
// //       name: "Medicines List",
// //       icon: <ListIcon fontSize="medium" />,
// //     },
// //     {
// //       path: "/profile",
// //       name: "Profile",
// //       icon: <RiUserLine fontSize="1.8em" style={{paddingLeft:1}} />,
// //     },
// //   ];

// //   return (
// //     <div className="NavBottom  text-[#00a651] dark:bg-black  ">
// //       {navigation.map((nav) => (
// //         <NavLink
// //           key={nav.name}
// //           to={nav.path}
// //           className="nav-link text-[#00a651] "
// //         >
// //           <NavBottomIcon icon={nav.icon} />
// //           {nav.name}
// //         </NavLink>
// //       ))}
// //       <ThemeToggle />
// //     </div>
// //   );
// // };

// // const NavBottomIcon = ({ icon }) => (
// //   <div className="NavBottom-icon group">{icon}</div>
// // );

// // export default NavBottom;

// /* eslint-disable tailwindcss/no-custom-classname */
// import React from "react";
// import { NavLink } from "react-router-dom";
// import HomeIcon from "@mui/icons-material/Home";
// import SearchIcon from "@mui/icons-material/Search";
// import ListIcon from "@mui/icons-material/List";
// import AddIcon from "@mui/icons-material/Add";
// import ThemeToggle from "./ThemeToggle";
// import { RiUserLine } from "react-icons/ri";
// import "../../index.css";

// const NavBottom = () => {
//   const navigation = [
//     { path: "/", name: "Home", icon: <HomeIcon fontSize="medium" /> },
//     {
//       path: "/search",
//       name: "Search",
//       icon: <SearchIcon fontSize="medium" />,
//     },
//     {
//       path: "/list",
//       name: "Medicines List",
//       icon: <ListIcon fontSize="medium" />,
//     },
//     {
//       path: "/profile",
//       name: "Profile",
//       icon: <RiUserLine fontSize="1.8em" style={{ paddingLeft: 1 }} />,
//     },
//   ];

//   return (
//     <div className="NavBottom flex justify-between items-center bg-white-contents dark:bg-black-fg dark:shadow-md p-5">
//       {navigation.map((nav) => (
//         <NavLink
//           key={nav.name}
//           to={nav.path}
//           className="nav-link flex flex-col items-center text-[#00a651] text-sm transition duration-250 hover:text-[#0fe2b1]"
//           activeclassname="text-[#0fe2b1]"
//         >
//           <NavBottomIcon icon={nav.icon} />
//           <span>{nav.name}</span>
//         </NavLink>
//       ))}
//       <ThemeToggle />
//     </div>
//   );
// };

// const NavBottomIcon = ({ icon }) => (
//   <div className="NavBottom-icon group">{icon}</div>
// );

// export default NavBottom;

import * as React from "react";
import { Link } from "react-router-dom";
import { GoHome , GoSearch , GoPerson , GoListUnordered } from "react-icons/go";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export default function NavBottom() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 65,
        backgroundColor: "#e0e0e0",
      }}
      value={value}
      onChange={handleChange}
      className="dark:bg-black-contents "
    >
      <BottomNavigationAction
        component={Link}
        to="/"
        label={
          <span style={{ color: value === "home" ? "#FAAF40" : "#00a651" }}>
            Home
          </span>
        }
        value="home"
        icon={
          <GoHome
            style={{
              color: value === "home" ? "#FAAF40" : "#00a651",
              fontSize: "25px",
            }}
          />
        }
      />
      <BottomNavigationAction
        component={Link}
        to="/search"
        label={
          <span style={{ color: value === "search" ? "#FAAF40" : "#00a651" }}>
            Search
          </span>
        }
        value="search"
        icon={
          <GoSearch
            style={{
              color: value === "search" ? "#FAAF40" : "#00a651",
              fontSize: "25px",
            }}
          />
        }
      />
      <BottomNavigationAction
        component={Link}
        to="/list"
        label={
          <span style={{ color: value === "list" ? "#FAAF40" : "#00a651" }}>
            List
          </span>
        }
        value="list"
        icon={
          <GoListUnordered
            style={{
              color: value === "list" ? "#FAAF40" : "#00a651",
              fontSize: "25px",
            }}
          />
        }
      />
      <BottomNavigationAction
        component={Link}
        to="/profile"
        label={
          <span style={{ color: value === "profile" ? "#FAAF40" : "#00a651" }}>
            Profile
          </span>
        }
        value="profile"
        icon={
          <GoPerson
            style={{
              color: value === "profile" ? "#FAAF40" : "#00a651",
              fontSize: "25px",
            }}
          />
        }
      />
    </BottomNavigation>
  );
}
