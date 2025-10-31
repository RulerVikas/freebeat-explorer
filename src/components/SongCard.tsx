import { Play, Heart, MoreVertical } from "lucide-react";
import { Track } from "@/types/music";
import { Button } from "./ui/button";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { cn } from "@/lib/utils";

interface SongCardProps {
  track: Track;
  index?: number;
  showIndex?: boolean;
}

export function SongCard({ track, index, showIndex = false }: SongCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { isLiked, addLikedSong, removeLikedSong } = useLibrary();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    playTrack(track);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked(track.id)) {
      removeLikedSong(track.id);
    } else {
      addLikedSong(track);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer",
        isCurrentTrack && "bg-muted/50"
      )}
      onClick={handlePlay}
    >
      {showIndex && (
        <div className="w-6 text-center text-muted-foreground group-hover:hidden">
          {index !== undefined ? index + 1 : ""}
        </div>
      )}
      {showIndex && (
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 hidden group-hover:flex"
          onClick={handlePlay}
        >
          <Play className="w-4 h-4" />
        </Button>
      )}

      <div className="relative flex-shrink-0">
        <img
          src={track.artworkUrl}
          alt={track.name}
          className="w-12 h-12 rounded object-cover"
        />
        {!showIndex && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
            <Play className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", isCurrentTrack && "text-primary")}>
          {track.name}
        </p>
        <p className="text-sm text-muted-foreground truncate">{track.artistName}</p>
      </div>

      <p className="text-sm text-muted-foreground hidden md:block truncate max-w-[200px]">
        {track.albumName}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100"
          onClick={handleLike}
        >
          <Heart
            className={cn(
              "w-5 h-5",
              isLiked(track.id) && "fill-primary text-primary"
            )}
          />
        </Button>
        <span className="text-sm text-muted-foreground w-12 text-right">
          {Math.floor(track.duration / 60000)}:{String(Math.floor((track.duration % 60000) / 1000)).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
