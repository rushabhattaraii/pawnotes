// Small in-memory API for local development. Data resets when the dev server restarts.
import type { IncomingMessage, ServerResponse } from "node:http";

type Version = { id: number; noteId: string; text: string; savedAt: string };

const patients = [
  { id: "p1", name: "Biscuit", species: "Dog", owner: "A. Rivera" },
  { id: "p2", name: "Mochi", species: "Cat", owner: "J. Patel" },
  { id: "p3", name: "Pepper", species: "Rabbit", owner: "L. Okafor" },
  { id: "p4", name: "Juniper", species: "Dog", owner: "S. Novak" },
];

const drafts: Record<string, string> = {
  p1: "Annual check-up. Weight 21.4 kg. Teeth clean, mild tartar on upper molars.",
  p2: "Vaccination booster given. Owner reports reduced appetite for two days.",
  p3: "Nail trim. Coat in good condition. Recheck diet in four weeks.",
  p4: "Limping on front left paw after a walk. Rest for one week, recheck if no better.",
};

let nextId = 1;
const versions: Version[] = [];
for (const [noteId, text] of Object.entries(drafts)) {
  versions.push({ id: nextId++, noteId, text, savedAt: new Date(Date.now() - 86_400_000).toISOString() });
}

let unread = 3;

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

export async function notesApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith("/api/")) return next();

  if (req.method === "GET" && url.pathname === "/api/patients") {
    return send(res, 200, patients);
  }
  if (req.method === "GET" && url.pathname === "/api/inbox") {
    return send(res, 200, { unread });
  }

  const match = url.pathname.match(/^\/api\/notes\/(\w+)\/versions$/);
  if (match) {
    const noteId = match[1];
    if (req.method === "GET") {
      return send(res, 200, versions.filter((v) => v.noteId === noteId).reverse());
    }
    if (req.method === "POST") {
      const { text } = JSON.parse(await readBody(req)) as { text: string };
      const version = { id: nextId++, noteId, text, savedAt: new Date().toISOString() };
      versions.push(version);
      return send(res, 201, version);
    }
  }
  send(res, 404, { error: "not found" });
}
