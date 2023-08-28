'use client'
import React from "react";
import styles from '../css/user_comment_styles.module.css'
import {AiOutlineCaretUp} from "react-icons/ai"
import {AiOutlineCaretDown} from "react-icons/ai"
import {Comment} from '../types/comment_types'



type UC_Props = {
    key: number;
    handle_comment_click: (comment: Comment) => void; 
    comment: Comment;
    i: number;
    }



export default function User_Comment(props: UC_Props) {

    const comment = props.comment
    
    return (
    
    <article className = {styles.comment_wrap___user} onClick = {() => props.handle_comment_click(comment)}>
    
    
    
    <div className = {styles.comment_score___user_wrap}>
    <AiOutlineCaretUp className = {styles.upvote_icon}/>
    <div className = {styles.post_box_score__user}>{comment.data.score}</div>
    <AiOutlineCaretDown className = {styles.downvote_icon}/>
    </div>
    
    
    <div className = {styles.comment_wrap_inner___user} >
    
    <header className = {styles.comment_author___user}>{comment.data.author} commented on {comment.data.link_title}</header>
    
    <p className = {styles.comment_body__user} >{comment.data.body}</p>
    <div className = {styles.comment_subreddit___user_wrap}>
    <div className ={styles.comment_subreddit___user}> r/{comment.data.subreddit}</div>
    <footer className = {styles.comment_posted_time___user} >Posted {comment.posted_time} ago</footer>
    </div>
    </div>
    
    
    </article>
    
    
      )
    
    
    
    
    }