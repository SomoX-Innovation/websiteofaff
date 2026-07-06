import AdminApp from "../../src/components/AdminApp.jsx";

export const metadata = {
  title: "Site Admin - WellwetX Administration Panel",
  description: "WellwetX Site Administration Panel - Admin access only",
  robots: "noindex, nofollow, noarchive",
};

export default function AdminPage() {
  return <AdminApp />;
}
