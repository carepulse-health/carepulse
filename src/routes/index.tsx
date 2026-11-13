import { createFileRoute } from "@tanstack/react-router";
import { CarePulsePatientApp } from "@/components/carepulse-patient-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarePulse | Patient care preview" },
      {
        name: "description",
        content: "Explore the CarePulse patient app with clearly labeled sample appointments and clinic information.",
      },
      { property: "og:title", content: "CarePulse | Patient care preview" },
      {
        property: "og:description",
        content: "Explore the CarePulse patient app with clearly labeled sample appointments and clinic information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CarePulsePatientApp />;
}
