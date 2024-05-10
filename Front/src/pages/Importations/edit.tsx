// import { Autocomplete, Box, MenuItem, Select, TextField } from "@mui/material";
// import { Edit, useAutocomplete } from "@refinedev/mui";
// import { useForm } from "@refinedev/react-hook-form";
// import { Controller } from "react-hook-form";

// interface RFIEditProps {
//   initialValues?: any; 
// }

// export const RFIEdit: React.FC<RFIEditProps> = ({ initialValues }) => {
//   console.log("Initial Values:", initialValues);
//   const {
//     saveButtonProps,
//     refineCore: { formLoading },
//     register,
//     control,
//     formState: { errors },
//   } = useForm({ defaultValues: initialValues || {} }); 

//   console.log("Default Values:", initialValues);


//   const { autocompleteProps: drugAutocompleteProps } = useAutocomplete({
//     resource: "drug",
//   });

//   return (
//     <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
//       <Box
//         component="form"
//         sx={{ display: "flex", flexDirection: "column" }}
//         autoComplete="off"
//       >
//         <Controller
//           name="drugid"
//           control={control}
//           render={({ field }) => (
//             <Autocomplete
//               {...field}
//               {...drugAutocompleteProps}
//               getOptionLabel={(option) => option.drugname || ""}
//               isOptionEqualToValue={(option, value) => option.drugid === value?.drugid}
//               onChange={(event, value) => {
//                 field.onChange(value ? value.drugid : null);
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Drug Name"
//                   margin="normal"
//                   variant="outlined"
//                   error={!!errors.drugid}
//                   helperText={errors.drugid?.message}
//                   required
//                 />
//               )}
//             />
//           )}
//         />

//         <TextField
//           {...register("quantity", {
//             required: "This field is required",
//           })}
//           error={!!errors.quantity}
//           helperText={errors.quantity?.message}
//           margin="normal"
//           fullWidth
//           InputLabelProps={{ shrink: true }}
//           multiline
//           type="number"
//           label={"Quantity"}
//           name="quantity"
//         />
//         <TextField
//           {...register("offertype", {
//             required: "This field is required",
//           })}
//           error={!!errors.offertype}
//           helperText={errors.offertype?.message}
//           margin="normal"
//           fullWidth
//           InputLabelProps={{ shrink: true }}
//           multiline
//           type="text"
//           label={"Offer Type"}
//           name="offertype"
//         />
//         <TextField
//           {...register("notes", {
//             required: "This field is required",
//           })}
//           error={!!errors.notes}
//           helperText={errors.notes?.message}
//           margin="normal"
//           fullWidth
//           InputLabelProps={{ shrink: true }}
//           multiline
//           type="text"
//           label={"Notes"}
//           name="notes"
//         />

//         <Controller
//           name="status"
//           control={control}
//           render={({ field }) => (
//             <Select
//               {...field}
//               value={field.value || "reviewing"}
//               label={"Status"}
//             >
//               <MenuItem value="reviewing">Reviewing</MenuItem>
//               <MenuItem value="accepted">Accepted</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           )}
//         />
//       </Box>
//     </Edit>
//   );
// };

// ///////////////////////////////////////////////////////////////



// import React, { useState } from "react";
// import { Autocomplete, Box, MenuItem, Select, TextField, Modal, Button } from "@mui/material";
// import { Edit, useAutocomplete } from "@refinedev/mui";
// import { useForm } from "@refinedev/react-hook-form";
// import { Controller } from "react-hook-form";

// interface RFIEditProps {
//   initialValues?: any; 
// }

// export const RFIEdit: React.FC<RFIEditProps> = ({ initialValues }) => {
//   console.log("Initial Values:", initialValues);
//   const {
//     saveButtonProps,
//     refineCore: { formLoading },
//     register,
//     control,
//     formState: { errors },
//   } = useForm({ defaultValues: initialValues || {} }); 
  
//   console.log("Default Values:", initialValues);

//   const [isEditing, setIsEditing] = useState(false);

//   const handleOpenModal = () => {
//     setIsEditing(true);
//   };

//   const handleCloseModal = () => {
//     setIsEditing(false);
//   };

//   const { autocompleteProps: drugAutocompleteProps } = useAutocomplete({
//     resource: "drug",
//   });

