import { useParams, useNavigate } from "react-router-dom";
import { Play, Trash2, Music } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { SongCard } from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Playlist() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, deletePlaylist } = useLibrary();
  const { addToQueue } = usePlayer();

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">Playlist not found</p>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      addToQueue(playlist.tracks, 0);
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      toast.success("Playlist deleted");
      navigate("/library");
    }
  };

  const coverImage = playlist.coverUrl || playlist.tracks[0]?.artworkUrl;

  return (
    <div className="min-h-screen pb-32">
      {/* Playlist Header */}
      <div className="bg-gradient-secondary rounded-lg p-8 md:p-12 mb-8 animate-slide-in">
        <div className="flex items-end gap-6">
          {coverImage ? (
            <img
              src={coverImage}
              alt={playlist.name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover flex-shrink-0 shadow-glow"
            />
          ) : (
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Music className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-foreground/80 mb-2">{playlist.description}</p>
            )}
            <p className="text-sm">
              {playlist.tracks.length} songs
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          size="lg"
          onClick={handlePlayAll}
          disabled={playlist.tracks.length === 0}
          className="rounded-full w-14 h-14 shadow-glow"
        >
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Playlist
        </Button>
      </div>

      {/* Track List */}
      <div className="space-y-2 animate-slide-in" style={{ animationDelay: "0.1s" }}>
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              This playlist is empty
            </p>
            <p className="text-muted-foreground mt-2">
              Search for songs and add them to your playlist
            </p>
          </div>
        ) : (
          playlist.tracks.map((track, idx) => (
            <SongCard key={track.id} track={track} index={idx} showIndex />
          ))
        )}
      </div>
    </div>
  );
}
