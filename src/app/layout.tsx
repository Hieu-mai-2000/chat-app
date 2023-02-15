// import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' color='white'>
      <head />
      <body>{children}</body>
    </html>
  )
}
