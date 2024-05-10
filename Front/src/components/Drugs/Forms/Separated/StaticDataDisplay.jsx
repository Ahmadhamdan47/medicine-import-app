// import React, { useState, useEffect } from "react";
// import Axios from "../../../../api/axios";
// import StaticData from "./StaticData";
// import { v4 as uuidv4 } from "uuid";
// import { Link, useParams } from "react-router-dom";

// const CrudTable = () => {
//   const { guid } = useParams();
//   const [data, setData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (guid) {
//           console.log("Fetching data for guid:", guid);
//           const response = await Axios.get(`/api/atc/v1.0?guid=${guid}`);
//           console.log("Response data:", response.data);
//           setData(Array.isArray(response.data) ? response.data : []);
//         } else {
//           console.log("Fetching all data");
//           const response = await Axios.get("/api/atc/v1.0");
//           console.log("Response data:", response.data);
//           setData(Array.isArray(response.data) ? response.data : []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [guid]);

//   const handleEdit = (index) => {
//     setSelectedRow(data[index]);
//     console.log("Selected row data:", data[index]);
//   };

//   const handleDelete = (index) => {
//     console.log("Delete item at index:", index);
//   };

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Code</th>
//             <th>Level Name</th>
//             <th>Level Name (Arabic)</th>
//             <th>ATC Related Label</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.code}</td>
//               <td>{item.levelName}</td>
//               <td>{item.levelNameAr}</td>
//               <td>{item.atcRelatedLabel}</td>
//               <td>
//                 <Link
//                   to={`/staticdata?id=${item.guid}`}
//                   onClick={() => handleEdit(index)}
//                 >
//                   Edit
//                 </Link>
//                 <button onClick={() => handleDelete(index)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrudTable;

// /////////////////////////////////////////////



import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Axios from "../../../../api/axios";

const StaticData = () => {
  const { guid } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (guid) {
          console.log("Fetching data for guid:", guid);
          const response = await Axios.get(`/api/atc/v1.0?guid=${guid}`);
          console.log("Response data:", response.data);
          setData(Array.isArray(response.data) ? response.data : []);
        } else {
          console.log("Fetching all data");
          const response = await Axios.get("/api/atc/v1.0");
          console.log("Response data:", response.data);
          setData(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [guid]);

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ATC Table</h1>
        <Link
          to="/atc/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Back
        </Link>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Level Name</th>
            <th className="px-4 py-2">Level Name (Arabic)</th>
            <th className="px-4 py-2">ATC Related Label</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.guid}</td>
              <td className="border px-4 py-2">{item.code}</td>
              <td className="border px-4 py-2">{item.levelName}</td>
              <td className="border px-4 py-2">{item.levelNameAr}</td>
              <td className="border px-4 py-2">{item.atcRelatedLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaticData;
