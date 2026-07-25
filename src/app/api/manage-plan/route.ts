import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Manage plan route working" });
}