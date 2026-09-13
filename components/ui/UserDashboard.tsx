export default function UserDashboard() {
  return (
    <section className="card">
      <h2>User dashboard</h2>
      <div className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dashboard-card-label">Applications</span>
          <span className="dashboard-card-value">02</span>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-card-label">Transactions</span>
          <span className="dashboard-card-value">$1,750</span>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-card-label">Documents</span>
          <span className="dashboard-card-value">03</span>
        </article>
      </div>
    </section>
  );
}
