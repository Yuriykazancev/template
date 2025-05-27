import { useState, useRef, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';

export const HeaderWithSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const history = useHistory();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputVisible && inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    }, [inputVisible]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = searchQuery.trim();
            if (query) {
                history.push(`/search/${query}`);
            }
        }
    };

    const toggleInput = () => {
        setInputVisible(!inputVisible);
    };

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/" className="logo">Last.fm</Link>
            </div>
            <div className="header__links">
                <input type="text" className={`header__searchInput ${inputVisible ? 'active' : ''}`} placeholder="Search for music..." id="input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} ref={inputRef} autoComplete="off" />
                <button className="searchButton" onClick={toggleInput}></button>
                <a href="https://www.last.fm/dashboard" className="link">Live</a>
                <a href="/" className="link">Music</a>
                <a href="https://www.last.fm/charts" className="link">Charts</a>
                <a href="https://www.last.fm/events" className="link">Events</a>
            </div>
        </header>
    );
};
