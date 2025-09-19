;(() => {
  // Theme toggle: persist in localStorage, set data-theme on documentElement
  const THEME_KEY = 'antora-theme'
  const toggle = document.getElementById('theme-toggle')

  function applyTheme() {
    const theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'light'
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark')
    else document.documentElement.removeAttribute('data-theme')
    if (toggle) {
      toggle.setAttribute('aria-checked', String(theme === 'dark'))
      try {
        toggle.textContent = theme === 'dark' ? 'Dark' : 'Light'
      } catch (e) {}
    }
  }

  function loadTheme() {
    try {
      const saved = window.localStorage?.getItem(THEME_KEY)
      if (saved) return saved
    } catch (e) {
      /* ignore */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function saveTheme(t) {
    try {
      window.localStorage?.setItem(THEME_KEY, t)
    } catch (e) {}
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      saveTheme(next)
    })
  }

  applyTheme(loadTheme())

  // Smooth scrolling for internal links
  function smoothScroll(target, e) {
    if (!target || target.tagName !== 'A') return
    const href = target.getAttribute('href')
    if (!href || href.charAt(0) !== '#') return
    const id = href.slice(1)
    const dest = document.getElementById(id)
    if (!dest) return
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const top = dest.getBoundingClientRect().top + window.scrollY - 72 // account for header
    window.scrollTo({ top, behavior: 'smooth' })
    window.history?.replaceState?.(null, '', href)
  }

  document.addEventListener('click', e => {
    const el = e.target?.closest ? e.target.closest('a') : null
    if (el) smoothScroll(el, e)
  })

  // Minimal ScrollSpy for TOC: highlight nearest heading
  const toc = document.querySelector('.toc .toc-menu')
  if (toc) {
    const links = []
    toc.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href')
      if (!href) return
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) links.push({ link: a, el })
    })

    const onTocScroll = () => {
      const fromTop = window.scrollY + 90
      let active = null
      for (let i = 0; i < links.length; i++) {
        const rect = links[i].el.getBoundingClientRect()
        const top = window.scrollY + rect.top
        if (top <= fromTop) active = links[i]
      }
      if (active) {
        toc.querySelectorAll('a').forEach(a => {
          a.classList.remove('is-active')
        })
        active.link.classList.add('is-active')
      }
    }

    onTocScroll()
    window.addEventListener('scroll', throttle(onTocScroll, 120))
  }

  function throttle(fn, wait) {
    let last = 0
    return () => {
      const now = Date.now()
      if (now - last > wait) {
        last = now
        fn()
      }
    }
  }

  // Wire nav toggle button
  const navToggle = document.querySelector('.nav-toggle')
  const navContainer = document.querySelector('.nav-container')
  if (navToggle && navContainer) {
    navToggle.addEventListener('click', () => {
      navContainer.classList.toggle('is-active')
      document.documentElement.classList.toggle('is-clipped-nav')
    })
  }
  // Keyboard navigation for left nav (simple roving focus)
  ;(() => {
    const navRoot = document.querySelector('.nav')
    if (!navRoot) return

    function collectItems() {
      return Array.prototype.slice
        .call(navRoot.querySelectorAll('.nav-link, .nav-item-toggle'))
        .filter(el => el.offsetParent !== null)
    }

    function focusIndex(items, idx) {
      if (!items.length) return
      idx = Math.max(0, Math.min(items.length - 1, idx))
      items[idx].focus()
    }

    navRoot.addEventListener('keydown', e => {
      const items = collectItems()
      if (!items.length) return
      const active = document.activeElement
      const idx = items.indexOf(active)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (idx === -1) focusIndex(items, 0)
          else focusIndex(items, idx + 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          if (idx === -1) focusIndex(items, 0)
          else focusIndex(items, idx - 1)
          break
        case 'ArrowRight':
          if (active?.classList.contains('nav-item-toggle')) {
            active.parentElement.classList.add('is-active')
            e.preventDefault()
          }
          break
        case 'ArrowLeft':
          if (active?.classList.contains('nav-item-toggle')) {
            active.parentElement.classList.remove('is-active')
            e.preventDefault()
          } else {
            const li = active?.closest?.('.nav-item')
            if (li?.parentElement?.closest('.nav-item')) {
              const parentLi = li.parentElement.closest('.nav-item')
              const link = parentLi.querySelector('.nav-link, .nav-item-toggle')
              if (link) {
                link.focus()
                e.preventDefault()
              }
            }
          }
          break
        case 'Enter':
        case ' ':
          if (active?.classList.contains('nav-item-toggle')) {
            active.parentElement.classList.toggle('is-active')
            e.preventDefault()
          }
          break
      }
    })
  })()
})()
