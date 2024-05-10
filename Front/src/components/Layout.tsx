import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import SidebarRight from "./Sidebar/SidebarRight";
import { SidebarOffCanvas } from "./Sidebar/SidebarOffCanvas";


type Props = {
	children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			<div className="flex h-full bg-white-bg dark:bg-black-bg">
				<div className="hidden md:block">
					<Sidebar />
				</div>
				<div className="content-container flex flex-col w-full m-2 bg-white-fg dark:bg-black-contents text-white-text pb-4 mb-0 p-4 rounded-xl overflow-auto">
					{children}
				</div>
				<div className="block md:hidden">
					<SidebarOffCanvas />
				</div>
			</div>

		</>
	);
}
