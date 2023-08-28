'use client'
import React, {Fragment, useState, useEffect, useRef } from "react";
import styles from '../css/post_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Post from '../components/Post'
import { getCookie, setCookie} from 'cookies-next';
import User_Comment from './User_Comment'
import { useRouter } from 'next/navigation'
import BounceLoader from "react-spinners/BounceLoader";
import get_relative_time from '../utils/get_relative_time';
import { usePathname } from "next/navigation"
import {Thread, ThreadResult} from '../types/post_types'
import {Comment} from '../types/comment_types'
import { useParams } from 'next/navigation'

type AllContentConfirmed = (Thread | Comment)[]
type Posts = Thread[] | null;
type Comments = Comment[] | null;
type AllContent = (Thread | Comment)[] | null


type UC_Props = {
fetch_url: string;
token: string;
posts: AllContent;
after: string | null;
width: number;
height: number;
}

type ContentType = "all_content" | "posts" | "comments"

type UCPostsState = {
  all_content: AllContent;
  posts: Posts;
  comments: Comments;
  posts_pool: Posts; 
  comments_pool: Comments; 
  all_content_pool: AllContent;
  all_content_after: string | null; 
  posts_after: string | null; 
  comments_after: string | null; 
  fetch_url: string;
  OOP_all_content: boolean;
  OOP_posts: boolean;
  OOP_comments: boolean;
}


type FetchNewData = ThreadResult[] | ThreadResult | null;

