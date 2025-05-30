import { IAlbum } from "../types/Album";
import { SearchAlbum } from "./SearchAlbum";

interface IAlbums {
    albums: IAlbum[] | null;
    query: string;
}

export const SearchAlbums = (props: IAlbums) => {
    const { albums, query = '' } = props;

    if (albums && albums.length > 0) {
        return (
            <div>
                <ul className="container_ul albumsContainer_ul" id="search__albumsContainer">
                    {albums.map((album) => <SearchAlbum key={album.url} album={album} />)}
                </ul>
                <a className="moreLink albumsContainer__moreLink" href={'https://www.last.fm/search/albums?q=' + query}>More albums &gt;</a>
            </div>
        );
    }
    return (
        <p className="noArtistsMessage message__visible">No artists found.</p>
    );
};