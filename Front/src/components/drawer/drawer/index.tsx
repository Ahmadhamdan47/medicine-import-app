import BaseDrawer, { DrawerProps } from "@mui/material/Drawer";
import { PropsWithChildren } from "react";
import gray from "@mui/material/colors/grey";
import { useColorModeContext } from "../../../Contexts/contexts/";

type Props = {} & DrawerProps;

export const Drawer = ({ children, ...props }: PropsWithChildren<Props>) => {
  const { mode } = useColorModeContext();

  return (
    <BaseDrawer
      {...props}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: mode === "dark" ? gray[500] : "#000",
        },
        ...props.sx,
      }}
    >
      {children}
    </BaseDrawer>
  );
};
