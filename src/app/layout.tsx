import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import ClientProvider from "./components/ClientProvider";

export const metadata: Metadata = {
  title: "ChatAgent",
  description: "AI assistant platform for seamless conversations and task automation",
  icons: {
    icon: "/images/bot-icon.svg",
  },
};
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <>
          <ClientProvider>{children}</ClientProvider>
        </>
        <script defer src="https://cdn.tailwindcss.com"></script>
        <script defer src="http://localhost:8000/script/chatbot-embed.js"></script>
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
        document.addEventListener('DOMContentLoaded', function() {
          if (window.initializeChatbot) {
            window.initializeChatbot("680bf5f6121a065b13cfd6aa");
            return;
          }
          const checkInitialize = setInterval(function() {
            if (window.initializeChatbot) {
              window.initializeChatbot("680bf5f6121a065b13cfd6aa");
              clearInterval(checkInitialize);
            }
          }, 100);
          setTimeout(() => clearInterval(checkInitialize), 10000);
        });
      `,
          }}
        />
      </body>
    </html>
  );
}
