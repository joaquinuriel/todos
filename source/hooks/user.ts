import { useSession } from "next-auth/react";

export default function useUser() {
  const { data, status } = useSession();
  const loading = status === "loading";
  const user = data?.user;
  return { user, loading };
}
