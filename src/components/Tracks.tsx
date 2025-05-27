import { ITrack } from "../types/Track";
import { Track } from "./Track";

interface ITracks {
    tracks: ITrack[] | null;
}

export const Tracks = (props: ITracks) => {
    const { tracks } = props;

    if (tracks) {
        return (
        <ul className="tracksContainer" >
            {tracks.map((track) => <Track key={track.url} track={track} />)}
        </ul>
    );
    }
    return null;
};