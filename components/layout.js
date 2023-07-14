
import React, { Component, useState, useEffect, Suspense } from 'react'
import styles from '../homepage_styles.module.css'
import Topbar from '../components/Topbar.js'
import Loading from '../components/loading.js'




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


async function get_auth() {
return await fetch("/api/auth", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
.then((res) => res.json())
.then((token) => localStorage.setItem('token', token))
.catch(err => console.log(err))
}