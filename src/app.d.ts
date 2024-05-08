// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { User } from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface Locals {
			user?: User
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
