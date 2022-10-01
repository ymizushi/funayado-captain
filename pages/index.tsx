import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from 'react';
import { KV, Select } from '../components/Input';
let socket: Socket

const Home: NextPage = () => {
  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {
      setInput(msg)
    })
  }

  const onChangeHandler = (e: any) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  const [input, setInput] = useState<string>("")

  const values: KV[] = [
    {
      key: 1,
      value: 1
    }
  ]

  useEffect(() => {
      socketInitializer()
  }
    , [])

  return (
    <div className={styles.container}>
      <Head>
      </Head>

      <main className={styles.main}>
        <Select
         id="selectRoom"
         name="selectRoom"
         values={values}
        />
        <input
          placeholder="Type something"
          value={input}
          onChange={onChangeHandler}
        />

      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
