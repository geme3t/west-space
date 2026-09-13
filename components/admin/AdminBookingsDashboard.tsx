"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type BookingStatus = "Booked" | "Cancelled" | "Revoked" | "Approved";

type Booking = {
  id: number;
  start: string;
  end: string;
  status: BookingStatus;
  recurringDiscount: number;
};

type SpaceStatus = "Live" | "Draft" | "Archived";

type Space = {
  id: number;
  title: string;
  location: string;
  status: SpaceStatus;
  price: number;
  uploads: string;
  image: string;
};

const storageKey = "rentalBookings";
const spacesKey = "rentalSpaces";

const defaultSpaces: Space[] = [
  {
    id: 1,
    title: "East Riverside suite",
    location: "Windsor, Ontario",
    status: "Live",
    price: 1750,
    uploads: "hero.svg, bedroom1.svg, bedroom2.svg",
    image: "/photos/hero.svg",
  },
  {
    id: 2,
    title: "Garden Apartment",
    location: "East Riverside, Windsor",
    status: "Draft",
    price: 1600,
    uploads: "garden.svg",
    image: "/photos/bedroom1.svg",
  },
];

const defaultBookings: Booking[] = [
  { id: 1, start: "2026-09-18", end: "2026-09-29", status: "Booked", recurringDiscount: 0 },
  { id: 2, start: "2026-10-10", end: "2026-10-14", status: "Booked", recurringDiscount: 10 },
];

const parseDate = (s: string) => {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  return parseDate(aStart) <= parseDate(bEnd) && parseDate(bStart) <= parseDate(aEnd);
};

