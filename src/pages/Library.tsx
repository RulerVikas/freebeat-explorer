import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Library as LibraryIcon, Heart, Music, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLibrary } from "@/contexts/LibraryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { SongCard } from "@/components/SongCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { toast } from "sonner";

export default function Library() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "playlists";
  const { likedSongs, playlists, createPlaylist } = useLibrary();
  const { playHistory } = usePlayer();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    createPlaylist(newPlaylistName, newPlaylistDesc);
    toast.success("Playlist created successfully!");
    setNewPlaylistName("");
    setNewPlaylistDesc("");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="flex items-center gap-3 mb-8">
        <LibraryIcon className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold">Your Library</h1>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="playlists" className="gap-2">
            <Music className="w-4 h-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="liked" className="gap-2">
            <Heart className="w-4 h-4" />
            Liked Songs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    placeholder="My Playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                  <Input
                    placeholder="Playlist description"
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreatePlaylist} className="w-full">
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {playlists.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground mb-4">
                You haven't created any playlists yet
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  id={playlist.id}
                  name={playlist.name}
                  description={playlist.description}
                  imageUrl={playlist.tracks[0]?.artworkUrl}
                  trackCount={playlist.tracks.length}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="space-y-2">
          {likedSongs.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                You haven't liked any songs yet
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Liked Songs</h2>
                <p className="text-muted-foreground">{likedSongs.length} songs</p>
              </div>
              {likedSongs.map((track, idx) => (
                <SongCard key={track.id} track={track} index={idx} showIndex />
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
