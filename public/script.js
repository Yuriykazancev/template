const apiKey = 'a3b705fa06cf54a968e1b8884fce7802';
const input = document.querySelector('.header__searchInput');
const button = document.querySelector('.searchButton');

renderArtists();
renderTracks();

if (button != null) {
    button.addEventListener('click', () => {
        if (input.classList.contains('active')) {
            input.classList.remove('active');
        } else {
            input.classList.add('active');
            input.focus();
        }
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
 * Получение топовых артистов
 *
 * @returns {Object[]} массив объектов с данными о топовых артистах
 */
async function getTopArtistsWithAlbumImages() {
    try {
        const artistsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=12`);

        if (artistsResponse.status != 200) {
            return null;
        }

        const artistsData = await artistsResponse.json();
        const artists = artistsData.artists.artist;

        const artistsWithAlbumImages = await Promise.all(artists.map(async (artist) => {
            const [albumsResponse, tagsResponse] = await Promise.all([
                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${apiKey}&format=json&limit=1`),
                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist.name}&api_key=${apiKey}&format=json`)
            ]);

            let albumImage = '';
            if (albumsResponse.status === 200) {
                const albumsData = await albumsResponse.json();
                const albums = albumsData.topalbums.album;
                if (albums.length > 0) {
                    const imgObj = albums[0].image.find(img => img.size === 'extralarge' && img['#text']);
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
async function getTopTracks() {
    try {
        const tracksResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=18`);

        if (tracksResponse.status != 200) {
            return null;
        }

        const tracksData = await tracksResponse.json();
        const tracks = tracksData.tracks.track;

        const topTracks = await Promise.all(tracks.map(async (track) => {
            const tagsResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${track.artist.name}&api_key=${apiKey}&format=json`);

            let topTags = null;
            if (tagsResponse.status === 200) {
                const tagsData = await tagsResponse.json();
                topTags = tagsData.toptags.tag.slice(0, 3);
            }

            let trackImage = '';
            const imgObj = track.image.find(img => img.size === 'extralarge' && img['#text']);
            trackImage = imgObj['#text'];

            const trackInfoResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${track.artist.name}&track=${track.name}&format=json`);

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
 * Генерация разметки для артистов
 */
async function renderArtists() {
    const artistsContainer = document.querySelector('.artistsContainer');
    if (artistsContainer != null) {
        const artists = await getTopArtistsWithAlbumImages();
        let html = '';
        artists.forEach(artist => {
            if (artist.tags && artist.tags.length == 3) {
                html += `<li class="artistsContainer__artist">
                        <a class="artist__url" href=${artist.url}>
                            <img class="artist__image" src="${artist.image}" alt="${artist.name}">
                            <div class="artist__name">${artist.name}</div>
                        </a>
                        <div class="artist__tags">
                            <a class="tag" href="${artist.tags[0].url}">${artist.tags[0].name}</a> ·
                            <a class="tag" href="${artist.tags[1].url}">${artist.tags[1].name}</a> ·
                            <a class="tag" href="${artist.tags[2].url}">${artist.tags[2].name}</a>
                        </div>
                    </li>`;
            } else {
                html += `<li class="artistsContainer__artist">
                        <a class="artist__url" href=${artist.url}>
                            <img class="artist__image" src="${artist.image}" alt="${artist.name}">
                            <div class="artist__name">${artist.name}</div>
                        </a>
                    </li>`;
            }
        });
        artistsContainer.innerHTML = html;
    }
}

/**
 * Генерация разметки для треков
 */
async function renderTracks() {
    const tracksContainer = document.querySelector('.tracksContainer');
    if (tracksContainer != null) {
        const tracks = await getTopTracks();
        let html = '';
        tracks.forEach(track => {
            if (track.tags && track.tags.length == 3) {
                html += `<li class="tracksContainer__track">
                            <a class="artist__url" href=${track.url}>
                                <img class="track__image" src="${track.image}" alt="">
                                <div class="track__info">
                                <div class="track__name" >${track.name}</div>
                            </a>
                                <a class="track__artistName" href=${track.artistUrl}>${track.artistName}</a>
                                <div class="track__tags">
                                    <a class="tag" href="${track.tags[0].url}">${track.tags[0].name}</a> ·
                                    <a class="tag" href="${track.tags[1].url}">${track.tags[1].name}</a> ·
                                    <a class="tag" href="${track.tags[2].url}">${track.tags[2].name}</a>
                                </div>
                            </div>
                        </li>`;
            } else {
                html += `<li class="tracksContainer__track">
                            <a class="artist__url" href=${track.url}>
                                <img class="track__image" src="${track.image}" alt="">
                                <div class="track__info">
                                <div class="track__name" >${track.name}</div>
                            </a>
                                <a class="track__artistName" href=${track.artistUrl}>${track.artistName}</a>
                            </div>
                        </li>`;
            }
        });
        tracksContainer.innerHTML = html;
    }
}