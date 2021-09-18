import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';

import { get } from '../utils';
import MatchCard from './MatchCards';

import '../styles/Main.css';

export default function Main() {

    const [matchList, setMatchList] = useState([]);
    const [matchKey, setMatchKey] = useState('');
    const [nextMatchloading, setNextMatchLoading] = useState(false);

    useEffect(() => {
        get('/matches')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.success) {
                setMatchList(res.matches);
                setMatchKey(res.lastKey);
            }   
        }).catch(err => {
            console.log(err)
        });
    }, []);

    const fetchMoreMatches = () => {
        if (matchKey.length > 0) {
            setNextMatchLoading(true);
            get('/nextMatches')
            .then(res => res.json())
            .then(res => {
                setMatchKey(res.lastkey);
                setMatchList([...matchList, ...res.matches]);
                setNextMatchLoading(false);
            }).catch(err => {
                console.log(err);
                setNextMatchLoading(false);
            })
        }
    }

    return (
        <div className='match-container'>
            <h2>Please wait for a Room ID.</h2>
            <br />
            <div className="matches-list">
                {
                    matchList.map(match => (
                        <div className="single-match">
                            <MatchCard {...match} />
                        </div>
                    ))
                }
            </div>
            <br />
            <Button
                variant="outlined"
                onClick={fetchMoreMatches}
            >
                Next 5 matches
            </Button>
        </div>
    )
}