//   return (
//     <>
//       <Button onClick={handleOpenModal}>Edit</Button>
//       <Modal
//         open={isEditing}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
//           <Box
//             component="form"
//             sx={{ display: "flex", flexDirection: "column" }}
//             autoComplete="off"
//           >
//             <Controller
//               name="drugid"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   {...field}
//                   {...drugAutocompleteProps}
//                   getOptionLabel={(option) => option.drugname || ""}
//                   isOptionEqualToValue={(option, value) => option.drugid === value?.drugid}
//                   onChange={(event, value) => {
//                     field.onChange(value ? value.drugid : null);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Drug Name"
//                       margin="normal"
//                       variant="outlined"
//                       error={!!errors.drugid}
//                       helperText={errors.drugid?.message}
//                       required
//                     />
//                   )}
//                 />
//               )}
//             />

//             <TextField
//               {...register("quantity", {
//                 required: "This field is required",
//               })}
//               error={!!errors.quantity}
//               helperText={errors.quantity?.message}
//               margin="normal"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               multiline
//               type="number"
//               label={"Quantity"}
//               name="quantity"
//             />
//             <TextField
//               {...register("offertype", {
//                 required: "This field is required",
//               })}
//               error={!!errors.offertype}
//               helperText={errors.offertype?.message}
//               margin="normal"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               multiline
//               type="text"
//               label={"Offer Type"}
//               name="offertype"
//             />
//             <TextField
//               {...register("notes", {
//                 required: "This field is required",
//               })}
//               error={!!errors.notes}
//               helperText={errors.notes?.message}
//               margin="normal"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               multiline
//               type="text"
//               label={"Notes"}
//               name="notes"
//             />

//             <Controller
//               name="status"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   value={field.value || "reviewing"}
//                   label={"Status"}
//                 >
//                   <MenuItem value="reviewing">Reviewing</MenuItem>
//                   <MenuItem value="accepted">Accepted</MenuItem>
//                   <MenuItem value="rejected">Rejected</MenuItem>
//                 </Select>
//               )}
//             />
//           </Box>
//         </Edit>
//       </Modal>
//     </>
//   );
// };


// -----------------------------------------------

import React from "react";
import { Autocomplete, Box, MenuItem, Select, TextField, Modal, Button } from "@mui/material";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm, Controller as FormController, useModalForm } from "@refinedev/react-hook-form"; // Import useModalForm hook
import { Controller } from "react-hook-form";

interface RFIEditProps {
  initialValues?: any; 
}

export const RFIEdit: React.FC<RFIEditProps> = ({ initialValues }) => {
  console.log("Initial Values:", initialValues);
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({ defaultValues: initialValues || {} }); 
  
  console.log("Default Values:", initialValues);

  const { isOpen, openModal, closeModal } = useModalForm(); // Use useModalForm hook to control modal state

  const { autocompleteProps: drugAutocompleteProps } = useAutocomplete({
    resource: "drug",
  });

  return (
    <>
      <Button onClick={openModal}>Edit</Button> 
      <Modal
        open={isOpen} 
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <Controller
              name="drugid"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  {...drugAutocompleteProps}
                  getOptionLabel={(option) => option.drugname || ""}
                  isOptionEqualToValue={(option, value) => option.drugid === value?.drugid}
                  onChange={(event, value) => {
                    field.onChange(value ? value.drugid : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Drug Name"
                      margin="normal"
                      variant="outlined"
                      error={!!errors.drugid}
                      helperText={errors.drugid?.message}
                      required
                    />
                  )}
                />
              )}
            />

            <TextField
              {...register("quantity", {
                required: "This field is required",
              })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              multiline
              type="number"
              label={"Quantity"}
              name="quantity"
            />
            <TextField
              {...register("offertype", {
                required: "This field is required",
              })}
              error={!!errors.offertype}
              helperText={errors.offertype?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              multiline
              type="text"
              label={"Offer Type"}
              name="offertype"
            />
            <TextField
              {...register("notes", {
                required: "This field is required",
              })}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              multiline
              type="text"
              label={"Notes"}
              name="notes"
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || "reviewing"}
                  label={"Status"}
                >
                  <MenuItem value="reviewing">Reviewing</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              )}
            />
          </Box>
        </Edit>
      </Modal>
    </>
  );
};
