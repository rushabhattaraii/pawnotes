import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUnreadCount } from "../api";

export default function Sidebar() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUnreadCount().then(setUnread);
    const timer = setInterval(() => {
      getUnreadCount().then(setUnread);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="sidebar">
      <div className="brand">PawNotes</div>
      <NavLink to="/patients">Patients</NavLink>
      <div className="inbox">Messages <span className="badge">{unread}</span></div>
    </nav>
  );
}
