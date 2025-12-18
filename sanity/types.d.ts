import "sanity";

declare module "sanity" {
  interface SanityReferenceOverride {
    [key: string]: {
      [key: string]: any;
    };
  }
}
