'use client'
import React, {Fragment, useEffect} from "react";
import styles from '../../../posts_container_styles.module.css'
import {AiFillCloseCircle} from "react-icons/ai"
import Clicked_Post from '../../../components/Clicked_Post.js'
import Comments from '../../../components/Comments.js'
import { useRouter } from 'next/navigation'
const ls_data = JSON.parse(localStorage.getItem('clicked_post'))


export default function Modal_Post(props) {
	
const router = useRouter()
const ls_data = JSON.parse(localStorage.getItem('clicked_post'))
//const clicked_comment_ =  JSON.parse(localStorage.getItem('clicked_comment')) || null

const h_ =window.innerHeight
const w_ =  window.innerWidth


function handle_post_click() {
router.back()
}


return ( 

  <Fragment>
<div className = {styles.post_popup_frame_left} onClick = {() => handle_post_click(null)}/>

<div className = {styles.post_popup}>
<AiFillCloseCircle onClick = {() => handle_post_click(null)} className = {styles.close_popup_post_icon}/>

<Clicked_Post handle_post_click = {handle_post_click} h_ = {h_ } w_ = {w_} post = {ls_data.post} prev = {ls_data.prev} />

<Comments post = {ls_data.post} clicked_comment = {{data: ls_data.comment}} original_id = {ls_data.original_id}/>

</div>

<div className = {styles.post_popup_frame_right} onClick = {() => handle_post_click(null)}/>

</Fragment>


)


}