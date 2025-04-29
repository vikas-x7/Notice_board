export function getUserHomeRoute(role: string | null | undefined) {
  if (role === "STUDENT") {
    return "/student/feed";
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }

  return "/login";
}
