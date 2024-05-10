import * as React from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import axios from 'axios';

type RFI = {
  id: string;
  drugID: string;
  quantity: number;
  offerType: string;
  notes: string;
  status: string;
}

const columnHelper = createColumnHelper<RFI>();

const columns = [
  columnHelper.accessor('drugID', {
    header: () => <span>Drug Name</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(row => row.quantity, {
    id: 'quantity',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Quantity</span>,
  }),
  columnHelper.accessor('offerType', {
    header: () => 'Offer Type',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('notes', {
    header: () => <span>Notes</span>,
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('status', {
    header: () => <span>Status</span>,
    cell: info => info.renderValue(),
  }),
];

function RFITable() {
  const [data, setData] = React.useState<RFI[]>([]);
  
  // Fetch RFIs
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rfis');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching RFIs:', error);
      }
    };
    fetchData();
  }, []);

  // Function to update RFI status
  const updateRFIStatus = async (rfiId: string, status: string) => {
    try {
      await axios.put(`/api/rfis/${rfiId}`, { status });
      // Update the status locally
      setData(prevData =>
        prevData.map(rfi => (rfi.id === rfiId ? { ...rfi, status } : rfi))
      );
    } catch (error) {
      console.error(`Error updating RFI status for RFI ${rfiId}:`, error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
                <div>
                  <button onClick={() => updateRFIStatus(row.original.id, 'accept')}>Accept</button>
                  <button onClick={() => updateRFIStatus(row.original.id, 'reject')}>Reject</button>
                  <button onClick={() => updateRFIStatus(row.original.id, 'correct')}>Correct</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

export default RFITable;
