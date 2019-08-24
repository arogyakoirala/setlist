import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';


var ContentEditable = createReactClass({
    render: function(){
        return <div 
            onInput={this.emitChange} 
            onBlur={this.emitChange}
            style = {this.props.style}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    },
    shouldComponentUpdate: function(nextProps) {
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    },
    emitChange: function() {
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {

            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
});

class Editor extends Component {

    constructor(props) {
        super(props)

        function initState() {
            if (Object.keys(props.currentSong).length > 0) {

                return {
                    songName: props.currentSong.songName,
                    songArtist: props.currentSong.songArtist,
                    songBody: props.currentSong.songBody
                }
            } else {
                return {
                    songBody: "Instructions: <br/><br/> 1. Click me <br/> 2. Ctrl+A <br/> 3. Ctrl+Shift+V",
                    songName: "Song title",
                    songArtist: "Song Artist"
                }
            }
        }


        this.state = initState();

        this.onNameChange = this.onNameChange.bind(this);
        this.onArtistChange = this.onArtistChange.bind(this);
        this.onBodyChange = this.onBodyChange.bind(this);

    };

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.songBody !== nextProps.currentSong.songBody ||
            this.state.songName !== nextProps.currentSong.songName ||
            this.state.songArtist !== nextProps.currentSong.songArtist
        )
    }

    componentDidUpdate() {

        this.setState({
            songName: this.props.currentSong.songName,
            songArtist: this.props.currentSong.songArtist,
            songBody: this.props.currentSong.songBody
        })

    }


    onNameChange(e) {


        this.setState({
            songName: e.target.value
        })


        this.props.onChangeSong({
            songName: e.target.value,
            songArtist: this.state.songArtist,
            songBody: this.state.songBody
        })


    }


    onArtistChange(e) {

        this.setState({
            songArtist: e.target.value
        })

        this.props.onChangeSong({
            songName: this.state.songName,
            songArtist: e.target.value,
            songBody: this.state.songBody
        })

    }

    onBodyChange(e) {
        
        this.setState({
            songBody: e.target.value
        })

        this.props.onChangeSong({
            songName: this.state.songName,
            songArtist: this.state.songArtist,
            songBody: e.target.value
        })

    }



    render() {
        return (
            <div style={{ fontFamily: "Roboto Mono", padding: "1rem" }}>
            {" "}
            <ContentEditable
              onChange={this.onNameChange}
              html={this.state.songName}
              style={{ fontSize: "2rem", margin: "0vh", fontWeight: "700" }}
            />{" "}
            <ContentEditable
              onChange={this.onArtistChange}
              html={this.state.songArtist}
              style={{ fontSize: "1.2rem", fontStyle:"italic", margin: "0vh" }}
            />{" "}
            <ContentEditable
              style={{ 
                color: " rgba(0,0,0,0.72)"
                , marginTop: "5vh", fontFamily: "Roboto Mono" }}
              html={this.state.songBody}
              onChange={this.onBodyChange}
            >
              {" "}
            </ContentEditable>
          </div>
        )
    }
};

export default Editor;