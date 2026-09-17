const url = process.env.API_HEALTH_URL || 'http://localhost:8787/api/health'
const timeoutMs = 30_000
const retryMs = 250
const deadline = Date.now() + timeoutMs

while (Date.now() < deadline) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      process.exit(0)
    }
  } catch {
    // The API may still be starting its database.
  }

  await new Promise((resolve) => setTimeout(resolve, retryMs))
}

console.error(`[web] API did not become ready at ${url} within ${timeoutMs / 1000}s`)
process.exit(1)