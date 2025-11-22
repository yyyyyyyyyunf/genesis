import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import fs from 'node:fs/promises'
import path from 'node:path'

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

const DB_PATH = path.join(process.cwd(), 'src', 'db.json')

// 确保 DB 存在
async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    console.error('读取 DB 出错:', e)
    return []
  }
}

async function saveDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

app.get('/', (c) => {
  return c.text('Jarvis 后端服务正在运行!')
})

app.get('/api/page-config', async (c) => {
  const data = await getDB()
  return c.json(data)
})

app.post('/api/page-config', async (c) => {
  const body = await c.req.json()
  await saveDB(body)
  return c.json({ success: true, message: '配置保存成功' })
})

const port = 3002
console.log(`服务运行在端口 ${port}`)

serve({
  fetch: app.fetch,
  port
})

