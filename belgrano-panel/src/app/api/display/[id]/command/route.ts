import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

type HardwareCommand = {
  id: string;
  screenId: string;
  command: string;
  status: string;
  createdAt: string;
  acknowledgedAt: string | null;
};

// In-memory queue for mock — will be replaced with DB in production
const commandQueue: HardwareCommand[] = [];

const validCommands = ["restart", "power_off", "power_on"] as const;

// GET: Display polls for pending commands
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const pending = commandQueue.filter(
    (cmd) => cmd.screenId === id && cmd.status === "pending",
  );

  return Response.json({
    ok: true,
    commands: pending.map((cmd) => ({
      id: cmd.id,
      command: cmd.command,
      createdAt: cmd.createdAt,
    })),
  });
}

// POST: Admin sends a command to a screen
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { command } = body;

    if (!command || !validCommands.includes(command)) {
      return Response.json(
        {
          ok: false,
          error: `Invalid command. Must be one of: ${validCommands.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const newCommand: HardwareCommand = {
      id: randomUUID(),
      screenId: id,
      command,
      status: "pending",
      createdAt: new Date().toISOString(),
      acknowledgedAt: null,
    };

    commandQueue.push(newCommand);

    return Response.json({
      ok: true,
      commandId: newCommand.id,
      command: newCommand.command,
      screenId: id,
      status: "pending",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
