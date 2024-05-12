import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "React - Progress Knight",
  description: "Simple idle game built with React",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="grid h-screen grid-rows-[auto,1fr] p-2">
              <span className="pb-2 text-2xl">Progress Knight - React</span>
              <div className="overflow-y-scroll">{children}</div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
