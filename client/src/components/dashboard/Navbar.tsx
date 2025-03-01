import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/referrals", label: "Referrals" },
    { href: "/convert", label: "Convert" },
  ];

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CryptoPoints
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                      location === item.href
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border"
                    )}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}