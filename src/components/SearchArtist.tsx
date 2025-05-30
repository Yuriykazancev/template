import { splitter } from "../functions/Server";
import { IArtist } from "../types/Artist";

interface IArtistProps {
    artist: IArtist;
}

export const SearchArtist = (props: IArtistProps) => {
    const { artist } = props;

    return (
        <li className="container_li search__artistsContainer__artist" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('${artist.image}')`}}>
            <a className="search__artist__url" href={artist.url}>
                <div className="search__artist__name li__mainText">{artist.name}</div>
                <div className="search__artist__listeners li__subtext">{splitter(artist.listeners)} listeners</div>
            </a>
        </li>
    );
};