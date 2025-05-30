import { IAlbum } from '../types/Album';
import { IArtist } from '../types/Artist';
import { ITrack } from '../types/Track';

const apiKey = 'a3b705fa06cf54a968e1b8884fce7802';

/**
 * Получение топовых артистов
 *
 * @returns {Object[]} массив объектов с данными о топовых артистах
 */
export async function getTopArtistsWithAlbumImages() {
    try {
        const artistsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=12`);

        if (artistsResponse.status != 200) {
            return null;
        }

        const artistsData = await artistsResponse.json();
        const artists = artistsData.artists.artist;

        const artistsWithAlbumImages: IArtist[] = await Promise.all(artists.map(async (artist: any) => {
            const [albumsResponse, tagsResponse] = await Promise.all([
                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${apiKey}&format=json&limit=1`),
                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist.name}&api_key=${apiKey}&format=json`)
            ]);

            let albumImage = '/white-star.webp';
            if (albumsResponse.status === 200) {
                const albumsData = await albumsResponse.json();
                const albums = albumsData.topalbums.album;
                if (albums.length > 0) {
                    const imgObj = albums[0].image.find((img: any) => img.size === 'extralarge' && img['#text']);
                    if (imgObj) {
                        albumImage = imgObj['#text'];
                    }
                }
            }

            let topTags = null;
            if (tagsResponse.status === 200) {
                const tagsData = await tagsResponse.json();
                topTags = tagsData.toptags.tag.slice(0, 3);
            }

            return {
                name: artist.name,
                image: albumImage,
                url: artist.url,
                tags: topTags
            };
        }));

        return artistsWithAlbumImages;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Получение топовых треков
 *
 * @returns {Object[]} массив объектов с данными о топовых треках
 */
export async function getTopTracks() {
    try {
        const tracksResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=18`);

        if (tracksResponse.status != 200) {
            return null;
        }

        const tracksData = await tracksResponse.json();
        const tracks = tracksData.tracks.track;

        const topTracks: ITrack[] = await Promise.all(tracks.map(async (track: any) => {
            const tagsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${track.artist.name}&api_key=${apiKey}&format=json`);

            let topTags = null;
            if (tagsResponse.status === 200) {
                const tagsData = await tagsResponse.json();
                topTags = tagsData.toptags.tag.slice(0, 3);
            }

            let trackImage = '/white-star.webp';
            const imgObj = track.image.find((img: any) => img.size === 'extralarge' && img['#text']);
            if (imgObj) {
                trackImage = imgObj['#text'];
            }

            const trackInfoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${track.artist.name}&track=${track.name}&format=json`);

            if (trackInfoResponse.status === 200) {
                const trackInfoData = await trackInfoResponse.json();
                if (trackInfoData.track && trackInfoData.track.album) {
                    const trackInfo = trackInfoData.track.album;
                    const imgObj = trackInfo.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                    if (imgObj) {
                        trackImage = imgObj['#text'];
                    }
                }
            }

            return {
                name: track.name,
                artistName: track.artist.name,
                artistUrl: track.artist.url,
                image: trackImage,
                url: track.url,
                tags: topTags
            };
        }));

        return topTracks;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Поиск артистов и изображения топового альбома найденных артистов по заданной строке
 *
 * @param {string} searchStr строка поиска
 * @returns {Object[]} массив объектов с данными артистов
 */
export async function searchArtistsWithAlbumImages(searchStr: string) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchStr}&api_key=${apiKey}&format=json&limit=8`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const artists = resultsData.results.artistmatches.artist;

            const artistsWithAlbumImages: IArtist[] = await Promise.all(artists.map(async (artist: any) => {
                const albumsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${apiKey}&format=json&limit=1`);

                let albumImage = '/white-star.webp';
                const imgObj = artist.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                if (imgObj) {
                    albumImage = imgObj['#text'];
                }
                if (albumsResponse.status === 200) {
                    const albumsData = await albumsResponse.json();
                    if (albumsData.topalbums && albumsData.topalbums.album.length > 0) {
                        const album = albumsData.topalbums.album[0];
                        const imgObj = album.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                        if (imgObj) {
                            albumImage = imgObj['#text'];
                        }
                    }
                }

                return {
                    name: artist.name,
                    image: albumImage,
                    listeners: artist.listeners,
                    url: artist.url
                };
            }));

            return artistsWithAlbumImages;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Поиск альбомов по заданной строке
 *
 * @param {string} searchStr строка поиска
 * @returns {Object[]} массив объектов с данными альбомов
 */
export async function searchAlbumsWithImages(searchStr: string) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchStr}&api_key=${apiKey}&format=json&limit=8`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const albums = resultsData.results.albummatches.album;

            const albumsWithAlbumImages: IAlbum[] = await Promise.all(albums.map(async (album: any) => {
                let albumImage = '/white-star.webp';
                const imgObj = album.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                if (imgObj) {
                    albumImage = imgObj['#text'];
                }

                return {
                    name: album.name,
                    image: albumImage,
                    artistName: album.artist,
                    artistUrl: 'https://www.last.fm/music/' + album.artist,
                    url: album.url
                };
            }));

            return albumsWithAlbumImages;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Поиск треков по заданной строке
 *
 * @param {string} searchStr строка поиска
 * @returns {Object[]} массив объектов с данными треков
 */
export async function searchTracksWithAlbumImages(searchStr: string) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchStr}&api_key=${apiKey}&format=json&limit=10`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const tracks = resultsData.results.trackmatches.track;

            const tracksWithAlbumImages: ITrack[] = await Promise.all(tracks.map(async (track: any) => {
                const trackInfoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${track.artist}&track=${track.name}&format=json`);

                let trackImage = '/white-star.webp';
                const imgObj = track.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                if (imgObj) {
                    trackImage = imgObj['#text'];
                }

                if (trackInfoResponse.status === 200) {
                    const trackInfoData = await trackInfoResponse.json();
                    if (trackInfoData.track && trackInfoData.track.album) {
                        const trackInfo = trackInfoData.track.album;
                        const imgObj = trackInfo.image.find((img: any) => img.size === 'extralarge' && img['#text']);
                        if (imgObj) {
                            trackImage = imgObj['#text'];
                        }
                    }
                }

                return {
                    name: track.name,
                    image: trackImage,
                    artistName: track.artist,
                    artistUrl: 'https://www.last.fm/music/' + track.artist,
                    listeners: track.listeners,
                    url: track.url
                };
            }));

            return tracksWithAlbumImages;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Функция преобразования строки справа налево: после 3-х символов ставится пробел
 *
 * @param {string} text входная строка 
 * @returns {string} преобразованная строка
 */
export function splitter(text: string) {
    let result = '';
    let str = text.split('').reverse().join('');

    for (let i = 0; i < str.length; i++) {
        result += str[i];
        if ((i + 1) % 3 === 0 && i + 1 !== str.length) {
            result += ' ';
        }
    }

    return result.split('').reverse().join('');
}