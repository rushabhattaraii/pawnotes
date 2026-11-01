export type Patient = { id: string; name: string; species: string; owner: string };
export type Version = { id: number; noteId: string; text: string; savedAt: string };

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patients");
  return res.json();
}

export async function getVersions(noteId: string): Promise<Version[]> {
  const res = await fetch(`/api/notes/${noteId}/versions`);
  return res.json();
}

export async function saveVersion(noteId: string, text: string): Promise<Version> {
  const res = await fetch(`/api/notes/${noteId}/versions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function getUnreadCount(): Promise<number> {
  const res = await fetch("/api/inbox");
  const body = (await res.json()) as { unread: number };
  return body.unread;
}
