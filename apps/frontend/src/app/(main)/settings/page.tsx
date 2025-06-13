'use client';

import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  // The dialog needs to be controlled for the fallback page as well.
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the dialog is closed on this dedicated page,
      // navigate back or to a default page like home.
      router.push('/'); // Or router.back()
    }
    setIsDialogOpen(open);
  };

  return <SettingsDialog open={isDialogOpen} onOpenChange={handleOpenChange} />;
}
