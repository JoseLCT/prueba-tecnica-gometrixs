import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Sidebar } from "./_components/sidebar";
import { MessageProvider } from "./_providers/message-provider";
import { CustomBreadcrumb } from "./_components/custom-breadcrumb";

export const metadata: Metadata = {
  title: "Gometrixs - Prueba Técnica",
  description: "Prueba técnica para Gometrixs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <MessageProvider>
            <div className="flex">
              <Sidebar />
              <div className="flex flex-col gap-5 flex-1 min-h-screen p-10">
                <CustomBreadcrumb />
                {children}
              </div>
            </div>
          </MessageProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
