import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AGRO GENIX: Smart Farming & Agro-Tourism",
    short_name: "AGRO GENIX",
    description: "AI-powered platform for smart farming and agro-tourism",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9c8269",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
