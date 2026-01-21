import { UserButton, useUser } from '@clerk/clerk-react';

const UserSection = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) return null;

  return (
    <div className="flex items-center gap-3 ml-2 pl-3 border-l border-dark-border">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-white">
          {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
        </p>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'w-9 h-9',
            userButtonPopoverCard: 'bg-[#141414] border border-[#2a2a2a]',
            userButtonPopoverActionButton: 'text-white hover:bg-[#2a2a2a]',
            userButtonPopoverActionButtonText: 'text-white',
            userButtonPopoverFooter: 'hidden',
          }
        }}
      />
    </div>
  );
};

export default UserSection;
