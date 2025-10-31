import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Play } from "lucide-react";
import { getArtistTracks } from "@/lib/api";
import { Track } from "@/types/music";
import { SongCard } from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/PlayerContext";

export default function Artist() {
  const { name } = useParams<{ name: string }>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToQueue } = usePlayer();

  useEffect(() => {
    if (name) {
      loadArtistTracks();
    }
  }, [name]);

  const loadArtistTracks = async () => {
    if (!name) return;
    setLoading(true);
    const results = await getArtistTracks(decodeURIComponent(name));
    setTracks(results);
    setLoading(false);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      addToQueue(tracks, 0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-32">
        <div className="h-64 bg-muted/50 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Artist Header */}
      <div className="bg-gradient-secondary rounded-lg p-8 md:p-12 mb-8 animate-slide-in">
        <div className="flex items-end gap-6">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-muted flex items-center justify-center flex-shrink-0 shadow-glow">
            <User className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">ARTIST</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {name ? decodeURIComponent(name) : "Unknown Artist"}
            </h1>
            <p className="text-lg text-foreground/80">
              {tracks.length} songs available
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          size="lg"
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="rounded-full w-14 h-14 shadow-glow"
        >
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </Button>
      </div>

      {/* Popular Tracks */}
      <div className="space-y-2 animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-2xl font-bold mb-6">Popular Tracks</h2>
        {tracks.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No tracks found</p>
        ) : (
          tracks.slice(0, 10).map((track, idx) => (
            <SongCard key={track.id} track={track} index={idx} showIndex />
          ))
        )}
      </div>
    </div>
  );
}
