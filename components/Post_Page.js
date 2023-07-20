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
import { useRouter } from 'next/router'




export default function Post_Page(props) {

const [loading, set_loading] = useState(true);
const [post_data, set_post_data] = useState(null);


useEffect(() => {
  console.log(props)
let data__ = props.data.data.children.map(x => {
var d = new Date(x.data.created_utc*1000);
var now = new Date(new Date().getTime())
let posted_time = getRelativeTime(d, now)
return {...x, posted_time: posted_time.replace(' ago', '')}
})

set_post_data(data__[0]);
set_loading(false)
}, [])






 return (

<div className = {styles.post_frame} >
{loading ? <div className ={styles.skeleton_loader}></div> :
<Fragment>

<Clicked_Post  h_ = {props.height} w_ = {props.width} post = {post_data} />

<Comments post = {post_data} clicked_comment = {null} />
</Fragment>
}
</div>


)}


var units = {
  year  : 24 * 60 * 60 * 1000 * 365,
  month : 24 * 60 * 60 * 1000 * 365/12,
  day   : 24 * 60 * 60 * 1000,
  hour  : 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' })

var getRelativeTime = (d1, d2 = new Date()) => {
  var elapsed = d1 - d2
  for (var u in units) 
    if (Math.abs(elapsed) > units[u] || u == 'second') 
      return rtf.format(Math.round(elapsed/units[u]), u)
}
