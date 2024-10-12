export function usernameValidator(username) {
  if (!username) return "Username can't be empty.";
  if (username.length < 3) return "Username must be at least 3 characters long.";
  return '';
}