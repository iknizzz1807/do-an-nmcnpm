// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DSMuaGiai, Session, Settings, User } from "$lib/typesDatabase";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals { // She is for the server
      user: User | null;
      session: Session | null;
      muaGiai: DSMuaGiai | null;
      setting: Settings;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
