export const metadata = {
  title: "Pastebin Lite",
  description: "Simple Pastebin clone"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
