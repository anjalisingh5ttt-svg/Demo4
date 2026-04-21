import { createClient } from "next-sanity";

export const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});