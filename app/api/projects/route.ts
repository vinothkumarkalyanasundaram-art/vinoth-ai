import { data } from "@/app/lib/projects/projects";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }
}