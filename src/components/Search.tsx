import { useEffect, useState } from 'react';
import { ITrack } from '../types/Track';
import { searchArtistsWithAlbumImages, searchAlbumsWithImages, searchTracksWithAlbumImages } from '../functions/Server';
import { IArtist } from '../types/Artist';
import { IAlbum } from '../types/Album';
import { SearchArtists } from './SearchArtists';
import { SearchAlbums } from './SearchAlbums';
import { SearchTracks } from './SearchTracks';
import { useHistory } from 'react-router-dom';

interface SearchProps {
    query: string;
}

export const Search = ({ query }: SearchProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchArtists, setSearchArtists] = useState<IArtist[] | null>(null);
    const [searchAlbums, setSearchAlbums] = useState<IAlbum[] | null>(null);
    const [searchTracks, setSearchTracks] = useState<ITrack[] | null>(null);
    const history = useHistory();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const searchQueryVar = searchQuery.trim();
            if (searchQueryVar) {
                history.push(`/search/${searchQueryVar}`);
            }
        }
    };

    useEffect(() => {
        async function fetchData() {
            const searchArtists = await searchArtistsWithAlbumImages(query);
            setSearchArtists(searchArtists);
        }
        fetchData();
    }, [query]);

    useEffect(() => {
        async function fetchData() {
            const searchAlbums = await searchAlbumsWithImages(query);
            setSearchAlbums(searchAlbums);
        }
        fetchData();
    }, [query]);

    useEffect(() => {
        async function fetchData() {
            const searchTracks = await searchTracksWithAlbumImages(query);
            setSearchTracks(searchTracks);
        }
        fetchData();
    }, [query]);

    const handleReset = () => {
        setSearchQuery('');
    };

    return (
        <main className="main">
            <div className="mainContainer">
                <h1 className="textSearch">Search result for "{query}"</h1>
                <div className="inputContainer">
                    <input type="text" className="searchInput" placeholder="Search for music..." id="input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} autoComplete="off" />
                    <button type="reset" className="resetSearchButton" onClick={handleReset} ></button>
                </div>

                <div className="container searchArtistsContainer">
                    <h2>Artists</h2>
                    <SearchArtists artists={searchArtists} query={query} />
                </div>

                <div className="container searchAlbumsContainer">
                    <h2>Albums</h2>
                    <SearchAlbums albums={searchAlbums} query={query} />
                </div>

                <div className="container searchTracksContainer">
                    <h2>Tracks</h2>
                    <SearchTracks tracks={searchTracks} query={query} />
                </div>
            </div>
        </main>
    );
};