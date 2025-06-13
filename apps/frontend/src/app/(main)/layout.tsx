export default function MainLayout({
  children,
  authModal,
  settingsModal,
  deckViewModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
  settingsModal: React.ReactNode;
  deckViewModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {authModal}
      {settingsModal}
      {deckViewModal}
    </>
  );
}
