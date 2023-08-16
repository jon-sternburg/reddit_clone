'use client'
import React, {Fragment, useState, useEffect} from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Clicked_Post from '../components/Clicked_Post'
import Comments from '../components/Comments'
import get_relative_time from '../utils/get_relative_time';



export default function Post_Page(props) {

const [loading, set_loading] = useState(true);
const [post_data, set_post_data] = useState(null);


useEffect(() => {
let data__ = props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})

set_post_data(data__[0]);
set_loading(false)
}, [])

 return (

<div className = {styles.post_frame} >
{loading ? <div className ={styles.skeleton_loader}></div> :
<Fragment>

<Clicked_Post  handle_post_click = {() => {}} h_ = {props.height} w_ = {props.width} post = {post_data} />

<Comments post = {post_data} clicked_comment = {null} />
</Fragment>
}
</div>


)}


