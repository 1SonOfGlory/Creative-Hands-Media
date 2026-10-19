const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 60, 420)}ms`;
  observer.observe(item);
});

const premiereHero = document.querySelector('.premiere-hero');
if (premiereHero) {
  let cueTimer = null;
  let cueVisible = false;

  const hideScrollCue = () => {
    cueVisible = false;
    premiereHero.classList.remove('show-scroll-cue');
  };

  const scheduleScrollCue = () => {
    window.clearTimeout(cueTimer);
    cueTimer = window.setTimeout(() => {
      cueVisible = true;
      premiereHero.classList.add('show-scroll-cue');
    }, 15000);
  };

  const cueObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) scheduleScrollCue();
      else hideScrollCue();
    });
  }, {
    threshold: 0.62,
    rootMargin: '-8% 0px -8% 0px'
  });

  cueObserver.observe(premiereHero);

  window.addEventListener('scroll', () => {
    if (cueVisible) hideScrollCue();
  }, { passive: true });
}

const counters = document.querySelectorAll('.number');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1200;
      const startTime = performance.now();
      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toString();
        if (progress < 1) requestAnimationFrame(update);
        else if (target === 96) el.textContent = '96%';
        else el.textContent = `${target}+`;
      };
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.7 });
  counters.forEach((counter) => counterObserver.observe(counter));
}

document.querySelectorAll('#year').forEach((el) => {
  el.textContent = new Date().getFullYear().toString();
});

const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  window.addEventListener('mouseover', (event) => {
    if (event.target.closest('a, button, .card, .work-card, .mosaic-card')) {
      ring.style.width = '54px';
      ring.style.height = '54px';
    }
  });

  window.addEventListener('mouseout', () => {
    ring.style.width = '34px';
    ring.style.height = '34px';
  });

  window.addEventListener('wheel', (event) => {
    const spark = document.createElement('span');
    spark.className = 'cursor-spark';
    spark.style.left = `${mouseX + (Math.random() * 20 - 10)}px`;
    spark.style.top = `${mouseY + (Math.random() * 20 - 10)}px`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }, { passive: true });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();
}

const quickContact = document.createElement('div');
quickContact.className = 'quick-contact';
quickContact.innerHTML = `
  <a href="#" data-contact="whatsapp" aria-label="Chat on WhatsApp">WhatsApp</a>
  <a href="#" data-contact="email" aria-label="Send email">Email</a>
`;
document.body.appendChild(quickContact);

const contactRoutes = {
  phone: ['233', '55', '143', '8315'].join(''),
  email: ['freehandscreative', 'multimedia', '@', 'gmail', '.com'].join('')
};

document.addEventListener('click', (event) => {
  const contactButton = event.target.closest('[data-contact]');
  if (!contactButton) return;
  event.preventDefault();
  const message = encodeURIComponent('Hello Free Hands Creative Multimedia, I would like to make an enquiry.');
  if (contactButton.dataset.contact === 'whatsapp') {
    window.open(`https://wa.me/${contactRoutes.phone}?text=${message}`, '_blank', 'noopener');
  }
  if (contactButton.dataset.contact === 'email') {
    window.location.href = `mailto:${contactRoutes.email}?subject=${encodeURIComponent('Media Production Enquiry')}`;
  }
});

const customBase = 'assets/custom-web/01-home/explore-our-work-gallery';
const imagePath = (path) => path.replace(/\\/g, '/');
const optimizedImagePath = (folder, file) => {
  const normalized = /\.(jpe?g|png)$/i.test(file)
    ? file.replace(/\.(jpe?g|png)$/i, '.jpg')
    : file;
  return imagePath(`${folder}/${normalized}`);
};
const collection = (category, title, folder, files, subtitle = 'Selected coverage') => ({
  category,
  title,
  subtitle,
  images: files.map((file) => optimizedImagePath(folder, file))
});

