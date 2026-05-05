import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Footer from "./Footer";

function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--surface)" }}>
      <div style={{ height: "64px", flexShrink: 0 }}>
        <Header />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", flex: 1, alignItems: "flex-start" }}>
        <div style={{ height: "calc(100vh - 64px)", position: "sticky", top: 0, display: "flex" }}>
          <SideMenu />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)" }}>
          <main style={{ flex: 1, padding: "0" }}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;
