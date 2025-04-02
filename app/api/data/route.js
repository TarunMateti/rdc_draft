import { NextResponse } from "next/server";
import db from "@/lib/database";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { columns } from "@/components/DataTable/columns";

/****************** GET: Fetch Data ******************/

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const search = searchParams.get("search") || "";

  let query = "SELECT * FROM records";
  let params = [];
  let conditions = [];
  let lastOperator = null;

  if (search) {
    const parts = search.split(/\s+/); // Split query by spaces
    console.log("search:", search);

    parts.forEach((part) => {
      if (part === "AND" || part === "OR" || part === "NOT") {
        lastOperator = part;
      } else {
        const fieldMatch = part.match(/([a-zA-Z]+)\[(.*?)\]/);

        if (fieldMatch) {
          const fieldName = fieldMatch[2]; // Extract field (e.g., "Date", "Name")
          const fieldValue = fieldMatch[1]; // Extract value (e.g., "John")

          const isNotCondition = lastOperator === "NOT";
          const condition = isNotCondition
            ? `NOT (json_extract(data, '$.${fieldName}') LIKE ?)`
            : `json_extract(data, '$.${fieldName}') LIKE ?`;

          conditions.push(condition);
          params.push(`%${fieldValue}%`);

          if (lastOperator && lastOperator !== "NOT") {
            conditions.splice(conditions.length - 1, 0, lastOperator);
          }

          lastOperator = null;
        } else {
          // Generic search across all fields
          const isNotCondition = lastOperator === "NOT";
          const condition = isNotCondition
            ? `NOT (data LIKE ?)`
            : `data LIKE ?`;

          conditions.push(condition);
          params.push(`%${part}%`);

          if (lastOperator && lastOperator !== "NOT") {
            conditions.splice(conditions.length - 1, 0, lastOperator);
          }

          lastOperator = null;
        }
      }
    });

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" ");
    }
  }

  console.log("Constructed Query:", query);
  console.log("Query Params:", params);

  try {
    const records = db.prepare(query).all(...params);

    return Response.json(
      records.map((record) => ({
        id: record.id,
        data: record.data ? JSON.parse(record.data) : {},
      }))
    );
  } catch (error) {
    console.error("SQL Error:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}


/****************** POST: Insert New Data ******************/

// Function to validate and structure incoming data
function validateData(dataArray) {
  return dataArray.map((row) => {
    let validatedRow = {};

    columns.forEach((col) => {
      validatedRow[col] = row[col] || ""; // Ensure all required columns exist
    });

    return validatedRow;
  });
}

const uploadDir = path.join(process.cwd(), "/public/uploads");
await fs.mkdir(uploadDir, { recursive: true });

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file uploads separately
      const formData = await req.formData();
      const jsonData = JSON.parse(formData.get("data"));
      const files = [];

      for (const [key, value] of formData.entries()) {
        if (key.startsWith("file_") && value instanceof File) {
          const uniqueName = `${uuidv4()}_${value.name}`;
          const filePath = path.join(uploadDir, uniqueName);

          const buffer = await value.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(buffer));

          files.push({
            name: value.name,
            type: value.type,
            size: value.size,
            path: filePath,
          });
        }
      }

      jsonData.Files = files;
      const structuredData = validateData([jsonData]); // Ensure structure

      const stmt = db.prepare("INSERT INTO records (data) VALUES (?)");
      stmt.run(JSON.stringify(structuredData[0]));

      return NextResponse.json({ message: "Data inserted successfully" }, { status: 201 });
    }

    // Handle JSON bulk upload (from Excel)
    const data = await req.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const structuredData = validateData(data);

    const stmt = db.prepare("INSERT INTO records (data) VALUES (?)");
    const insertMany = db.transaction((rows) => {
      for (const row of rows) stmt.run(JSON.stringify(row));
    });

    insertMany(structuredData);

    return NextResponse.json({ message: "Data uploaded successfully" }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


/****************** DELETE: Remove Data By ID ******************/
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid ID");
    }

    const stmt = db.prepare("DELETE FROM records WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "No record found with the specified ID" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/****************** PUT: Update Data By ID ******************/
export async function PUT(req) {
  try {
    const { id, updatedData } = await req.json();
    const jsonData = JSON.stringify(updatedData);

    const stmt = db.prepare("UPDATE records SET data = ? WHERE id = ?");
    stmt.run(jsonData, id);

    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
