
import React, { Component, useState, useEffect, Suspense } from 'react'
import styles from '../homepage_styles.module.css'
import Topbar from '../components/Topbar.js'


export default function HomepageLayout({children, props}) {

  return (


<div className = {styles.homepage_frame}>
<Topbar 
subreddit = {props.router.query.r} 
query = {props.router.query.s} 
search = {props.search}
user = {props.router.query.u}
 />
<section>
{children}
</section>

</div>


  )
}

