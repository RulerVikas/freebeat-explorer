import { Sidebar } from "./Sidebar";
import { PlayerBar } from "./PlayerBar";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LibraryProvider } from "@/contexts/LibraryContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <LibraryProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
          <PlayerBar />
        </div>
      </LibraryProvider>
    </PlayerProvider>
  );
}
