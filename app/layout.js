export const metadata = {
  title: 'PK NET Billing',
  description: 'POS Billing System for PK NET',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
