import { useEffect, useState } from "react";
import { getTrendingTracks } from "@/lib/api";
import { Track } from "@/types/music";
import { SongCard } from "@/components/SongCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { Music2, TrendingUp, Clock } from "lucide-react";

export default function Index() {
  const [trending, setTrending] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { playHistory, addToQueue } = usePlayer();
  const { playlists } = useLibrary();

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    const tracks = await getTrendingTracks();
    setTrending(tracks);
    setLoading(false);
  };

  const recentTracks = playHistory.slice(0, 6).map(h => h.track);

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="bg-gradient-hero p-8 md:p-12 mb-8 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="w-8 h-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">Welcome Back</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover and play millions of songs with Spotify Clone
        </p>
      </section>

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <section className="mb-12 animate-slide-in">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Recently Played</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTracks.map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                className="flex items-center gap-4 bg-card rounded-lg p-3 hover:bg-muted/50 transition-all cursor-pointer group shadow-card"
                onClick={() => addToQueue(recentTracks, idx)}
              >
                <img
                  src={track.artworkUrl}
                  alt={track.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {track.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artistName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Your Playlists */}
      {playlists.length > 0 && (
        <section className="mb-12 animate-slide-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map(playlist => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                name={playlist.name}
                description={playlist.description}
                imageUrl={playlist.coverUrl || playlist.tracks[0]?.artworkUrl}
                trackCount={playlist.tracks.length}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now */}
      <section className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {trending.map((track, idx) => (
              <SongCard key={track.id} track={track} index={idx} showIndex />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
