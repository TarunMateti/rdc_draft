"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { columns } from "./DataTable/columns";

export default function SearchComponent({ onSearch }) {
  const [fields, setFields] = useState(columns);
  const [selectedField, setSelectedField] = useState("Name");
  const [query, setQuery] = useState("");
  const [operator, setOperator] = useState("AND");
  const [mainQuery, setMainQuery] = useState("");

  const handleAddToQuery = () => {
    if (query) {
      // Construct the query part
      const formattedQuery = `(${query}[${selectedField}])`;
  
      setMainQuery((prev) => {
        if (prev === "") {
          // If it's the first query, just add it
          return operator === "NOT" ? `NOT ${formattedQuery}` : formattedQuery;
        } else {
          // Add the operator before the next query part, handling NOT correctly
          return operator === "NOT"
            ? `${prev} ${operator} ${formattedQuery}`
            : `${prev} ${operator} ${formattedQuery}`;
        }
      });
  
      setQuery(""); // Reset the query input
    }
  };
  

  const handleSearch = () => {
    onSearch(mainQuery); // Pass the main query to parent to fetch data
  };

  const handleQueryChange = (e) => {
    setMainQuery(e.target.value); // Update the main query when editing it
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-4">
        {/* Dropdown for fields */}
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
        >
          {fields.map((field, index) => (
            <option key={index} value={field}>
              {field}
            </option>
          ))}
          <option value="All">All fields</option>
        </select>

        {/* Input for search query */}
        <Input
          className="flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query"
        />

        {/* Dropdown for SQL operators */}
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="NOT">NOT</option>
        </select>

        {/* Button to add to the main query */}
        <Button onClick={handleAddToQuery} className="bg-blue-600 text-white hover:bg-blue-700">
          Add
        </Button>
      </div>

      {/* Display the constructed query as an editable text area */}
      <div className="p-4 border rounded-md dark:bg-gray-800 dark:text-gray-200">
        <textarea
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
          rows="4"
          value={mainQuery}
          onChange={handleQueryChange} // Allow editing of the query
          placeholder="Edit your query here"
        />
      </div>

      {/* Search button */}
      <Button
        onClick={handleSearch}
        className="bg-green-600 text-white hover:bg-green-700"
      >
        <Search size={18} />
        Search
      </Button>
    </div>
  );
}
