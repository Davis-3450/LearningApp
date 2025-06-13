'use client';

import { AuthDialog } from '@/components/dialogs/auth-dialog';
import { useRouter } from 'next/navigation';

export default function LoginModal() {
  const router = useRouter();
  return <AuthDialog open={true} onOpenChange={() => router.back()} />;
}
