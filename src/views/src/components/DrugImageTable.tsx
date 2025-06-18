// src/components/DrugImageTable.tsx
import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import axios from "axios";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { Button } from "@mantine/core";

interface DrugRow {
  DrugID: number;
  DrugName: string;
  Manufacturer: string;
  Dosage: string;
  Presentation: string;
  DrugNameWithDosage: string;
  ImagePath: string;             // CSV string or the literal "No Image"
}

const DrugImageTable: React.FC = () => {
  const [tableData, setTableData] = useState<DrugRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------------- 1. initial fetch -------------------------- */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/drugs/all");
        const formatted: DrugRow[] = data.drugs.map((d: any) => ({
          DrugID: d.DrugID,
          DrugName: d.DrugName || "N/A",
          Manufacturer: d.Manufacturer || "N/A",
          Dosage: d.Dosage || "",
          Presentation: d.Presentation || "",          DrugNameWithDosage:
            `${d.DrugName || "N/A"}${d.Dosage ? ` - ${d.Dosage}` : ""}${d.Presentation ? ` - ${d.Presentation}` : ""}`,
          ImagePath: d.ImagesPath || "No Image",
        }));
        setTableData(formatted);
      } catch (err) {
        console.error("Error fetching drugs:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* -------------------- 2. helpers for image handling ------------------- */
  /** Upload a single file -> returns the path given by the API */
  const uploadOne = async (drugID: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post(
      `/drugs/upload/${drugID}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.imagePath as string;          // e.g. “17497-front.png”
  };

  /** Generic CSV join/clean utilities */
  const splitCSV = (csv: string) =>
    csv === "No Image" || !csv.trim() ? [] : csv.split(",").map(s => s.trim());
  const joinCSV  = (arr: string[]) => arr.length ? arr.join(",") : "No Image";

  /* ---------------------- 3. multi-file upload flow --------------------- */
const handleFileInputChange = async (
  e: ChangeEvent<HTMLInputElement>,
  drugID: number,
) => {
  const files = Array.from(e.target.files ?? []);
  if (!files.length) return;

  try {
    const newPaths: string[] = [];

    for (const file of files) {
      const path = await uploadOne(drugID, file); // Wait sequentially
      newPaths.push(path);
    }

    setTableData(prev => {
      const next = prev.map(row => {
        if (row.DrugID !== drugID) return row;

        const combined = [...splitCSV(row.ImagePath), ...newPaths];
        const updatedCSV = joinCSV(combined);

        // persist **once** for the whole batch
        axios
          .put(`/drugs/${drugID}/images`, { ImagesPath: updatedCSV })
          .catch(console.error);

        return { ...row, ImagePath: updatedCSV };
      });
      return next;
    });
  } catch (err) {
    console.error("Error uploading images:", err);
  } finally {
    e.target.value = ""; // Reset file input
  }
};


  /* ------------------------- 4. delete image ---------------------------- */
  const handleDeleteImage = (drugID: number, img: string) => {
    setTableData(prev => prev.map(row => {
      if (row.DrugID !== drugID) return row;

      const updatedCSV = joinCSV(splitCSV(row.ImagePath)
                                 .filter(p => p !== img));

      axios
        .put(`/drugs/${drugID}/images`, { ImagesPath: updatedCSV })
        .catch(console.error);

      return { ...row, ImagePath: updatedCSV };
    }));
  };

  /* --------------------------- 5. columns ------------------------------- */
  const columns = useMemo<MRT_ColumnDef<DrugRow>[]>(() => [    {
      accessorKey: "DrugNameWithDosage",
      header: "Drug Name + Dosage + Presentation",
      size: 280,
    },
    {
      accessorKey: "Manufacturer",
      header: "Manufacturer",
      size: 180,
    },
    {
      accessorKey: "ImagePath",
      header: "Image Path",
      size: 320,
      Cell: ({ cell, row }) => {
        const paths = splitCSV(cell.getValue<string>());
        const drugID = row.original.DrugID;

        return paths.length
          ? (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {paths.map(p => (
                <li key={p} style={{ display: "flex", alignItems: "center" }}>
                  <a href={`/img/${p}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                    {p}
                  </a>
                  <Button
                    size="xs"
                    color="red"
                    variant="outline"
                    onClick={() => handleDeleteImage(drugID, p)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )
          : <span>No Image</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 180,
      Cell: ({ row }) => {
        const drugID = row.original.DrugID;
        return (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              id={`upload-${drugID}`}
              style={{ display: "none" }}
              onChange={(e) => handleFileInputChange(e, drugID)}
            />
            <label htmlFor={`upload-${drugID}`}>
              <Button component="span" color="blue">
                Upload&nbsp;Image(s)
              </Button>
            </label>
          </>
        );
      },
    },
  ], []);

  /* --------------------------- 6. table ------------------------------- */
  const table = useMantineReactTable({
    columns,
    data: tableData,
    state: { isLoading },
    enableColumnResizing: true,
    enableStickyHeader: true,
    enablePagination: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginBottom: 10 }}>Drug Image Table</h2>
      <div style={{ flex: 1 }}>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default DrugImageTable;
