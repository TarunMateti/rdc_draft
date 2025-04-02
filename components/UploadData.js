"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SuccessAlert from "@/components/alerts/SuccessAlert";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import { FilePlus, Trash2 } from "lucide-react";

export default function UploadData() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleEditCell = (rowIndex, key, value) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex][key] = value;
      return updatedData;
    });
  };

  const handleDeleteRow = (rowIndex) => {
    setData((prevData) => prevData.filter((_, index) => index !== rowIndex));
  };

  const handleUpload = async () => {
    if (data.length === 0) return setAlert(<ErrorAlert message="No data to upload!" />);
    
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setAlert(<SuccessAlert message="Data uploaded successfully!" />);
        setData([]);
      } else {
        setAlert(<ErrorAlert message="Failed to upload data." />);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setAlert(<ErrorAlert message="An error occurred while uploading data." />);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <Card className="p-6 shadow-md bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <FilePlus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Upload Data from Excel
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Upload an Excel file to extract data. You can edit the data before submitting.
        </p>

        {alert}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Upload File:</h3>
          <label
            htmlFor="file-upload"
            className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <FilePlus className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">Click or drag files here</p>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

        {data.length > 0 && (
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800">
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="p-2 border">{key}</th>
                  ))}
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border dark:border-gray-700">
                    {Object.keys(row).map((key) => (
                      <td key={key} className="p-2 border">
                        <input
                          type="text"
                          value={row[key]}
                          onChange={(e) => handleEditCell(rowIndex, key, e.target.value)}
                          className="w-full p-1 border rounded-md"
                        />
                      </td>
                    ))}
                    <td className="p-2 border">
                      <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          onClick={handleUpload}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Upload Data
        </Button>
      </Card>
    </div>
  );
}
