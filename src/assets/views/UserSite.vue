<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <!-- Top bar -->
    <header class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        <button @click="goHome" class="text-2xl font-bold shrink-0">Rainbow</button>

        <nav class="hidden md:flex items-center gap-1">
          <button
            @click="goHome"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route === 'home' ? 'bg-white/25' : 'hover:bg-white/10'"
          >
            Home
          </button>
        </nav>

        <div class="relative flex-1 max-w-md">
          <IconSearch class="w-4 h-4 text-white/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="search"
            type="text"
            placeholder="Search posts..."
            class="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white/15 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            @focus="route === 'post' && (route = 'home')"
          />
        </div>

        <button
          @click="goCreate"
          class="ml-auto flex items-center gap-2 bg-white text-indigo-600 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shrink-0 hover:bg-indigo-50"
        >
          <IconEdit class="w-4 h-4" />
          Write a Post
        </button>

        <button
          @click="showNameModal = true"
          class="hidden sm:flex items-center gap-2 bg-white/15 hover:bg-white/20 text-sm font-medium px-3 py-2 rounded-lg shrink-0"
        >
          <span class="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">{{ initials(guestName) }}</span>
          {{ guestName }}
        </button>
      </div>

      <!-- Category tabs -->
      <div v-if="route === 'home'" class="max-w-6xl mx-auto px-6 pb-4 flex items-center gap-2 overflow-x-auto">
        <button
          v-for="cat in ['All', ...categories]"
          :key="cat"
          @click="activeCategory = cat; currentPage = 1"
          class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
          :class="activeCategory === cat ? 'bg-white text-indigo-600' : 'bg-white/15 text-white hover:bg-white/25'"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <!-- ==================== HOME / FEED ==================== -->
    <main v-if="route === 'home'" class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            {{ activeCategory === 'All' ? 'Latest Posts' : activeCategory }}
          </h2>
          <p class="text-sm text-slate-500 mt-0.5">{{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div v-if="paginatedPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in paginatedPosts"
          :key="post.id"
          @click="openPost(post.id)"
          class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
        >
          <div class="h-32 flex items-center justify-center" :class="categoryBg(post.category)">
            <component :is="categoryIcon(post.category)" class="w-9 h-9" :class="categoryIconColor(post.category)" />
          </div>
          <div class="p-5 flex flex-col flex-1">
            <span class="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2" :class="categoryBadge(post.category)">{{ post.category }}</span>
            <h3 class="font-bold text-slate-900 leading-snug">{{ post.title }}</h3>
            <p class="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-3">{{ post.content }}</p>
            <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span class="flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{{ initials(post.author) }}</span>
                {{ post.author }}
              </span>
              <span class="flex items-center gap-3">
                <span class="flex items-center gap-1"><IconMessage class="w-3.5 h-3.5" />{{ post.comments.length }}</span>
                <span>{{ formatDate(post.dateCreated) }}</span>
              </span>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm py-16 text-center">
        <p class="text-sm text-slate-400">No posts found. Be the first to write one!</p>
        <button @click="goCreate" class="mt-4 inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
          <IconEdit class="w-4 h-4" /> Write a Post
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 hover:bg-white">
          <IconChevronLeft class="w-4 h-4" />
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
          :class="currentPage === page ? 'bg-indigo-500 text-white' : 'border border-slate-200 text-slate-500 hover:bg-white'"
        >
          {{ page }}
        </button>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 hover:bg-white">
          <IconChevronRight class="w-4 h-4" />
        </button>
      </div>
    </main>

    <!-- ==================== SINGLE POST ==================== -->
    <main v-else-if="route === 'post' && selectedPost" class="max-w-3xl mx-auto px-6 py-8">
      <button @click="goHome" class="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5">
        <IconChevronLeft class="w-4 h-4" /> Back to posts
      </button>

      <article class="bg-white rounded-2xl shadow-sm p-8">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="categoryBadge(selectedPost.category)">{{ selectedPost.category }}</span>
        <h1 class="text-2xl font-bold text-slate-900 mt-4 leading-snug">{{ selectedPost.title }}</h1>

        <div class="flex items-center gap-4 mt-4 text-sm text-slate-500">
          <span class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{{ initials(selectedPost.author) }}</span>
            {{ selectedPost.author }}
          </span>
          <span>{{ formatDate(selectedPost.dateCreated) }}</span>
          <span class="flex items-center gap-1"><IconClock class="w-3.5 h-3.5" />{{ readTime(selectedPost.content) }} min read</span>
        </div>

        <p class="text-slate-700 leading-relaxed mt-6 whitespace-pre-line">{{ selectedPost.content }}</p>

        <!-- Comments -->
        <div class="mt-10 pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-900 mb-4">
            Comments ({{ selectedPost.comments.length }})
          </h3>

          <div class="space-y-4 mb-6">
            <div v-for="c in selectedPost.comments" :key="c.id" class="flex gap-3">
              <span class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">{{ initials(c.name) }}</span>
              <div class="bg-slate-50 rounded-xl px-4 py-3 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold text-slate-800">{{ c.name }}</p>
                  <p class="text-xs text-slate-400">{{ formatDate(c.date) }}</p>
                </div>
                <p class="text-sm text-slate-600 mt-1 leading-relaxed">{{ c.text }}</p>
              </div>
            </div>
            <p v-if="!selectedPost.comments.length" class="text-sm text-slate-400">Be the first to comment.</p>
          </div>

          <form @submit.prevent="submitComment" class="space-y-3">
            <textarea
              v-model.trim="commentText"
              required
              rows="3"
              placeholder="Share your thoughts..."
              class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            ></textarea>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-400">Commenting as <span class="font-semibold text-slate-600">{{ guestName }}</span> · <button type="button" @click="showNameModal = true" class="text-indigo-500 hover:underline">change</button></p>
              <button type="submit" class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
                <IconSend class="w-4 h-4" /> Post Comment
              </button>
            </div>
          </form>
        </div>
      </article>
    </main>

    <!-- ==================== CREATE POST ==================== -->
    <main v-else-if="route === 'create'" class="max-w-2xl mx-auto px-6 py-8">
      <button @click="goHome" class="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5">
        <IconChevronLeft class="w-4 h-4" /> Back to posts
      </button>

      <div class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-xl font-bold text-slate-900">Write a Post</h2>
        <p class="text-sm text-slate-500 mt-1">Share something with the community.</p>

        <form @submit.prevent="publishPost" class="mt-6 space-y-4">
          <div>
            <label class="text-xs font-semibold text-slate-500">Post title</label>
            <input v-model.trim="newPost.title" required type="text" placeholder="Give your post a clear, catchy title" class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-500">Category</label>
            <select v-model="newPost.category" class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-500">Content</label>
            <textarea
              v-model.trim="newPost.content"
              required
              rows="8"
              placeholder="Write your post..."
              class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="text-xs font-semibold text-slate-500">Posting as</label>
            <input v-model.trim="newPost.author" required type="text" class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <p v-if="formError" class="text-xs text-red-500">{{ formError }}</p>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg">Publish Post</button>
            <button type="button" @click="goHome" class="text-sm font-medium text-slate-500 px-4 py-2.5 rounded-lg hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      </div>
    </main>

    <!-- Display name modal -->
    <div v-if="showNameModal" @click.self="showNameModal = false" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="text-lg font-bold text-slate-900">Your display name</h3>
        <p class="text-sm text-slate-500 mt-1">Used when you write posts or comment. Saved on this device only.</p>
        <input v-model.trim="nameInput" type="text" class="mt-4 w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter your name" />
        <div class="flex items-center gap-3 mt-4">
          <button @click="saveName" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg">Save</button>
          <button @click="showNameModal = false" class="text-sm font-medium text-slate-500 px-4 py-2.5 rounded-lg hover:bg-slate-50">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-40">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, h } from "vue";

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */
const makeIcon = (paths) => (props) =>
  h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", ...props }, paths.map((d) => h("path", { d })));

const IconSearch = makeIcon(["M21 21l-4.35-4.35", "M11 19a8 8 0 100-16 8 8 0 000 16z"]);
const IconEdit = makeIcon(["M12 20h9", "M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"]);
const IconMessage = makeIcon(["M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"]);
const IconChevronLeft = makeIcon(["M15 18l-6-6 6-6"]);
const IconChevronRight = makeIcon(["M9 18l6-6-6-6"]);
const IconClock = makeIcon(["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 6v6l4 2"]);
const IconSend = makeIcon(["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"]);
const IconCamera = makeIcon(["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 17a4 4 0 100-8 4 4 0 000 8z"]);
const IconVideo = makeIcon(["M23 7l-7 5 7 5V7z", "M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z"]);
const IconMusic = makeIcon(["M9 18V5l12-2v13", "M6 21a3 3 0 100-6 3 3 0 000 6z", "M18 19a3 3 0 100-6 3 3 0 000 6z"]);
const IconLeaf = makeIcon(["M11 20A7 7 0 019.8 6.1C15.5 5 20 5 20 5s0 4.5-1.1 10.2A7 7 0 0111 20z", "M2 21c0-4 2-9 9-13"]);
const IconChip = makeIcon(["M9 3v4", "M15 3v4", "M9 17v4", "M15 17v4", "M3 9h4", "M3 15h4", "M17 9h4", "M17 15h4", "M5 7h14v10H5z"]);

const categoryIconMap = { Photography: IconCamera, Videos: IconVideo, Music: IconMusic, Lifestyle: IconLeaf, Technology: IconChip };
const categoryIcon = (cat) => categoryIconMap[cat] || IconMessage;

/* ------------------------------------------------------------------ */
/* Storage keys                                                         */
/* ------------------------------------------------------------------ */
const POSTS_KEY = "rainbow-community-posts-v1";
const NAME_KEY = "rainbow-guest-name-v1";
const categories = ["Photography", "Videos", "Music", "Lifestyle", "Technology"];

const toast = ref("");
function showToast(msg) {
  toast.value = msg;
  setTimeout(() => (toast.value = ""), 2200);
}

/* ------------------------------------------------------------------ */
/* Seed data                                                             */
/* ------------------------------------------------------------------ */
function seedPosts() {
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      title: "Five tips for shooting golden hour portraits",
      category: "Photography",
      author: "Blessing Okafor",
      content:
        "Golden hour light is soft and warm, which makes it forgiving for portraits. Shoot with the sun behind your subject for a natural rim light, keep your aperture wide to blur busy backgrounds, and don't be afraid to slightly underexpose to protect the highlights. A cheap reflector can fill in shadows on the face without needing extra flash gear. Most importantly, scout your location earlier in the day so you're not scrambling when the light starts to fade.",
      dateCreated: now - 2 * day,
      comments: [
        { id: crypto.randomUUID(), name: "Daniel Abba", text: "The reflector tip is underrated, changed my whole workflow.", date: now - 1.5 * day },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: "Why we switched our editing workflow to proxies",
      category: "Videos",
      author: "Chinedu Nwosu",
      content:
        "Editing 4K footage on a mid-range laptop used to mean constant stuttering in the timeline. Switching to proxy editing — cutting on lightweight low-res copies and relinking to full quality at export — made playback instant again. It takes a few extra minutes upfront to generate proxies, but you get that time back many times over across a project.",
      dateCreated: now - 4 * day,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: "Building a home studio on a tight budget",
      category: "Music",
      author: "Hannah Faith",
      content:
        "You don't need a treated room and a rack of outboard gear to make something that sounds good. Start with a decent pair of headphones you trust, a single good condenser mic, and thick blankets on the wall behind you to tame reflections. Spend more time learning your DAW's stock plugins before buying anything new — most of them can get you 90% of the way there.",
      dateCreated: now - 6 * day,
      comments: [
        { id: crypto.randomUUID(), name: "Tosin Adeleke", text: "Blankets genuinely work better than I expected.", date: now - 5 * day },
        { id: crypto.randomUUID(), name: "Samuel Jonah", text: "What headphones would you recommend for under $100?", date: now - 4.5 * day },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: "A slower morning routine changed how I write",
      category: "Lifestyle",
      author: "Peace David",
      content:
        "I used to open my laptop the second I woke up. Now I wait at least an hour — coffee, a short walk, no phone. It sounds small, but the writing that comes out afterward is noticeably clearer. Give your brain a few quiet minutes before you ask it to perform.",
      dateCreated: now - 1 * day,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: "What I learned deploying my first side project",
      category: "Technology",
      author: "Ibrahim Musa",
      content:
        "Shipping is a different skill from building. I spent weeks polishing features nobody asked for and almost no time thinking about how real users would actually find and use the thing. Next time, I'm shipping an ugly version in week one and letting feedback decide what gets polished.",
      dateCreated: now - 3 * day,
      comments: [{ id: crypto.randomUUID(), name: "Grace Nnamdi", text: "This is exactly the mistake I'm making right now, thank you.", date: now - 2.5 * day }],
    },
    {
      id: crypto.randomUUID(),
      title: "Composing for negative space",
      category: "Photography",
      author: "Amaka Obi",
      content:
        "Empty space in a frame isn't wasted space — it gives the eye somewhere to rest and makes the subject feel more intentional. Next time you're out shooting, try leaving two-thirds of the frame empty and see how differently the shot feels.",
      dateCreated: now - 8 * day,
      comments: [],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* State + persistence                                                   */
/* ------------------------------------------------------------------ */
const posts = ref([]);
const guestName = ref("Guest User");
const nameInput = ref("");
const showNameModal = ref(false);

function loadPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    posts.value = raw ? JSON.parse(raw) : seedPosts();
  } catch {
    posts.value = seedPosts();
  }
}
function savePosts() {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts.value));
  } catch {
    showToast("Could not save — local storage is full.");
  }
}
watch(posts, savePosts, { deep: true });

