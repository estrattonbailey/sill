import { h, patch } from 'picodom'
import mitt from 'mitt'
import createRouter from '@sill/router'

function currentURL (loc = window.location) {
  return loc.href.replace(loc.origin, '')
}

export { h }

export function app (r = []) {
  let ref = null
  const router = createRouter(r)

  function mount (root, done) {
    const ev = mitt.default ? mitt.default() : mitt()

    function render (url = currentURL()) {
      ev.emit('navigate', url)
      return Promise.resolve(router.get(url))
        .then(next => requestAnimationFrame(() => {
          patch(root, ref, (ref = next))
          ev.emit('render')
        }))
        .then(() => window.history.pushState({}, document.title, url))
    }

    window.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) return

      let a = e.target

      while (a && !(a.href && a.nodeName === 'A')) {
        a = a.parentNode
      }

      if (
        !a ||
        window.location.origin !== a.origin ||
        a.hasAttribute('download') ||
        a.target === '_blank' ||
        /mailto|tel/.test(a.href)
      ) return

      e.preventDefault()

      render(currentURL(a))
    })

    window.onpopstate = e => render(currentURL(e.target.location))

    render().then(done)

    return Object.assign(ev, {
      render
    })
  }

  return typeof window !== 'undefined' ? mount : router.get
}
