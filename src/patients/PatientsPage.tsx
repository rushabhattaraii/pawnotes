import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import { getPatients, type Patient } from "../api";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    getPatients().then(setPatients);
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main>
        <h1>Patients</h1>
        <table>
          <thead>
            <tr><th>Name</th><th>Species</th><th>Owner</th><th></th></tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.species}</td>
                <td>{p.owner}</td>
                <td><Link to={`/notes/${p.id}`}>Open note</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
