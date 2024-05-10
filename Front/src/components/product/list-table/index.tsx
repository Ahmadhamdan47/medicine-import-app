import { useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { NumberField, UseDataGridReturnType } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { ICategory, IProduct } from "../../../interfaces";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ProductStatus } from "../status";

type Props = {
  categories: ICategory[];
} & UseDataGridReturnType<IProduct>;

export const ProductListTable = (props: Props) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();
  const t = useTranslate();

  const columns = useMemo<GridColDef<IProduct>[]>(
    () => [
      {
        field: "id",
        headerName: "ID #",
        description: "ID #",
        width: 52,
        renderCell: function render({ row }) {
          return <Typography>#{row.id}</Typography>;
        },
      },
      {
        field: "avatar",
        headerName: t("products.fields.images.label"),
        renderCell: function render({ row }) {
          return (
            <Avatar
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
              }}
              src={row.images && (row.images[0]?.thumbnailUrl || row.images[0]?.url)}
              alt={row.name}
            />
          );
        },
        width: 64,
        align: "center",
        headerAlign: "center",
        sortable: false,
      },
      {
        field: "category.title",
        headerName: t("products.fields.category"),
        minWidth: 160,
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          const category = row.category && props.categories.find(
            (category) => category.id === row.category.id,
          );

          return <Typography>{category?.title}</Typography>;
        },
      },

      {
        field: "isActive",
        headerName: t("products.fields.isActive.label"),
        minWidth: 136,
        renderCell: function render({ row }) {
          return <ProductStatus value={row.isActive} />;
        },
      },
      {
        field: "actions",
        headerName: t("table.actions"),
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: function render({ row }) {
          return (
            <IconButton
              sx={{
                color: "text.secondary",
              }}
              onClick={() => {
                return go({
                  to: `${editUrl("products", row.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          );
        },
      },
    ],
    [t, props.categories, editUrl, go, pathname],
  );

  return (
    <DataGrid
      {...props.dataGridProps}
      sx={{}}
      columns={columns}
      autoHeight
      pageSizeOptions={[12, 24, 48, 96]}
    />
  );
};
