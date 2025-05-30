import { IArtist } from "../types/Artist";
import { Artist } from "./Artist";

interface IArtists {
    artists: IArtist[] | null;
}

export const Artists = (props: IArtists) => {
    const { artists } = props;

    if (artists) {
        return (
        <ul className="artistsContainer" >
            {artists.map((artist) => <Artist key={artist.url} artist={artist} />)}
        </ul>
    );
    }
    return null;
};