import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo, createElement } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import {BiExpandAlt} from "react-icons/bi"
import _ from 'lodash'
import { setCookie, getCookie } from 'cookies-next';

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
{loading ? <div className = {styles.skeleton_loader_comments}></div> : clicked_comment ? 


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
{comments.comments.map((comment, i) => {

return(
  <Fragment key = {i}>

{comment.kind == 't1' && (
<Comment  comment = {comment} i = {i} subreddit = {subreddit} post_id = {post_id} />
)}


</Fragment>
)
})}

{more_comments.more  &&  more_comments.remaining > 0 && ( 
<div className = {styles.comment_body} onClick = {() => set_chunk(more_comments.more)}>
{more_comments.remaining} more {more_comments.remaining == 1 ? 'comment' : 'comments'}
</div>
)}


</Fragment>

: <div className = {styles.no_comments}>No comments yet!</div>

}
</Fragment>

  </div>
  
	)}



function Comment(props) { 
let comment = props.comment
let replies_ = comment.data.replies && comment.data.replies.data  ? comment.data.replies.data.children : [] 
const [replies, set_replies] = useState({replies:replies_, show: true})
const [posted_time, set_posted_time] = useState(null)

function toggle_replies() {
set_replies({...replies, show: !replies.show})
}

useEffect(() => {
  
if (posted_time == null) { 

var d = new Date(comment.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)

set_posted_time(posted_time)
}


}, [posted_time, comment.data.created_utc])



async function get_more_replies(reply_) {

let comment_id = reply_.data.children.join(',')
let link_id = comment && comment.data && comment.data.link_id ? comment.data.link_id : reply_.data.parent_id
let url_ = `https://oauth.reddit.com/api/morechildren.json?api_type=json&showmore=true&link_id=${link_id}&children=${comment_id}`
return new Promise((resolve,reject) => resolve(fetchData(url_)))
.then((data) => {

let new_replies = data.json.data.things

let max_depth = Math.max.apply(null,new_replies.map((o) =>  o.data.depth ));

console.log(new_replies, ' => max_depth: ', max_depth)
var depth = max_depth

while (depth >= 1) {
let child_comments_ = new_replies.filter(x => x.data.depth == depth)

child_comments_.map(x => {
let parent_comment_id = new_replies.findIndex((y) => y.data.name == x.data.parent_id )
let parent = new_replies[parent_comment_id]
console.log(parent, x, 'id: ', x.data.name, ' parent: ', x.data.parent_id)

if (new_replies[parent_comment_id]) { 
new_replies[parent_comment_id].data.replies = {data: {children: [x]}}

let original_index = new_replies.findIndex((y => y.data.name == x.data.name))
if (original_index > -1) {new_replies.splice(original_index, 1) }
}

})
depth--
}

console.log('done ', new_replies)


let cr = replies.replies.filter(x => x.kind !== 'more')
let final = cr.concat(new_replies)

set_replies({replies: final, show: true})

}).catch(err => console.log(err))  

}



return (

<div className = {styles.comment_wrap}>
<div className = {styles.thread_line_wrap}  onClick = {() => toggle_replies()} >
<div className = {styles.thread_line}/>
</div>

<div className = {styles.comment_wrap_inner} >
<div className = {styles.expand_icon_wrap} onClick = {() => toggle_replies()}><BiExpandAlt className = {styles.expand_icon} /> </div>
<div className = {styles.comment_score}>{comment.data.score}</div>

<Link href={`/u/${comment.data.author}`} className = {styles.comment_author}>
u/{comment.data.author}
</Link>


{posted_time  && (<div className = {styles.comment_posted_time}>{posted_time}</div>)}
</div>

{replies.show && (
<Fragment>
<div className = {comment.data.id == props.clicked_id ? styles.clicked_comment_body : styles.comment_body} onClick = {() => toggle_replies()}>{comment.data.body}</div>

{replies.replies.map((reply,i) => {

return (

<Fragment key = {i}>
{reply && reply.data && reply.kind == 't1' && (
<Comment clicked_id = {props.clicked_id} comment = {reply} subreddit = {props.subreddit} post_id = {props.post_id}  />
  )}

{reply.data && reply.kind == 'more' && reply.data.children.length > 0 && (

<div onClick = {() => get_more_replies(reply)} className = {styles.load_more_replies}>{reply.data.children.length} more {reply.data.children.length == 1 ? 'reply' : 'replies'}</div>

  )}

</Fragment>
)

})}

</Fragment>

  )}

</div>

  )


}

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