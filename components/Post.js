import React, {Fragment, useState, useEffect, useCallback, useRef } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import {BiSolidUpvote} from "react-icons/bi"
import {FaRegComment} from "react-icons/fa"
import {BiSolidDownvote} from "react-icons/bi"
import {TbExternalLink} from "react-icons/tb"
import { marked } from 'marked';
import parse from 'html-react-parser';



export default function Post(props) {

let post = props.post
let h_ = props.h_
let i = props.i

let type_ = (post.data.is_video)|| (post.data.post_hint && post.data.post_hint.includes('video')) ? <Video_ width = {props.w_} height = {h_} data = {post.data} /> : 
                                                                                post.data.is_self ? <Text_ data = {post.data}  height = {h_} />  : <Image_ height = {h_} data = {post.data} width = {props.w_} /> 


function handle_post_box_click(post_, e) {
e.preventDefault()
e.stopPropagation()


}


return (


<div className = {styles.post_box} onClick = {() => props.handle_post_click(post)}>
 
<div className = {styles.post_box_top_wrapper} >

<div className = {styles.score_wrapper}>
<BiSolidUpvote className = {styles.upvote_icon}/>
<div className = {styles.post_box_score}>{post.data.score}</div>
<BiSolidDownvote className = {styles.downvote_icon}/>
</div>


<div className = {styles.post_box_title_wrap}>
<h3 className = {styles.post_box_title}>{post.data.title}</h3>
<div className = {styles.post_info_wrapper}>


<div className = {styles.post_box_subreddit} onClick = {(e) => handle_post_box_click(post, e)}>
<Link href={`/${post.data.subreddit}`}>
{post.data.sr_detail && post.data.sr_detail.icon_img && (<img alt = {"subreddit icon image"} height = {20} width = {20} src = {post.data.sr_detail.icon_img} className = {styles.icon_img} />)}
<span>r/{post.data.subreddit}</span>
</Link>
</div>



<div className = {styles.post_box_author} onClick = {(e) => handle_post_box_click(post, e)}>
<Link href={`/u/${post.data.author}`}>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></Link></div>

<div className = {styles.post_box_comments}>
<FaRegComment className = {styles.comments_icon} /> 
{post.data.num_comments} comments
</div>
</div>
</div>


</div>


<div className = {styles.post_box_inner}>
{type_}
</div>
</div>





	)





}

function Image_(props) {
const [img_error, set_img_error] = useState(false);
const [dim, set_dim] = useState({w: null, h: null})
let src_ =  props.data.url 

function onError() {
  console.log('error => ', props)
set_img_error(true)
}


  useEffect(() => {

if (!props.data.url.includes('.gifv') && !props.data.url.includes('gallery') && props.data.preview) {

let prev_h = props.data.preview.images[0].source.height
let prev_w = props.data.preview.images[0].source.width
let dim = getMediaSize(prev_w, prev_h)
set_dim(dim)
} 
//else {set_dim({w: 'auto', h: 'auto'})}


}, [props.width, props.height])




function getMediaSize(iw, ih) {
let max_h = props.height * .7
let max_w = props.width * .4



let widthPercent = max_w / iw;
let heightPercent = max_h / ih;
let smallestPercent = Math.min(widthPercent, heightPercent);

return {
    w: iw * smallestPercent,
    h: ih * smallestPercent
}

}





  return (
<Fragment>

{props.data.url.includes('imgur') && props.data.url.includes('.gifv') ?

    <video 
    autoPlay 
    loop 
    muted
    style = {{maxHeight: props.height * .7}}
    controls
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {props.data.url.replace('.gifv', '.mp4')} />

    : props.data.domain.includes('redd') || props.data.domain.includes('imgur') ? 
<Fragment>

{img_error || props.data.url.includes('gallery') ? 

<div className = {styles.img_link_wrapper}>
<form action = {props.data.url} method = 'get' target="_blank">
<button type = 'submit' className = {styles.img_link_wrap}>
<TbExternalLink className = {styles.img_link_icon} />
<span className = {styles.img_link}>{props.data.url}</span>

</button>
</form>
</div>
:
<Fragment>
{dim.w && dim.h && (
 <img alt = {'post image'} 
 className = {styles.img_post} 
 src = {src_} 
 loading = {"lazy"}
 width = {dim.w}
 height = {dim.h}
 onError={onError}/> 
)}
</Fragment>

}
</Fragment>
:
<div className = {styles.img_link_wrapper}>
<form action = {props.data.url} method = 'get' target="_blank">
<button type = 'submit' className = {styles.img_link_wrap}>
<TbExternalLink className = {styles.img_link_icon} />
<span className = {styles.img_link}>{props.data.url}</span>

</button>
</form>
</div>
}

  
</Fragment>

    )
  }

  function Text_(props) {

if (props.data.selftext && props.data.selftext.length > 0) { 
let text = marked.parse(props.data.selftext,  {mangle: false, headerIds: false})
let html_ = parse(text)


  return (
<Fragment>

{html_ && html_.length > 0 && (
<div className = {styles.selftext_box_feed} style = {{maxHeight: props.height * .7}} >
  {html_}
</div>
  )}

</Fragment>
    
    )


 } else {


return(

<Fragment>
</Fragment>
  )

 }




  }

function Video_(props) {

let type_ = props.data.url.includes('youtube') || props.data.url.includes('youtu.be') ? 'youtube' : props.data.url.includes('redgifs') ? 'redgifs'  : 
props.data.url.includes('gfy') ? 'gfy' : props.data.url.includes('stream') ? 'streamable' : 'video'


let src_ = type_ == 'youtube' || type_ == 'redgifs'  || type_ == 'gfy' ? props.data.secure_media_embed.media_domain_url : props.data.secure_media && props.data.secure_media.reddit_video && props.data.secure_media.reddit_video.fallback_url ?
props.data.secure_media.reddit_video.fallback_url : props.data.secure_media.reddit_video ?  props.data.secure_media.reddit_video : props.data.url




  return (
    <Fragment>

    { type_ == 'youtube' || type_ == 'redgifs' || type_ == 'gfy'?  <iframe width = {props.data.secure_media_embed.width } 
                                                                          style = {{maxHeight: props.height * .7}}
                                                                          height = {props.data.secure_media_embed.height + 5} 
                                                                          className = {styles.video_post} src = {src_}
                                                                          frameBorder = {0}
                                                                          loading = {"lazy"}
                                                                           /> 

                                                          :  type_ == 'streamable' ? <div className = {styles.img_link_wrapper}>
<form action = {props.data.url} method = 'get' target="_blank">
<button type = 'submit' className = {styles.img_link_wrap}>
<TbExternalLink className = {styles.img_link_icon} />
<span className = {styles.img_link}>{props.data.url}</span>

</button>
</form>
</div> : 
    <video 
    autoPlay 
    loop 
    loading = {"lazy"}
    muted
    style = {{maxHeight: props.height * .7}}
    controls
  //  poster = {props.data.thumbnail} 
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {src_} />}
    </Fragment>
    )
  }