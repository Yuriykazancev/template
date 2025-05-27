export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__top">
                <div className="column">
                    <h2 className="column__header">COMPANY</h2>
                    <a href="https://www.last.fm/about" className="column__link">About Last.fm</a>
                    <a href="https://www.last.fm/about/contact" className="column__link">Contacts Us</a>
                    <a href="https://www.last.fm/about/jobs" className="column__link">Jobs</a>
                    <a href="https://www.last.fm/features" className="column__link">Features</a>
                </div>
                <div className="column">
                    <h2 className="column__header">HELP</h2>
                    <a href="https://www.last.fm/about/trackmymusic" className="column__link">Track My Music</a>
                    <a href="https://support.last.fm/" className="column__link">Community Support</a>
                    <a href="https://www.last.fm/help/guidelines" className="column__link">Community Guidelines</a>
                    <a href="https://www.last.fm/help/faq" className="column__link">Help</a>
                </div>
                <div className="column">
                    <h2 className="column__header">GOODIES</h2>
                    <a href="https://www.last.fm/about/trackmymusic" className="column__link">Download Scrobbler</a>
                    <a href="https://www.last.fm/api" className="column__link">Developer API</a>
                    <a href="https://www.last.fm/music/+free-music-downloads" className="column__link">Free Music Downloads</a>
                    <a href="https://store.last.fm/" className="column__link">Merchandise</a>
                </div>
                <div className="column">
                    <h2 className="column__header">ACCOUNT</h2>
                    <a href="https://www.last.fm/join" className="column__link">Sign Up</a>
                    <a href="https://www.last.fm/login" className="column__link">Log In</a>
                    <a href="https://www.last.fm/pro" className="column__link">Subscribe</a>
                </div>
                <div className="column">
                    <h2 className="column__header">FOLLOW US</h2>
                    <a href="https://www.facebook.com/lastfm" className="column__link">Facebook</a>
                    <a href="https://x.com/lastfm" className="column__link">X</a>
                    <a href="https://bsky.app/profile/last.fm" className="column__link">Bluesky</a>
                    <a href="https://www.instagram.com/last_fm" className="column__link">Instagram</a>
                    <a href="https://www.youtube.com/user/lastfm" className="column__link">YouTube</a>
                </div>
            </div>
            <hr className="separator" />
            <div className="footer__bottom">
                <h2 className="footer__bottom__info">
                    CBS Interactive © 2025 Last.fm Ltd. All rights reserved
                </h2>
            </div>
        </footer>
    );
};