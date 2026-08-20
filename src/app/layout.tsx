import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const trajanPro = localFont({
  variable: "--font-trajan-pro",
  src: [
    {
      path: "../../public/fonts/trajan-pro/TrajanPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/trajan-pro/TrajanPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bezel.com.br"),
  title: {
    default: "BEZEL Engenharia | Arquitetura, Engenharia e Construção",
    template: "%s | BEZEL Engenharia",
  },
  description: "Arquitetura, engenharia e construção.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "BEZEL Engenharia",
    title: "BEZEL Engenharia | Arquitetura, Engenharia e Construção",
    description: "Arquitetura, engenharia e construção.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BEZEL Engenharia | Arquitetura, Engenharia e Construção",
    description: "Arquitetura, engenharia e construção.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${trajanPro.variable} h-full antialiased`}
    >
      </html>
  );
}