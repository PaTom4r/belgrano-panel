export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    // Protect all routes except: display, login, api/display, api/auth, static files
    "/((?!display|login|api/display|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
