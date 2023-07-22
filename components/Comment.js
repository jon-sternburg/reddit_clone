import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo, createElement } from "react";
import styles from '../posts_container_styles.module.css'
import Link from 'next/link'
import {BiExpandAlt} from "react-icons/bi"
import _ from 'lodash'
import get_relative_time from '../utils/get_relative_time';

export default function Comment(props) { 
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
let posted_time = get_relative_time(d, now)

set_posted_time(posted_time.replace(' ago', ''))
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

<div className = {styles.comment_wrap_inner} onClick = {() => toggle_replies()}>
<div className = {styles.expand_icon_wrap} ><BiExpandAlt className = {styles.expand_icon} /> </div>
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