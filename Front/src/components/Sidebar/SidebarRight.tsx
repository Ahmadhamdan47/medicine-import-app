import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '../Header/ThemeToggle';
import { RiUserLine } from 'react-icons/ri';
import { FaRegBell } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { AiOutlineDatabase } from 'react-icons/ai';


const SidebarRight = () => {
	const [isActive, setIsActive] = useState(false);
	const [activeIcon, setActiveIcon] = useState(null);
	const handleIconsClick = (iconName) => {
		setActiveIcon((prevIcon) => (prevIcon === iconName ? null : iconName));
	};

	const handleIconClick = () => {
		setIsActive(!isActive);
	};
	const [isCollapsed, setCollapsed] = useState(false);
	const sidebarRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setCollapsed(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarRef]);

	const toggleCollapse = () => {
		setCollapsed(!isCollapsed);
	};

	const framerSidebarPanel = {
		initial: { x: '100%', zIndex: 1000 },
		animate: { x: 0 },
		exit: { x: '-100%' },
		transition: { duration: 0.1 },
	};

	return (
		<AnimatePresence>
			{isCollapsed && (
				<div
					className="fixed inset-0 z-0 backdrop-blur-sm dark:backdrop-blur-sm"
					onClick={toggleCollapse}
				></div>
			)}
			<div ref={sidebarRef} className="">
				<motion.div
					{...framerSidebarPanel}
					className={`z-40  h-screen pt-10 bg-[#f2f2f2] flex flex-col justify-between dark:bg-black-contents ${isCollapsed ? 'w-50' : 'w-250'
						}px text-lightgray font-averta-regular h-screen shrink-0 overflow-hidden text-left text-xl transition-all duration-300 ease-in-out`}
					style={{ right: isCollapsed ? 0 : 'auto' }}
				>
					{isCollapsed ? (
						// Show icons with text stacked when expanded
						<div className="w-[250px] p-2 pt-14 text-gray-900 dark:text-gray-100">
							<div className="flex flex-col items-start gap-5">
								<Link
									to="/profile"
									className="flex cursor-pointer items-center"
									onClick={() => handleIconClick()}
								>
									<RiUserLine
										className={`text-[33px] ${activeIcon === 'user' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
											} hover:text-[#00a651]`}
										onClick={() => handleIconsClick('user')}
									/>
									<span className="text-md ml-4 text-gray-900 dark:text-gray-100">Profile</span>
								</Link>

								<Link
									to="/auth"
									className="flex cursor-pointer items-center"
									onClick={() => handleIconClick()}
								>
									<FiLogIn
										className={`text-[33px] ${activeIcon === 'login' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
											} hover:text-[#00a651]`}
										onClick={() => handleIconsClick('login')}
									/>
									<span className="text-md ml-4 text-gray-900 dark:text-gray-100">Login</span>
								</Link>

								<Link
									to="/notifications"
									className="flex cursor-pointer items-center"
									onClick={() => handleIconClick()}
								>
									<FaRegBell
										className={`text-[33px] ${activeIcon === 'bell' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
											} hover:text-[#00a651]`}
										onClick={() => handleIconsClick('bell')}
									/>
									<span className="text-md ml-4 text-gray-900 dark:text-gray-100">
										Notifications
									</span>
								</Link>

								<Link
									to="/static"
									className="flex cursor-pointer items-center"
									onClick={() => handleIconClick()}
								>
									<AiOutlineDatabase
										className={`text-[33px] ${activeIcon === 'bell' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
											} hover:text-[#00a651]`}
										onClick={() => handleIconsClick('data')}
									/>
									<span className="text-md ml-4 text-gray-900 dark:text-gray-100">Static Data</span>
								</Link>
							</div>
						</div>
					) : (
						// Show icons without text when collapsed, stacked
						<div className="flex flex-col items-center gap-5 p-2 pt-14 text-green-pri dark:text-gray-100">
							<Link to="/profile" onClick={() => handleIconClick()}>
								<RiUserLine
									className={`text-[33px] ${activeIcon === 'user' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
										} hover:text-[#00a651]`}
									onClick={() => handleIconsClick('user')}
								/>
							</Link>

							<Link to="/auth" onClick={() => handleIconClick()}>
								<FiLogIn
									className={`text-[33px] ${activeIcon === 'login' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
										} hover:text-[#00a651]`}
									onClick={() => handleIconsClick('login')}
								/>
							</Link>

							<Link to="/notifications" onClick={() => handleIconClick()}>
								<FaRegBell
									className={`text-[33px] ${activeIcon === 'bell' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
										} hover:text-[#00a651]`}
									onClick={() => handleIconsClick('bell')}
								/>
							</Link>

							<Link to="/static" onClick={() => handleIconClick()}>
								<AiOutlineDatabase
									className={`text-[33px] ${activeIcon === 'bell' ? 'text-[#00a651]' : 'text-[#9CA5BF]'
										} hover:text-[#00a651]`}
									onClick={() => handleIconsClick('data')}
								/>
							</Link>
						</div>
					)}

					<div className="flex flex-col items-center justify-center gap-4 border-t">
						{isCollapsed ? (
							// When expanded, buttons are in a row
							<div className="flex justify-between w-full py-2 px-4">
								<div>
									<ThemeToggle />
								</div>
								<div>

								</div>
							</div>
						) : (
							// When collapsed, buttons are stacked
							<div className="flex flex-col items-center justify-between py-4">
								<div>
									<ThemeToggle />
								</div>
								<div className="mt-4">

								</div>
							</div>
						)}
					</div>
				</motion.div>

				<div
					className="absolute top-0 flex cursor-pointer items-center justify-start  p-2"
					onClick={toggleCollapse}
				>
					<svg
						className="h-6 w-6  rotate-90 text-green-pri transition-transform duration-300 ease-in-out dark:text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						{isCollapsed ? (
							// Show expand arrow when collapsed
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 15l7-7 7 7"
							></path>
						) : (
							// Show collapse arrow when expanded
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							></path>
						)}
					</svg>
				</div>
			</div>
		</AnimatePresence>
	);
};

export default SidebarRight;

