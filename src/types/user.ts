/** Safe subset of User for client components (no password). */
export type CurrentUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
};

export function displayName(u: Pick<CurrentUserProfile, "firstName" | "lastName">) {
  return `${u.firstName} ${u.lastName}`.trim();
}
