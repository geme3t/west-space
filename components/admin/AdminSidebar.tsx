"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Overview", href: "/admin", icon: "▦" },
  { label: "Apartments", href: "/admin/apartments", icon: "⌂" },
  { label: "Bookings", href: "/admin/bookings", icon: "☏" },
  { label: "Calendar", href: "/admin/calendar", icon: "◫" },
  { label: "Guests", href: "/admin/guests", icon: "♙" },
  { label: "Reservations", href: "/admin/reservations", icon: "✓" },
  { label: "Applications", href: "/admin/applications", icon: "✎" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Invoices", href: "/admin/invoices", icon: "₦" },
  { label: "Reviews", href: "/admin/reviews", icon: "★" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`admin-sidebar ${open ? "open" : ""}`}> 
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span className="brand-mark">East Space</span>
            <span className="brand-label">Admin</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            ×
          </button>
        </div>

        <nav className="admin-nav">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link className={`admin-nav-link ${active ? "active" : ""}`} href={item.href} key={item.href} onClick={onClose}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="profile-row">
            <span className="profile-avatar">ER</span>
            <div className="profile-details">
              <span className="profile-name">East Residency</span>
              <span className="profile-role">Owner</span>
            </div>
          </div>
          <div className="sidebar-footer-actions">
            <button className="profile-button" aria-label="Profile">
              <span className="icon-user">♙</span>
            </button>
            <button className="signout-button" aria-label="Sign out">
              <span className="icon-signout">↪</span>
            </button>
          </div>
        </div>
      </aside>

      <div className={`admin-backdrop ${open ? "show" : ""}`} onClick={onClose}></div>
    </>
  );
}
