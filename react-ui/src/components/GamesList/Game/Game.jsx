import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            image: this.getImage(),
            game: this.props.game,
            expanded: false
        }
        if (this.state.game.platforms) {
            this.state.game.platforms.reverse();
        }
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.isAnimating = false;
    }

    handleExpandClick() {
        this.setState((prev) => {
            return { expanded: !prev.expanded }
        })
    }

    getImage() {
        let image = 'https://via.placeholder.com/264x374';
        try {
            image = this.props.game.cover.url.replace('thumb', 'cover_big');
        } catch (error) {
            console.log(error);
        }
        return image;
    }

    render() {
        return (
            <Card>
                <CardActionArea>
                    <div className="card-media-chips" style={{ position: 'relative' }}>
                        <CardMedia
                            image={this.state.image}
                            title="Contemplative Reptile"
                            style={{ height: 250 }}
                        />
                        <div className="chip-groups">
                            {
                                this.state.game.platforms
                                    ? this.state.game.platforms.map(({ id, name }) => {
                                        return <Chip size="small" key={id} label={name}></Chip>
                                    })
                                    : null
                            }
                        </div>
                    </div>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={this.handleExpandClick}>
                        Learn More
                        </Button>
                </CardActions>
                <Collapse
                    in={this.state.expanded}
                    addEndListener={(node, done) => {
                        node.addEventListener('transitionrun', () => {
                            console.log(node.clientHeight);
                            this.props.onToggleContent();
                        })
                        node.addEventListener('transitionend', () => {
                            this.props.onToggleContent();
                        })
                    }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.state.game.name}
                        </Typography>
                        <Typography style={{ maxHeight: 150, overflowY: 'scroll' }} variant="body2" color="textSecondary" component="p">
                            {this.state.game.summary}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card >
        );
    }

}