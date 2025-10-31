import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { getAlbumTracks } from "@/lib/api";
import { Track } from "@/types/music";
import { SongCard } from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/PlayerContext";

export default function Album() {
  const { name, artist } = useParams<{ name: string; artist: string }>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToQueue } = usePlayer();

  useEffect(() => {
    if (name && artist) {
      loadAlbumTracks();
    }
  }, [name, artist]);

  const loadAlbumTracks = async () => {
    if (!name || !artist) return;
    setLoading(true);
    const results = await getAlbumTracks(
      decodeURIComponent(name),
      decodeURIComponent(artist)
    );
    setTracks(results);
    setLoading(false);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      addToQueue(tracks, 0);
    }
  };

  const albumCover = tracks[0]?.artworkUrl;
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60000);

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
      {/* Album Header */}
      <div className="bg-gradient-secondary rounded-lg p-8 md:p-12 mb-8 animate-slide-in">
        <div className="flex items-end gap-6">
          {albumCover && (
            <img
              src={albumCover}
              alt={name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover flex-shrink-0 shadow-glow"
            />
          )}
          <div>
            <p className="text-sm font-medium mb-2">ALBUM</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {name ? decodeURIComponent(name) : "Unknown Album"}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {artist ? decodeURIComponent(artist) : "Unknown Artist"}
              </span>
              <span>•</span>
              <span>{tracks.length} songs</span>
              {totalMinutes > 0 && (
                <>
                  <span>•</span>
                  <span>{totalMinutes} min</span>
                </>
              )}
            </div>
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

      {/* Track List */}
      <div className="space-y-2 animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div>#</div>
          <div>TITLE</div>
          <div className="hidden md:block">ALBUM</div>
          <div className="flex justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        {tracks.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No tracks found</p>
        ) : (
          tracks.map((track, idx) => (
            <SongCard key={track.id} track={track} index={idx} showIndex />
          ))
        )}
      </div>
    </div>
  );
}
