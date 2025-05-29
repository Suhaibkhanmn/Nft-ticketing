import { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | NFT Ticketing System",
  description: "Manage your events and tickets",
};

export default function DashboardPage() {
  return <DashboardContent />;
}