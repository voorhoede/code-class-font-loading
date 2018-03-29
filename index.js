const express = require('express')
const path = require('path')
const portfinder = require('portfinder')
const renderer = require('./lib/renderer')

const app = express()
const enableCaching = false // Prevent caching to make perf exercise consistent. This is not a good practice for real projects.
portfinder.basePort = 3000

app.set('etag', enableCaching)

// make fonts slow
app.get(/.(woff2?|ttf|eot)/, (req, res, next) => {
	setTimeout(() => {
		next();
	}, Math.floor(Math.random() * 4000) + 3100  )
});
app.use('/assets/', express.static(path.join(__dirname, 'src', 'assets'), { etag: enableCaching, lastModified: enableCaching }))

app.get('/', (req, res) => res.send(renderer.render(path.join('views', 'index.html'))))

app.get('/:page', (req, res) => {
	const { page } = req.params
	const filename = path.join('views', 'exercises', `${page}.html`)
	const timestamp = new Date().getTime()
	res.send(renderer.render(filename, { timestamp }))
})

portfinder.getPortPromise().then(port => {
	app.listen(port, () => console.log(`Server ready on http://localhost:${port}`))
})
