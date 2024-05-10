import React, { createContext, useEffect, useReducer } from 'react';
import { useAutocomplete } from '@mui/material';
import { useForm } from 'react-hook-form';
import { supabaseClient } from '../utility';

// Create a new context
export const RFIContext = createContext();

const initialState = {
    rfiData: [],
    drugOptions: [],
    dataFetched: false,
};

const actionTypes = {
    SET_RFI_DATA: 'SET_RFI_DATA',
    SET_DRUG_OPTIONS: 'SET_DRUG_OPTIONS',
    SET_DATA_FETCHED: 'SET_DATA_FETCHED',
};

const reducer = (state: any, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case actionTypes.SET_RFI_DATA:
            return { ...state, rfiData: action.payload };
        case actionTypes.SET_DRUG_OPTIONS:
            return { ...state, drugOptions: action.payload };
        case actionTypes.SET_DATA_FETCHED:
            return { ...state, dataFetched: action.payload };
        default:
            return state;
    }
};

const supabase = supabaseClient;

// Create a provider component
export const RFIProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { rfiData, drugOptions, dataFetched } = state;
    const { autocompleteProps: drugAutocompleteProps } = useAutocomplete({
        resource: 'drug',
    });
    const { register, control, formState } = useForm({});
    const { errors } = formState;

    useEffect(() => {
        const fetchDrugIDs = async () => {
            try {
                const { data, error } = await supabase.from('drug').select('drugid, drugname');
                if (error) {
                    throw error;
                }
                dispatch({ type: actionTypes.SET_DRUG_OPTIONS, payload: data });
            } catch (error) {
                console.error('Error fetching drug IDs:', error.message);
            }
        };

        const fetchRFIs = async () => {
            try {
                const { data, error } = await supabase.from("rfi").select("*");
                if (error) {
                    throw error;
                }
                console.log("Fetched RFIs:", data); // Log fetched data

                // Map the data to include a unique id property
                const rfisWithId = data.map((rfi, index) => ({
                    id: rfi.id, // Assuming id is the unique identifier
                    ...rfi,
                }));
                dispatch({ type: actionTypes.SET_RFI_DATA, payload: rfisWithId });
                dispatch({ type: actionTypes.SET_DATA_FETCHED, payload: true });
            } catch (error) {
                console.error("Error fetching RFIs:", error.message);
            }
        };

        fetchDrugIDs();
        if (!dataFetched) { // Fetch only if data has not been fetched yet
            fetchRFIs();
        }
    }, [dataFetched]);

    const createRFI = async (data: { drugid: any; quantity: any; offertype: any; notes: any; status: any; }) => {
        try {
            const { error } = await supabase.from("rfi").insert([
                {
                    drugid: data.drugid || null,
                    quantity: data.quantity,
                    offertype: data.offertype,
                    notes: data.notes,
                    status: data.status
                }
            ]);
            if (error) {
                throw error;
            }
            // Fetch updated RFIs after creation
            fetchRFIs();
        } catch (error) {
            console.error("Error creating RFI:", error.message);
        }
    };

    const handleEdit = async (id: any) => {
        try {
            // Fetch the RFI with the given id
            const { data: rfi, error } = await supabase.from("rfi").select("*").eq("id", id).single();
            if (error) {
                throw error;
            }

            // Open a modal or navigate to a new page with the edit form populated with the RFI data
            console.log("Edit RFI:", rfi);
        } catch (error) {
            console.error("Error editing RFI:", error.message);
        }
    };

    const handleShow = async (id: any) => {
        try {
            // Fetch the RFI with the given id
            const { data: rfi, error } = await supabase.from("rfi").select("*").eq("id", id).single();
            if (error) {
                throw error;
            }

            // Display the RFI details, either in a modal or a new page
            console.log("Show RFI:", rfi);
        } catch (error) {
            console.error("Error showing RFI:", error.message);
        }
    };

    const handleDelete = async (id: any) => {
        try {
            // Delete the RFI with the given id
            const { error } = await supabase.from("rfi").delete().eq("id", id);
            if (error) {
                throw error;
            }

            // Update the UI to remove the deleted RFI
            dispatch({ type: actionTypes.SET_RFI_DATA, payload: rfiData.filter((rfi: { id: any; }) => rfi.id !== id) });
            console.log("RFI deleted successfully:", id);
        } catch (error) {
            console.error("Error deleting RFI:", error.message);
        }
    };

    const contextValue = {
        rfiData,
        drugOptions,
        register,
        control,
        errors,
        drugAutocompleteProps,
        createRFI,
        handleEdit,
        handleShow,
        handleDelete
    };

    return <RFIContext.Provider value={contextValue}>{children}</RFIContext.Provider>;
};