function loadName() {
  const stored = localStorage.getItem(NAME_KEY);
  if (stored) guestName.value = stored;
}
function saveName() {
  if (!nameInput.value) return;
  guestName.value = nameInput.value;
  localStorage.setItem(NAME_KEY, guestName.value);
  showNameModal.value = false;
  nameInput.value = "";
}

onMounted(() => {
  loadPosts();
  loadName();
});

watch(showNameModal, (open) => {
  if (open) nameInput.value = guestName.value === "Guest User" ? "" : guestName.value;
});

/* ------------------------------------------------------------------ */
/* Routing (lightweight, in-component)                                   */
/* ------------------------------------------------------------------ */
const route = ref("home"); // 'home' | 'post' | 'create'
const selectedPostId = ref(null);
const selectedPost = computed(() => posts.value.find((p) => p.id === selectedPostId.value) || null);

function goHome() {
  route.value = "home";
  selectedPostId.value = null;
}
function openPost(id) {
  selectedPostId.value = id;
  route.value = "post";
  commentText.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function goCreate() {
  newPost.value = { title: "", category: categories[0], content: "", author: guestName.value === "Guest User" ? "" : guestName.value };
  formError.value = "";
  route.value = "create";
}

/* ------------------------------------------------------------------ */
/* Feed: search / filter / pagination                                    */
/* ------------------------------------------------------------------ */
const search = ref("");
const activeCategory = ref("All");
const currentPage = ref(1);
const pageSize = 6;

const filteredPosts = computed(() => {
  let list = [...posts.value];
  if (activeCategory.value !== "All") list = list.filter((p) => p.category === activeCategory.value);
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }
  return list.sort((a, b) => b.dateCreated - a.dateCreated);
});
watch([search, activeCategory], () => (currentPage.value = 1));

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)));
const paginatedPosts = computed(() => filteredPosts.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));

