// import clsx from "clsx";
// import { observer } from "mobx-react";
// import { useEffect, useRef, useState } from "react";
// import { useMst } from "../../store-models";
// import { Link } from "react-router-dom";

// import SidebarItem from "./SidebarItem";

// // Importing the new icons
// import AddIcon from './icons/AddIcon.jsx';
// import ImportIcon from './icons/ImportIcon.jsx';
// import HomeGrayIcon from './icons/HomeGrayIcon.jsx';
// import SearchGrayIcon from './icons/SearchGrayIcon.jsx';
// import InspectionIcon from './icons/InspectionIcon.jsx';
// import TrackRecordsIcon from './icons/TrackRecordsIcon.jsx';
// import DashboardGrayIcon from './icons/DashboardGrayIcon.jsx';

// function Sidebar() {
// 	const [isMouseIn, setIsMouseIn] = useState(false);
// 	const { isCollapsed, setIsCollapsed, toggleIsCollapsed } = useMst().sidebar;
// 	let delayTimer = useRef<number | null>(null);

// 	const handleIsMouseIn = () => {
// 		if (!isCollapsed) return;

// 		delayTimer.current = setTimeout(() => {
// 			setIsMouseIn(true);
// 		}, 450);
// 	};

// 	const handleMouseOut = () => {
// 		setIsMouseIn(false);
// 		if (delayTimer.current) {
// 			clearTimeout(delayTimer.current);
// 		}
// 	};

// 	useEffect(() => {
// 		if (!isCollapsed) return;

// 		setIsCollapsed(false);

// 		return () => {
// 			toggleIsCollapsed();
// 		};
// 	}, [isMouseIn]);

// 	return (
// 		<div
// 			onMouseEnter={handleIsMouseIn}
// 			onMouseLeave={handleMouseOut}
// 			className={clsx(
// 				`flex-row transition-all duration-300 pr-2`,
// 				isCollapsed ? "w-[3.5rem] space-y-6" : "w-44 space-y-6"
// 			)}
// 		>
// 			<div className="flex-column">
// 				<Link to="/" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Home" active={false}>
// 						<HomeGrayIcon />
// 					</SidebarItem>
// 				</Link>

// 				<Link to="/search" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Search" active={false}>
// 						<SearchGrayIcon />
// 					</SidebarItem>
// 				</Link>

// 				<Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Dashboard" active={false}>
// 						<DashboardGrayIcon />
// 					</SidebarItem>
// 				</Link>
// 			</div>

// 			{/* Horizontal divider */}
// 			<hr className={isCollapsed ? "border-gray-300 my-2 ml-2" : "border-gray-300 my-4"} />

// 			<div className="flex-column">
// 				<Link to="/add" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Add" active={false}>
// 						<AddIcon />
// 					</SidebarItem>
// 				</Link>

// 				<Link to="/import" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Import" active={false}>
// 						<ImportIcon />
// 					</SidebarItem>
// 				</Link>

// 				<Link to="/inspect" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Inspect" active={false}>
// 						<InspectionIcon />
// 					</SidebarItem>
// 				</Link>

// 				<Link to="/track-records" className="text-gray-600 hover:text-gray-800">
// 					<SidebarItem text="Track Records" active={false}>
// 						<TrackRecordsIcon />
// 					</SidebarItem>
// 				</Link>

// 			</div>
// 		</div>
// 	);
// }

// export default observer(Sidebar);



import clsx from "clsx";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { useMst } from "../../store-models";
import { Link } from "react-router-dom";

import SidebarItem from "./SidebarItem";

// Importing the new icons
import AddIcon from './icons/AddIcon.jsx';
import ImportIcon from './icons/ImportIcon.jsx';
import HomeGrayIcon from './icons/HomeGrayIcon.jsx';
import SearchGrayIcon from './icons/SearchGrayIcon.jsx';
import InspectionIcon from './icons/InspectionIcon.jsx';
import TrackRecordsIcon from './icons/TrackRecordsIcon.jsx';
import DashboardGrayIcon from './icons/DashboardGrayIcon.jsx';

function Sidebar() {
	const [isMouseIn, setIsMouseIn] = useState(false);
	const { isCollapsed, setIsCollapsed, toggleIsCollapsed } = useMst().sidebar;
	let delayTimer = useRef<number | null>(null);

	const handleIsMouseIn = () => {
		if (!isCollapsed) return;

		delayTimer.current = setTimeout(() => {
			setIsMouseIn(true);
		}, 450);
	};

	const handleMouseOut = () => {
		setIsMouseIn(false);
		if (delayTimer.current) {
			clearTimeout(delayTimer.current);
		}
	};

	useEffect(() => {
		if (!isCollapsed) return;

		setIsCollapsed(false);

		return () => {
			toggleIsCollapsed();
		};
	}, [isMouseIn]);

	return (
		<div
			onMouseEnter={handleIsMouseIn}
			onMouseLeave={handleMouseOut}
			className={clsx(
				`flex-row transition-all duration-300 pr-2`,
				isCollapsed ? "w-[3.5rem] space-y-6" : "w-44 space-y-6"
			)}
		>
			<div className="flex-column pt-4">
				{/* Menu Section Title */}
				<h2 className="text-[#999] text-md pl-3">Menu</h2>

				{/* Menu Items */}
				<Link to="/" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Home" active={false}>
						<HomeGrayIcon />
					</SidebarItem>
				</Link>

				<Link to="/search" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Search" active={false}>
						<SearchGrayIcon />
					</SidebarItem>
				</Link>

				<Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Dashboard" active={false}>
						<DashboardGrayIcon />
					</SidebarItem>
				</Link>
			</div>

			{/* Horizontal divider */}
			<hr className={isCollapsed ? "border-gray-300 my-2 ml-2" : "border-gray-300 my-4"} />

			<div className="flex-column">
				{/* Menu Section Title */}
				<h2 className="text-[#999] text-md pl-3">Drugs</h2>

				{/* Menu Items */}
				<Link to="/add" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Add" active={false}>
						<AddIcon />
					</SidebarItem>
				</Link>

				<Link to="/import" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Import" active={false}>
						<ImportIcon />
					</SidebarItem>
				</Link>

				<Link to="/inspect" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Inspect" active={false}>
						<InspectionIcon />
					</SidebarItem>
				</Link>

				<Link to="/track-records" className="text-gray-600 hover:text-gray-800">
					<SidebarItem text="Track Records" active={false}>
						<TrackRecordsIcon />
					</SidebarItem>
				</Link>

			</div>
		</div>
	);
}

export default observer(Sidebar);
