export const isAdmin = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin-token") === "lukas-admin-token";
  }
  return false;
};