/* ------------------------------------------------------------------ */
/* Create post                                                           */
/* ------------------------------------------------------------------ */
const newPost = ref({ title: "", category: categories[0], content: "", author: "" });
const formError = ref("");

function publishPost() {
  if (!newPost.value.title || !newPost.value.content || !newPost.value.author) {
    formError.value = "Please fill in every field before publishing.";
    return;
  }
  const post = {
    id: crypto.randomUUID(),
    title: newPost.value.title,
    category: newPost.value.category,
    author: newPost.value.author,
    content: newPost.value.content,
    dateCreated: Date.now(),
    comments: [],
  };
  posts.value = [post, ...posts.value];
  if (guestName.value === "Guest User") {
    guestName.value = newPost.value.author;
    localStorage.setItem(NAME_KEY, guestName.value);
  }
  showToast("Post published.");
  openPost(post.id);
}

/* ------------------------------------------------------------------ */
/* Comments                                                               */
/* ------------------------------------------------------------------ */
const commentText = ref("");

function submitComment() {
  if (!commentText.value || !selectedPost.value) return;
  if (guestName.value === "Guest User") {
    showNameModal.value = true;
    showToast("Add your name first so people know who's commenting.");
    return;
  }
  const post = posts.value.find((p) => p.id === selectedPostId.value);
  post.comments.push({ id: crypto.randomUUID(), name: guestName.value, text: commentText.value, date: Date.now() });
  commentText.value = "";
}

/* ------------------------------------------------------------------ */
/* Formatting / styling helpers                                          */
/* ------------------------------------------------------------------ */
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function readTime(content) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}
function initials(name) {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const categoryStyles = {
  Photography: { bg: "bg-fuchsia-50", badge: "bg-fuchsia-50 text-fuchsia-600", iconColor: "text-fuchsia-400" },
  Videos: { bg: "bg-sky-50", badge: "bg-sky-50 text-sky-600", iconColor: "text-sky-400" },
  Music: { bg: "bg-amber-50", badge: "bg-amber-50 text-amber-600", iconColor: "text-amber-400" },
  Lifestyle: { bg: "bg-emerald-50", badge: "bg-emerald-50 text-emerald-600", iconColor: "text-emerald-400" },
  Technology: { bg: "bg-indigo-50", badge: "bg-indigo-50 text-indigo-600", iconColor: "text-indigo-400" },
};
const categoryBg = (cat) => categoryStyles[cat]?.bg || "bg-slate-50";
const categoryBadge = (cat) => categoryStyles[cat]?.badge || "bg-slate-100 text-slate-500";
const categoryIconColor = (cat) => categoryStyles[cat]?.iconColor || "text-slate-400";
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
