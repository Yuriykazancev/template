import { IArtist } from "../types/Artist";
import { SearchArtist } from "./SearchArtist";

interface IArtists {
    artists: IArtist[] | null;
    query: string;
}

export const SearchArtists = (props: IArtists) => {
    const { artists, query = '' } = props;

    if (artists && artists.length > 0) {
        return (
            <div>
                <ul className="container_ul artistsContainer_ul" id="search__artistsContainer">
                    {artists.map((artist) => <SearchArtist key={artist.url} artist={artist} />)}
                </ul>
                <a className="moreLink artistsContainer__moreLink" href={'https://www.last.fm/search/artists?q=' + query}>More artists &gt;</a>
            </div>
        );
    }
    return (
        <p className="noAlbumsMessage message__visible">No albums found.</p>
    );
};