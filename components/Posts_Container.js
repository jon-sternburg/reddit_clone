import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import Post from '../components/Post.js'
import Clicked_Post from '../components/Clicked_Post.js'
import Sort_Bar from '../components/Sort_Bar.js'
import Comments from '../components/Comments.js'
import {AiFillFire} from "react-icons/ai"
import {AiFillClockCircle} from "react-icons/ai"
import {AiFillTrophy} from "react-icons/ai"
import {AiFillCaretDown, AiFillCloseCircle} from "react-icons/ai"
import { setCookie, getCookie } from 'cookies-next';

export default function Posts_Container(props) {

const fetching_ref = useRef(false)
const length_ref = useRef(0)
const [end_vis, toggle_end_vis] = useState(false);
const [loading, set_loading] = useState(true);
const [top_time_sort, set_time_sort] = useState('Today');
const [posts, set_posts] = useState({posts: [], 
  pool: [], 
  all_posts: [], 
  subreddit: '', 
  after: '', 
  sort: '', 
  search: '', 
  query: '', 
  fetch_url: '',
  OOP: false
});
const [clicked_post, set_clicked_post] = useState(null);
const [show_time_sort, toggle_time_sort] = useState(false);

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

let posts_ = props.posts.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)
return {...x, posted_time: posted_time}
})

set_posts({
  posts: posts_.slice(0, 5), 
  pool: posts_.slice(5) , 
  all_posts: posts_, 
  subreddit: props.subreddit, 
  after: props.after,
  sort: 'hot', 
  search: props.search, 
  query: props.query, 
  fetch_url: props.fetch_url,
  OOP: false
});
set_loading(false)
}, [])


const options ={rootMargin:'-50px 0px 200px 0px', threshold:[0.01]} 
const [end_ref] = useIntersectionObserverRef(callback, options);

async function fetch_new_posts(url_) {
 
let token_ = getCookie('access_token')

console.log('fetching new posts... ', url_ )

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
console.log(data)
  return { props: { data } }
})
.catch(err => console.log(err))

}









function set_post_sort(sort_) {

let time_sort = sort_ == 'top' ? `&t=${top_time_sort}` : ''
let base_ = posts.subreddit && !posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/${sort_}/.json` :
            posts.subreddit && posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/search.json?q=${posts.query}&restrict_sr=1` :
            !posts.subreddit && posts.search ? `https://oauth.reddit.com/search.json?q=${posts.query}&nsfw=1` :  `https://oauth.reddit.com/${sort_}/.json`
let url_ = !posts.search ? `${base_}?sort=${sort_}${time_sort}` : `${base_}&sort=${sort_}${time_sort}`


set_loading(true)
return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {

let after_ = data.props.data.data.after
let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)
return {...x, posted_time: posted_time}
})



console.log('SET POST SORT NEW AFTER ', after_)

set_posts({posts: new_posts.slice(0, 5), 
  pool: new_posts.slice(5) , 
  all_posts: new_posts, 
  subreddit: posts.subreddit, 
  after: after_, 
  sort: sort_, 
  search: posts.search, 
  query: posts.query, 
  fetch_url: url_,
  OOP: new_posts.length < 25 ? true : false
 })
set_loading(false)
}).catch(err => console.log(err))
}


function handle_time_sort(x_) {

if (x_ == 'toggle') {toggle_time_sort(!show_time_sort)} else {

let time_sort =  `&t=${x_}`
let base_ = posts.subreddit && !posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/${posts.sort}/.json` :
            posts.subreddit && posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/search.json?q=${posts.query}&restrict_sr=1` :
            !posts.subreddit && posts.search ? `https://oauth.reddit.com/search.json?q=${posts.query}&nsfw=1` :  `https://oauth.reddit.com/${posts.sort}/.json`
let url_ = !posts.search ? `${base_}?sort=${posts.sort}${time_sort}` : `${base_}&sort=${posts.sort}${time_sort}`


set_loading(true)
toggle_time_sort(false)
set_time_sort(x_)
return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {
let after_ = data.props.data.data.after
let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)
return {...x, posted_time: posted_time}
})

