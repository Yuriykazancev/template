import { ITrack } from "../types/Track";
import { SearchTrack } from "./SearchTrack";

interface ITracks {
    tracks: ITrack[] | null;
    query: string;
}

export const SearchTracks = (props: ITracks) => {
    const { tracks, query = '' } = props;

    if (tracks && tracks.length > 0) {
        return (
            <div>
                <table className="tracksTable">
                    <tbody className="tracksTable__body">
                        {tracks.map((track) => <SearchTrack key={track.url} track={track} />)}
                    </tbody>
                </table>
                <a className="moreLink tracksContainer__moreLink" href={'https://www.last.fm/search/tracks?q=' + query}>More tracks &gt;</a>
            </div>
        );
    }
    return (
        <p className="noTracksMessage message__visible">No tracks found.</p>
    );
};