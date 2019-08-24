import React, { Component } from 'react';
import Editor from './Editor.js'
import _ from 'lodash';
import $ from 'jquery';
import songs from './songs.json';


class Container extends Component {

    constructor(props) {

        function initState() {
            
            if (!localStorage.getItem("songs")) {
                localStorage.setItem("songs", JSON.stringify(songs))
            }


            return {
                isShowingList: true,
                canSave: false,
                songs: localStorage.getItem("songs"),
                songId: JSON.parse(localStorage.getItem("songs")).length + 1,
                currentSong: {},
                // currentSong: JSON.parse(localStorage.getItem("songs"))[JSON.parse(localStorage.getItem("songs")).length - 1]
            }


          
        }



        super(props);
        this.state = initState();

        this.onChangeSong = this.onChangeSong.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onNewSong = this.onNewSong.bind(this);
        this.onDispayList = this.onDispayList.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem("songs")) {
            // console.log("No songs bruv");

            localStorage.setItem("songs", JSON.stringify(songs))

        }
    }


    onChangeSong(newSong) {
        if (localStorage.getItem("songs")) {
            this.setState({
                currentSong: { songId: JSON.parse(localStorage.getItem("songs")).length + 1, ...newSong },
                canSave: this.state.currentSong.songBody !== newSong.songBody || this.state.currentSong.songName !== newSong.songName || this.state.currentSong.songArtist !== newSong.songArtist
            })
        } else {
            this.setState({
                currentSong: { songId: 1, ...newSong },
                canSave: this.state.currentSong.songBody !== newSong.songBody || this.state.currentSong.songName !== newSong.songName || this.state.currentSong.songArtist !== newSong.songArtist
            })

        }
    }

    onNewSong() {

        if (localStorage.getItem("songs")) {
            console.log("Local storage has songs");

            this.setState({
                isShowingList: false,
                songId: this.state.songId + 1,
                currentSong: {
                    songId: this.state.songId + 1,
                    songBody: "Instructions: <br/><br/> 1. Click me <br/> 2. Ctrl+A <br/> 3. Ctrl+Shift+V",
                    songName: "Song Title",
                    songArtist: "Song Artist"
                }
            })
        }
    }

    onDispayList() {
        this.setState({
            isShowingList: true,
        })
    }


    onSave() {
        if (this.state.canSave) {
            const uniqueSongNames = _.map(JSON.parse(localStorage.getItem("songs")), 'songName');

            if (uniqueSongNames.includes(this.state.currentSong.songName)) {
                const { songName } = this.state.currentSong

                const index = _.findIndex(JSON.parse(localStorage.getItem("songs")), function (o) { return o.songName === songName; })
                const oldSongs = JSON.parse(localStorage.getItem("songs"));
                alert("Song: " + JSON.parse(localStorage.getItem("songs"))[index].songName + " already exists. Will re-write existing song.")
                oldSongs.splice(index, 1);

                oldSongs.push({
                    songId: this.state.songId,
                    ...this.state.currentSong,
                })

                localStorage.setItem("songs", JSON.stringify(oldSongs))


            } else {

                if (localStorage.getItem("songs")) {
                    const oldSongs = JSON.parse(localStorage.getItem("songs"));
                    oldSongs.push({
                        songId: this.state.songId,
                        ...this.state.currentSong,
                    })
                    localStorage.setItem("songs", JSON.stringify(oldSongs))
                } else {
                    localStorage.setItem("songs", JSON.stringify([
                        {
                            songId: this.state.songId,
                            ...this.state.currentSong
                        }
                    ]))
                }

            }


        }

        this.setState({
            canSave: false
        });

    }

    onSelectSong(index) {
        this.setState({
            currentSong: JSON.parse(localStorage.getItem("songs")).reverse()[index],
            songId: JSON.parse(localStorage.getItem("songs")).reverse()[index].songId,
            isShowingList: false
        })
    }

    onDelete() {
        if (localStorage.getItem("songs")) {

            const { songId } = this.state;

            
            

            const oldSongs = _.cloneDeep(JSON.parse(localStorage.getItem("songs")))

            const index = _.findIndex(oldSongs, function (o) { return o.songId === songId; })


            // console.log(oldSongs.map((item)=>{return item.songName}), index);
            

            oldSongs.splice(index, 1)
            localStorage.setItem("songs", JSON.stringify(oldSongs));
            this.setState({
                songId: oldSongs.length,
                currentSong: {
                    songBody: "Song deleted. You can now add a new song here. <br/> <br/> Instructions: <br/><br/> 1. Click me <br/> 2. Ctrl+A <br/> 3. Ctrl+Shift+V",
                    songName: "Song Title",
                    songArtist: "Song Artist"
                }
            })
        }
    }

    onScroll() {



        if (this.state.isScrolling) {

            $(document).ready(function () {
                $('body,html').animate({ scrollTop: window.innerHeight }, 10800);
            });
        } else { }

    }

    render() {
        const currentSongs = JSON.parse(localStorage.getItem("songs")) || [];
        return (
            <div>
            <div style={{float: "right"}}>
                <a href="https://github.com/arogyakoirala/setlist">
                    <img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
                    </img>
                </a>
                </div>
                <div className="container" style={{ paddingLeft: '6rem', paddingTop: '2rem', fontFamily: 'Roboto Mono', fontStyle: "italic" }}><span style={{ fontWeight: "700" }}>setlist</span> - made by <a href="https://twitter.com/koiralaaaa" target='_blank' rel="noopener noreferrer">@koiralaaaa</a></div>
                <div className="container" style={{ padding: '5rem' }}>


                    <div style={{ float: "right" }}>
                        {!this.state.isShowingList &&  <button onClick={this.onSave} style={{ marginRight: "1rem" }} className={this.state.canSave ? "btn-floating  btn waves-effect waves-light red darken-4" : "btn-floating  btn waves-effect waves-light grey darken-3"} ><i className="material-icons">save</i></button>}
                        {!this.state.isShowingList && <button onClick={this.onDelete} style={{ marginRight: "1rem" }} className="btn-floating  btn waves-effect waves-light grey darken-3 "><i className="material-icons">delete</i></button>}
                        <button onClick={this.onDispayList} style={{ marginRight: "1rem" }} className="btn-floating  btn waves-effect waves-light grey darken-3"><i className="material-icons">format_list_numbered</i></button>
                        <button onClick={this.onNewSong} style={{ marginRight: "1rem" }} className="btn-floating  btn-large waves-effect waves-light red darken-4"><i className="material-icons">add</i></button>

                    </div>
                    {!this.state.isShowingList && <Editor onChangeSong={this.onChangeSong} currentSong={this.state.currentSong} />}
                    {this.state.isShowingList && <div>
                            {currentSongs.length > 0 &&
                                currentSongs.reverse().map((item, i) => {
                                    return <div
                                        className="hover-color"
                                        key={i}

                                        onClick={() => { this.onSelectSong(i) }} style={{ padding: "1rem" }}>
                                        <div
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: "700",
                                                    position: "relative",
                                                    color: " rgba(0,0,0,0.22)",
                                                    fontSize: "2.5rem",
                                                    fontFamily: "Roboto Mono",
                                                }}>
                                                #{i + 1}
                                            </p>
                                            <h5
                                                style={{
                                                    margin: 0,
                                                    fontFamily: "Roboto Mono",
                                                    fontWeight: "700"
                                                }}
                                            >{item.songName}</h5>
                                        </div>
                                        <div

                                            style={{ fontFamily: "Roboto Mono" }}
                                        >
                                            {item.songArtist}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    }



                </div>
            </div>
        )
    }
}

export default Container;