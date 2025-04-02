"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SuccessAlert from "@/components/alerts/SuccessAlert";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import { Card } from "@/components/ui/card";
import { FilePlus, Trash2 } from "lucide-react";
import { columns } from "@/components/DataTable/columns";

export default function CreateData() {
  // Exclude "Files" from selectable fields
  const selectableFields = columns.filter((field) => field !== "Files");

  const [fields, setFields] = useState(selectableFields);
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [fieldValue, setFieldValue] = useState("");
  const [dataRows, setDataRows] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [alert, setAlert] = useState(null);

  const handleAddField = () => {
    if (selectedField && fieldValue) {
      setDataRows((prev) => ({
        ...prev,
        [selectedField]: fieldValue,
      }));
      setFieldValue("");
    }
  };
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);  

  const handleEditField = (key, value) => {
    setDataRows((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDeleteFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(dataRows));
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const res = await fetch("/api/data", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setAlert(<SuccessAlert message="Data saved successfully!" />);
        setDataRows({});
        setUploadedFiles([]);
      } else {
        setAlert(<ErrorAlert message="Failed to save data." />);
      }
    } catch (error) {
      console.error("Save Error:", error);
      setAlert(<ErrorAlert message="An error occurred while saving data." />);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <Card className="p-6 shadow-md bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <FilePlus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Data Entry
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add key-value pairs and click "Create" to save the data.
        </p>

        {alert}

        <div className="flex gap-2 mb-4">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            placeholder="Enter value"
            className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 flex-1"
          />
          <Button onClick={handleAddField} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
            Add
          </Button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Data Rows:</h3>
          <table className="w-full mt-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
            <tbody>
              {Object.keys(dataRows).map((key) => (
                <tr key={key} className="border-b dark:border-gray-700">
                  <td className="p-2 font-semibold">{key}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={dataRows[key]}
                      onChange={(e) => handleEditField(key, e.target.value)}
                      className="w-full p-1 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Upload Files:</h3>
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

          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FilePlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteFile(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Create
        </Button>
      </Card>
    </div>
  );
}
