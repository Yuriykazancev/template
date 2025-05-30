import { IAlbum } from "../types/Album";

interface IAlbumProps {
    album: IAlbum;
}

export const SearchAlbum = (props: IAlbumProps) => {
    const { album } = props;

    return (
        <li className="container_li search__albumsContainer__album" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('${album.image}')` }}>
            <a className="search__artist__url" href={album.url}>
                <div className="search__album__name li__mainText">{album.name}</div>
                <div className="search__album__artistName li__subtext">
                    <object>
                        <a className="search__artist__link" href={album.artistUrl}>{album.artistName}</a>
                    </object>
                </div>
            </a>
        </li>
    );
};