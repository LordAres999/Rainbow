<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Title + Add New Post action -->
      <div class="flex items-start justify-between gap-6 mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight max-w-2xl">
          {{ title }}
        </h1>
        <div class="flex items-center gap-3 flex-shrink-0">
          <button
            class="px-4 py-2.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors whitespace-nowrap"
          >
            Add New Post
          </button>
          <div
            class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0"
          >
            {{ currentUserInitial }}
          </div>
        </div>
      </div>

      <!-- Author meta -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
        <img :src="author.avatar" :alt="author.name" class="w-7 h-7 rounded-full object-cover" />
        <span
          >By <span class="text-gray-700 font-medium">{{ author.name }}</span></span
        >
        <span class="text-gray-300">|</span>
        <span>Published on {{ publishedDate }}</span>
        <span class="text-gray-300">|</span>
        <span>{{ readTime }} min read</span>
      </div>

      <!-- Featured Image -->
      <div class="mb-10 rounded-xl overflow-hidden">
        <img
          src="../images/background.jpeg"
          alt="Featured"
          class="w-full h-64 sm:h-96 object-cover"
        />
      </div>

      <!-- Content row: ONE continuous main column + sidebar.
           items-start is required here — without it, flex stretches the
           shorter child (the sidebar) to match the main column's height,
           which visually is fine, but doing the reverse split (main split
           into two blocks around the sidebar) causes a stretched blank gap.
           Keeping the whole article in a single column avoids that entirely,
           and items-start guarantees neither column is ever force-stretched. -->
      <div class="flex flex-col lg:flex-row lg:items-start gap-12">
        <!-- Main column: the entire article, uninterrupted -->
        <div class="lg:w-[65%]">
          <p
            v-for="(p, i) in introParagraphs"
            :key="'intro-' + i"
            class="text-gray-600 leading-relaxed mb-6"
          >
            {{ p }}
          </p>

          <p
            v-for="(p, i) in bodyParagraphs"
            :key="'body-' + i"
            class="text-gray-600 leading-relaxed mb-6"
          >
            {{ p }}
          </p>

          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 mt-2">
            {{ subheading }}
          </h2>

          <p
            v-for="(p, i) in closingParagraphs"
            :key="'closing-' + i"
            class="text-gray-600 leading-relaxed mb-6"
          >
            {{ p }}
          </p>

          <!-- Related Articles -->
          <div class="mt-4 pt-8 border-t border-gray-100">
            <p class="text-[15px] text-gray-800 mb-8">
              Good or bad, we'd love to hear your thoughts. Find us on Twitter (<a
                href="https://twitter.com"
                class="text-blue-500 hover:underline"
                >@twitter</a
              >)
            </p>

            <p class="text-[11px] font-semibold tracking-wide text-gray-400 uppercase mb-4">
              Here are some related articles you may find interesting:
            </p>

            <div>
              <a
                v-for="article in relatedArticles"
                :key="article.id"
                href="#"
                class="flex gap-5 group py-6 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-md bg-gray-100"
                >
                  <img
                    :src="article.image"
                    :alt="article.title"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <p class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase mb-1">
                    {{ article.category }} · {{ article.readTime }} minute read
                  </p>
                  <h3
                    class="text-lg sm:text-xl font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-gray-600 transition-colors"
                  >
                    {{ article.title }}
                  </h3>
                  <p class="text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {{ article.excerpt }}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:w-[35%] flex-shrink-0 space-y-8">
          <div>
            <h3 class="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-4">
              Popular Posts
            </h3>
            <div>
              <a
                v-for="post in popularPosts"
                :key="post.id"
                href="#"
                class="flex gap-3 py-4 border-b border-gray-100 last:border-b-0 group"
              >
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <p class="text-[10px] font-semibold tracking-wide text-gray-400 uppercase mb-1">
                    {{ post.category }}
                  </p>
                  <p
                    class="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors"
                  >
                    {{ post.title }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl p-6 text-white text-center"
          >
            <h3 class="text-lg font-bold mb-3">Get More Done Together With US</h3>
            <p class="text-white/90 text-sm mb-6 leading-relaxed">
              {{ ctaText }}
            </p>
            <button
              class="px-5 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const currentUserInitial = 'E'

const author = {
  name: 'Debbie Rise',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
}
const publishedDate = 'January 14, 2025'
const readTime = 2

const featuredImage =
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=1200&h=500&fit=crop'

const introParagraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum ut amet. Pellentesque commodo lacus at sodales sodales.',
  'Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.',
]

const popularPosts = [
  {
    id: 1,
    category: 'Product',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
  },
  {
    id: 2,
    category: 'Product | Enterprise',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
  },
  {
    id: 3,
    category: 'Productivity',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  },
  {
    id: 4,
    category: 'Productivity',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop',
  },
]

const ctaText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.'

const bodyParagraphs = [
  'Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum ut amet.',
  'Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.',
]

const subheading = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

const closingParagraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum ut amet. Pellentesque commodo lacus at sodales sodales.',
  'Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.',
  'Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.',
]

const relatedArticles = [
  {
    id: 1,
    category: 'Product',
    readTime: 4,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    category: 'Product',
    readTime: 6,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan,',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    category: 'Productivity',
    readTime: 7,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    category: 'Productivity',
    readTime: 7,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop',
  },
]
</script>
