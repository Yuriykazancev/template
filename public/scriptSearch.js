const apiKey = 'a3b705fa06cf54a968e1b8884fce7802';
const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';
const heading = document.querySelector('.textSearch');

heading.textContent = `Search result for "${query}"`;
searchArtists(query);
searchAlbums(query);
searchTracks(query);

const input = document.querySelector('.searchInput');
const button = document.querySelector('.resetSearchButton');

if (button != null) {
    button.addEventListener('click', () => {
        input.value = '';
    });
}

if (input != null) {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = input.value.trim();
            if (query) {
                const encodedQuery = encodeURIComponent(query);
                window.location.href = `search.html?q=${encodedQuery}`;
            }
        }
    });
}

/**
 * Поиск артистов и изображения топового альбома найденных артистов по заданной строке
 *
 * @param {string} searchStr строка поиска
 * @returns {Object[]} массив объектов с данными артистов
 */
// Великолепное API Last.fm не возвращает в ответ на запрос реальные изображения артистов, а только пятиконечную звезду на белом фоне
async function searchArtistsWithAlbumImages(searchStr) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchStr}&api_key=${apiKey}&format=json&limit=8`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const artists = resultsData.results.artistmatches.artist;

            const artistsWithAlbumImages = await Promise.all(artists.map(async (artist) => {
                const albumsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${apiKey}&format=json&limit=1`);

                let albumImage = '';
                const imgObj = artist.image.find(img => img.size === 'extralarge' && img['#text']);
                if (imgObj) {
                    albumImage = imgObj['#text'];
                }
                if (albumsResponse.status === 200) {
                    const albumsData = await albumsResponse.json();
                    if (albumsData.topalbums && albumsData.topalbums.album.length > 0) {
                        const album = albumsData.topalbums.album[0];
                        const imgObj = album.image.find(img => img.size === 'extralarge' && img['#text']);
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
async function searchAlbumsWithImages(searchStr) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchStr}&api_key=${apiKey}&format=json&limit=8`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const albums = resultsData.results.albummatches.album;

            const albumsWithAlbumImages = await Promise.all(albums.map(async (album) => {
                let albumImage = '';
                const imgObj = album.image.find(img => img.size === 'extralarge' && img['#text']);
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
async function searchTracksWithAlbumImages(searchStr) {
    try {
        if (searchStr.trim() != '') {
            const results = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchStr}&api_key=${apiKey}&format=json&limit=10`);

            if (results.status != 200) {
                return null;
            }

            const resultsData = await results.json();
            const tracks = resultsData.results.trackmatches.track;

            const tracksWithAlbumImages = await Promise.all(tracks.map(async (track) => {
                const trackInfoResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${track.artist}&track=${track.name}&format=json`);

                let trackImage = '';
                const imgObj = track.image.find(img => img.size === 'extralarge' && img['#text']);
                trackImage = imgObj['#text'];

                if (trackInfoResponse.status === 200) {
                    const trackInfoData = await trackInfoResponse.json();
                    if (trackInfoData.track && trackInfoData.track.album) {
                        const trackInfo = trackInfoData.track.album;
                        const imgObj = trackInfo.image.find(img => img.size === 'extralarge' && img['#text']);
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
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Генерация разметки для артистов
 *
 * @param {string} query строка поиска
 */
async function searchArtists(query) {
    const container = document.getElementById('search__artistsContainer');
    if (container != null) {
        const artists = await searchArtistsWithAlbumImages(query);
        let html = '';
        artists.forEach(artist => {
            html += `<li class="container_li artistsContainer__artist" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('${artist.image}');">
                        <a class="artist__url" href=${artist.url}>  
                            <div class="artist__name li__mainText">${artist.name}</div>
                            <div class="artist__listeners li__subtext">${splitter(artist.listeners)} listeners</div>
                        </a>
                     </li>`;
        });
        container.innerHTML = html;

        const message = document.querySelector('.noArtistsMessage');
        const link = document.querySelector('.artistsContainer__moreLink');

        if (artists.length == 0 && message != null) {
            message.classList.add('message__visible');
            link.classList.add('message');
        } else {
            message.classList.remove('message__visible');
            link.classList.remove('message');
            if (link != null) {
                link.href = 'https://www.last.fm/search/artists?q=' + query;
            }
        }
    }
}

/**
 * Функция преобразования строки справа налево: после 3-х символов ставится пробел
 *
 * @param {string} text входная строка 
 * @returns {string} преобразованная строка
 */
function splitter(text) {
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

/**
 * Генерация разметки для альбомов
 *
 * @param {string} query строка поиска
 */
async function searchAlbums(query) {
    const container = document.getElementById('search__albumsContainer');
    if (container != null) {
        const albums = await searchAlbumsWithImages(query);
        let html = '';
        albums.forEach(album => {
            html += `<li class="container_li albumsContainer__album" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('${album.image}');">
                        <a class="artist__url" href=${album.url}>  
                            <div class="album__name li__mainText">${album.name}</div>
                            <div class="album__artistName li__subtext">
                                <object>
                                    <a class="artist__link" href="${album.artistUrl}">${album.artistName}</a>
                                </object>
                            </div>
                        </a>
                    </li>`;
        });
        container.innerHTML = html;

        const message = document.querySelector('.noAlbumsMessage');
        const link = document.querySelector('.albumsContainer__moreLink');

        if (albums.length == 0 && message != null) {
            message.classList.add('message__visible');
            link.classList.add('message');
        } else {
            message.classList.remove('message__visible');
            link.classList.remove('message');
            if (link != null) {
                link.href = 'https://www.last.fm/search/albums?q=' + query;
            }
        }
    }
}

/**
 * Генерация разметки для треков
 *
 * @param {string} query строка поиска
 */
async function searchTracks(query) {
    const container = document.querySelector('.tracksTable__body');
    if (container != null) {
        const tracks = await searchTracksWithAlbumImages(query);
        let html = '';
        tracks.forEach(track => {
            html += `<tr class="tracksTable__track">
                        <td class="cell__image"><a class="track__link" href="${track.url}"><img class="track__image" src="${track.image}" alt=""></a></td>
                        <td class="track__name"><a class="track__link" href="${track.url}">${track.name}</a></td>
                        <td class="track__artistName"><a class="track__link" href="${track.artistUrl}">${track.artistName}</a></td>
                        <td class="track__listeners">${splitter(track.listeners)} listeners</td>
                    </tr>`;
        });
        container.innerHTML = html;

        const message = document.querySelector('.noTracksMessage');
        const link = document.querySelector('.tracksContainer__moreLink');


        if (tracks.length == 0 && message != null) {
            message.classList.add('message__visible');
            link.classList.add('message');
        } else {
            message.classList.remove('message__visible');
            link.classList.remove('message');
            if (link != null) {
                link.href = 'https://www.last.fm/search/tracks?q=' + query;
            }
        }
    }
}