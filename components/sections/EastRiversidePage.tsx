"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Booking = {
  start: string;
  end: string;
};

type BookingRange = {
  start: string;
  end: string;
};

const PROPERTY_FEATURES = [
  { icon: "bedroom", label: "2 furnished bedrooms" },
  { icon: "bath", label: "1 full bathroom" },
  { icon: "kitchen", label: "Kitchenette with fridge & microwave" },
  { icon: "laundry", label: "In-suite washer & dryer" },
  { icon: "wifi", label: "Wi-Fi & Smart TV" },
  { icon: "climate", label: "Heating & air conditioning" },
  { icon: "parking", label: "Street parking available" },
  { icon: "utilities", label: "Utilities included" },
];

const FEATURE_ICONS: Record<string, string> = {
  bedroom: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Bedrooms'><path d='M3 11h7l2-3h7a2 2 0 0 1 2 2v4H3z' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M4 17h16M6 11V7m4 4V8m5-1h2' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  bath: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Bathroom'><path d='M5 12h11v4a5 5 0 0 1-10 0z' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M8 5a3 3 0 0 1 3 3v2M14 6h4a2 2 0 0 1 2 2v1' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M4 18h14' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  kitchen: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Kitchenette'><path d='M5 4h6v6H5zM8 10v8M12 4h5a3 3 0 0 1 3 3v3H12' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M14 17h7M14 20h7' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  laundry: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Laundry'><path d='M5 5h14v15H5z' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M8 10a4 4 0 1 0 8 0a4 4 0 0 0-8 0z' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M9 16h6' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  wifi: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Wi-Fi and Smart TV'><path d='M4 8a16 16 0 0 1 16 0M7 12a10 10 0 0 1 10 0M10 16a4 4 0 0 1 4 0' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M17 17h4v4h-4z' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  climate: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Climate'><path d='M12 3v18M6 7a6 6 0 0 1 12 0M6 17a6 6 0 0 0 12 0' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  parking: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Parking'><path d='M6 4h7a5 5 0 0 1 0 10H6z' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M8 14l-2 6M10 7h3M14 7h2' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
  utilities: "<svg viewBox='0 0 24 24' class='feature-icon' aria-label='Utilities'><path d='M9 3h6v4l-2 2v4M5 17h14' fill='none' stroke='currentColor' strokeWidth='1.8'/><path d='M6 21h12' fill='none' stroke='currentColor' strokeWidth='1.8'/></svg>",
};

const ADMIN_LISTINGS = [
  { title: "East Riverside suite", unit: "Lower-level furnished suite", status: "Live", price: "$1,750 / month" },
  { title: "Apartment listing", unit: "2 bedroom long stay", status: "Draft", price: "$1,850 / month" },
  { title: "Availability package", unit: "Calendar sync", status: "Synced", price: "Updated" },
];

const APPLICATIONS = [
  { status: "In review", unit: "Furnished suite", starts: "2026-09-15", cost: "$1,750", progress: 64 },
  { status: "Approved", unit: "Long-term rental", starts: "2026-10-01", cost: "$1,820", progress: 100 },
  { status: "Documents", unit: "Application package", starts: "2026-09-25", cost: "$1,750", progress: 46 },
];

const TRANSACTIONS = [
  { name: "Application fee", amount: "$150", status: "Paid", date: "2026-09-02" },
  { name: "Security deposit", amount: "$1,750", status: "Pending", date: "2026-09-04" },
  { name: "First month rent", amount: "$1,750", status: "Scheduled", date: "2026-09-15" },
];

const parseDate = (s: string) => {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  return parseDate(aStart) <= parseDate(bEnd) && parseDate(bStart) <= parseDate(aEnd);
};

