import React, { ReactNode } from "react";
import DashboardLayout from "../components/DashboardLayout";

const Layout = ({ children }: { children: ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
