'use client';

import { AuthDialog } from '@/components/dialogs/auth-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  // The dialog needs to be controlled for the fallback page as well.
  // We can default it to open and then navigate away when it's closed.
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the dialog is closed on this dedicated page,
      // navigate back or to a default page like home.
      router.push('/'); // Or router.back() if that's more appropriate
    }
    setIsDialogOpen(open);
  };

  // If the dialog is closed by other means (e.g. router.back() from intercept)
  // and the page is still visible, we might need to ensure it's open or redirect.
  // For this setup, it's simpler to assume it's always open initially.

  return <AuthDialog open={isDialogOpen} onOpenChange={handleOpenChange} />;
}
