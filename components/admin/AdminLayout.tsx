"use client";

import { useEffect, useRef, useState, type UIEvent } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  function updateFooterVisibility() {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const needsScroll = content.scrollHeight > content.clientHeight;
    const reachedEnd = content.scrollHeight - content.scrollTop <= content.clientHeight + 2;

    setFooterVisible(!needsScroll || reachedEnd);
  }

  function handleContentScroll(event: UIEvent<HTMLDivElement>) {
    const content = event.currentTarget;
    const needsScroll = content.scrollHeight > content.clientHeight;
    const reachedEnd = content.scrollHeight - content.scrollTop <= content.clientHeight + 2;

    setFooterVisible(!needsScroll || reachedEnd);
  }

  useEffect(() => {
    updateFooterVisibility();

    const content = contentRef.current;
    if (!content) {
      return;
    }

    const observer = new ResizeObserver(() => updateFooterVisibility());
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <section className="admin-main">
          <AdminTopbar onToggle={() => setSidebarOpen(true)} />
          <section className="admin-dashboard-body">
            <div className="admin-content" ref={contentRef} onScroll={handleContentScroll}>
              <div className="admin-content-inner">
                {children}
              </div>
              <AdminFooter visible={footerVisible} />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
