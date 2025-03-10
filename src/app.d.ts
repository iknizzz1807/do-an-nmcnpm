// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DSMuaGiai, Session, User } from "$lib/types";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals { // She is for the server
      user: User | null;
      session: Session | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
