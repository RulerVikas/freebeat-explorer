import { useState } from "react";
import { Search as SearchIcon, Music, User, Disc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchTracks, searchArtists, searchAlbums } from "@/lib/api";
import { Track, Artist, Album } from "@/types/music";
import { SongCard } from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setQuery(searchQuery);

    const [trackResults, artistResults, albumResults] = await Promise.all([
      searchTracks(searchQuery),
      searchArtists(searchQuery),
      searchAlbums(searchQuery),
    ]);

    setTracks(trackResults);
    setArtists(artistResults);
    setAlbums(albumResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            className="pl-12 h-12 text-lg bg-card border-border"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {!query && (
        <div className="text-center py-20">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">
            Search for songs, artists, or albums
          </p>
        </div>
      )}

      {query && (
        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="tracks" className="gap-2">
              <Music className="w-4 h-4" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="gap-2">
              <User className="w-4 h-4" />
              Artists
            </TabsTrigger>
            <TabsTrigger value="albums" className="gap-2">
              <Disc className="w-4 h-4" />
              Albums
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-2">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : tracks.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No songs found</p>
            ) : (
              tracks.map((track, idx) => (
                <SongCard key={track.id} track={track} index={idx} showIndex />
              ))
            )}
          </TabsContent>

          <TabsContent value="artists" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted/50 rounded-full animate-pulse" />
              ))
            ) : artists.length === 0 ? (
              <p className="col-span-full text-center py-12 text-muted-foreground">
                No artists found
              </p>
            ) : (
              artists.map(artist => (
                <Link
                  key={artist.id}
                  to={`/artist/${encodeURIComponent(artist.name)}`}
                  className="group"
                >
                  <div className="bg-card rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer shadow-card hover:shadow-glow">
                    {artist.imageUrl ? (
                      <img
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-full aspect-square rounded-full object-cover mb-4"
                      />
                    ) : (
                      <div className="w-full aspect-square rounded-full bg-muted flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold text-center truncate group-hover:text-primary transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">Artist</p>
                  </div>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="albums" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted/50 rounded-lg animate-pulse" />
              ))
            ) : albums.length === 0 ? (
              <p className="col-span-full text-center py-12 text-muted-foreground">
                No albums found
              </p>
            ) : (
              albums.map(album => (
                <Link
                  key={album.id}
                  to={`/album/${encodeURIComponent(album.name)}/${encodeURIComponent(album.artistName)}`}
                  className="group"
                >
                  <div className="bg-card rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer shadow-card hover:shadow-glow">
                    <img
                      src={album.artworkUrl}
                      alt={album.name}
                      className="w-full aspect-square rounded-lg object-cover mb-4"
                    />
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {album.artistName}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
