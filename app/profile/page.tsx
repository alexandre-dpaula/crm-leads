import { getCurrentUser } from '@/lib/auth';
import ProfileClient from '@/components/forms/profile-client';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl ?? undefined
      }}
    />
  );
}
