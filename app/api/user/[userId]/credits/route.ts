import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // console.log("Updating user with ID:", params.userId)

    const { creditsUsed } = await request.json();
    const { db } = await connectToDatabase();
    const users = db.collection("users");

    const result : any = await users.findOneAndUpdate(
      { userId: params.userId },
      {
        $inc: {
          credits: -creditsUsed,
          successfulScrapes: 1,
        },
        $set: {
          lastActivity: new Date().toISOString(),
        },
      },
      { returnDocument: "after", upsert: true }
    );
  // console.log("MongoDB update result:", result)

    if (!result) {
      console.error(
        "User not found or update failed for userId:",
        params.userId
      );
      return NextResponse.json(
        { error: "Failed to update user credits" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      result || { error: "Failed to update user credits" }
    );
  } catch (error) {
    console.error("Failed to update user credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
