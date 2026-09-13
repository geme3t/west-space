"use client";

import Link from "next/link";

export default function AdminTopbar({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="mobile-menu-button" onClick={onToggle} aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span className="admin-page-kicker">Owner dashboard</span>
      </div>

      <div className="admin-topbar-right">
        <Link className="topbar-search" href="#">
          <span className="search-icon">⌕</span>
          <span>Search</span>
        </Link>
        <Link className="btn btn-light header-link" href="/">Public page</Link>
        <button className="profile-button topbar-profile" aria-label="Profile">
          <span className="icon-user">♙</span>
          <span className="profile-text">Owner</span>
        </button>
        <button className="signout-button topbar-signout" aria-label="Sign out">
          <span className="icon-signout">↪</span>
        </button>
      </div>
    </header>
  );
}
