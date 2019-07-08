import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from '@material-ui/core/Container';

import NavigationBar from './components/NavigationBar/NavigationBar';
import GamesList from "./components/GamesList/GamesList";
import api from './components/api';

import './App.css';
import TitleBar from './components/TitleBar/TitleBar';

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.defaultPlatform = api.platform.switch;
        this.games = {};

        this.default = {
            title: 'Material UI',
            games: false,
            searching: false,
            loading: true,
            page: 0,
            currentPlatform: this.defaultPlatform
        }

        this.state = this.default;
        this.fetchGames = this.fetchGames.bind(this);
    }

    async fetchGames(platform = this.defaultPlatform, page = 0) {
        // Start loading
        this.setState({ loading: true, page: page });

        // Set the endpoint.
        const endpoint = `${api.base}/games/${platform}/page/${page}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        this.setState({
            games: (
                this.state.page === 0 ?
                    data :
                    this.state.games.concat(data)
            ),
            searching: false,
            loading: false,
            currentPlatform: platform
        });
        this.games[platform] = data;
    }

    async searchGames(searchQuery, page = 0) {
        this.setState({ loading: true, page: page });
        const response = await fetch(`${api.base}/search/${searchQuery}/page/${this.state.page}`, { method: 'POST' });
        const data = await response.json();
        this.setState({
            games: (
                this.state.page === 0
                    ? data
                    : this.state.games.concat(data)
            ),
            title: `Searching: ${searchQuery}`,
            searching: searchQuery,
            loading: false
        });
    }

    /**
     * 
     * @param {id} newPlatform 
     */
    setPlatform(newPlatform) {
        if (newPlatform !== 'refresh') {
            if (typeof this.games[newPlatform] !== 'undefined' && this.games[newPlatform].length > 0) {
                this.setState({
                    games: this.games[newPlatform],
                    currentPlatform: newPlatform
                })
            } else {
                this.fetchGames(newPlatform)
            }
        } else {
            this.games = {};
            this.restoreDefault();
            this.fetchGames();
        }
    }

    restoreDefault(fetchAgain = false) {
        this.setState(this.default);
        if (fetchAgain) {
            this.fetchGames();
        }
    }

    resetSearch() {
        if (this.state.searching) {
            this.setState({ searching: false, title: this.default.title });
            this.fetchGames(this.currentPlatform);
        }
    }

    loadMoreOnScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            if (this.state.loading) {
                return;
            }
            this.setState({ loading: true });
            if (this.state.searching) {
                this.searchGames(this.state.searching, this.state.page + 1);
            } else {
                this.fetchGames(this.state.currentPlatform, this.state.page + 1);
            }
        }
    }

    render() {
        return (
            <div className="App">
                <CssBaseline></CssBaseline>
                <Container>
                    <TitleBar
                        title={this.state.title}
                        isSearching={(this.state.loading && this.state.searching ? true : false)}
                        resettingSearch={() => this.resetSearch()}
                        onStartSearch={(value) => this.searchGames(value)}>
                    </TitleBar>
                    <GamesList
                        loading={this.state.loading}
                        games={this.state.games}
                        pageId={this.state.page}
                        platform={this.state.currentPlatform}>
                    </GamesList>
                    <NavigationBar
                        default={this.defaultPlatform}
                        onChangeValue={(newPlat) => this.setPlatform(newPlat)}>
                    </NavigationBar>
                </Container>
            </div>
        )
    }

    componentWillMount() {
        this.fetchGames();
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            this.loadMoreOnScroll();
        }, true);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }
}

export default App;