'use client'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Sidebar from '../components/Sidebar'
import Login from '@/pages/login'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from 'config/firebase'
import Loading from '@/components/Loading'
import { useEffect } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
// import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'Users', user?.email as string),
          {
            email: user?.email,
            lastSeen: serverTimestamp(),
            photoURL: user?.photoURL,
          },
          { merge: true }
        )
      } catch (error) {
        console.log('ERROR SET USER INFO IN DB', error)
      }
    }
    if (user) setUserInDb()
  }, [user])

  if (loading) return <Loading />

  if (!user) return <Login />

  return <Sidebar />
}
