// RouterStore.ts
import { types, Instance } from "mobx-state-tree";

const RouterModel = types
	.model({
		pathname: "/",
	})
	.actions((self) => ({
		updatePathname(newPathname: string) {
			self.pathname = newPathname;
		},
	}));

export const routerStore = RouterModel.create({});

export type RouterInstance = Instance<typeof RouterModel>;
export { RouterModel }; // Exporting RouterModel
