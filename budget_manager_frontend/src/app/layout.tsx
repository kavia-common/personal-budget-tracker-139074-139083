import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

/**
 * PUBLIC_INTERFACE
 * Root metadata for the Personal Budget Manager with Neon Cyber theme.
 */
export const metadata: Metadata = {
  title: "Personal Budget Manager",
  description:
    "Track incomes and expenses with bold Neon Cyber visuals. Local storage persistence, charts, and summaries.",
};

/**
 * PUBLIC_INTERFACE
 * Root layout providing global Neon Cyber background, sticky Navbar shell,
 * and a centered responsive container. Children pages render inside the main section.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="app-shell u-gradient-neon" suppressHydrationWarning>
        {/* Navbar Shell (placeholder for navigation) */}
        <nav className="nc-navbar">
          <div className="app-container" role="navigation" aria-label="Main">
            <div className="flex items-center justify-between py-3">
              <Link href="/" className="nc-brand">
                <span className="nc-dot" aria-hidden />
                <span className="text-xl md:text-2xl font-extrabold tracking-wide">
                  Budget Manager
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="nc-btn nc-btn-secondary"
                  aria-label="Go to Dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  href="#add"
                  className="nc-btn"
                  aria-label="Add Transaction"
                >
                  Add
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <main className="app-container">
          {children}
        </main>

        {/* Footer (simple placeholder) */}
        <footer className="app-container py-6">
          <p className="nc-muted text-center text-sm">
            Neon Cyber UI • Personal Budget Manager
          </p>
        </footer>
      </body>
    </html>
  );
}
