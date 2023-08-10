'use client'
import React, {Fragment, useState, useEffect, useRef } from "react";
import styles from '../homepage_styles.module.css'
import Posts_Container from './Posts_Container.js'
import User_Container from './User_Container.js'
import Post_Page from './Post_Page.js'
import Top_Bar from './Top_Bar.js'




export default function Homepage_Container(props) {

const [size, set_dim] = useState({width: 0, height: 0})

useEffect(() => {

document.title = props.subreddit? props.subreddit : props.user ? props.user : props.query ? `search results for ${props.query}` : 'Reddit Clone!' 

window.addEventListener('resize', updateDimensions);
updateDimensions()
return () => window.removeEventListener('resize', updateDimensions);
}, [])


function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}


return (


<main className = {styles.homepage_frame}>

{size.height > 0 && (
  <Fragment>
<Top_Bar  />


{props.user ? 
<User_Container 
data = {props.data}
fetch_url = {props.fetch_url}
user = {props.user}
token = {props.token}
posts = {props.posts} 
after = {props.after}
width = {size.width} 
height = {size.height} 
/>

: props.post_page ? 

<Post_Page
data = {props.data}
fetch_url = {props.fetch_url}
subreddit = {props.subreddit}
token = {props.token}
posts = {props.posts} 
after = {props.after}
width = {size.width} 
height = {size.height} 
/>

:

<Posts_Container 
data = {props.data}
fetch_url = {props.fetch_url}
subreddit = {props.subreddit}
token = {props.token}
posts = {props.posts} 
after = {props.after}
width = {size.width} 
height = {size.height} 
/>
}





</Fragment>
)}
</main>






  )

}
