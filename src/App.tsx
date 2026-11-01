import { Navigate, Route, Routes } from "react-router-dom";
import PatientsPage from "./patients/PatientsPage";
import NoteEditor from "./notes/NoteEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/patients" replace />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/notes/:patientId" element={<NoteEditor />} />
    </Routes>
  );
}
