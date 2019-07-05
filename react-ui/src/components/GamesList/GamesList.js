
import React, { Component } from 'react'
import Game from './Game/Game';
import Masonry from 'react-masonry-component';

import "./GamesList.css";

const masonryOptions = {
    transitionDuration: 500
};
const imagesLoadedOptions = { background: '.my-bg-image-el' }

export default class GamesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            games: this.props.games,
            loading: this.props.loading,
            platform: this.props.platform
        }
        this.masonry = null;
    }
    reloadMasonry() {
        this.masonry.layout();
    }
    render() {
        if (!this.state.games || this.state.games.length === 0) {
            return (
                <div>
                    Nessun gioco trovato.
                </div>
            )
        } else {
            return (
                <React.Fragment>
                    <Masonry
                        ref={function (c) { this.masonry = this.masonry || c.masonry; }.bind(this)}
                        className={'my-gallery-class'} // default ''
                        elementType={'ul'} // default 'div'
                        options={masonryOptions} // default {}
                        disableImagesLoaded={false} // default false
                        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                        imagesLoadedOptions={imagesLoadedOptions} // default {}
                    >
                        {
                            this.state.games.map((game) => {
                                return (
                                    <div className="card-container" key={`${game.id}-${this.state.platform}`}>
                                        <Game onToggleContent={this.reloadMasonry.bind(this)} game={game}></Game>
                                    </div>
                                )
                            })
                        }
                    </Masonry>
                </React.Fragment>
            )
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ games: props.games, loading: props.loading })
    }

}
