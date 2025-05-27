import { splitter } from "../functions/Server";
import { ITrack } from "../types/Track";

interface ITrackProps {
    track: ITrack;
}

export const SearchTrack = (props: ITrackProps) => {
    const { track } = props;

    return (
        <tr className="tracksTable__track">
            <td className="cell__image">
                <a className="search__track__link" href={track.url}>
                    <img className="search__track__image" src={track.image} alt="" />
                </a>
            </td>
            <td className="search__track__name"><a className="search__track__link" href={track.url}>{track.name}</a></td>
            <td className="search__track__artistName"><a className="search__track__link" href={track.artistUrl}>{track.artistName}</a></td>
            <td className="search__track__listeners">{splitter(track.listeners)} listeners</td>
        </tr>
    );
};