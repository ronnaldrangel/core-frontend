import { NextRequest, NextResponse } from "next/server";
import { getShalomAgencies } from "@/lib/shalom-actions";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const { data, error } = await getShalomAgencies(query);

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
}
