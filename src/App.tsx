import { HeaderWithSearch } from './components/HeaderWithSearch';
import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { BrowserRouter, Switch, Route, Link, useParams } from "react-router-dom";
import { Header } from './components/Header';
import { Search } from './components/Search';
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/search/:query" component={SearchPage} />
                <Route path="/" component={HomePage} />
            </Switch>
        </BrowserRouter>
    );
}
export default App;

function HomePage() {
    return (
        <div className="app">
            <HeaderWithSearch />
            <Main />
            <Footer />
        </div>
    );
}

function SearchPage({ match }: SearchProps) {
    const { query } = match.params;
    return (
        <div className="app">
            <Header />
            <Search query={query} />
            <Footer />
        </div>
    );
}

interface SearchProps {
    match: {
        params: {
            query: string;
        };
    };
}
