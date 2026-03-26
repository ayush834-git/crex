import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

async function readSubscribers(): Promise<string[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSubscribers(emails: string[]) {
  await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(emails, null, 2));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const subscribers = await readSubscribers();

    if (subscribers.includes(email)) {
      return NextResponse.json({
        ok: true,
        message: "You are already subscribed. We will send the next CREX scouting drop.",
      });
    }

    subscribers.push(email);
    await writeSubscribers(subscribers);

    return NextResponse.json({
      ok: true,
      email,
      message: "Subscribed! You will receive the next CREX scouting drop.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
