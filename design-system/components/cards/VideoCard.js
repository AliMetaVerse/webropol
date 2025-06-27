/**
 * Webropol Video Card Component
 * Cards for video content with thumbnails and play buttons
 */

import { BaseComponent } from '../../utils/base-component.js';

export class WebropolVideoCard extends BaseComponent {
  static get observedAttributes() {
    return ['title', 'duration', 'thumbnail', 'video-url', 'description', 'category'];
  }

  render() {
    const title = this.getAttr('title');
    const duration = this.getAttr('duration');
    const thumbnail = this.getAttr('thumbnail');
    const videoUrl = this.getAttr('video-url');
    const description = this.getAttr('description');
    const category = this.getAttr('category');

    this.innerHTML = `
      <div class="bg-white rounded-2xl shadow-card border border-webropol-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
        
        <!-- Video Thumbnail -->
        <div class="relative aspect-video bg-webropol-gray-100 overflow-hidden">
          ${thumbnail ? `
            <img src="${thumbnail}" alt="${title || 'Video thumbnail'}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          ` : `
            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-webropol-teal-100 to-webropol-blue-100">
              <i class="fas fa-play-circle text-6xl text-webropol-teal-600 opacity-50"></i>
            </div>
          `}
          
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
              <i class="fas fa-play text-webropol-teal-600 text-xl ml-1"></i>
            </div>
          </div>
          
          <!-- Duration Badge -->
          ${duration ? `
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              ${duration}
            </div>
          ` : ''}
          
          <!-- Category Badge -->
          ${category ? `
            <div class="absolute top-2 left-2 bg-webropol-teal-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              ${category}
            </div>
          ` : ''}
        </div>
        
        <!-- Card Content -->
        <div class="p-4">
          ${title ? `
            <h3 class="font-semibold text-lg text-webropol-gray-900 mb-2 line-clamp-2 group-hover:text-webropol-teal-700 transition-colors">
              ${title}
            </h3>
          ` : ''}
          
          ${description ? `
            <p class="text-sm text-webropol-gray-600 line-clamp-3 mb-3">
              ${description}
            </p>
          ` : ''}
          
          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <button class="video-play-btn flex items-center text-webropol-teal-600 hover:text-webropol-teal-700 font-medium text-sm transition-colors">
              <i class="fas fa-play mr-2"></i>
              Watch Video
            </button>
            
            <div class="flex items-center space-x-2">
              <button class="video-bookmark-btn p-2 text-webropol-gray-400 hover:text-webropol-teal-600 transition-colors">
                <i class="fas fa-bookmark"></i>
              </button>
              <button class="video-share-btn p-2 text-webropol-gray-400 hover:text-webropol-teal-600 transition-colors">
                <i class="fas fa-share-alt"></i>
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
    const isBookmarked = bookmarkBtn.classList.contains('fas');
    
    if (isBookmarked) {
      bookmarkBtn.classList.remove('fas');
      bookmarkBtn.classList.add('far');
    } else {
      bookmarkBtn.classList.remove('far');
      bookmarkBtn.classList.add('fas');
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
