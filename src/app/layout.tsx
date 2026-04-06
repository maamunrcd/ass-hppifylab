import type { Metadata } from "next";
import "./globals.css";
import "./bootstrap.min.css";
import "./common.css";
import "./main.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "Social Feed App",
  description: "Scalable social feed application",
  icons: { icon: "/assets/images/logo-copy.svg" },
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
