'use client';

import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { useRouter } from 'next/navigation';

export default function SettingsModal() {
  const router = useRouter();
  return <SettingsDialog open={true} onOpenChange={() => router.back()} />;
}
