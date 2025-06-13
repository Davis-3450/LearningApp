'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger is not needed here if triggered externally
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login or Sign Up</DialogTitle>
          <DialogDescription>
            Enter your credentials to login or create a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Username Field: Stack label on top of input on small screens, side-by-side on larger */}
          <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-x-4 gap-y-2">
            <Label htmlFor="username" className="sm:text-right">
              Username
            </Label>
            <Input id="username" placeholder="Your username" className="sm:col-span-3" />
          </div>
          {/* Password Field: Stack label on top of input on small screens, side-by-side on larger */}
          <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-x-4 gap-y-2">
            <Label htmlFor="password" className="sm:text-right">
              Password
            </Label>
            <Input id="password" type="password" placeholder="Your password" className="sm:col-span-3" />
          </div>
        </div>
        <DialogFooter>
          {/* Buttons can stack on very small screens if needed, but default flex behavior of footer might be okay */}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={() => console.log('Login clicked (no-op)')}>Login</Button>
          <Button type="submit" variant="secondary" onClick={() => console.log('Sign Up clicked (no-op)')}>Sign Up</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
