export const metadata = {
  title: "CIISIC API",
  description: "CII Industry-Student Innovation Collaboration Platform — Backend API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
