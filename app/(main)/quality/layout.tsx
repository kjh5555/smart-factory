import QualityProviders from './_components/QualityProviders';

export default function QualityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QualityProviders>
      {children}
    </QualityProviders>
  );
} 