import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../../utility";
import { useState } from "react";

const supabase = supabaseClient;
// Function to generate unique 4-digit serial numbers
const generateSerialNumber = (() => {
  let counter = 0; // Initialize counter

  return () => {
    counter++; // Increment counter
    return counter.toString().padStart(4, "0"); // Return counter as padded string
  };
})();

// Function to fetch drug IDs and names
export async function fetchDrugIDs() {
  
  try {
    const { data, error } = await supabase
      .from("drug")
      .select("drugid, drugname");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching drug IDs:", error.message);
    throw new Error("Failed to fetch drug IDs");
  }
}

export const fetchRFIs = async () => {
  const [rfiData, setRfiData] = useState([]);
  const [drugOptions, setDrugOptions] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  try {
    const { data, error } = await supabase.from("rfi").select("*");
    if (error) {
      throw error;
    }
    console.log("Fetched RFIs:", data); // Log fetched data

    // Map the data to include a unique id property
    const rfisWithId = data.map((rfi, index) => ({
      id: rfi.rfiid, // Assuming rfiid is the unique identifier
      ...rfi,
    }));
    setRfiData(rfisWithId);
    setDataFetched(true); // Set dataFetched to true after successful fetch
  } catch (error) {
    console.error("Error fetching RFIs:", error.message);
  }
};

// CREATE hook (post new order to API)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      try {
        const { error } = await supabase.from("rfi").insert([
          {
            drugid: data.drugid || null,
            quantity: data.quantity,
            offertype: data.offertype,
            notes: data.notes,
            status: data.status || "pending",
          },
        ]);
        if (error) {
          throw error;
        }
        // Fetch updated RFIs after creation
        fetchRFIs();
      } catch (error) {
        console.error("Error creating RFI:", error.message);
        throw new Error("Failed to create RFI");
      }
    },
    onMutate: (newOrderInfo) => {
      // Optimistic update: Add new RFI to cache with a temporary ID
      const temporaryId = generateSerialNumber(); // Use generated serial number
      queryClient.setQueryData(["rfi"], (prevRFIs) => {
        // Ensure prevRFIs is initialized as an array
        const RFIs = Array.isArray(prevRFIs) ? prevRFIs : [];
        return [
          ...RFIs,
          { ...newOrderInfo, id: temporaryId, status: "pending" },
        ];
      });
    },
  });
}

// DELETE hook (delete order in API)
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId) => {
      try {
        // Send API request to delete order
        const { error } = await supabase.from("rfi").delete().eq("id", orderId);
        if (error) throw error;
        return orderId;
      } catch (error) {
        console.error("Error deleting order:", error);
        throw new Error("Failed to delete order");
      }
    },
    onMutate: (orderId) => {
      // Optimistic update: Remove order from cache
      queryClient.setQueryData(["rfi"], (prevOrders) => {
        // Ensure prevOrders is initialized as an array
        const orders = Array.isArray(prevOrders) ? prevOrders : [];
        return orders.filter((order) => order.id !== orderId);
      });
    },
  });
}

// UPDATE hook (update order in API)
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedOrder) => {
      try {
        if (!updatedOrder.id) {
          throw new Error("Order ID is missing");
        }
        // Ensure status field is always submitted
        const { data, error } = await supabase
          .from("rfi")
          .update([
            { ...updatedOrder, status: updatedOrder.status || "pending" },
          ]);
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error updating order:", error);
        throw new Error("Failed to update order");
      }
    },
    onMutate: (updatedOrder) => {
      // Optimistic update: Update order in cache
      if (updatedOrder.id) {
        queryClient.setQueryData(["rfi"], (prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      }
    },
  });
}

// READ hook (get orders from API)
export function useGetOrders() {
  return useQuery({
    queryKey: ["rfi"],
    queryFn: async () => {
      try {
        // Send API request to fetch orders
        const { data, error } = await supabase.from("rfi").select();
        if (error) throw error;

        // Modify response data to include default values for Order ID and Status
        const ordersWithDefaults = data.map((order) => ({
          ...order,
          orderId: order.orderId || generateSerialNumber(), // Include default Order ID if not provided
          status: order.status || "pending", // Include default status if not provided
        }));

        return ordersWithDefaults;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
      }
    },
    refetchOnWindowFocus: false,
  });
}

// Function to handle status change
export function handleStatusChange(updatedOrder, setStatus, status) {
  return async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    try {
      // Send API request to update status
      const { error } = await supabase
        .from("rfi")
        .update([{ ...updatedOrder, status: newStatus }]);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(status); // Revert status if update fails
    }
  };
}
