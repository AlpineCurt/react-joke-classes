import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
    static defaultProps = {numJokesToGet: 10}
    constructor(props) {
        super(props);
        this.state = {
            jokes: []
        }
        this.getJokes();
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.getJokes = this.getJokes.bind(this);
        this.vote = this.vote.bind(this);
    }

    async getJokes() {
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        const {numJokesToGet} = this.props;
        try {
            while (j.length < numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                //debugger;
                let { status, ...jokeObj } = res.data;
                //debugger;
                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            this.setState({jokes: j})
        } catch (e) {
            console.log(e);
        }
    }

    generateNewJokes() {
        this.setState({jokes: []});
        this.getJokes();
    }

    vote(id, delta) {
        this.setState(state => ({
            jokes: state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
        })
        );
    }

    render() {
        const {jokes} = this.state;
        if (jokes.length) {
            let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
        

            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>
                    {sortedJokes.map(j => (
                        <Joke
                            text={j.joke}
                            key={j.id}
                            id={j.id}
                            votes={j.votes}
                            vote={this.vote}
                        />
                    ))}
                </div>
            );
        }
        return null;
    }

}

export default JokeList;