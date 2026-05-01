import { createFileRoute } from "@tanstack/react-router";
import { LoveGame } from "../components/LoveGame";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <LoveGame />;
}