export default function EastRiversidePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [dateStatus, setDateStatus] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "">("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupants, setOccupants] = useState("");
  const [duration, setDuration] = useState("1–4 weeks");
  const [message, setMessage] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("rentalBookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  const monthTitle = viewDate.toLocaleString("en-CA", { month: "long", year: "numeric" });

  const calendarDays = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

    const all = [...blanks, ...days.map((day) => {
      const date = new Date(year, month, day);
      const dateKey = isoDate(date);
      return {
        label: day,
        date,
        dateKey,
        isPast: date < today,
        isBooked: bookings.some((booking) => overlap(dateKey, dateKey, booking.start, booking.end)),
        isSelected: selectedStart === dateKey || selectedEnd === dateKey,
        isInRange: selectedStart && selectedEnd && date > parseDate(selectedStart) && date < parseDate(selectedEnd),
      };
    })];

    return all;
  }, [bookings, selectedStart, selectedEnd, today, viewDate]);

  const selectDate = (dateKey: string) => {
    const date = parseDate(dateKey);
    if (date < today || bookings.some((booking) => overlap(dateKey, dateKey, booking.start, booking.end))) {
      return;
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateKey);
      setSelectedEnd(null);
      setDateStatus("");
      return;
    }

    if (date <= parseDate(selectedStart)) {
      setSelectedStart(dateKey);
      setSelectedEnd(null);
      setDateStatus("");
      return;
    }

    const start = parseDate(selectedStart);
    const end = date;
    const range = []; 
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const key = isoDate(d);
      const testDate = parseDate(key);
      if (bookings.some((b) => overlap(key, key, b.start, b.end))) {
        setDateStatus("Some dates in this range are already booked. Please choose another range.");
        setSelectedEnd(null);
        setNotice("Some dates in this range are already booked. Please choose another range.");
        setNoticeType("error");
        return;
      }
    }

    setSelectedEnd(dateKey);
    setCheckIn(selectedStart);
    setCheckOut(dateKey);
    setDateStatus(`Selected: ${selectedStart} to ${dateKey}`);
    setNotice("Selected dates are ready for your inquiry.");
    setNoticeType("success");
  };

  const changeMonth = (amount: number) => {
    const changed = new Date(viewDate);
    changed.setMonth(changed.getMonth() + amount);
    setViewDate(changed);
  };

  const addBooking = () => {
    const input = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value || "";
    const start = input("adminStart");
    const end = input("adminEnd");

    if (!start || !end || end < start) {
      alert("Choose a valid start and end date.");
      return;
    }

    const overlapCheck = bookings.some((booking) => overlap(start, end, booking.start, booking.end));
    if (overlapCheck) {
      alert("Those dates overlap an existing booking.");
      return;
    }

    const newBooking = { start, end };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem("rentalBookings", JSON.stringify(updated));
  };

  const clearBookings = () => {
    if (confirm("Clear all prototype bookings from this browser?")) {
      setBookings([]);
      localStorage.setItem("rentalBookings", JSON.stringify([]));
    }
  };

  const removeBooking = (index: number) => {
    const next = bookings.filter((_, i) => i !== index);
    setBookings(next);
    localStorage.setItem("rentalBookings", JSON.stringify(next));
  };

  const submitInquiry = (event: FormEvent) => {
    event.preventDefault();

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setNotice("Please select valid move-in and move-out dates.");
      setNoticeType("error");
      return;
    }

    const hasOverlapBooking = bookings.some((booking) => overlap(checkIn, checkOut, booking.start, booking.end));
    if (hasOverlapBooking) {
      setNotice("Those dates are no longer available. Please select different dates.");
      setNoticeType("error");
      return;
    }

    const data = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      start: checkIn,
      end: checkOut,
      occupants,
      duration,
      message,
    };

    const subject = encodeURIComponent(`Furnished Rental Inquiry: ${checkIn} to ${checkOut}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMove-in: ${checkIn}\nMove-out: ${checkOut}\nOccupants: ${data.occupants}\nPreferred stay: ${data.duration}\nMessage: ${data.message}`,
    );

    if (typeof window !== "undefined") {
      window.location.href = `mailto:ridealong.ent@gmail.com?subject=${subject}&body=${body}`;
    }

    setNotice("Your email app should open with the rental inquiry prepared. Please send it to complete the inquiry.");
    setNoticeType("success");
  };

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <span className="badge">Furnished Long-Term Rental • East Riverside • Windsor, Ontario</span>
          <h1>Comfortable Furnished Living in East Riverside</h1>
          <p>Private 2-bedroom, 1-bathroom lower-level suite with furnished living space, in-suite laundry, Wi-Fi and utilities included.</p>
          <a className="btn btn-primary" href="#availability">Check Availability</a>
        </div>
      </header>

      <main className="container">
        <section className="grid">
          <div>
            <h2>Your furnished home away from home</h2>
            <p>This fully furnished 2-bedroom lower-level suite is designed for comfortable longer stays in a quiet East Riverside neighbourhood.</p>

            <div className="features">
              {PROPERTY_FEATURES.map((feature, idx) => (
                <div className="feature" key={idx}>
                  <span className="feature-icon-wrap" dangerouslySetInnerHTML={{ __html: FEATURE_ICONS[feature.icon] }} />
                  <span className="feature-label">{feature.label}</span>
                </div>
              ))}
            </div>

            <h2>Location</h2>
            <p>11822 Rockland Street, Windsor, Ontario</p>
            <p>Enjoy easy access to East Riverside amenities and outdoor recreation, including Ganatchio Trail, Blue Heron Lake, East Riverside Park, Sandpoint Beach, shopping, restaurants and everyday services.</p>

            <div className="gallery">
              <img src="/photos/hero.svg" width="1200" height="900" alt="Living area" onError={(event) => { event.currentTarget.src = '/photos/placeholder.svg'; }} />
              <img src="/photos/bedroom1.svg" width="800" height="600" alt="Bedroom" onError={(event) => { event.currentTarget.src = '/photos/placeholder.svg'; }} />
              <img src="/photos/bedroom2.svg" width="800" height="600" alt="Second bedroom" onError={(event) => { event.currentTarget.src = '/photos/placeholder.svg'; }} />
            </div>
            <p className="small">Replace the images in the <b>photos</b> folder with your actual property photos.</p>
          </div>

          <aside className="card calendar-wrap" id="availability">
            <h2 style={{ fontSize: "23px" }}>Check availability</h2>
            <div className="cal-head">
              <button onClick={() => changeMonth(-1)}>‹</button>
              <strong id="monthTitle">{monthTitle}</strong>
              <button onClick={() => changeMonth(1)}>›</button>
            </div>
            <div className="week">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="days">
              {calendarDays.map((day, idx) => (
                day === null ? <button className="day empty" key={`empty-${idx}`} disabled /> : (
                  <button
                    className={`day ${day.isPast ? "past" : ""} ${day.isBooked ? "booked" : ""} ${day.isSelected ? "selected" : ""} ${day.isInRange ? "inrange" : ""}`}
                    key={day.dateKey}
                    onClick={() => selectDate(day.dateKey)}
                    disabled={day.isPast || day.isBooked}
                  >
                    {day.label}
                  </button>
                )
              ))}
            </div>
            <div className="legend"><span className="dot"></span>Booked / unavailable</div>
            <p className="small">Select your preferred move-in and move-out dates. Dates are confirmed only after your application is reviewed.</p>
            <div id="dateStatus">{dateStatus ? <div className="notice success">{dateStatus}</div> : null}</div>
          </aside>
        </section>

        <section className="card" style={{ marginTop: "40px" }} id="inquiry">
          <h2>Rental inquiry</h2>
          <p>Select your dates above, then send an inquiry. No payment is collected through this form.</p>
          {notice ? <div id="formNotice"><div className={`notice ${noticeType}`}>{notice}</div></div> : <div id="formNotice" />}
          <form id="rentalForm" onSubmit={submitInquiry}>
            <div className="form-grid">
              <div><label>First name<input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label></div>
              <div><label>Last name<input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} /></label></div>
              <div><label>Email<input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label></div>
              <div><label>Phone<input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} /></label></div>
              <div><label>Move-in date<input id="checkIn" type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label></div>
              <div><label>Move-out date<input id="checkOut" type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label></div>
              <div><label>Number of occupants<select id="occupants" required value={occupants} onChange={(e) => setOccupants(e.target.value)}><option value="">Select</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label></div>
              <div><label>Preferred stay<select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}><option>1–4 weeks</option><option>1–3 months</option><option>3–6 months</option><option>6–12 months</option><option>12+ months</option></select></label></div>
              <div className="full"><label>Message<textarea id="message" placeholder="Tell us a little about your stay and preferred move-in date." value={message} onChange={(e) => setMessage(e.target.value)}></textarea></label></div>
              <div className="full"><button className="btn btn-dark" type="submit">Send Rental Inquiry</button></div>
            </div>
          </form>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Rental information</h2>
          <div className="grid">
            <div className="card">
              <h3>Minimum one month rental</h3>
              <p>Minimum one-month rental. Rental terms, rent, included utilities and tenancy conditions will be confirmed in the Ontario Standard Lease where applicable.</p>
              <p>Tenant screening may include employment/income verification, credit information and rental references with appropriate consent.</p>
            </div>
          </div>
        </section>

        <section className="card admin">
          <h2>Owner availability manager</h2>
          <p className="small">This first version stores bookings in this browser only. Use it as a prototype. For a live public site, connect the calendar to a database/calendar service before relying on it for real bookings.</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input style={{ maxWidth: "190px" }} id="adminStart" type="date" />
            <input style={{ maxWidth: "190px" }} id="adminEnd" type="date" />
            <button className="btn btn-dark" onClick={addBooking}>Mark dates booked</button>
            <button className="btn" onClick={clearBookings} style={{ border: "1px solid #ccd7d2", background: "#fff" }}>Clear prototype bookings</button>
          </div>
          <div id="bookingList">
            {bookings.length ? (
              <>
                <h3>Booked dates</h3>
                {bookings.map((booking, index) => (
                  <div className="booking-row" key={`${booking.start}-${booking.end}-${index}`}
                    style={{ display: "flex", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid #e4e9e6", padding: "12px 0" }}>
                    <span>{booking.start} → {booking.end}</span>
                    <button onClick={() => removeBooking(index)}>Remove</button>
                  </div>
                ))}
              </>
            ) : <p className="small">No prototype bookings entered.</p>}
          </div>
        </section>
      </main>

      <footer>
        <strong>Ride Along Enterprise</strong><br />
        Furnished Housing • Windsor, Ontario
      </footer>
    </>
  );
}
