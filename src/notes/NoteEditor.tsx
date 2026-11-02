import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import { getVersions, saveVersion, type Version } from "../api";

export default function NoteEditor() {
  const { patientId = "" } = useParams();
  const [text, setText] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    getVersions(patientId).then((list) => {
      setVersions(list);
      setText(list[0]?.text ?? "");
    });
  }, [patientId]);

  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        await saveVersion(patientId, textRef.current);
        setVersions(await getVersions(patientId));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [patientId]);

  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Link to="/patients">← Back to patients</Link>
        <h1>Clinical note</h1>
        <p className="hint">Press ⌘S to save a new version.</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} />
        <h2>Version history ({versions.length})</h2>
        <ol className="history">
          {versions.map((v) => (
            <li key={v.id}>
              <span className="time">{new Date(v.savedAt).toLocaleTimeString()}</span>
              <span className="text">{v.text}</span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
