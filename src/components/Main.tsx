import { useEffect, useState } from 'react';
import { ITrack } from '../types/Track';
import { Tracks } from './Tracks';
import { getTopArtistsWithAlbumImages, getTopTracks } from '../functions/Server';
import { Artists } from './Artists';
import { IArtist } from '../types/Artist';

export const Main = () => {
    const [artists, setArtists] = useState<IArtist[] | null>(null);
    const [tracks, setTracks] = useState<ITrack[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            const artists = await getTopArtistsWithAlbumImages();
            setArtists(artists);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const tracks = await getTopTracks();
            setTracks(tracks);
        }
        fetchData();
    }, []);

    return (
        <main className="main">
            <div className="mainContent">
                <div className="main__header">Music</div>

                <div className="mainContainer">
                    <div className="mainContainer__header">Hot right now</div>
                    <hr className="header__separator" />
                    <Artists artists={artists} />
                </div>

                <div className="mainContainer">
                    <div className="mainContainer__header">Popular tracks</div>
                    <hr className="header__separator" />
                    <Tracks tracks={tracks} />
                </div>
            </div>
        </main>
    );
};