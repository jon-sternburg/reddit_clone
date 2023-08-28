'use client'
import React, {Fragment} from "react";
import styles from '../../../css/modal_styles.module.css'
import {AiFillCloseCircle} from "react-icons/ai"
import Clicked_Post from '../../../components/Clicked_Post'
import Comments from '../../../components/Comments'
import { useRouter } from 'next/navigation'
import {Thread} from '../../../types/post_types'
import {Comment} from '../../../types/comment_types'


type LsData = {
comment: Comment | null
original_id: string | null
post: Thread
prev: string

}
export default function Modal_Post(): JSX.Element {
	
const router = useRouter()
const ls_data: LsData = JSON.parse(localStorage.getItem('clicked_post') || '{}')
const clicked_comment_ = ls_data.comment ? ls_data.comment : null
const h_ = window.innerHeight
const w_ =  window.innerWidth


function handle_post_click() {
router.back()
}


return ( 

  <Fragment>
<div className = {styles.post_popup_frame_left} onClick = {() => handle_post_click()}/>


<div className = {styles.post_popup}>

{ls_data !== null && ls_data && (
  <Fragment>
<AiFillCloseCircle onClick = {() => handle_post_click()} className = {styles.close_popup_post_icon}/>

<Clicked_Post h_ = {h_ } w_ = {w_} post = {ls_data.post} prev = {ls_data.prev} />

<Comments post = {ls_data.post} clicked_comment = {clicked_comment_} original_id = {ls_data.original_id}/>
</Fragment>
)}
</div>

<div className = {styles.post_popup_frame_right} onClick = {() => handle_post_click()}/>


</Fragment>


)


}