const galleryCollections = [
  collection('Weddings', 'Wedding Stories I', `${customBase}/weddings/1`, ['IMG_0808.JPG', 'IMG_1057.JPG', 'IMG_1062.JPG', 'IMG_1156.JPG', 'IMG_1253.JPG'], 'Ceremony, details, and reception moments'),
  collection('Weddings', 'Wedding Stories II', `${customBase}/weddings/2`, ['IMG_3035.JPG', 'IMG_3124.JPG', 'IMG_5509.JPG', 'IMG_5512.JPG', 'IMG_5742.JPG'], 'Elegant moments from another celebration'),
  collection('Funerals', 'Memorial Coverage I', `${customBase}/funerals/1`, ['MR NEWMAN FUNERAL(164).jpg', 'MR NEWMAN FUNERAL(165).jpg', 'MR NEWMAN FUNERAL(235).jpg', 'MR NEWMAN FUNERAL(239).jpg', 'MR NEWMAN FUNERAL(243).jpg'], 'Respectful family and service coverage'),
  collection('Funerals', 'Memorial Coverage II', `${customBase}/funerals/2`, ['IMG_9138.JPG', 'IMG_9159.JPG', 'IMG_9195.JPG', 'IMG_9229.JPG', 'IMG_9366.JPG'], 'A second memorial story collection'),
  collection('Church', 'Church & Religious Events I', `${customBase}/religious events/1`, ['_MG_0749.jpg', 'IMG_1146.jpg', 'IMG_1180.JPG', 'IMG_1201.jpg', 'IMG_1348.jpg'], 'Worship, community, and ministry coverage'),
  collection('Church', 'Church & Religious Events II', `${customBase}/religious events/2`, ['_MG_0581.jpg', '_MG_0585.jpg', '_MG_0602.jpg', '_MG_0639.jpg', '_MG_0721.jpg'], 'Ceremony and gathering highlights'),
  collection('Birthdays', 'Birthday Celebrations', `${customBase}/birthdays`, ['_MG_4259.JPG', '_MG_4268.JPG', '_MG_4273.JPG', '_MG_4298.JPG', '_MG_4662.JPG'], 'Joyful private celebration coverage'),
  collection('Real Estate', 'Drone Coverage', `${customBase}/drone shots`, ['DJI_07781.jpg', 'ff2d3764-ecf7-4115-a64b-854ba9b86cde.jpg', 'WhatsApp Image 2026-03-07 at 4.07.38 AM.jpg', 'WhatsApp Image 2026-03-07 at 4.07.38 AM (1).jpeg', 'WhatsApp Image 2026-03-07 at 4.07.38 AM.jpeg'], 'Aerial perspective and atmosphere'),
  collection('Real Estate', 'Real Estate Showcase', `${customBase}/real estate`, ['IMG_E1070.jpg', 'IMG_E1077.jpg', 'IMG_E1087.jpg'], 'Property visuals with clean spatial storytelling'),
  collection('Photoshoots', 'Portrait Sessions I', `${customBase}/photoshoots/1`, ['_MG_0591.jpg', '_MG_0648.jpg', '_MG_0844.jpg', '_MG_5511.jpg', '_MG_5722.jpg'], 'Portrait, fashion, and personal brand work'),
  collection('Photoshoots', 'Portrait Sessions II', `${customBase}/photoshoots/2`, ['_MG_0009.jpg', '_MG_0031.jpg', '0ae114af391fb8a374dade22fb4761ff.JPG', '5124c7ece1957f2ccf177631e0c3169c.JPG', 'Photography Packages.png'], 'Studio and campaign-ready visuals'),
  collection('Outreach', 'Outreach Campaigns', `${customBase}/outreach`, ['file1786.jpg', 'file1795.jpg', 'file1828.jpg', 'file1880.jpg', 'file1948.jpg'], 'Community-centered event storytelling'),
  collection('Excursions', 'Excursions & Field Trips', `${customBase}/excursions`, ['_MG_0029.jpg', '_MG_0145.jpg', '_MG_0220.jpg', '_MG_0406.jpg', '_MG_0517.jpg'], 'Movement, discovery, and group experiences'),
  collection('Production', 'Production & Behind The Scenes', `${customBase}/production`, ['_MG_3431.jpg', '_MG_3563.jpg', '_MG_3573.jpg', 'Copy of _MG_3343.jpg', 'Copy of _MG_3355.jpg'], 'Crew, process, and production energy')
];

let activeCollection = null;
let activeImageIndex = 0;

