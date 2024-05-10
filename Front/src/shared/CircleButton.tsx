import React from "react";
import clsx from "clsx";

type Props = {
	padding?: number;
	children: React.ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function CircleButton({ padding = 2, children, className, ...props }: Props) {
	return (
		<button
			className={clsx(
				`hover:bg-gray-500 transition-colors duration-100 rounded-full outline-none active:outline-none focus:outline-none text-black-fg dark:text-white-bg hover:text-black-fg`,
				padding ? `p-${padding}` : "p-2",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}
