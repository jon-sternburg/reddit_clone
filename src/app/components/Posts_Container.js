'use client'
import React, {Fragment, useState, useEffect, useRef } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import Post from '../components/Post.js'
import Clicked_Post from '../components/Clicked_Post.js'
import Sort_Bar from '../components/Sort_Bar.js'
import Comments from '../components/Comments.js'
import {AiFillCloseCircle} from "react-icons/ai"
import {setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import get_relative_time from '../utils/get_relative_time';


export default function Posts_Container(props) {
const router = useRouter()
const fetching_ref = useRef(false)
const length_ref = useRef(0)
const [end_vis, toggle_end_vis] = useState(false);
const [loading, set_loading] = useState(true);
const [clicked_post, set_clicked_post] = useState(null);
const [posts, set_posts] = useState({posts: [], 
  pool: [], 
  all_posts: [], 
  subreddit: '', 
  after: '', 
  fetch_url: '',
  OOP: false
});

  const callback = (entries) => {
    if (entries && entries[0]) {
      toggle_end_vis(entries[0].isIntersecting);
    }
  };

useEffect(() => {
if (end_vis && !fetching_ref.current && !posts.OOP) {
fetching_ref.current = true
add_chunks()
} else if (end_vis && fetching_ref.current) {
  fetching_ref.current = false
}}, [end_vis])


  useEffect(() => {

setCookie('access_token', props.token);

if (props.posts !== null && props.posts.length > 0) {

let posts_ = props.posts.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})


set_posts({
  posts: posts_.slice(0, 5), 
  pool: posts_.slice(5) , 
  all_posts: posts_, 
  subreddit: props.subreddit, 
  after: props.after,
  fetch_url: props.fetch_url,
  OOP: false
});
set_loading(false)

 } else {
set_posts({...posts, OOP: true})
  set_loading(false)
 }


}, [])


const options ={rootMargin:'-50px 0px 200px 0px', threshold:[0.01]} 
const [end_ref] = useIntersectionObserverRef(callback, options);

async function fetch_new_posts(url_) {

const token_ = getCookie('access_token')
return await fetch("/api/fetch_data", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: url_, token: token_})
  })
.then((res) => res.json())
.then((data) => {

  return { props: { data } }
})
.catch(err => console.log(err))
}



async function fetch_next_page() {

const url_ = `${posts.fetch_url}&after=${posts.after}`

return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {

if (data.props.data.data.children && data.props.data.data.children.length >= 25) { 

let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})


let new_posts_ = new_posts.slice(0, 5)
let new_pool = new_posts.slice(5)
let new_after = data.props.data.data.after
let posts_ = posts.posts.concat(new_posts_)
let new_pool_ = posts.pool.concat(new_pool)
length_ref.current = posts_.length

set_posts({
  ...posts,
  posts: posts_, 
  pool: new_pool_, 
  after: new_after
})
fetching_ref.current = false

          } else {


set_posts({...posts, OOP: true})
fetching_ref.current = false
          }

}).catch(err => console.log(err))

}




function add_chunks() {


if (posts.pool.length < 5) { fetch_next_page() } else {

        let new_posts = [...posts.pool].slice(0, 5)
        let new_pool = [...posts.pool].slice(5)
        let posts_ = posts.posts.concat(new_posts)
        length_ref.current = posts_.length

            setTimeout(() => {
                set_posts({
                         ...posts,
                    pool: new_pool,
                    OOP: false,
                    posts: posts_
                })
            }, 300)

        }
          fetching_ref.current = false
    }



const h_ = props.height * .85
const w_ = props.width
  return (

<div className = {styles.post_frame} >

<Sort_Bar  sort = {props.sort} subreddit = {props.subreddit} />

<div className = {styles.posts_shadow_wrap} >
{loading ? 
<div className ={styles.skeleton_loader}></div>  :
<Fragment>
{posts.posts.map((post, i) => <Post key = {i + post.data.name}  h_ = {h_ } w_ = {w_} post = {post} i = {i}/>)}

{posts.OOP ? <div className = {styles.OOP}>Out of posts!</div> :
<div className = {styles.loading_box_bottom}> 
<div  className = {styles.end_ref} ref = {end_ref} />
</div>}

</Fragment>

}
</div>
{!posts.OOP && (<div className = {styles.bottom_frame_loader} />)}
</div>

)}

