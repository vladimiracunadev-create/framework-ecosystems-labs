export const metadata = { title: "HTML en flujo — Next.js" };

export default function Raiz({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
