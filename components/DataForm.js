// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2, Save } from "lucide-react";

// export default function DataTable({ data, fetchData }) {
//   const [editingRow, setEditingRow] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [filters, setFilters] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const handleEdit = (index, record) => {
//     setEditingRow(index);
//     setEditedData({ ...record.data });
//   };

//   const handleSave = async (id) => {
//     try {
//       await fetch(`/api/data`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id, updatedData: editedData }),
//       });
//       setEditingRow(null);
//       fetchData();
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`/api/data`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting data:", error);
//     }
//   };

//   const handleChange = (key, value) => {
//     setEditedData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const filteredData = data.filter((record) => {
//     return Object.keys(filters).every((key) => {
//       if (!filters[key]) return true;
//       const value = record.data[key];
//       return value?.toString().toLowerCase().includes(filters[key].toLowerCase());
//     });
//   });

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   return (
//     <div className="overflow-auto max-h-[70vh] max-w-full">
//       <div className="flex justify-between items-center mb-2">
//         <label className="text-sm font-medium">
//           Rows per page:
//           <select
//             className="ml-2 border rounded p-1"
//             value={rowsPerPage}
//             onChange={(e) => setRowsPerPage(Number(e.target.value))}
//           >
//             {[5, 10, 20, 50].map((count) => (
//               <option key={count} value={count}>
//                 {count}
//               </option>
//             ))}
//           </select>
//         </label>
//         <div>
//           Page {currentPage} of {totalPages}
//         </div>
//       </div>

//       <table className="w-full border-collapse text-sm">
//         <thead>
//           <tr>
//             {["Index", "Author", "Date", "Material", "Mold", "Additional_Info", "Files", "Actions"].map((header) => (
//               <th key={header} className="p-2 border">
//                 {header}
//                 {header !== "Index" && header !== "Actions" && (
//                   <input
//                     type="text"
//                     placeholder={`Filter ${header}`}
//                     className="mt-1 w-full border rounded p-1 text-xs"
//                     value={filters[header] || ""}
//                     onChange={(e) => handleFilterChange(header, e.target.value)}
//                   />
//                 )}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((record, index) => (
//             <tr key={record.id} className="border-b">
//               <td className="p-2 border">{index + 1 + (currentPage - 1) * rowsPerPage}</td>
//               {["Author", "Date", "Material", "Mold", "Additional_Info", "Files"].map((key) => (
//                 <td key={key} className="p-2 border">
//                   {editingRow === index ? (
//                     key === "Files" ? (
//                       <ul>
//                         {Array.isArray(editedData.Files) &&
//                           editedData.Files.map((file, fileIndex) => (
//                             <li key={fileIndex}>
//                               <a
//                                 href={`/uploads/${file.path?.split("/uploads/")[1] || ""}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 hover:underline"
//                               >
//                                 {file.name || "Unnamed File"}
//                               </a>
//                             </li>
//                           ))}
//                       </ul>
//                     ) : (
//                       <input
//                         type="text"
//                         value={editedData[key] || ""}
//                         onChange={(e) => handleChange(key, e.target.value)}
//                         className="w-full border p-1 rounded"
//                       />
//                     )
//                   ) : key === "Files" ? (
//                     <ul>
//                       {Array.isArray(record.data.Files) && record.data.Files.length > 0 ? (
//                         record.data.Files.map((file, fileIndex) => (
//                           <li key={fileIndex}>
//                             <a
//                               href={`/uploads/${file.path?.split("/uploads/")[1] || ""}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:underline"
//                             >
//                               {file.name || "Unnamed File"}
//                             </a>
//                           </li>
//                         ))
//                       ) : (
//                         <span className="text-gray-500">No Files</span>
//                       )}
//                     </ul>
//                   ) : (
//                     <span>{String(record.data[key] || "")}</span>
//                   )}
//                 </td>
//               ))}
//               <td className="p-2 border">
//                 {editingRow === index ? (
//                   <Button onClick={() => handleSave(record.id)} className="bg-blue-500 text-white p-1 rounded">
//                     <Save className="w-4 h-4" />
//                     Save
//                   </Button>
//                 ) : (
//                   <Button onClick={() => handleEdit(index, record)} className="bg-yellow-500 text-white p-1 rounded">
//                     <Edit className="w-4 h-4" />
//                   </Button>
//                 )}
//                 <Button
//                   onClick={() => handleDelete(record.id)}
//                   className="bg-red-500 text-white p-1 rounded ml-2"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-2 flex justify-between">
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage <= 1}
//           className={`px-4 py-2 rounded ${currentPage <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
//         >
//           Previous
//         </Button>
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage >= totalPages}
//           className={`px-4 py-2 rounded ${currentPage >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
