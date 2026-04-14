export default function hasRole(user, role) {
  if (!user || !user.role) {
    return false;
  }

  return String(user.role).toLowerCase() === String(role).toLowerCase();
}
