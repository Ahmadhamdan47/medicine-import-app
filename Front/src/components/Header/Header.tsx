import SearchBarInput from "./SearchBarInput";
import CircleButton from "../../shared/CircleButton";
import { useMst } from "../../store-models";
import Tooltip from "../../shared/Tooltip";
import { DownArrowIcon, SearchIcon } from "../../utils/icons";
import { useDarkMode } from "../../utils/DarkModeContext";
import MedLebLogo from './MedLebLogo';
import MedLebLogoDark from './MedLebLogoDark';
import ThemeToggle from './ThemeToggle';

export default function Header() {
	const { toggleIsCollapsed } = useMst().sidebar;
	const { isDarkMode } = useDarkMode();
	function onToggle() {
		toggleIsCollapsed();
	}

	return (
		<div className={`w-full flex bg-white-bg ${isDarkMode ? "dark:bg-black-bg" : ""} items-center text-white `}>
			<div className="flex">
				<div className="md:w-64 sm:flex pl-1">
					<div className="invisible md:visible">
						<CircleButton padding={4} onClick={onToggle}>
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
					</div>
					<div className="hidden sm:flex items-center ml-4 mt-1">
						{isDarkMode ? <MedLebLogo /> : <MedLebLogoDark />}
					</div>
				</div>
			</div>

			<div className="flex justify-between w-full items-center pr-2">
				<div className="bg-white-fg dark:bg-black-contents rounded-full sm:w-2/3 sm:ml-10 p-1 md:w-1/2 flex items-center space-x-2">
					<div className="pl-1">
						<Tooltip text="Search">
							<CircleButton>
								<SearchIcon />
							</CircleButton>
						</Tooltip>
					</div>
					<div className="flex-1 w-full">
						<SearchBarInput />
					</div>

					<div>
						<Tooltip text="Show search options">
							<CircleButton>
								<DownArrowIcon />
							</CircleButton>
						</Tooltip>
					</div>
				</div>

				<div className="space-x-2 flex items-center">
					<div className="hidden md:flex">
						<Tooltip text="Theme">
							<ThemeToggle />
						</Tooltip>
					</div>
					<Tooltip
						htmlText="<strong>Account</strong>"
						position="bottom-left"
					>
						<CircleButton padding={1}>
							<div className="h-8 w-8 rounded-full flex justify-center items-center bg-green-pri font-semibold uppercase">
								K
							</div>
						</CircleButton>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
