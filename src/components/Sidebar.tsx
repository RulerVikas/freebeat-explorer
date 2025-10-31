import { Home, Search, Library, PlusSquare, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/contexts/LibraryContext";

export function Sidebar() {
  const location = useLocation();
  const { playlists } = useLibrary();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Your Library", path: "/library" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Spotify Clone
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-4 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
              location.pathname === path && "text-primary bg-sidebar-accent font-medium"
            )}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </Link>
        ))}

        <Link
          to="/library?tab=playlists"
          className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <PlusSquare className="w-6 h-6" />
          <span>Create Playlist</span>
        </Link>

        <Link
          to="/library?tab=liked"
          className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <Heart className="w-6 h-6" />
          <span>Liked Songs</span>
        </Link>
      </nav>

      {playlists.length > 0 && (
        <div className="px-3 pb-6 space-y-1 max-h-64 overflow-y-auto">
          <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Playlists
          </h3>
          {playlists.map(playlist => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="block px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 truncate"
            >
              {playlist.name}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
