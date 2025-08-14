/**
 * Webropol Video Card Component
 * Cards for video content with thumbnails and play buttons
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolVideoCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'duration', 'thumbnail', 'video-url', 'description', 'category', 'background', 'tag'];
  }

  render() {
    const title = this.getAttr('title');
    const duration = this.getAttr('duration');
    const thumbnail = this.getAttr('thumbnail');
    const videoUrl = this.getAttr('video-url');
    const description = this.getAttr('description');
    const category = this.getAttr('category');
    const background = this.getAttr('background');
    const tag = this.getAttr('tag');

    // Background images from the img/backgrounds folder
    const backgroundImages = {
      'abstract-crystal': '../img/backgrounds/abstract-crystal-prism.jpg',
      'abstract-smoke': '../img/backgrounds/abstract-smoke-dark.jpg',
      'bokeh-lights': '../img/backgrounds/bokeh-lights-warm.jpg',
      'fluid-pink': '../img/backgrounds/fluid-abstract-pink.jpg',
      'forest-green': '../img/backgrounds/forest-nature-green.jpg',
      'geometric-blue': '../img/backgrounds/geometric-blue-pattern.jpg',
      'geometric-hexagon': '../img/backgrounds/geometric-hexagon-pattern.jpg',
      'gradient-colorful': '../img/backgrounds/gradient-colorful-abstract.jpg',
      'gradient-ocean': '../img/backgrounds/gradient-ocean-blue.jpg',
      'gradient-rainbow': '../img/backgrounds/gradient-rainbow-pastel.jpg',
      'gradient-rose': '../img/backgrounds/gradient-rose-light.jpg',
      'lang-bg': '../img/backgrounds/lang-bg.jpg',
      'light-blue': '../img/backgrounds/light-blue-minimal.jpg',
      'minimal-geometric': '../img/backgrounds/minimal-geometric-white.jpg',
      'city-skyline': '../img/backgrounds/modern-city-skyline.jpg',
      'mountain-landscape': '../img/backgrounds/mountain-landscape-misty.jpg',
      'nature-sunset': '../img/backgrounds/nature-landscape-sunset.jpg',
      'sky-clouds': '../img/backgrounds/sky-clouds-blue.jpg',
      'tech-circuit': '../img/backgrounds/tech-circuit-dark.jpg',
      'water-ripples': '../img/backgrounds/water-ripples-blue.jpg'
    };

    const backgroundImage = background && backgroundImages[background] ? backgroundImages[background] : null;

    this.innerHTML = `
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:border-gray-300/50 transition-all duration-300 group cursor-pointer">
        
        <!-- Video Thumbnail with Background -->
        <div class="relative aspect-video overflow-hidden">
          ${backgroundImage ? `
            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('${backgroundImage}')"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          ` : thumbnail ? `
            <img src="${thumbnail}" alt="${title || 'Video thumbnail'}" 
                 class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          ` : `
            <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          `}
          
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-110 transition-all duration-300 group-hover:bg-white">
              <i class="fal fa-play-circle text-blue-600 text-xl ml-1 group-hover:text-blue-700"></i>
            </div>
          </div>
          
          <!-- Duration Badge -->
          ${duration ? `
            <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
              ${duration}
            </div>
          ` : ''}
          
          <!-- Category/Tag Badge -->
          ${category ? `
            <div class="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
              ${category}
            </div>
          ` : tag ? `
            <div class="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
              ${tag}
            </div>
          ` : ''}

          <!-- Title Overlay -->
          ${title ? `
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="font-bold text-lg text-white mb-1 line-clamp-2 drop-shadow-lg">
                ${title}
              </h3>
              ${description ? `
                <p class="text-white/90 text-sm line-clamp-2 drop-shadow">
                  ${description}
                </p>
              ` : ''}
            </div>
          ` : ''}
        </div>
        
        <!-- Card Footer -->
        <div class="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div class="flex items-center justify-between">
            <button class="video-play-btn flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors group/btn">
              <i class="fal fa-play-circle mr-2 group-hover/btn:scale-110 transition-transform duration-200"></i>
              Watch Video
            </button>
            
            <div class="flex items-center space-x-2">
              <button class="video-bookmark-btn p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                <i class="far fa-bookmark"></i>
              </button>
              <button class="video-share-btn p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                <i class="fal fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const card = this.querySelector('.group');
    const playBtn = this.querySelector('.video-play-btn');
    const bookmarkBtn = this.querySelector('.video-bookmark-btn');
    const shareBtn = this.querySelector('.video-share-btn');

    // Card click to play video
    if (card) {
      this.addListener(card, 'click', (event) => {
        // Don't trigger if clicking on action buttons
        if (!event.target.closest('button')) {
          this.playVideo();
        }
      });
    }

    // Play button
    if (playBtn) {
      this.addListener(playBtn, 'click', (event) => {
        event.stopPropagation();
        this.playVideo();
      });
    }

    // Bookmark button
    if (bookmarkBtn) {
      this.addListener(bookmarkBtn, 'click', (event) => {
        event.stopPropagation();
        this.toggleBookmark();
      });
    }

    // Share button
    if (shareBtn) {
      this.addListener(shareBtn, 'click', (event) => {
        event.stopPropagation();
        this.shareVideo();
      });
    }
  }

  playVideo() {
    this.emit('webropol-video-play', {
      title: this.getAttr('title'),
      videoUrl: this.getAttr('video-url'),
      thumbnail: this.getAttr('thumbnail')
    });
  }

  toggleBookmark() {
    const bookmarkBtn = this.querySelector('.video-bookmark-btn i');
    const isBookmarked = bookmarkBtn.classList.contains('fal');
    
    if (isBookmarked) {
      bookmarkBtn.classList.remove('fal');
      bookmarkBtn.classList.add('far');
    } else {
      bookmarkBtn.classList.remove('far');
      bookmarkBtn.classList.add('fal');
    }

    this.emit('webropol-video-bookmark', {
      title: this.getAttr('title'),
      bookmarked: !isBookmarked
    });
  }

  shareVideo() {
    this.emit('webropol-video-share', {
      title: this.getAttr('title'),
      videoUrl: this.getAttr('video-url')
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.bindEvents();
    }
  }
}

// Register the component
customElements.define('webropol-video-card', WebropolVideoCard);