const openGalleryLightbox = (collectionIndex, imageIndex = 0) => {
  activeCollection = galleryCollections[collectionIndex];
  activeImageIndex = imageIndex;
  if (!activeCollection) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox collection-viewer';
  lightbox.innerHTML = `
    <button type="button" class="gallery-lightbox-close" aria-label="Close gallery preview">Close</button>
    <button type="button" class="viewer-nav viewer-prev" aria-label="Previous image">Back</button>
    <figure>
      <img src="" alt="" />
      <div class="viewer-help" aria-hidden="true">Use &larr; &rarr;, mouse wheel, Home, End, or Esc</div>
    </figure>
    <button type="button" class="viewer-nav viewer-next" aria-label="Next image">Next</button>
  `;
  document.body.appendChild(lightbox);

  const updateViewer = () => {
    const image = activeCollection.images[activeImageIndex];
    lightbox.querySelector('img').src = image;
    lightbox.querySelector('img').alt = `${activeCollection.category} portfolio image`;
  };

  const move = (direction) => {
    activeImageIndex = (activeImageIndex + direction + activeCollection.images.length) % activeCollection.images.length;
    updateViewer();
  };

  lightbox.querySelector('.viewer-prev').addEventListener('click', () => move(-1));
  lightbox.querySelector('.viewer-next').addEventListener('click', () => move(1));
  lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', () => lightbox.remove());
  lightbox.querySelector('img').addEventListener('click', () => move(1));
  lightbox.addEventListener('wheel', (event) => {
    event.preventDefault();
    move(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.remove();
  });
  window.addEventListener('keydown', function handleKeys(event) {
    if (!document.body.contains(lightbox)) {
      window.removeEventListener('keydown', handleKeys);
      return;
    }
    if (event.key === 'Escape') lightbox.remove();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'Home') {
      activeImageIndex = 0;
      updateViewer();
    }
    if (event.key === 'End') {
      activeImageIndex = activeCollection.images.length - 1;
      updateViewer();
    }
  });

  updateViewer();
};

const renderGallery = (container, filter = 'All') => {
  const categories = filter === 'All'
    ? [...new Set(galleryCollections.map((item) => item.category))]
    : [filter];

  container.dataset.activeFilter = filter;
  container.innerHTML = categories.map((category) => {
    const items = galleryCollections.filter((item) => item.category === category);
    if (!items.length) return '';
    return `
      <section class="collection-lane" aria-label="${category} work">
        <div class="collection-lane-head">
          <span>${category}</span>
        </div>
        <div class="collection-row">
          ${items.map((item) => {
            const index = galleryCollections.indexOf(item);
            return `
              <button class="collection-card" type="button" data-collection="${index}" data-category="${item.category}">
                <img src="${item.images[0]}" alt="${item.title}" loading="lazy" />
              </button>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }).join('');
};

document.querySelectorAll('.wild-gallery').forEach((container) => {
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  let activeFilter = requestedCategory && galleryCollections.some((item) => item.category === requestedCategory)
    ? requestedCategory
    : 'All';
  const controls = document.querySelector(`[data-gallery-filters="${container.id}"]`);
  const categories = ['All', ...new Set(galleryCollections.map((item) => item.category))];

  if (controls) {
    controls.innerHTML = categories.map((category) => `
      <button class="gallery-tab ${category === activeFilter ? 'active' : ''}" type="button" data-filter="${category}">
        <span>${category}</span>
      </button>
    `).join('');
    controls.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      activeFilter = button.dataset.filter;
      controls.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      renderGallery(container, activeFilter);
      const url = activeFilter === 'All'
        ? `${window.location.pathname}`
        : `${window.location.pathname}?category=${encodeURIComponent(activeFilter)}`;
      window.history.replaceState({}, '', url);
    });
  }

  container.addEventListener('click', (event) => {
    const card = event.target.closest('.collection-card');
    if (!card) return;
    openGalleryLightbox(Number(card.dataset.collection), 0);
  });

  renderGallery(container, activeFilter);
});

const tiltTargets = document.querySelectorAll('.work-card, .cap-card, .mosaic-card, .video-embed, .hero-panels article, .card, .project-card, .page-hero, .collection-card');
if (finePointer) {
  tiltTargets.forEach((card) => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;
      card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--shine-y', `${(py * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--shine-x', '50%');
      card.style.setProperty('--shine-y', '50%');
    });
  });
}



