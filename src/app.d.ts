// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, Settings, User } from "$lib/typesAuth";
import type { MuaGiai } from "$lib/typesDatabase";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals { // She is for the server
      user: User | null;
      session: Session | null;
      muaGiai: MuaGiai | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
