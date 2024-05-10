import axios from "axios";

// Set the base URL for your API
axios.defaults.baseURL = "http://1.1.1.250:9000";

// Add the orders endpoint
axios.defaults.ordersEndpoint = "/api/orders";

// Perform a GET request to the users endpoint
axios
  .get("/api/users")
  .then((response) => {
    // console.log("Users:", response.data);
  })
  .catch((error) => {
    // console.error("Error:", error);
  });

// Perform a GET request to the orders endpoint
axios
  .get("/api/orders")
  .then((response) => {
    // console.log("Orders:", response.data);
  })
  .catch((error) => {
    // console.error("Error:", error);
  });

export default axios;