console.log('HANDLE TIME SORT NEW AFTER ', after_)
set_posts({posts: new_posts.slice(0, 5), 
  pool: new_posts.slice(5), 
  all_posts: new_posts, 
  subreddit: posts.subreddit, 
  after: after_, 
  sort: 'top', 
  search: posts.search, 
  query: posts.query, 
  fetch_url: url_,
  OOP: new_posts.length < 25 ? true : false
})
set_loading(false)
}).catch(err => console.log(err))
}
}



async function fetch_next_page() {

let time_sort = posts.sort == 'top' ? `&t=${top_time_sort}` : ''
//let url_ = `${posts.fetch_url}?&after=${posts.after}`
let url_ = `${posts.fetch_url}&after=${posts.after}`
console.log('FETCING NEXT PAGE ', posts.after, ' => ', url_)

return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {


console.log('fetch next pg ', data)

if (data.props.data.data.children && data.props.data.data.children.length >= 25) { 

let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)
return {...x, posted_time: posted_time}
})


let new_posts_ = new_posts.slice(0, 5)
let new_pool = new_posts.slice(5)
let new_after = data.props.data.data.after
let posts_ = posts.posts.concat(new_posts_)
let new_pool_ = posts.pool.concat(new_pool)
length_ref.current = posts_.length
console.log('NEWWWWWW FOR NEXT FETCH ', data.props.data.data.after)
set_posts({
  posts: posts_, 
  pool: new_pool_, 
  subreddit: posts.subreddit, 
  after: new_after, 
  sort: posts.sort, 
  search: posts.search, 
  query: posts.query, 
  fetch_url: posts.fetch_url,
  OOP: posts.OOP
})

          } else {

console.log('OOP!!!!!!!!!!!!!!!!!')
set_posts({...posts, OOP: true})
fetching_ref.current = false
          }

}).catch(err => console.log(err))

}



function handle_post_click(x) {
if (clicked_post == null) {set_clicked_post(x)} else { set_clicked_post(null)}
}

function add_chunks() {

 console.log('fired add chunks')
        if (posts.pool.length < 5) { 
fetch_next_page()
        } else {
console.log('ADDING CHUNKS: ', posts, 'after? ', posts.after)
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
            }, 1000)

        }
          fetching_ref.current = false
    }



let h_ = props.height * .85
let w_ = props.width
  return (

    <Fragment>


<div className = {styles.post_frame} >

<Sort_Bar show_time_sort = {show_time_sort} toggle_time_sort = {toggle_time_sort} sort = {posts.sort} handle_time_sort = {handle_time_sort} set_post_sort = {set_post_sort} top_time_sort = {top_time_sort} />

{clicked_post !== null && (
  <Fragment>
<div className = {styles.post_popup_frame_left} onClick = {() => handle_post_click(null)}/>

<div className = {styles.post_popup}>
<AiFillCloseCircle onClick = {() => handle_post_click(null)} className = {styles.close_popup_post_icon}/>

<Clicked_Post handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {clicked_post} />

<Comments post = {clicked_post} clicked_comment = {null} />

</div>

<div className = {styles.post_popup_frame_right} onClick = {() => handle_post_click(null)}/>

</Fragment>

  )}

<div className = {styles.posts_shadow_wrap} >
{loading ? <div className ={styles.skeleton_loader}></div> :
<Fragment>
{posts.posts.map((post, i) => <Post key = {i + post.data.name}  handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {post} i = {i}/>)}

{posts.OOP ? <div className = {styles.OOP}>Out of posts!</div> :
<div className = {styles.loading_box_bottom}> 
<div  className = {styles.end_ref} ref = {end_ref} />
<span className={styles.skeleton_loader_bottom}></span>

</div>}

</Fragment>

}
</div>


</div>
</Fragment>
)}


var units = {
  year  : 24 * 60 * 60 * 1000 * 365,
  month : 24 * 60 * 60 * 1000 * 365/12,
  day   : 24 * 60 * 60 * 1000,
  hour  : 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

var getRelativeTime = (d1, d2 = new Date()) => {
  var elapsed = d1 - d2
  for (var u in units) 
    if (Math.abs(elapsed) > units[u] || u == 'second') 
      return rtf.format(Math.round(elapsed/units[u]), u)
}
