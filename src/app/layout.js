import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footeri from './components/Footers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GameGrid',
  description: 'GameGrid a platfom for gaming lovers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"/>
      </head> */}
      <body className="bg-main-background bg-no-repeat bg-cover">
<<<<<<< HEAD
        <Header />
=======
        <div>
        </div>
        {/* <Header /> */}
>>>>>>> 82d1b909680d028340e9709ad09161e1f22d790f
        {children}
        <div>
          <Footeri />
        </div>
      </body>
    </html>
  )
}
