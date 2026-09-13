export default function AdminDashboard() {
  const listings = [
    { title: "East Riverside suite", status: "Live", price: "$1,750 / month" },
    { title: "Apartment listing", status: "Draft", price: "$1,850 / month" },
  ];

  return (
    <section className="card admin">
      <h2>Owner availability manager</h2>
      <div className="admin-dashboard">
        {listings.map((listing) => (
          <div className="admin-dashboard-row" key={listing.title}>
            <span className="admin-listing-title">{listing.title}</span>
            <span className="admin-listing-status">{listing.status}</span>
            <span className="admin-listing-price">{listing.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
