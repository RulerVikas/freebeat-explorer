import { Play, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface PlaylistCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount?: number;
}

export function PlaylistCard({ id, name, description, imageUrl, trackCount }: PlaylistCardProps) {
  return (
    <Link to={`/playlist/${id}`}>
      <div className="group relative bg-card rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer shadow-card hover:shadow-glow">
        <div className="relative mb-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full aspect-square rounded-lg object-cover"
            />
          ) : (
            <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-glow rounded-full w-12 h-12 bg-primary hover:bg-primary/90 hover:scale-110"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </Button>
        </div>
        <h3 className="font-semibold mb-1 truncate">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description || `${trackCount || 0} songs`}
        </p>
      </div>
    </Link>
  );
}
