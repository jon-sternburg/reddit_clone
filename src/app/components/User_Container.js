'use client'
import React, {Fragment, useState, useEffect, useRef } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import Post from '../components/Post.js'
import Clicked_Post from '../components/Clicked_Post.js'
import Comments from '../components/Comments.js'
import {AiFillCloseCircle} from "react-icons/ai"
import { getCookie, setCookie} from 'cookies-next';
import {AiOutlineCaretUp} from "react-icons/ai"
import {AiOutlineCaretDown} from "react-icons/ai"
import { useRouter } from 'next/navigation'
import BounceLoader from "react-spinners/BounceLoader";
import get_relative_time from '../utils/get_relative_time';
import { usePathname } from "next/navigation"

export default function User_Container(props) {
const router = useRouter()
const pathname = usePathname()
const fetching_ref = useRef(false)
const length_ref = useRef(0)
const [end_vis, toggle_end_vis] = useState(false);
const [loading, set_loading] = useState(true);
const [top_time_sort, set_time_sort] = useState('Today');
const [content_type, set_content_type] = useState('all_content');
const [posts, set_posts] = useState({
  all_content: [],
  posts: [], 
  comments: [],
  posts_pool: [], 
  comments_pool: [], 
  all_content_pool: [],
  user: '', 
  all_content_after: null,
  posts_after: null, 
  comments_after: null, 
  sort: '', 
  search: '', 
  query: '', 
  fetch_url: '',
  OOP_all_content: false,
  OOP_posts: false,
  OOP_comments: false
});
const [clicked_post, set_clicked_post] = useState(null);
const [clicked_comment, set_clicked_comment] = useState({data: null, original_id: null});
const [show_time_sort, toggle_time_sort] = useState(false);

  const callback = (entries) => {
    if (entries && entries[0]) {
      toggle_end_vis(entries[0].isIntersecting);
    }
  };

  useEffect(() => {
  
if (end_vis && !fetching_ref.current && ((content_type == 'posts' && !posts.OOP_posts) || (content_type == 'comments' && !posts.OOP_comments) || (content_type == 'all_content' && !posts.OOP_all_content))) {
fetching_ref.current = true

add_chunks()
} else if (end_vis && fetching_ref.current) {
  fetching_ref.current = false
}}, [end_vis])

/*
useEffect(() => {

if (!router.query.post && clicked_post !== null) { 
props.reset_content()
//set_clicked_comment({data: null, original_id: null})
//set_clicked_post(null)
} else if (router.query.post && clicked_post == null) {
//let base_ = router.query.content == 'all_content' ? posts.all_content : router.query.content == 'posts' ? posts.posts : posts.comments
let base_ = posts.all_content.concat(posts.posts).concat(posts.comments)
let find_ = base_.filter(x => x.data.name == router.query.post)

if (find_) {

  props.set_found_post(find_[0])
 //set_clicked_post(find_[0])

} else { 

}}}, [router.query.post])
*/


  useEffect(() => {

setCookie('access_token', props.token);

if (props.posts !== null) {

let data__ = props.posts.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})


let comments_ = data__.filter(x => x.kind == 't1')
let posts_ = data__.filter(x => x.kind == 't3')

set_posts({
  ...posts,
  posts: posts_.slice(0, 15), 
  comments: comments_.slice(0, 15),
  posts_pool: posts_.slice(15), 
  comments_pool: comments_.slice(15),
  all_content: data__.slice(0, 15), 
  all_content_pool: data__.slice(15), 
  user: props.user, 
  all_content_after: props.after,
  search: props.search, 
  query: props.query, 
  fetch_url: props.fetch_url
});

set_loading(false)
} else {

set_posts({
  ...posts,
OOP_posts: true,
OOP_comments: true,
OOP_all_content: true
});

set_loading(false)

}
}, [])


const options ={rootMargin:'-50px 0px 200px 0px', threshold:[0.01]} 
const [end_ref] = useIntersectionObserverRef(callback, options);

