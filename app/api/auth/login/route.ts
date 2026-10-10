import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputPassword = (body.password || "").trim();

    const envPassword = (process.env.ADMIN_PASSWORD || "HOMEBOY_SECRET_2026").trim();

    // Verify password against environment variable
    if (inputPassword === envPassword || inputPassword.toUpperCase() === envPassword.toUpperCase()) {
      return NextResponse.json({
        success: true,
        message: "AUTHENTICATION SUCCESSFUL",
        token: `hb_auth_${Date.now()}`,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "INVALID ACCESS KEY. PLEASE VERIFY YOUR CREDENTIALS.",
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "SERVER AUTHENTICATION ERROR" },
      { status: 500 }
    );
  }
}
