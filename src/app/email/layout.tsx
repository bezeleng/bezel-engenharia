import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel de E-mail",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
