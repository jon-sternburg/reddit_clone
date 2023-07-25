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
import { useRouter } from 'next/router'
import BounceLoader from "react-spinners/BounceLoader";
import get_relative_time from '../utils/get_relative_time';


export default function Posts_Container(props) {
const router = useRouter()
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
if (!router.query.post && clicked_post !== null) { 
set_clicked_post(null)
} else if (router.query.post && clicked_post == null) {
let find_ = posts.posts.filter(x => x.data.name == router.query.post)
if (find_) { set_clicked_post(find_[0])} else { 
}}}, [router.query.post])


  useEffect(() => {
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
  sort: router.query.sort ? router.query.sort : 'hot', 
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





function set_post_sort(sort_) {

let time_sort = sort_ == 'top' ? `&t=${top_time_sort.toLowerCase()}` : ''
let base_ = posts.subreddit && !posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/${sort_}/.json?sr_detail=1` :
            posts.subreddit && posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/search.json?q=${posts.query}&restrict_sr=1&sr_detail=1` :
            !posts.subreddit && posts.search ? `https://oauth.reddit.com/search.json?q=${posts.query}&nsfw=1&sr_detail=1` :  `https://oauth.reddit.com/${sort_}/.json?sr_detail=1`
let url_ = !posts.search ? `${base_}?sort=${sort_}${time_sort}` : `${base_}&sort=${sort_}${time_sort}`

let base = router.query.r ? router.query.r : ''
router.push(`${base}?sort=${sort_ + time_sort}`)
set_loading(true)
return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {

let after_ = data.props.data.data.after
let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})

set_posts({
  ...posts,
  posts: new_posts.slice(0, 5), 
  pool: new_posts.slice(5) , 
  all_posts: new_posts, 
  after: after_, 
  sort: sort_, 
  fetch_url: url_,
  OOP: new_posts.length < 25 ? true : false
 })
set_loading(false)
}).catch(err => console.log(err))
}






function handle_time_sort(x_) {

if (x_ == 'toggle') {toggle_time_sort(!show_time_sort)} else {

let time_sort =  `&t=${x_.toLowerCase()}`
let base_ = posts.subreddit && !posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/${posts.sort}/.json?sr_detail=1` :
            posts.subreddit && posts.search ? `https://oauth.reddit.com/r/${posts.subreddit}/search.json?q=${posts.query}&restrict_sr=1&sr_detail=1` :
            !posts.subreddit && posts.search ? `https://oauth.reddit.com/search.json?q=${posts.query}&nsfw=1&sr_detail=1` :  `https://oauth.reddit.com/${posts.sort}/.json?sr_detail=1`
let url_ = !posts.search ? `${base_}?sort=${posts.sort}${time_sort}` : `${base_}&sort=${posts.sort}${time_sort}`
let base = router.query.r ? router.query.r : ''
router.push(`${base}?sort=${posts.sort + time_sort}`)
set_loading(true)
toggle_time_sort(false)
set_time_sort(x_)
return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {
let after_ = data.props.data.data.after
let new_posts = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})


set_posts({
  ...posts,
  posts: new_posts.slice(0, 5), 
  pool: new_posts.slice(5), 
  all_posts: new_posts, 
  after: after_, 
  sort: 'top', 
  fetch_url: url_,
  OOP: new_posts.length < 25 ? true : false
})
set_loading(false)
}).catch(err => console.log(err))
}
}



async function fetch_next_page() {

let time_sort = posts.sort == 'top' ? `&t=${top_time_sort}` : ''
let url_ = `${posts.fetch_url}&sr_detail=1&after=${posts.after}`


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



function handle_post_click(x) {

let time_sort = posts.sort == 'top' ? `&t=${top_time_sort.toLowerCase()}` : ''
let base_ = posts.subreddit ? posts.subreddit : '/'
let sort_ = posts.sort ? `?sort=${posts.sort + time_sort}` : ''


if (clicked_post == null) {
router.push(`${base_}?post=${x.data.name}`, null, { shallow: true })
  set_clicked_post(x)

} else {
//let new_url = router.query.r ? `${router.query.r}` : `/`

router.push(base_ + sort_, null, { shallow: true })
 set_clicked_post(null)

}
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



let h_ = props.height * .85
let w_ = props.width
  return (

<section className = {styles.post_frame} >

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
{loading ? 
<div className ={styles.skeleton_loader}></div>  :
<Fragment>
{posts.posts.map((post, i) => <Post key = {i + post.data.name}  handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {post} i = {i}/>)}

{posts.OOP ? <div className = {styles.OOP}>Out of posts!</div> :
<div className = {styles.loading_box_bottom}> 
<div  className = {styles.end_ref} ref = {end_ref} />
<div className = {styles.skeleton_loader_bottom_rings}>
      <BounceLoader
        color={'#b2d7c5'}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
</div>}

</Fragment>

}
</div>


</section>

)}

