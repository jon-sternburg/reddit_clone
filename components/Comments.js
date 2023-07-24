import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo, createElement } from "react";
import styles from '../posts_container_styles.module.css'
import Link from 'next/link'
import {BiExpandAlt} from "react-icons/bi"
import _ from 'lodash'
import { getCookie } from 'cookies-next';
import BounceLoader from "react-spinners/BounceLoader";
import Comment from '../components/Comment.js'
import {FaChevronDown} from "react-icons/fa"



export default function Comments(props) {
const [comments, set_comments] = useState({comments:[], show: false})
const [loading, set_loading] = useState(true);
const [more_comments, set_more_comments] = useState({fetched: false, pool: [], pool_index: 0, remaining: null, more: null});
const [clicked_comment, show_clicked_comment] = useState(false)


let post = props.post
let subreddit = props.post.data.subreddit
let post_id = post.data.id
let clicked_comment_ = !props.clicked_comment || props.clicked_comment.data == null ? null : props.clicked_comment && props.clicked_comment.data.data && props.clicked_comment.data.data.children ? props.clicked_comment.data.data.children[0] : props.clicked_comment.data

useEffect(() => {
if (!comments.show) {
 new Promise((resolve,reject) => resolve(fetchData(`https://oauth.reddit.com/r/${subreddit}/comments/${post_id}.json?`)))
.then((comments_) => {
let more_ = comments_[1].data.children.filter(x => x.kind == 'more')
console.log(comments_)
set_comments({comments: comments_[1].data.children, show: true})

set_more_comments({
  fetched: false, 
  pool: [], 
  pool_index: 0, 
  remaining: more_ && more_[0] && more_[0].data.children.length ? more_[0].data.children.length : null, 
  more: more_ && more_.length > 0 ? more_[0] : null 
})

if (props.clicked_comment !== null && props.clicked_comment.data) {show_clicked_comment(true)}
set_loading(false)

}).catch(err => console.log(err))  
}}, [])


function scroll_next_comment() {





}


function set_chunk(comment_) {


if (!more_comments.fetched) { 
let chunked = _.chunk(comment_.data.children, 100)
let current_chunk = chunked[0]
let comment_id = current_chunk.join(',')
console.log('set_chunk (first run)')
get_more_comments(comment_, comment_id)
set_more_comments({
  fetched: true, 
  pool: chunked, 
  pool_index: 0, 
  remaining: comment_.data.children.length - chunked[more_comments.pool_index ].length,
  more: more_comments.more
})



} else {
console.log('set_chunk (not first run)')
console.log(more_comments)
let current_chunk = more_comments.pool[more_comments.pool_index + 1]
let comment_id = current_chunk.join(',')
get_more_comments(comment_, comment_id)
set_more_comments({
  fetched: true, 
  pool: more_comments.pool, 
  pool_index: more_comments.pool_index + 1, 
  remaining: more_comments.remaining - current_chunk.length,
  more: more_comments.more
})



}

}
function handle_clicked_comment_toggle() {


show_clicked_comment(false)

}
async function get_more_comments(comment_, comment_id) {

console.log('ORIGINAL: ', comment_)

let url_ = `https://oauth.reddit.com/api/morechildren.json?api_type=json&showmore=true&link_id=${comment_.data.parent_id}&children=${comment_id}`
return new Promise((resolve,reject) => resolve(fetchData(url_)))
.then((data) => {

let new_comments = data.json.data.things
let max_depth = Math.max.apply(null,new_comments.map((o) =>  o.data.depth ));
var depth = max_depth

while (depth >= 1) {
let child_comments_ = new_comments.filter(x => x.data.depth == depth)

child_comments_.map(x => {
let parent_comment_id = new_comments.findIndex((y) => y.data.name == x.data.parent_id )
let parent = new_comments[parent_comment_id]
new_comments[parent_comment_id].data.replies = {data: {children: [x]}}
let original_index = new_comments.findIndex((y => y.data.name == x.data.name))
if (original_index > -1) {new_comments.splice(original_index, 1) }

})
depth--
}

console.log('done ', new_comments)
let final = comments.comments.concat(new_comments)

set_comments({comments: final, show: true})

}).catch(err => console.log(err))  

}

return (

  <div className = {styles.comment_box} >


<Fragment>
{loading ? <div className = {styles.skeleton_loader_rings_comments}>
      <BounceLoader
        color={'#b2d7c5'}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
 : clicked_comment ? 


<Fragment>
<div onClick = {() => handle_clicked_comment_toggle()} className = {styles.show_all_comments} >Show all comments</div>
<Comment  
clicked_comment = {true} 
comment = {clicked_comment_} 
clicked_id = {props.clicked_comment.original_id}
i = {0} 
subreddit = {subreddit} 
post_id = {post_id} 
/>

</Fragment>




: comments.comments.length ? 

  <Fragment>
{/*
<div onClick = {() => scroll_next_comment()} className = {styles.next_comment_wrap}><FaChevronDown className={styles.next_comment_icon}/></div>
*/}
{comments.comments.map((comment, i) => {

return(
  <Fragment key = {i}>

{comment.kind == 't1' && (
<Comment  comment = {comment} i = {i} subreddit = {subreddit} post_id = {post_id} />
)}

<div className = {styles.comment_divider}></div>
</Fragment>
)
})}

{more_comments.more  &&  more_comments.remaining > 0 && ( 
<div className = {styles.comment_body} onClick = {() => set_chunk(more_comments.more)}>
Load more comments
{/*more_comments.remaining} more {more_comments.remaining == 1 ? 'comment' : 'comments'*/}
</div>
)}


</Fragment>

: <div className = {styles.no_comments}>No comments yet!</div>

}
</Fragment>

  </div>
   
	)}




async function fetchData(url_) {

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
return data
})
.catch(err => console.log(err))

}