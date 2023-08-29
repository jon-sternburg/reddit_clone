'use client'
import React, {Fragment, useState, useEffect, useRef } from "react";
import styles from '../css/post_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Post from '../components/Post'
import Mobile_Post from "../components/Mobile_Post";
import Sort_Bar from '../components/Sort_Bar'
import {setCookie, getCookie } from 'cookies-next';
import get_relative_time from '../utils/get_relative_time';
import {Thread, ThreadResult} from '../types/post_types'


type PostsConfirmed = Thread[]
type Posts = Thread[] | null
type PC_Props = {
fetch_url: string;
token: string;
posts: Posts;
after: string | null;
width: number;
height: number;
}


type Posts_State = {
posts: Posts;
pool: Posts;
after: string | null;
fetch_url: string;
OOP: boolean;
}

type FetchNewData = ThreadResult;


export default function Posts_Container(props: PC_Props):JSX.Element {

const fetching_ref = useRef<boolean>(false)
const [loading, set_loading] = useState<boolean>(true);
const [posts, set_posts] = useState<Posts_State>({
  posts: [], 
  pool: [], 
  after: '', 
  fetch_url: '',
  OOP: false
});

const h_ = props.height * .85
const w_ = props.width


  const callback = (entries:  IntersectionObserverEntry[]): void => {
    if (entries && entries[0]) {

      let end_vis = entries[0].isIntersecting

      if (end_vis && !fetching_ref.current && !posts.OOP) {
        fetching_ref.current = true
        add_chunks()
        } else if (end_vis && fetching_ref.current) {
          fetching_ref.current = false
        }
    }
  };

const options ={rootMargin:'-50px 0px 200px 0px', threshold:[0.01]} 
const [end_ref] = useIntersectionObserverRef(callback, options);

useEffect(() => {
if (props.posts !== null && props.posts.length > 0) {
  setCookie('access_token', props.token);

let posts_ = get_posted_time(props.posts)

set_posts({
  posts: posts_.slice(0, 5), 
  pool: posts_.slice(5) , 
  after: props.after,
  fetch_url: props.fetch_url,
  OOP: false
});
set_loading(false)

 } else {
  setCookie('access_token', props.token);
set_posts((prevState) => {
  return {...prevState, OOP: true}
})
set_loading(false)
 }


}, [props.posts, props.after, props.fetch_url, props.token])

async function fetch_new_posts(url_:string):Promise<FetchNewData | null>{

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
.then((data) => data)
.catch(err => {
console.log(err); 
return null
})
}

function add_chunks():void {
  if (posts.pool !== null && posts.pool.length < 5) { fetch_next_page() } else if (posts.pool !== null && posts.posts !== null) {
          let new_posts = [...posts.pool].slice(0, 5)
          let new_pool = [...posts.pool].slice(5)
          let posts_ = posts.posts.concat(new_posts)
  
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

function get_posted_time(posts_: PostsConfirmed) : PostsConfirmed {
return posts_.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
if (posted_time !== undefined) {
return {...x, posted_time: posted_time.replace(' ago', '')}
} else { 
return {...x, posted_time: null}
}
})


}

async function fetch_next_page() {

const url_:string = `${posts.fetch_url}&after=${posts.after}`.toLowerCase()

const data = await fetch_new_posts(url_)

if (posts.posts !== null && posts.pool !== null && data !== null && data !== undefined && data.data.children && data.data.children.length >= 25) { 
let new_posts = get_posted_time(data.data.children)
let new_posts_ = new_posts.slice(0, 5)
let new_pool = new_posts.slice(5)
let posts_ = posts.posts.concat(new_posts_)
let new_pool_ = posts.pool.concat(new_pool)

set_posts({
  ...posts,
  posts: posts_, 
  pool: new_pool_, 
  after: data.data.after
})
fetching_ref.current = false

          } else {


set_posts({...posts, OOP: true})
fetching_ref.current = false
          }

}

  return (

<div className = {styles.post_frame} >

<Sort_Bar />

<div className = {styles.posts_shadow_wrap} >
{loading ? 
<div className ={styles.skeleton_loader}></div>  :
<Fragment>
{posts.posts !== null && (posts.posts.map((post, i) => {

return w_ <= 800 ? <Mobile_Post key = {i + post.data.name} clicked = {false}   h_ = {h_ } w_ = {w_} post = {post} i = {i} /> :

<Post key = {i + post.data.name} clicked = {false}  h_ = {h_ } w_ = {w_} post = {post} i = {i}/>
}))}

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

