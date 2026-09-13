export default function AdminFooter({ visible = false }: { visible?: boolean }) {
  return (
    <footer className={`admin-footer ${visible ? "admin-footer-visible" : ""}`}>
      <div className="admin-footer-brand">
        <span>East Space</span>
      </div>
      <div className="admin-footer-links">
        <a href="#">Reports</a>
        <a href="#">Support</a>
        <a href="#">Settings</a>
      </div>
      <div className="admin-footer-copy">
        Ride Along Enterprise • Windsor, Ontario
      </div>
    </footer>
  );
}