async function fetch_new_posts(url_) {
 
const token_ = getCookie('access_token')
return await fetch("http://localhost:3000/api/fetch_data", {
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


function handle_content_type(type_) {


if (type_ == 'posts' && !posts.OOP_posts && posts.posts_after == null) { 

set_loading(true)
let url_ = `https://oauth.reddit.com/user/${posts.user}/submitted/.json`
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
  posts: new_posts.slice(0, 15), 
  posts_pool: new_posts.slice(15), 
  subreddit: posts.subreddit, 
  posts_after: after_
 })
set_loading(false)
//router.push(`/u/${router.query.u}/?content=${type_}`, null, { shallow: true })
set_content_type(type_)

}).catch(err => console.log(err))


} else if (type_ == 'comments' && !posts.OOP_comments && posts.comments_after == null) { 


let url_ = `https://oauth.reddit.com/user/${posts.user}/comments/.json`
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
  comments: new_posts.slice(0, 15), 
  comments_pool: new_posts.slice(15), 
  subreddit: posts.subreddit, 
  comments_after: after_
 })
set_loading(false)
//router.push(`/u/${router.query.u}/?content=${type_}`, null, { shallow: true })
set_content_type(type_)

}).catch(err => console.log(err))




} else { 
//router.push(`/u/${router.query.u}/?content=${type_}`, null, { shallow: true })
set_content_type(type_)
}

}




async function fetch_next_page() {


let after_type = content_type == 'posts' ? posts.posts_after : content_type == 'comments' ? posts.comments_after : posts.all_content_after
let ct_ = content_type == 'posts' ? '/submitted/' : content_type == 'comments' ? '/comments/' : ''
let base_url = `https://oauth.reddit.com/user/${posts.user}${ct_}.json`


let url_ = after_type ? `${base_url}?&after=${after_type}` : base_url


return new Promise((resolve,reject) => resolve(fetch_new_posts(url_.toLowerCase())))
.then((data) => {

if (data.props.data.data.children && data.props.data.data.children.length >= 5 && data.props.data.data.after) { 


let new_posts__ = data.props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})



let new_posts_ = new_posts__.slice(0, 15)
let new_pool = new_posts__.slice(15)
let new_after = data.props.data.data.after


let content__ = content_type == 'posts' ? posts.posts : content_type == 'comments' ? posts.comments : posts.all_content
let pool__ = content_type == 'posts' ? posts.posts_pool : content_type == 'comments' ? posts.comments_pool : posts.all_content_pool
let posts_ = content__.concat(new_posts_)
let new_pool_ = pool__.concat(new_pool)
length_ref.current = posts_.length

if (content_type == 'posts') { 
            set_posts({
              ...posts,
  posts: posts_, 
  posts_pool: new_pool_, 
  posts_after: new_after, 
})


} else if (content_type == 'comments') {
            set_posts({
              ...posts,
  comments: posts_, 
  comments_pool: new_pool_, 
  comments_after: new_after, 
})

 } else {
            set_posts({
              ...posts,
  all_content: posts_, 
  all_content_pool: new_pool_, 
  all_content_after: new_after, 
})


}





          } else {

if (content_type == 'posts') { 
set_posts({...posts, OOP_posts: true})
fetching_ref.current = false
} else if (content_type == 'comments') {
set_posts({...posts, OOP_comments: true})
fetching_ref.current = false
 } else {
set_posts({...posts, OOP_all_content: true})
fetching_ref.current = false
}
          }

}).catch(err => console.log(err))

}


function handle_post_click(x) {
if (clicked_post == null) {
router.push(`${router.asPath}?post=${x.data.name}`, null, { shallow: true })
  set_clicked_post(x)

} else { 
  let new_url = router.query.u ? `${router.query.u}` : `/`

router.push(new_url, null, { shallow: true })
  set_clicked_comment({data: null, original_id: null})
  set_clicked_post(null)
}
}




