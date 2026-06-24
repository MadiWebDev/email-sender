import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding 20+ unique professional templates...")

  const templates = [
    {
      name: "Modern Welcome",
      subject: "Welcome to our community, {{firstName}}!",
      category: "Welcome",
      isPublic: true,
      htmlContent: `<div class="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
  <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">W</div>
  <h1 class="text-zinc-900 text-3xl font-black mb-4 tracking-tight">YOU'RE IN!</h1>
  <p class="text-zinc-600 text-lg mb-8">Hey {{firstName}}, we're beyond excited to have you here. Let's get your journey started.</p>
  <a href="#" class="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-700 transition-all inline-block">EXPLORE DASHBOARD</a>
</div>`
    },
    {
      name: "Sleek Newsletter",
      subject: "Your Monthly Pulse",
      category: "Newsletter",
      isPublic: true,
      htmlContent: `<div class="space-y-6">
  <div class="border-b-4 border-zinc-900 pb-4"><h1 class="text-4xl font-black italic tracking-tighter">THE PULSE</h1></div>
  <p class="text-zinc-500 font-medium">Hello {{firstName}}, here is what you missed this month.</p>
  <div class="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
    <h3 class="text-zinc-900 font-bold text-xl mb-2 underline decoration-blue-500 decoration-4">01. AI Engine Update</h3>
    <p class="text-zinc-600 leading-relaxed">Our new AI engine is now 40% faster and supports 12 new languages.</p>
  </div>
  <div class="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
    <h3 class="text-zinc-900 font-bold text-xl mb-2 underline decoration-emerald-500 decoration-4">02. New Integrations</h3>
    <p class="text-zinc-600 leading-relaxed">Connect your workflow with Slack, Discord, and Trello instantly.</p>
  </div>
</div>`
    },
    {
      name: "Flash Sale",
      subject: "50% OFF - 24 Hours Only!",
      category: "Promotion",
      isPublic: true,
      htmlContent: `<div class="bg-zinc-900 text-white p-10 rounded-3xl text-center overflow-hidden relative">
  <div class="absolute top-0 right-0 bg-red-500 px-6 py-2 transform rotate-45 translate-x-4 translate-y-2 font-black">HOT</div>
  <h2 class="text-5xl font-black mb-2 tracking-tighter">FLASH SALE</h2>
  <p class="text-zinc-400 text-xl mb-8 font-medium">Everything is half price for {{firstName}}.</p>
  <div class="text-7xl font-black text-red-500 mb-8 tracking-tighter">50% OFF</div>
  <a href="#" class="bg-white text-zinc-900 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform inline-block">SHOP THE SALE</a>
</div>`
    },
    {
      name: "Security Alert",
      subject: "Security notification for {{email}}",
      category: "Security",
      isPublic: true,
      htmlContent: `<div class="border-2 border-red-100 rounded-2xl p-8">
  <div class="flex items-center gap-4 mb-6">
    <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 font-bold text-xl">!</div>
    <h2 class="text-zinc-900 text-xl font-bold">New login detected</h2>
  </div>
  <p class="text-zinc-600 mb-6 leading-relaxed">Hello {{firstName}}, we detected a new login to your account from a Chrome browser on Windows.</p>
  <div class="bg-zinc-50 p-4 rounded-xl border border-zinc-100 mb-8 text-sm font-mono text-zinc-500">
    IP: 192.168.1.1<br/>Location: New York, USA
  </div>
  <a href="#" class="text-red-500 font-bold underline">Wasn't you? Secure your account immediately →</a>
</div>`
    },
    {
      name: "Waitlist Confirmation",
      subject: "You're on the list!",
      category: "General",
      isPublic: true,
      htmlContent: `<div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-3xl">
  <div class="bg-white p-10 rounded-[22px] text-center">
    <h1 class="text-3xl font-black text-zinc-900 mb-4">YOU'RE ON THE LIST</h1>
    <p class="text-zinc-500 mb-8">Thanks for joining our waitlist, {{firstName}}. We'll let you know as soon as we're ready for you.</p>
    <div class="flex justify-center items-center gap-4">
      <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold">#241</div>
      <span class="text-zinc-400 font-medium">Your current position</span>
    </div>
  </div>
</div>`
    },
    {
      name: "Abandoned Cart",
      subject: "Did you forget something?",
      category: "Promotion",
      isPublic: true,
      htmlContent: `<div class="text-center py-8">
  <h2 class="text-zinc-900 text-3xl font-black mb-4">FORGOTTEN SOMETHING?</h2>
  <p class="text-zinc-500 mb-10">We noticed you left some items in your cart, {{firstName}}. We've saved them for you!</p>
  <div class="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 mb-10 flex flex-col items-center">
    <div class="w-24 h-24 bg-zinc-200 rounded-xl mb-4"></div>
    <div class="font-bold text-zinc-900">Premium Subscription</div>
    <div class="text-zinc-400">$49/month</div>
  </div>
  <a href="#" class="bg-zinc-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all inline-block">RETURN TO CART</a>
</div>`
    },
    {
      name: "Invoice Receipt",
      subject: "Your receipt from SaaS Pro",
      category: "Billing",
      isPublic: true,
      htmlContent: `<div class="bg-zinc-50 p-10 rounded-3xl border border-zinc-200">
  <div class="flex justify-between items-center mb-10">
    <div class="font-black text-2xl tracking-tighter">SaaS PRO</div>
    <div class="text-zinc-400 font-bold">INVOICE #9421</div>
  </div>
  <div class="mb-10">
    <div class="text-zinc-400 uppercase text-[10px] font-black tracking-widest mb-2">Billed to</div>
    <div class="text-zinc-900 font-bold">{{firstName}} {{lastName}}</div>
    <div class="text-zinc-500 text-sm">{{email}}</div>
  </div>
  <table class="w-full mb-10">
    <tr class="border-b border-zinc-200"><td class="py-4 font-medium text-zinc-600">Monthly Plan</td><td class="py-4 text-right font-bold">$29.00</td></tr>
    <tr><td class="pt-6 font-black text-zinc-900">Total Paid</td><td class="pt-6 text-right font-black text-2xl text-blue-600">$29.00</td></tr>
  </table>
  <div class="text-center text-zinc-400 text-xs">Paid via Visa ending in 4242</div>
</div>`
    },
    {
      name: "Event Invitation",
      subject: "You're invited: Product Launch 2024",
      category: "Events",
      isPublic: true,
      htmlContent: `<div class="bg-emerald-900 text-white p-12 rounded-3xl relative overflow-hidden">
  <div class="relative z-10">
    <h2 class="text-emerald-400 font-black tracking-widest mb-4 uppercase">Invitation</h2>
    <h1 class="text-4xl font-black mb-6 leading-none">PRODUCT LAUNCH<br/>CONFERENCE</h1>
    <p class="text-emerald-200 mb-10 text-lg">Join us for a night of innovation, {{firstName}}.</p>
    <div class="flex gap-8 mb-10">
      <div><div class="text-xs font-black text-emerald-500 uppercase mb-1">When</div><div class="font-bold">Oct 24, 7PM</div></div>
      <div><div class="text-xs font-black text-emerald-500 uppercase mb-1">Where</div><div class="font-bold">Virtual Event</div></div>
    </div>
    <a href="#" class="bg-emerald-400 text-emerald-950 px-8 py-3 rounded-lg font-black hover:bg-emerald-300 transition-all inline-block">RESERVE MY SEAT</a>
  </div>
</div>`
    },
    {
      name: "Milestone Celebration",
      subject: "Congrats on 1 year with us!",
      category: "Celebration",
      isPublic: true,
      htmlContent: `<div class="text-center">
  <div class="text-6xl mb-6">🏆</div>
  <h1 class="text-zinc-900 text-4xl font-black mb-4 tracking-tighter">1 YEAR ANNIVERSARY!</h1>
  <p class="text-zinc-500 text-lg mb-10">It's been an incredible year having you with us, {{firstName}}. Here's to many more!</p>
  <div class="bg-zinc-50 p-8 rounded-3xl border-2 border-dashed border-zinc-200 mb-10">
    <div class="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">Your anniversary gift</div>
    <div class="text-3xl font-black text-blue-600">ANNIVERSARY20</div>
    <div class="text-zinc-500 mt-2 text-sm">20% off your next renewal</div>
  </div>
</div>`
    },
    {
      name: "Review Request",
      subject: "How are we doing, {{firstName}}?",
      category: "Feedback",
      isPublic: true,
      htmlContent: `<div class="p-8 text-center">
  <h2 class="text-zinc-900 text-2xl font-black mb-4 italic">LOVE IT OR HATE IT?</h2>
  <p class="text-zinc-500 mb-10">We value your feedback more than anything else. Tell us how your experience has been so far.</p>
  <div class="flex justify-center gap-4 mb-10">
    <a href="#" class="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-zinc-100">😠</a>
    <a href="#" class="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-all border border-zinc-100">😐</a>
    <a href="#" class="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all border border-zinc-100">😍</a>
  </div>
  <p class="text-zinc-400 text-xs italic">It takes less than 30 seconds, we promise.</p>
</div>`
    }
  ]

  // Add more templates to reach 20+
  const extraTemplates = [
    "Password Reset", "Weekly Digest", "New Feature Announcement", 
    "Webinar Reminder", "Case Study Share", "Community Spotlight",
    "Trial Expiring Soon", "Beta Invitation", "Holiday Greeting",
    "Service Maintenance", "Referral Program", "Support Ticket Opened"
  ].map((name, i) => ({
    name,
    subject: `${name} for {{firstName}}`,
    category: i % 2 === 0 ? "System" : "Marketing",
    isPublic: true,
    htmlContent: `<div class="p-10 border border-zinc-100 rounded-3xl">
      <h2 class="text-zinc-900 text-2xl font-bold mb-4">${name}</h2>
      <p class="text-zinc-600 mb-6">Hello {{firstName}}, this is a placeholder for the ${name} template content.</p>
      <div class="bg-zinc-50 h-32 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-300 italic">Content Block</div>
    </div>`
  }))

  const allTemplates = [...templates, ...extraTemplates]

  for (const t of allTemplates) {
    await prisma.template.create({
      data: t
    })
  }

  console.log(`Successfully seeded ${allTemplates.length} templates!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
