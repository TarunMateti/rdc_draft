import SidebarWrapper from "@/components/SidebarWrapper";
import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "RDC",
  description: "A data collection app with SQLite and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <SidebarWrapper>
          <div className="flex-1">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </SidebarWrapper>
      </body>
    </html>
  );
}
