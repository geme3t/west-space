"use client";

import Link from "next/link";

type OverviewStat = {
  label: string;
  value: string;
  sub: string;
};

const stats: OverviewStat[] = [
  { label: "Total bookings", value: "08", sub: "All scheduled" },
  { label: "Pending", value: "03", sub: "Awaiting review" },
  { label: "Available apartments", value: "04", sub: "Active spaces" },
];

const recentBookings = [
  { guest: "Olivia Brooks", apartment: "East Riverside suite", date: "Sep 18 - Sep 29", status: "Booked", amount: "$1,750" },
  { guest: "Sam Carter", apartment: "City Garden Loft", date: "Oct 02 - Oct 10", status: "Pending", amount: "$1,600" },
  { guest: "Mina Lewis", apartment: "East Riverside suite", date: "Oct 10 - Oct 14", status: "Approved", amount: "$1,750" },
  { guest: "Andre Lee", apartment: "Blue Ridge Apartment", date: "Oct 21 - Oct 30", status: "Booked", amount: "$1,890" },
];

const availableSpaces = [
  { title: "East Riverside suite", location: "East Riverside, Windsor", price: "$1,750 / month", status: "Live" },
  { title: "Garden Apartment", location: "Windsor, Ontario", price: "$1,650 / month", status: "Available" },
  { title: "Blue Ridge Apartment", location: "East Riverside, Windsor", price: "$1,890 / month", status: "Available" },
  { title: "City Garden Loft", location: "Downtown Windsor", price: "$1,600 / month", status: "Draft" },
];

export default function AdminOverviewDashboard() {
  return (
    <section className="admin-overview">
      <section className="admin-page-title">
        <div>
          <span className="overline">Owner dashboard</span>
          <h1>Overview</h1>
        </div>
        <div className="admin-header-actions">
          <Link className="btn btn-dark" href="/admin/bookings">Manage bookings</Link>
        </div>
      </section>

      <section className="kpi-grid overview-kpi-grid">
        {stats.map((stat) => (
          <article className="kpi-card" key={stat.label}>
            <span className="kpi-label">{stat.label}</span>
            <span className="kpi-value">{stat.value}</span>
            <span className="kpi-detail">{stat.sub}</span>
          </article>
        ))}
      </section>

      <section className="overview-layout">
        <section className="admin-panel overview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Bookings</span>
              <h2>Recent bookings</h2>
            </div>
            <Link className="btn btn-light panel-button" href="/admin/bookings">Open bookings</Link>
          </div>

          <div className="recent-bookings-list">
            {recentBookings.map((booking, index) => (
              <div className="recent-booking-row" key={`${booking.guest}-${index}`}>
                <div className="recent-booking-main">
                  <span className="guest-name">{booking.guest}</span>
                  <span className="guest-apartment">{booking.apartment}</span>
                </div>
                <span className="booking-date">{booking.date}</span>
                <span className="booking-amount">{booking.amount}</span>
                <span className={`booking-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel overview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Apartments</span>
              <h2>Available spaces</h2>
            </div>
            <Link className="btn btn-light panel-button" href="/admin/apartments">All apartments</Link>
          </div>

          <div className="available-space-list">
            {availableSpaces.map((space, index) => (
              <div className="available-space-row" key={`${space.title}-${index}`}>
                <div className="space-row-title">
                  <span className="space-title">{space.title}</span>
                  <span className="space-location">{space.location}</span>
                </div>
                <div className="space-row-meta">
                  <span className="space-price">{space.price}</span>
                  <span className={`space-status ${space.status.toLowerCase()}`}>{space.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