export default function User_Container(props: UC_Props):JSX.Element {
const router = useRouter()
const pathname = usePathname()
const fetching_ref = useRef<boolean>(false)
const [loading, set_loading] = useState<boolean>(true);
const [content_type, set_content_type] = useState<ContentType>('all_content');
const [posts, set_posts] = useState<UCPostsState>({
  all_content: [],
  posts: [], 
  comments: [],
  posts_pool: [], 
  comments_pool: [], 
  all_content_pool: [],
  all_content_after: null,
  posts_after: null, 
  comments_after: null, 
  fetch_url: '',
  OOP_all_content: false,
  OOP_posts: false,
  OOP_comments: false
});
const params = useParams()
const isPost = (content: Comment | Thread): content is Thread => 't3' == content['kind']
const isComment = (content: Comment | Thread): content is Comment => 't1' == content['kind']
const h_ = props.height * .85
const w_ = props.width




  const callback = (entries:  IntersectionObserverEntry[]): void => {
    if (entries && entries[0]) {
      let end_vis = entries[0].isIntersecting
      if (end_vis && !fetching_ref.current && ((content_type == 'posts' && !posts.OOP_posts) || (content_type == 'comments' && !posts.OOP_comments) || (content_type == 'all_content' && !posts.OOP_all_content))) {
        fetching_ref.current = true
        add_chunks()
        } else if (end_vis && fetching_ref.current) {
          fetching_ref.current = false
        }
    }
  };


useEffect(() => {

setCookie('access_token', props.token);

if (props.posts !== null) {
let data__ = get_posted_time(props.posts)
let comments_:Comment[] = data__.filter(isComment)
let posts_:Thread[] = data__.filter(isPost);
set_posts(prevState => ({
  ...prevState,
  posts: posts_.slice(0, 15), 
  comments: comments_.slice(0, 15),
  all_content: data__.slice(0, 15), 
  posts_pool: posts_.slice(15), 
  comments_pool: comments_.slice(15),
  all_content_pool: data__.slice(15), 
  all_content_after: props.after,
  fetch_url: props.fetch_url
}));

set_loading(false)
} else {

set_posts(prevState => ({
  ...prevState,
OOP_posts: true,
OOP_comments: true,
OOP_all_content: true
}));

set_loading(false)

}
}, [props.posts, props.after, props.fetch_url, props.token])


const options ={rootMargin:'-50px 0px 200px 0px', threshold:[0.01]} 
const [end_ref] = useIntersectionObserverRef(callback, options);

async function fetch_new_posts(url_:string):Promise<FetchNewData> {
 
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
.catch(err => console.log(err))
}


function get_posted_time(posts_: AllContentConfirmed) : AllContentConfirmed {
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
function add_chunks() {
  let content__ = content_type == 'posts' ? posts.posts : content_type == 'comments' ? posts.comments : posts.all_content
  let pool__ = content_type == 'posts' ? posts.posts_pool : content_type == 'comments' ? posts.comments_pool : posts.all_content_pool
          if (pool__ !== null && pool__.length < 15 && content__ !== null) { 
      fetch_next_page() 
          } else if (pool__ !== null && content__ !== null) {
  
          let new_posts = pool__.slice(0, 15)
          let new_pool =pool__.slice(15)
          let posts_ = content__.concat(new_posts)
  
  
  if (content_type == 'posts') { 
              setTimeout(() => {
                  set_posts({
                           ...posts,
                      posts_pool: new_pool.filter(isPost),
                      posts: posts_.filter(isPost)
                  })
              }, 1000)
  } else if (content_type == 'comments') {
              setTimeout(() => {
                  set_posts({
                           ...posts,
                      comments_pool: new_pool.filter(isComment),
                      comments: posts_.filter(isComment)
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

async function handle_content_type(type_:string) {

if (type_ == 'posts' && !posts.OOP_posts && posts.posts_after == null) { 

set_loading(true)
let url_ = `https://oauth.reddit.com/user/${params.u}/submitted/.json`.toLowerCase()
let data = await fetch_new_posts(url_)
if (data !== null && data !== undefined && !Array.isArray(data)) { 
let new_posts = get_posted_time(data.data.children).filter(isPost) 

set_posts({
  ...posts,
  posts: new_posts.slice(0, 15), 
  posts_pool: new_posts.slice(15), 
  posts_after: data.data.after
 })
set_loading(false)
set_content_type(type_)
} else { set_posts({...posts, OOP_posts: true}) }

} else if (type_ == 'comments' && !posts.OOP_comments && posts.comments_after == null) { 


let url_ = `https://oauth.reddit.com/user/${params.u}/comments/.json`.toLowerCase()
let data = await fetch_new_posts(url_)
if (data !== null && data !== undefined && !Array.isArray(data)) { 

let new_comments = get_posted_time(data.data.children).filter(isComment) 


set_posts({
  ...posts,
  comments: new_comments.slice(0, 15), 
  comments_pool: new_comments.slice(15), 
  comments_after: data.data.after
 })

set_loading(false)
set_content_type(type_)
} else {set_posts({...posts, OOP_comments: true})}
} else if (type_ == 'all_content' || type_ == 'posts' || type_ == 'comments') { set_content_type(type_)}

}




async function fetch_next_page() {


let after_type = content_type == 'posts' ? posts.posts_after : content_type == 'comments' ? posts.comments_after : posts.all_content_after
let ct_ = content_type == 'posts' ? '/submitted/' : content_type == 'comments' ? '/comments/' : ''
let base_url = `https://oauth.reddit.com/user/${params.u}${ct_}.json`


let url_ = after_type ? `${base_url}?&after=${after_type}`.toLowerCase() : base_url.toLowerCase()

let data = await fetch_new_posts(url_)

if (data && data !== null &&  !Array.isArray(data) && data.data.children && data.data.children.length >= 5 && data.data.after) { 


let new_posts__ = get_posted_time(data.data.children)
let new_posts_ = new_posts__.slice(0, 15)
let new_pool = new_posts__.slice(15)
let new_after = data.data.after


let content__ = content_type == 'posts' ? posts.posts : content_type == 'comments' ? posts.comments : posts.all_content
let pool__ = content_type == 'posts' ? posts.posts_pool : content_type == 'comments' ? posts.comments_pool : posts.all_content_pool


let posts_ = content__ !== null ? content__.concat(new_posts_) : []
let new_pool_ = pool__ !== null ? pool__.concat(new_pool) : []


if (content_type == 'posts') { 
set_posts({
...posts,
  posts: posts_.filter(isPost), 
  posts_pool: new_pool_.filter(isPost), 
  posts_after: new_after, 
})


} else if (content_type == 'comments') {
set_posts({
...posts,
  comments: posts_.filter(isComment), 
  comments_pool: new_pool_.filter(isComment), 
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



}

async function handle_comment_click(comment_: Comment) {

let parent_id_name = comment_.data.parent_id.replace('t1_','')
let fetch_parent_comment_url = `https://oauth.reddit.com${comment_.data.permalink.replace(`/${comment_.data.id}/`, `/${parent_id_name}`)}`.toLowerCase()

let both_data = await fetch_new_posts(fetch_parent_comment_url)

if (both_data !== null && Array.isArray(both_data)) {
let post_data:ThreadResult = both_data[0]
let data__ = get_posted_time(post_data.data.children)
let post_data_ = data__[0]
let comment_data = comment_.data.parent_id.includes('t1') ? both_data[1].data.children[0] : comment_
localStorage.setItem('clicked_post', JSON.stringify({post: post_data_, comment: comment_data, original_id: comment_.data.id, prev: pathname}))
router.push(`/post/${post_data_.data.name}`)
}

}
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

<Fragment>
{content_type == 'posts' ? 
<Fragment>
{posts.posts !== null && (posts.posts.map((post, i) => <Post key = {i}  h_ = {h_ } w_ = {w_} post = {post} i = {i}/>))}
</Fragment>
: content_type == 'comments' ? 
<Fragment>
{posts.comments !== null && (posts.comments.map((comment, i) => <User_Comment key = {i} handle_comment_click={handle_comment_click} comment = {comment} i = {i} />))}
</Fragment>
:
<Fragment>

{posts.all_content !== null && (posts.all_content.map((content, i) => {
return (
<Fragment key = {i}>
{content.kind == 't1' ?  <User_Comment key = {i} handle_comment_click={handle_comment_click} comment = {content} i = {i} /> : 
content.kind == 't3' && isPost(content) ?
<Post key = {i}  h_ = {h_ } w_ = {w_} post = {content} i = {i}/> : null }
</Fragment>
  )
}))}
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




