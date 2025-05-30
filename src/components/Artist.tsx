import { IArtist } from "../types/Artist";

interface IArtistProps {
    artist: IArtist;
}

export const Artist = (props: IArtistProps) => {
    const {artist} = props;

    if (artist.tags.length === 3) {
        return (
            <li className="artistsContainer__artist">
                <a className="artist__url" href={artist.url}>
                    <img className="artist__image" src={artist.image} alt="" />
                    <div className="artist__name">{artist.name}</div>
                </a>
                <div className="artist__tags">
                    <a className="tag" href={artist.tags[0].url}>{artist.tags[0].name}</a> ·
                    <a className="tag" href={artist.tags[1].url}>{artist.tags[1].name}</a> ·
                    <a className="tag" href={artist.tags[2].url}>{artist.tags[2].name}</a>
                </div>
            </li>
        );
    }

    return (
        <li className="artistsContainer__artist">
            <a className="artist__url" href={artist.url}>
                <img className="artist__image" src={artist.image} alt="" />
                <div className="artist__name">${artist.name}</div>
            </a>
        </li>
    );
};