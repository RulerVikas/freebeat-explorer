import { Track, Artist, Album } from "@/types/music";

const ITUNES_API_BASE = "https://itunes.apple.com";

// Helper to transform iTunes response to our Track type
function transformItunesTrack(item: any): Track {
  return {
    id: String(item.trackId || item.collectionId || Math.random()),
    name: item.trackName || item.collectionName || "Unknown",
    artistName: item.artistName || "Unknown Artist",
    albumName: item.collectionName || "Unknown Album",
    artworkUrl: item.artworkUrl100?.replace("100x100", "300x300") || item.artworkUrl60 || "",
    previewUrl: item.previewUrl || "",
    duration: item.trackTimeMillis || 30000,
    releaseDate: item.releaseDate,
  };
}

// Search for tracks
export async function searchTracks(query: string, limit = 20): Promise<Track[]> {
  try {
    const response = await fetch(
      `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );
    const data = await response.json();
    return data.results?.map(transformItunesTrack) || [];
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
}

// Get trending/featured tracks (using popular artists)
export async function getTrendingTracks(): Promise<Track[]> {
  const popularArtists = ["Taylor Swift", "The Weeknd", "Ed Sheeran", "Ariana Grande", "Drake"];
  const randomArtist = popularArtists[Math.floor(Math.random() * popularArtists.length)];
  return searchTracks(randomArtist, 20);
}

// Search for artists
export async function searchArtists(query: string, limit = 10): Promise<Artist[]> {
  try {
    const response = await fetch(
      `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=${limit}`
    );
    const data = await response.json();
    return data.results?.map((item: any) => ({
      id: String(item.artistId || Math.random()),
      name: item.artistName || "Unknown Artist",
      imageUrl: item.artworkUrl100 || "",
    })) || [];
  } catch (error) {
    console.error("Error searching artists:", error);
    return [];
  }
}

// Get artist's top tracks
export async function getArtistTracks(artistName: string, limit = 20): Promise<Track[]> {
  return searchTracks(artistName, limit);
}

// Search for albums
export async function searchAlbums(query: string, limit = 10): Promise<Album[]> {
  try {
    const response = await fetch(
      `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&entity=album&limit=${limit}`
    );
    const data = await response.json();
    return data.results?.map((item: any) => ({
      id: String(item.collectionId || Math.random()),
      name: item.collectionName || "Unknown Album",
      artistName: item.artistName || "Unknown Artist",
      artworkUrl: item.artworkUrl100?.replace("100x100", "300x300") || "",
      releaseDate: item.releaseDate,
      trackCount: item.trackCount,
    })) || [];
  } catch (error) {
    console.error("Error searching albums:", error);
    return [];
  }
}

// Get album tracks
export async function getAlbumTracks(albumName: string, artistName: string): Promise<Track[]> {
  return searchTracks(`${albumName} ${artistName}`, 15);
}
