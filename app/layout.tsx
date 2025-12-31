import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import {
  Be_Vietnam_Pro,
  Bebas_Neue,
  Fjalla_One,
  Oswald,
  Playfair_Display,
  Roboto,
} from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
});

const vietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vietnam",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={`${vietnam.variable} ${bebas.variable} ${roboto.variable}`}
    >
      <body className="font-vietnam antialiased" suppressHydrationWarning>
        {children}

        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
