import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/" className="logo">Last.fm</Link>
            </div>
            <div className="header__links">
                <a href="https://www.last.fm/dashboard" className="link">Live</a>
                <a href="/" className="link">Music</a>
                <a href="https://www.last.fm/charts" className="link">Charts</a>
                <a href="https://www.last.fm/events" className="link">Events</a>
            </div>
        </header>
    );
};