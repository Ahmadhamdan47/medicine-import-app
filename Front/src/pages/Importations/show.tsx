import { Stack, Typography } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
  DateField,
  MarkdownField,
  NumberField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export const RFIShow = () => {
  const { queryResult } = useShow({
    meta: {
      select: "rfiid, drugid, quantity, offertype, notes, status",
    },
  });

  const { data: record, isLoading } = queryResult;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"RFI ID"}
        </Typography>
        <NumberField value={record?.rfiid ?? ""} />

        <Typography variant="body1" fontWeight="bold">
          {"Drug ID"}
        </Typography>
        <NumberField value={record?.drugid ?? ""} />

        <Typography variant="body1" fontWeight="bold">
          {"Quantity"}
        </Typography>
        <NumberField value={record?.quantity ?? ""} />

        <Typography variant="body1" fontWeight="bold">
          {"Offer Type"}
        </Typography>
        <TextField value={record?.offertype} />

        <Typography variant="body1" fontWeight="bold">
          {"Notes"}
        </Typography>
        <MarkdownField value={record?.notes} />

        <Typography variant="body1" fontWeight="bold">
          {"Status"}
        </Typography>
        <TextField value={record?.status} />

        {/* <Typography variant="body1" fontWeight="bold">
          {"Created At"}
        </Typography>
        <DateField value={record?.created_at} /> */}
      </Stack>
    </Show>
  );
};
