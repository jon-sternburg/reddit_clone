'use client'
import { Inter } from 'next/font/google'
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout(props) {


const pathname = usePathname();
const modal_ = pathname.includes("/post/") ? props.modal : null


  return (
    <html lang="en">
    <head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
<title>Reddit Clone!</title>
<link rel="icon" href="/favicon.ico" />

</head>

      <body className={inter.className} style = {{overscrollBehavior: 'none'}}>{props.children}{modal_}</body>
    </html>
  )
}
