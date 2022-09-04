import type { User as Default } from "next-auth";

declare module "next-auth" {
  interface User extends Default {
    id: string;
  }
}
