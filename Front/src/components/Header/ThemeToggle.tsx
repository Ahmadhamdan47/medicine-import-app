/* eslint-disable tailwindcss/no-custom-classname */

import { useDarkMode } from "../../utils/DarkModeContext";

export default function ThemeToggle() {
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	return (
		<div>
			<input
				type="checkbox"
				name="light-switch"
				id="light-switch"
				className="light-switch sr-only"
				checked={isDarkMode}
				onChange={toggleDarkMode}
			/>
			<label
				className="flex h-7 sm:h-8 w-7 sm:w-8 cursor-pointer items-center justify-center rounded-full bg-[#00a651] hover:bg-[#00a651] dark:bg-slate-700 dark:hover:bg-slate-600/80"
				htmlFor="light-switch"
			>
				<svg
					className="h-4 w-4 dark:hidden"
					width="16"
					height="16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="fill-current text-white"
						d="M7 0h2v2H7V0Zm5.88 1.637 1.414 1.415-1.415 1.413-1.414-1.414 1.415-1.414ZM14 7h2v2h-2V7Zm-1.05 7.433-1.415-1.414 1.414-1.414 1.415 1.413-1.414 1.415ZM7 14h2v2H7v-2Zm-4.02.363L1.566 12.95l1.415-1.414 1.414 1.415-1.415 1.413ZM0 7h2v2H0V7Zm3.05-5.293L4.465 3.12 3.05 4.535 1.636 3.121 3.05 1.707Z"
					/>
					<path
						className="fill-current text-white"
						d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
					/>
				</svg>

				<svg
					className="hidden h-4 w-4 dark:block"
					width="16"
					height="16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="fill-current text-[#00a651]"
						d="M6.2 2C3.2 2.8 1 5.6 1 8.9 1 12.8 4.2 16 8.1 16c3.3 0 6-2.2 6.9-5.2C9.7 12.2 4.8 7.3 6.2 2Z"
					/>
					<path
						className="fill-current text-[#00a651]"
						d="M12.5 6a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 6Z"
					/>
				</svg>
				<span className="sr-only">Switch to light / dark version</span>
			</label>
		</div>
	);
}
