import clsx from "clsx";
import React from "react";
import { useMst } from "../../store-models";

type Props = {
	text: string;
	active: boolean;
	children: React.ReactNode;
};

const EXPANDED_CSS =
	"flex border-r-1 rounded-r-full pl-[14px] transition duration-75 h-8 block py-1 space-y-6";
const COLLAPSED_CSS =
	"flex justify-center rounded-full pl-4 inline margin-auto h-8 w-8";

const ACTIVE_CSS = `font-semibold text-green-pri `;
const INACTIVE_CSS = "text-black-text dark:text-gray-100";

export default function SidebarItem({ text, active, children }: Props) {
	const { isCollapsed } = useMst().sidebar;

	const itemStyle = {
        // marginRight: isCollapsed ? 0 : 0,
        marginRight: isCollapsed ? 0 : 0,
        marginBottom: "1rem",
        marginTop: "1rem",
    };

	return (
        <div
            className={clsx(
                "items-center transition duration-75 cursor-pointer",
                isCollapsed ? COLLAPSED_CSS : EXPANDED_CSS,
                active ? ACTIVE_CSS : INACTIVE_CSS
            )}
            style={itemStyle}
        >
            <div className={clsx("h-5 w-5 inline", !active && "text-gray-200")}>
                {children}
            </div>
            {!isCollapsed && <span className="ml-6">{text}</span>}
        </div>
    );
}