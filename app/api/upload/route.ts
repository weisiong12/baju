import { NextResponse } from "next/server";
import { uploadToR2, listR2Objects, deleteFromR2 } from "@/app/lib/r2";


// GET /api/upload - List recent uploads from R2
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "products/";
    const items = await listR2Objects(prefix);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error("R2 list error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list R2 assets" },
      { status: 500 }
    );
  }
}

// POST /api/upload - Upload file to Cloudflare R2
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPG, PNG, WEBP, GIF, SVG, AVIF.` },
        { status: 400 }
      );
    }

    // Max 10MB file limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToR2({
      buffer,
      filename: file.name,
      contentType: file.type,
      folder,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      size: file.size,
      name: file.name,
      contentType: file.type,
    });
  } catch (error: any) {
    console.error("R2 upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload to Cloudflare R2" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete object from Cloudflare R2
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Missing 'key' query parameter" },
        { status: 400 }
      );
    }

    await deleteFromR2(key);
    return NextResponse.json({ success: true, message: `Deleted ${key} from R2` });
  } catch (error: any) {
    console.error("R2 delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete from Cloudflare R2" },
      { status: 500 }
    );
  }
}
