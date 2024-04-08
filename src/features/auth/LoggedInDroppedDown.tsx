"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PropsWithChildren } from "react";
import { signOutAction } from "./auth.action";
import { LogOut } from "lucide-react";

export type LoggedInDroppedDownProps = PropsWithChildren;

export const LoggedInDroppedDown = (props: LoggedInDroppedDownProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => {
						signOutAction();
					}}
				>
					<LogOut size={16} className="mr-2" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
