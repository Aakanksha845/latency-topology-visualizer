import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HomeContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
