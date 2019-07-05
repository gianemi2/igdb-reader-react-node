import React from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, InputBase, Icon, Chip } from '@material-ui/core';
import { fade, withStyles } from '@material-ui/core/styles';
import api from '../api';

import './TitleBar.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
});


class TitleBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            api_status: false
        }
        this.searchingId = false;
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch({ target }) {
        const value = target.value;
        if (this.searchingId) {
            this.setState({ searching: false });
            clearTimeout(this.searchingId);
        }
        if (value.length > 3) {
            this.searchingId = setTimeout(() => this.startSearch(value), 500);
        }

        if (value.length === 0) {
            this.props.resettingSearch(true);
        }
    }

    startSearch(value) {
        this.setState({ searching: true });
        this.props.onStartSearch(value);
        this.setState({ searching: false });
    }

    async fetchApiStatus() {
        const response = await fetch(api.base + '/api/status');
        const data = await response.json();
        this.setState({
            api_status: {
                plan: data[0].plan,
                hits: data[0].usage_reports.usage_report.current_value,
                max: data[0].usage_reports.usage_report.max_value
            }
        })
    }

    componentWillMount() {
        this.fetchApiStatus();
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            {this.props.title}
                            {(
                                this.state.api_status
                                    ? <Chip style={{ marginLeft: '15px' }} size="small" label={this.state.api_status.hits} />
                                    : null
                            )}
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                {(
                                    this.props.isSearching
                                        ? <Icon className="is-loading">refresh</Icon>
                                        : <Icon>searching</Icon>
                                )}
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'Search' }}
                                onChange={this.onSearch}
                            />
                        </div>
                    </Toolbar>
                </AppBar>

            </React.Fragment>
        );
    }
}
export default withStyles(styles)(TitleBar);