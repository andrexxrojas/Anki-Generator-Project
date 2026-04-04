import "./globals.css";
import styles from "./layout.module.css";
import type { Metadata } from "next";
import { regular, medium, semibold, bold } from "./fonts";
import {ReactNode} from "react";
import {AuthProvider} from "@/app/context/AuthContext/AuthContext";
import NavBar from "@/app/components/NavBar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Anki Generator",
  description: "Create flashcards and generate Anki decks automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={`${regular.variable} ${medium.variable} ${semibold.variable} ${bold.variable}`}
      >
        <body className={styles.bodyContainer}>
          <AuthProvider>
            <NavBar />
            <main>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </main>
          </AuthProvider>
        </body>
      </html>
  );
}
