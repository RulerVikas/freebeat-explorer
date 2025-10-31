import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, Heart } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    shuffle,
  } = usePlayer();

  const { isLiked, addLikedSong, removeLikedSong } = useLibrary();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLike = () => {
    if (!currentTrack) return;
    if (isLiked(currentTrack.id)) {
      removeLikedSong(currentTrack.id);
    } else {
      addLikedSong(currentTrack);
    }
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-border flex items-center justify-center">
        <p className="text-muted-foreground">No track playing</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-border backdrop-blur-xl bg-opacity-90 z-50">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
          <img
            src={currentTrack.artworkUrl}
            alt={currentTrack.name}
            className="w-14 h-14 rounded-lg object-cover shadow-card"
          />
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{currentTrack.name}</p>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artistName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isLiked(currentTrack.id) && "fill-primary text-primary"
              )}
            />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={shuffle}
              className="hover:text-primary"
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={previousTrack}
              className="hover:scale-110 transition-transform"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={isPlaying ? pauseTrack : resumeTrack}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 hover:scale-110 transition-transform shadow-glow"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              className="hover:scale-110 transition-transform"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={([value]) => seekTo(value)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
