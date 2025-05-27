import { ITrack } from "../types/Track";

interface ITrackProps {
    track: ITrack;
}

export const Track = (props: ITrackProps) => {
    const {track} = props;

    if (track.tags.length === 3) {
        return (
            <li className="tracksContainer__track" key={track.url}>
                <a className="artist__url" href={track.url}>
                    <img className="track__image" src={track.image} alt="" />
                </a>
                <div className="track__info">
                    <a className="artist__url" href={track.url}>
                        <div className="track__name" >{track.name}</div>
                    </a>
                    <a className="track__artistName" href={track.artistUrl}>{track.artistName}</a>
                    <div className="track__tags">
                        <a className="tag" href={track.tags[0].url}>{track.tags[0].name}</a> ·
                        <a className="tag" href={track.tags[1].url}>{track.tags[1].name}</a> ·
                        <a className="tag" href={track.tags[2].url}>{track.tags[2].name}</a>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li className="tracksContainer__track" key={track.url}>
            <a className="artist__url" href={track.url}>
                <img className="track__image" src={track.image} alt="" />
            </a>
            <div className="track__info">
                <a className="artist__url" href={track.url}>
                    <div className="track__name" >{track.name}</div>
                </a>
                <a className="track__artistName" href={track.artistUrl}>{track.artistName}</a>
            </div>
        </li>
    );
};