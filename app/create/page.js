"use client";
import { useState } from "react";
import CreateData from "@/components/CreateData";
import UploadData from "@/components/UploadData";
import { Button } from "@/components/ui/button";

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 ${activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Create New Data
        </Button>
        <Button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 ${activeTab === "upload" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Upload Data
        </Button>
      </div>

      {activeTab === "create" ? <CreateData /> : <UploadData />}
    </div>
  );
}
