"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable/DataTable";
import SuccessAlert from "@/components/alerts/SuccessAlert";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import SearchComponent from "@/components/SearchComponent";
import { Card } from "@/components/ui/card";
import { RefreshCcw, Database } from "lucide-react";

export default function ViewData() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);

  const fetchData = async (searchTerm = "") => {
    setAlert(null);
    try {
      const res = await fetch(`/api/data?search=${searchTerm}`);
      const result = await res.json();
      setData(result);
      setAlert(<SuccessAlert message="Data fetched successfully!" />);
    } catch (error) {
      setAlert(<ErrorAlert message="Failed to fetch data." />);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <Card className="p-6 shadow-md bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-7 h-7 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Stored Data Records
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Below is a list of all stored data entries. You can search or refresh the data.
        </p>

        {alert}

        {/* Search Component */}
        <SearchComponent onSearch={(query) => fetchData(query)} />

        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Records</h2>
          <Button
            onClick={() => fetchData()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh Data
          </Button>
        </div>

        <div className="overflow-auto" style={{ maxHeight: "80vh" }}>
          <DataTable data={data} fetchData={fetchData} />
        </div>
      </Card>
    </div>
  );
}
