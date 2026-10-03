import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function corsHeaders(origin: string | null) {
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
    .split(',').map((value) => value.trim()).filter(Boolean)
  const allowOrigin = origin && (allowed.includes('*') || allowed.includes(origin))
    ? origin
    : (allowed.includes('*') ? '*' : (allowed[0] ?? 'https://www.wonbok.kr'))
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'apikey, authorization, x-client-info, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function response(body: Record<string, unknown>, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char)
}

async function hashFingerprint(value: string) {
  const salt = Deno.env.get('RATE_LIMIT_SALT') ?? supabaseUrl
  const bytes = new TextEncoder().encode(`${salt}:${value}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hasExpectedSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (file.type === 'application/pdf') return new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
  if (file.type === 'image/png') return bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10'
  if (file.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (file.type === 'image/webp') return new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
  return false
}

async function notify(name: string, email: string, title: string, content: string) {
  const jobs: Promise<unknown>[] = []
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const recipient = Deno.env.get('NOTIFY_EMAIL_TO')
  const sender = Deno.env.get('NOTIFY_EMAIL_FROM')
  if (resendKey && recipient && sender) {
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeTitle = escapeHtml(title)
    const safeContent = escapeHtml(content).replace(/\n/g, '<br>')
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `[JWB STUDIO 문의] ${title}`,
        text: `성함: ${name}\n이메일: ${email}\n제목: ${title}\n\n${content}`,
        html: `<h2>새 외주 문의</h2><p><b>성함</b>: ${safeName}<br><b>이메일</b>: ${safeEmail}<br><b>제목</b>: ${safeTitle}</p><p>${safeContent}</p>`,
      }),
    }))
  }
  const webhook = Deno.env.get('DISCORD_WEBHOOK_URL')
  if (webhook) {
    jobs.push(fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'JWB STUDIO에 새 외주 문의가 접수됐습니다. 자세한 내용은 관리자 페이지에서 확인해 주세요.' }),
    }))
  }
  const results = await Promise.allSettled(jobs)
  results.forEach((result) => {
    if (result.status === 'rejected' || (result.status === 'fulfilled' && result.value instanceof Response && !result.value.ok)) {
      console.error('Inquiry notification delivery failed')
    }
  })
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  const cors = corsHeaders(origin)
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (request.method !== 'POST') return response({ error: '요청을 처리할 수 없습니다.' }, 405, cors)
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((value) => value.trim()).filter(Boolean)
  if (origin && !allowedOrigins.includes('*') && !allowedOrigins.includes(origin)) {
    return response({ error: '허용되지 않은 접속입니다.' }, 403, cors)
  }

  try {
    const form = await request.formData()
    if (String(form.get('company_website') ?? '').trim()) return response({ ok: true }, 200, cors)

    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const title = String(form.get('title') ?? '').replace(/[\r\n\u0000-\u001f]/g, ' ').trim()
    const content = String(form.get('content') ?? '').trim()
    const fileEntry = form.get('file')
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null
    if (!name || name.length > 120 || !email || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) ||
        !title || title.length > 200 || !content || content.length > 10000) {
      return response({ error: '입력 항목을 확인해 주세요.' }, 400, cors)
    }
    if (file && (file.size > 10 * 1024 * 1024 || !['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !await hasExpectedSignature(file))) {
      return response({ error: '첨부파일은 PDF 또는 JPG/PNG/WebP, 10MB 이하로 올려 주세요.' }, 400, cors)
    }

    const remoteIp = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const fingerprint = await hashFingerprint(remoteIp)
    const { data: withinLimit, error: rateError } = await supabase.rpc('consume_inquiry_limit', { p_fingerprint: fingerprint })
    if (rateError) {
      console.error('Inquiry rate limiter unavailable:', rateError.message)
      return response({ error: '문의 접수를 준비 중입니다. 잠시 후 다시 시도해 주세요.' }, 503, cors)
    }
    if (!withinLimit) return response({ error: '문의가 잠시 많이 접수됐습니다. 15분 후 다시 시도해 주세요.' }, 429, cors)

    let filePath: string | null = null
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
      filePath = `${crypto.randomUUID()}_${safeName}`
      const { error: uploadError } = await supabase.storage.from('inquiry-files').upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) {
        console.error('Inquiry attachment upload failed:', uploadError.message)
        return response({ error: '첨부파일을 저장하지 못했습니다. 파일을 확인해 다시 시도해 주세요.' }, 500, cors)
      }
    }

    const { error: insertError } = await supabase.from('inquiries').insert([{
      name, email, title, content, file_url: filePath, status: '대기중',
    }])
    if (insertError) {
      if (filePath) await supabase.storage.from('inquiry-files').remove([filePath])
      console.error('Inquiry insert failed:', insertError.message)
      return response({ error: '문의 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 500, cors)
    }

    await notify(name, email, title, content)
    return response({ ok: true }, 200, cors)
  } catch (error) {
    console.error('Inquiry function error:', error instanceof Error ? error.message : 'unknown')
    return response({ error: '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, 500, cors)
  }
})