function add_chunks() {

let content__ = content_type == 'posts' ? posts.posts : content_type == 'comments' ? posts.comments : posts.all_content
let pool__ = content_type == 'posts' ? posts.posts_pool : content_type == 'comments' ? posts.comments_pool : posts.all_content_pool


        if (pool__.length < 15) { 

    fetch_next_page() 

        } else {

        let new_posts = [...pool__].slice(0, 15)
        let new_pool = [...pool__].slice(15)
        let posts_ = content__.concat(new_posts)
        length_ref.current = content__.length

if (content_type == 'posts') { 
            setTimeout(() => {
                set_posts({
                         ...posts,
                    posts_pool: new_pool,
                    posts: posts_
                })
            }, 1000)
} else if (content_type == 'comments') {
            setTimeout(() => {
                set_posts({
                         ...posts,
                    comments_pool: new_pool,
                    comments: posts_
                })
            }, 1000)
 } else {
            setTimeout(() => {
                set_posts({
                         ...posts,
                    all_content_pool: new_pool,
                    all_content: posts_
                })
            }, 1000)

}
        }
          fetching_ref.current = false
    }



function handle_comment_click(comment_) {


let fetch_post_url = `https://oauth.reddit.com/api/info/?id=${comment_.data.link_id}`
let parent_id_name = comment_.data.parent_id.replace('t1_','')
let fetch_parent_comment_url = `https://oauth.reddit.com${comment_.data.permalink.replace(`/${comment_.data.id}/`, `/${parent_id_name}`)}`

return new Promise((resolve,reject) => resolve(fetch_new_posts(fetch_parent_comment_url.toLowerCase())))
.then((post_data) => {



let data__ = post_data.props.data[0].data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = get_relative_time(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})


let post_data_ = data__[0]
let comment_data = comment_.data.parent_id.includes('t1') ? post_data.props.data[1] : comment_


//router.push(`${router.asPath}?post=${post_data_.data.name}`, null, { shallow: true })
//set_clicked_comment({data: comment_data, original_id: comment_.data.id})

localStorage.setItem('clicked_post', JSON.stringify({post: post_data_, comment: comment_data, original_id: comment_.data.id, prev: pathname}))
router.push(`/post/${post_data_.data.name}`)
}).catch(err => console.log(err))


}






let h_ = props.height * .85
let w_ = props.width
  return (

<div className = {styles.post_frame} >

<div className = {styles.sort_wrapper}>
<button type="button" className = {content_type == 'all_content' ? styles.sort_option_selected : styles.sort_option} onClick = {() => handle_content_type('all_content')}>Overview</button>
<button type="button" className = {content_type == 'posts' ? styles.sort_option_selected : styles.sort_option} onClick = {() => handle_content_type('posts')}>Posts</button>
<button type="button" className = {content_type == 'comments' ? styles.sort_option_selected : styles.sort_option}onClick = {() => handle_content_type('comments')}>Comments</button>

</div>



<div className = {styles.posts_shadow_wrap} >
{loading ? 
<div className = {styles.skeleton_loader_rings}>
      <BounceLoader
        color={'#b2d7c5'}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
 :
/*<div className ={styles.skeleton_loader}></div>*/ 


<Fragment>
{content_type == 'posts' ? 
<Fragment>
{posts.posts.map((post, i) => <Post key = {i} handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {post} i = {i}/>)}
</Fragment>
: content_type == 'comments' ? 
<Fragment>
{posts.comments.map((comment, i) => <Comment key = {i} handle_comment_click={handle_comment_click} comment = {comment} i = {i} />)}
</Fragment>
:
<Fragment>

{posts.all_content.map((content, i) => {
return (
<Fragment key = {i}>
{content.kind == 't1' ?  <Comment key = {i} handle_comment_click={handle_comment_click} comment = {content} i = {i} /> : <Post key = {i} handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {content} i = {i}/> }
</Fragment>
  )
})}
</Fragment>
}

{content_type == 'posts' && posts.OOP_posts ?  <div className = {styles.OOP}>That&apos;s all!</div> :
content_type == 'comments' && posts.OOP_comments ? <div className = {styles.OOP}>That&apos;s all!</div> :
content_type == 'all_content' && posts.OOP_all_content ? <div className = {styles.OOP}>That&apos;s all!</div> :

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


</div>

)}


function Comment(props) {



let comment = props.comment


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
