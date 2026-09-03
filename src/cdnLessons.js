/**
 * Collection of simple, daily Content Delivery Network (CDN) lessons.
 * Designed to explain complex web infrastructure in friendly language
 * with relatable real-world analogies and simple code examples.
 */

export const CDN_LESSONS = [
  {
    id: 1,
    title: "What is a CDN?",
    badge: "CDN Basics",
    analogy: "🍕 Pizza Delivery Hubs",
    analogyText: "Instead of baking every pizza at one central restaurant in Italy and shipping it worldwide, Domino's puts local kitchens in every neighborhood so your pizza arrives hot and fast.",
    explanation: "A Content Delivery Network (CDN) is a network of servers spread across the globe. It caches (stores) your website's static files (images, CSS, JS) close to users so pages load instantly.",
    codeSnippet: `<!-- ❌ Without CDN: Server in New York serves user in Tokyo -->
<script src="https://my-origin-server.com/app.js"></script>

<!-- ✅ With CDN: Served from nearest Tokyo Edge Server -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>`,
    takeaway: "CDNs cut down physical distance between your website assets and your users."
  },
  {
    id: 2,
    title: "Origin Server vs. Edge Server",
    badge: "Architecture",
    analogy: "🏭 Main Factory vs. Local Supermarket",
    analogyText: "The Origin Server is the main factory where products are created. The Edge Server is your local grocery store where you buy those products in seconds.",
    explanation: "The Origin Server is your main web host (where your database & code live). Edge Servers are hundreds of CDN servers placed around the world to serve cached copies.",
    codeSnippet: `// HTTP Request Flow:
// User Browser ➔ Nearest Edge Server (Cache HIT!) ⚡ Fast (10ms)
// If not cached ➔ Edge fetches from Origin Server ➔ Stores copy ➔ Returns to User`,
    takeaway: "Edge servers protect your main origin server from crashing under heavy traffic."
  },
  {
    id: 3,
    title: "Cache Hits vs. Cache Misses",
    badge: "Performance",
    analogy: "🧠 Knowing an Answer vs. Looking it up in the Library",
    analogyText: "A Cache Hit is like immediately knowing the answer from memory. A Cache Miss is having to walk to the library to find the book first.",
    explanation: "When a user requests a file: if the CDN edge already has it in memory, it's a Cache HIT (ultra fast). If not, it's a Cache MISS, so the CDN fetches it from origin.",
    codeSnippet: `// Check Response Headers in Browser DevTools:

// ✅ Cache HIT (Fast! Served directly from CDN memory)
X-Cache: HIT
cf-cache-status: HIT

// ⚠️ Cache MISS (Slower; fetched from Origin)
X-Cache: MISS
cf-cache-status: DYNAMIC`,
    takeaway: "High Cache Hit ratios (>90%) mean lower server costs and faster websites."
  },
  {
    id: 4,
    title: "Cache-Control: Max-Age & Expiration",
    badge: "HTTP Headers",
    analogy: "🥛 Expiration Date on Milk",
    analogyText: "Just like milk has a 'Best Before' date, web files tell CDN servers how many seconds they are allowed to keep a copy before asking origin for a fresh one.",
    explanation: "The `Cache-Control` header tells CDNs and browsers how long to cache a file before revalidating.",
    codeSnippet: `// Express.js / Node.js HTTP Header example:
app.use(express.static('public', {
  setHeaders: (res, path) => {
    // Cache static files for 1 year (31,536,000 seconds)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));`,
    takeaway: "`max-age` dictates the shelf life of your website assets on the CDN."
  },
  {
    id: 5,
    title: "Cache Purging & Invalidation",
    badge: "Cache Management",
    analogy: "📢 Recall Notice for Outdated Flyers",
    analogyText: "If a supermarket printed wrong prices on flyers, they throw them out immediately. Purging tells all CDN servers worldwide to discard old files right now.",
    explanation: "When you deploy new CSS or JS updates, you 'Purge' or 'Invalidate' the CDN cache so users immediately get the fresh code instead of stale files.",
    codeSnippet: `// Example: Purging CDN cache via Cloudflare API / cURL
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \\
     -H "Authorization: Bearer YOUR_API_TOKEN" \\
     -H "Content-Type: application/json" \\
     --data '{"files":["https://example.com/css/styles.css"]}'`,
    takeaway: "Purging ensures users get critical bug fixes immediately without waiting for cache expiration."
  },
  {
    id: 6,
    title: "Cache Busting with File Hashing",
    badge: "Best Practices",
    analogy: "🏷️ Unique Edition Serial Numbers",
    analogyText: "Instead of telling everyone to throw away their old book edition, you publish a brand new book with a new version number (e.g. `main.v2.js`).",
    explanation: "Cache busting appends a unique content hash to filenames during build time. Since the URL changes, CDN caches it forever without serving stale code.",
    codeSnippet: `<!-- ❌ Bad: CDN caches forever, users won't see edits -->
<script src="app.js"></script>

<!-- ✅ Good: Hash changes whenever code updates -->
<script src="app.a8f92c3d.js"></script>`,
    takeaway: "Combine long `max-age=31536000` with hashed filenames for max speed & instant updates."
  },
  {
    id: 7,
    title: "Anycast DNS Routing",
    badge: "Networking",
    analogy: "🚑 Emergency Services (911 / 112)",
    analogyText: "Everyone dials the exact same phone number, but your call automatically connects to the dispatch station closest to your physical location.",
    explanation: "Anycast allows multiple servers worldwide to share the same IP address. Routers automatically send the user's request to the geographically nearest server.",
    codeSnippet: `// Terminal command to see nearest CDN IP:
$ ping cdn.cloudflare.com

// Output: Resolves to closest local POP (Point of Presence) server!
64 bytes from 104.16.132.229: icmp_seq=1 ttl=58 time=4.2 ms`,
    takeaway: "Anycast routing directs traffic to the nearest server without changing domain names."
  },
  {
    id: 8,
    title: "DDoS Protection & Rate Limiting",
    badge: "Security",
    analogy: "Bouncers at a Popular Club Door 🚪",
    analogyText: "If 1,000 bots try to rush into a club at once, the bouncers block them at the sidewalk before they ever reach the main building.",
    explanation: "CDNs absorb massive distributed denial-of-service (DDoS) attacks at their edge network, absorbing terabytes of junk traffic before it hits your origin.",
    codeSnippet: `// Cloudflare / Akamai Web Application Firewall (WAF) Rule Concept:
if (requestsFromIP > 100 per Minute) {
    return HTTP 429 "Too Many Requests"; // Blocked at CDN Edge!
}`,
    takeaway: "CDNs double as your front-line security firewall against cyber attacks."
  },
  {
    id: 9,
    title: "SSL/TLS Offloading at the Edge",
    badge: "Security & Speed",
    analogy: "Passport Control at Border Entry 🛂",
    analogyText: "You inspect passports once at the border station. Inside the country, vehicles move smoothly without stopping at every street corner.",
    explanation: "Decrypting HTTPS requires math CPU overhead. CDN Edge servers handle the SSL handshake with the user, taking CPU burden off your origin server.",
    codeSnippet: `// Client 🔒 (HTTPS / TLS 1.3) ➔ CDN Edge Server
// CDN Edge Server 🔒 (Internal Encrypted Tunnel) ➔ Origin Server
// Result: Faster TLS handshakes closer to the user!`,
    takeaway: "SSL offloading reduces cryptographic CPU workload on your origin servers."
  },
  {
    id: 10,
    title: "Edge Workers & Serverless Computing",
    badge: "Advanced CDN",
    analogy: "👨‍🍳 Food Truck Customizing Orders on the Spot",
    analogyText: "Instead of sending your special burger request back to the central kitchen, the food truck chef customizes it right in front of you.",
    explanation: "Modern CDNs (Cloudflare Workers, Fastly Compute@Edge, AWS CloudFront Functions) let you run lightweight JavaScript directly on edge servers worldwide.",
    codeSnippet: `// Cloudflare Worker example (Runs at CDN Edge in <1ms):
export default {
  async fetch(request) {
    const country = request.cf.country; // e.g. "US", "JP", "IN"
    return new Response(\`Hello user from \${country}!\`);
  }
};`,
    takeaway: "Edge Workers enable dynamic personalization at CDN speeds."
  }
];

/**
 * Get the lesson for today based on the day of the year.
 * Ensures smooth rotation through all topics indefinitely.
 */
export function getTodayLesson() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const lessonIndex = dayOfYear % CDN_LESSONS.length;
  return CDN_LESSONS[lessonIndex];
}
