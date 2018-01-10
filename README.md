# sill
A fun(ctional) little frontend application framework. 

```javascript
/** @jsx h */
import { h, app } from 'sill'
import store from './store.js'

import App from './components/App.js'
import Home from './pages/Home.js'
import About from './pages/About.js'

const program = app([
  ['/', () => (
    <App>
      <Home />
    </App>
  )],
  ['/about', () => (
    <App>
      <About />
    </App>
  )]
])(document.getElementById('root'))

store.update(state => program.render())
```

MIT
