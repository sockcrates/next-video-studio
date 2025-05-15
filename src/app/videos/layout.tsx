export default function VideosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-4 my-3 sm:mx-8 sm:my-6 md:mx-12 md:my-8">{children}</div>
  );
}