export default function AdminBookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(defaultBookings);
  const [spaces, setSpaces] = useState<Space[]>(defaultSpaces);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const emptySpace = {
    id: 0,
    title: "",
    location: "",
    status: "Live" as SpaceStatus,
    price: 1750,
    uploads: "",
    image: "/photos/hero.svg",
  };

  const [spaceForm, setSpaceForm] = useState<Space>(emptySpace);

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem(storageKey);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }

      const storedSpaces = localStorage.getItem(spacesKey);
      if (storedSpaces) {
        setSpaces(JSON.parse(storedSpaces));
      }
    } catch {
      setBookings(defaultBookings);
      setSpaces(defaultSpaces);
    }
  }, []);

  const summary = useMemo(() => {
    const totalDays = bookings.reduce((acc, b) => {
      const range = Math.round((parseDate(b.end).getTime() - parseDate(b.start).getTime()) / 86400000) + 1;
      return acc + range;
    }, 0);

    return {
      totalBookings: bookings.length,
      totalDays,
      totalListings: spaces.length,
    };
  }, [bookings, spaces]);

  const addBooking = (event: FormEvent) => {
    event.preventDefault();

    if (!start || !end || end < start) {
      setError("Choose a valid start and end date.");
      setNotice("");
      return;
    }

    const hasOverlap = bookings.some((booking) => overlaps(start, end, booking.start, booking.end));
    if (hasOverlap) {
      setError("Those dates overlap an existing booking.");
      setNotice("");
      return;
    }

    const updated = [...bookings, { id: Date.now(), start, end, status: "Booked" as BookingStatus, recurringDiscount: 0 }];
    setBookings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setStart("");
    setEnd("");
    setError("");
    setNotice("Booking added.");
  };

  const removeBooking = (id: number) => {
    const next = bookings.filter((booking) => booking.id !== id);
    setBookings(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setNotice("Booking removed.");
  };

  const clearBookings = () => {
    if (confirm("Clear all prototype bookings from this browser?")) {
      setBookings([]);
      localStorage.setItem(storageKey, JSON.stringify([]));
      setNotice("All bookings cleared.");
      setError("");
    }
  };

  const updateBookingStatus = (id: number, status: BookingStatus) => {
    const updated = bookings.map((booking) => booking.id === id ? { ...booking, status } : booking);
    setBookings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNotice(`Booking marked ${status}.`);
  };

  const grantDiscount = (id: number) => {
    const updated = bookings.map((booking) => booking.id === id ? { ...booking, recurringDiscount: 15 } : booking);
    setBookings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNotice("Recurring user discount granted.");
  };

  const saveSpace = (event: FormEvent) => {
    event.preventDefault();

    if (!spaceForm.title.trim() || !spaceForm.location.trim()) {
      setError("A title and location are required.");
      return;
    }

    const normalized = {
      ...spaceForm,
      title: spaceForm.title.trim(),
      location: spaceForm.location.trim(),
      uploads: spaceForm.uploads.trim(),
      price: Number(spaceForm.price),
    };

    if (spaceForm.id) {
      const updated = spaces.map((item) => (item.id === spaceForm.id ? { ...item, ...normalized } : item));
      setSpaces(updated);
      localStorage.setItem(spacesKey, JSON.stringify(updated));
      setNotice("Listing updated.");
    } else {
      const newSpace = { ...normalized, id: Date.now(), image: spaceForm.image || "/photos/hero.svg" };
      const updated = [...spaces, newSpace];
      setSpaces(updated);
      localStorage.setItem(spacesKey, JSON.stringify(updated));
      setNotice("Listing added.");
    }

    setSpaceForm(emptySpace);
    setError("");
  };

  const editSpace = (space: Space) => {
    setSpaceForm(space);
    setNotice("Listing editing.");
  };

  const deleteSpace = (id: number) => {
    const remaining = spaces.filter((s) => s.id !== id);
    setSpaces(remaining);
    localStorage.setItem(spacesKey, JSON.stringify(remaining));
    setNotice("Listing removed.");
  };

  return (
    <section className="admin-content-wrap">
      <section className="admin-header">
        <div>
          <span className="overline">Owner dashboard</span>
          <h1>Bookings and availability</h1>
        </div>
        <div className="admin-header-actions">
          <a className="btn btn-light" href="/">View public page</a>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <span className="kpi-label">Bookings</span>
          <span className="kpi-value">{summary.totalBookings}</span>
          <span className="kpi-detail">Calendar entries</span>
        </article>
        <article className="kpi-card">
          <span className="kpi-label">Booked range</span>
          <span className="kpi-value">{summary.totalDays}</span>
          <span className="kpi-detail">Total days</span>
        </article>
        <article className="kpi-card">
          <span className="kpi-label">Apartments</span>
          <span className="kpi-value">{summary.totalListings}</span>
          <span className="kpi-detail">Active spaces</span>
        </article>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Apartment manager</span>
            <h2>Apartment listings</h2>
          </div>
        </div>

        <form className="space-form" onSubmit={saveSpace}>
          <div className="form-grid admin-form-grid">
            <div>
              <label>Apartment title<input value={spaceForm.title} required onChange={(e) => setSpaceForm({ ...spaceForm, title: e.target.value })} /></label>
            </div>
            <div>
              <label>Location<input value={spaceForm.location} required onChange={(e) => setSpaceForm({ ...spaceForm, location: e.target.value })} /></label>
            </div>
            <div>
              <label>Price<input type="number" value={spaceForm.price} onChange={(e) => setSpaceForm({ ...spaceForm, price: Number(e.target.value) })} /></label>
            </div>
            <div>
              <label>Status<select value={spaceForm.status} onChange={(e) => setSpaceForm({ ...spaceForm, status: e.target.value as SpaceStatus })}><option>Live</option><option>Draft</option><option>Archived</option></select></label>
            </div>
            <div>
              <label>Uploads<input value={spaceForm.uploads} onChange={(e) => setSpaceForm({ ...spaceForm, uploads: e.target.value })} /></label>
            </div>
            <div>
              <label>Image path<input value={spaceForm.image} onChange={(e) => setSpaceForm({ ...spaceForm, image: e.target.value })} /></label>
            </div>
            <div className="form-actions">
              <button className="btn btn-dark" type="submit">{spaceForm.id ? "Save apartment" : "Add apartment"}</button>
              {spaceForm.id ? <button className="btn btn-light" type="button" onClick={() => setSpaceForm(emptySpace)}>Cancel</button> : null}
            </div>
          </div>
        </form>

        <div className="listing-list">
          {spaces.map((space) => (
            <div className="listing-row" key={space.id}>
              <span className="listing-thumb"><img src={space.image} alt="" /></span>
              <span className="listing-title">{space.title}</span>
              <span className="listing-location">{space.location}</span>
              <span className="listing-price">${space.price}</span>
              <span className="status-badge">{space.status}</span>
              <span className="listing-actions">
                <button className="icon-button small-button" onClick={() => editSpace(space)}>Edit</button>
                <button className="icon-button danger-button small-button" onClick={() => deleteSpace(space.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Availability manager</span>
            <h2>Manage bookings</h2>
          </div>
          <div className="panel-actions">
            <button className="btn btn-dark" type="button" onClick={clearBookings}>Clear bookings</button>
          </div>
        </div>

        <form className="booking-form" onSubmit={addBooking}>
          <div className="form-grid admin-form-grid">
            <div>
              <label>Start date<input type="date" value={start} required onChange={(e) => setStart(e.target.value)} /></label>
            </div>
            <div>
              <label>End date<input type="date" value={end} required onChange={(e) => setEnd(e.target.value)} /></label>
            </div>
            <div className="form-actions">
              <button className="btn btn-dark" type="submit">Mark dates booked</button>
            </div>
          </div>
          {error ? <div className="notice error">{error}</div> : null}
          {notice ? <div className="notice success">{notice}</div> : null}
        </form>
      </section>

      <section className="admin-panel">
        <div className="panel-heading small-heading">
          <div>
            <span className="panel-kicker">Scheduled</span>
            <h2>Booked date ranges</h2>
          </div>
        </div>

        <div className="booking-list">
          {bookings.length === 0 ? <div className="empty-state">No prototype bookings entered.</div> : null}

          {bookings.map((booking) => (
            <div className="booking-row admin-booking-row" key={booking.id}> 
              <span className="booking-range">{booking.start} → {booking.end}</span>
              <span className="booking-meta">Furnished rental • East Riverside</span>
              <span className="booking-status">{booking.status}</span>
              <span className="booking-discount">{booking.recurringDiscount}% discount</span>
              <span className="booking-actions">
                <select value={booking.status} onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}>
                  <option>Booked</option>
                  <option>Cancelled</option>
                  <option>Revoked</option>
                  <option>Approved</option>
                </select>
                <button className="icon-button small-button" onClick={() => grantDiscount(booking.id)}>Recurring discount</button>
                <button className="icon-button danger-button small-button" onClick={() => removeBooking(booking.id)}>Remove</button>
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
