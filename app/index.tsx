import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to login page for now
  return <Redirect href="/login" />;
}
