# Projectweek 2

Disclaimer: Every audit was taken with a slow 3g connection in the Chrome developer tools.

![chart](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/chart.png)

## The assignment

Optimize the website volkswagen.nl on a better performance and accessibility.

## Problem

When loading the website on my iphone 6, the page takes about 12 to 15 seconds to display something useful. I, as a user of the site, was pretty annoyed it took so long to load in the website.

## Goal

Reduce the time of the first meaningful paint, first contentful paint and thus, time to interactive.
While also giving the user a better sense of percieved performance.

## Index

_first meaningful paint_

This audit identifies the time at which the user feels that the primary content of the page is visible.

_first contentful paint_

First Contentful Paint (FCP) measures the time from navigation to the time when the browser renders the first bit of content from the DOM. This is an important milestone for users because it provides feedback that the page is actually loading.

The main difference between the first meaningful paint and the first contentful paint is that they refer to different points in a users's experience.

**First Contentful Paint** is definitely **meant** to be more accurate than First Paint – however, often the two timings may end up being the same.

There may be situations where you may prefer to use one or the other however:

- On **faster and lighter websites,** it is more likely that First Paint and First Contentful Paint **are the same** due to the browser being able to render elements quickly. If they’re the same, either First Paint or First Contentful Paint will suffice.
- On **larger, more complex websites** – you may see First Paint and First Contentful Paint drift further apart more often, due to multiple elements needing to be handled. First Contentful Paint would be the best metric to use on such sites.

_time to interactive_

The Time to Interactive (TTI) metric measures how long it takes a page to become interactive. "Interactive" is defined as the point where:

- The page has displayed useful content, which is measured with [First Contentful Paint](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint).
- Event handlers are registered for most visible page elements.
- The page responds to user interactions within 50 milliseconds.

_percieved performance_



### The steps I made:

- Critical css & font-face:swap

- Compression

- Intersection observer voor percieved performance

- optimizing images to new format > web

- preload fonts

- minimizing css & JS

- Caching



### Critical css & font-face: swap

Deciding which css has to be loaded to show content the 'above the fold' content is key in optimizing the critical render path. The css needed for the above the fold content is place between `<style></style>` in the head of the html. Every other `<style>` or `<script>` was then moved to before the `</body>` .



`@font-face` is first removed from the css sheet and placed in a seperate fonts.css file. More on this later.

`font-display: swap`  Instructs the browser to use the fallback font to display the text until the custom font has fully downloaded. This is also known as a "flash of unstyled text".

#### Before

![audit before critical css](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/0. audit before critical css.png)

![before critical css](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/0. before critical css.png)

### After

![audit after critical css](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/1. audit after critical css.png)



![after critical css](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/1. after critical css.png)





###Compression

Compression is a middleware that that will attempt to compress response bodies that go through this middleware. In the current Volkswagen.nl website, gzip is used. My advice is to use Brotli in conjunction with Shrink-ray.

#### after



![2. after compression](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/2. after compression.png)



![2. audit after compression](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/2. audit after compression.png)



### Intersection observer for extra percieved performance

The current website makes use of lazy loading. The images have a fade in effect on the page load. But this is only declared in the css. So the images still get loaded on the initial page load.

With a proper lazy loading effect, the images get fetched only if the images are in the viewport.

the _intersection observer api_ in the browser lets us execute proper lazy loading functions. I've implemented the lazy loading function on images below the fold. This reduced only the Time to Interactive.

####after

![3. after intersection observer lazy loading](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/3. after intersection observer lazy loading.png)

### image optimisation to next gen format

One problem on the current Volkswagen site is that the images are not in a next-gen format and are not properly sized. To get extra performance points, the images have to properly sized for the website.

To convert images to the next-gen format `webP`  , I've written a Gulp taks to optimize the images for me.

```
gulp.task('images', function () {
    return gulp.src('./public/imagesOld/**/*')
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest('./public/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./public/images/'))
});
```

Using `gulp-min` and `gulp-webp`, the gulp task can easily optimze the images. The results of this are noticeable in Time to interactive and the estimated input latency. It also increases the speed index a little bit.

#### after

![4. after image next gen format](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/4. after image next gen format.png)

### Preloading fonts

By using the Preload on a `<link>` we can tell the browser that we definitly need to start download webfonts earlier on the page rendering than the default let us.
The default is that the site will load all of the html and css before it will load in webfonts. Because  browsers only load web fonts when there is a css selector for a connect DOM node.

By telling the browser that we definetly need that font, the browser can start downloading the font much earlier in the proces. The results are with mixed feelings. It raised the time of the first contentful paint and the first meaningful paint but it improved the percieved performance of the website.

#### after

![5. after preloading fonts](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/5. after preloading fonts.png)

### minify css and JS

Css and JS are minified on the current volkswagen.nl. But it wasn't minified on my local machine. And also, I want to touch this current issue on the live site. It still loads in Jquery and a ton of third-party scripts. My advice would be to validate which third-party script is still necessary to use on the live site.

I've minified my css and js with the following gulp tasks:

```
gulp.task('min-css', function () {
    return gulp.src('./public/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(cssnano({
            discardComments: {
                removeAll:
                    true
            }
        }))
        .pipe(rename(function (path) {
            path.basename += "-min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('./public/stylesheets/'));
})
```

```
gulp.task('min-js', function () {
    return gulp.src('./public/js/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += "-min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('./public/javascripts/'))
})
```

It vastly improved the first contentful paint and the first meaningful paint.

#### after![6. after css and js min](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/6. after css and js min.png)

### Caching

After all of the minification and optimisation it is time to incorporate HTTP-caching. Every time the server sends a response we have to include the correct HTTP_header with information about how long the browser has to store the data in the browsers's cache. The http-header contains information about the type of content, the length and some instructions about the cache memory.

```
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=' + 365 * 24 * 60 * 60); next();
});
```

Caching only has real effect after the first page load. But it will make loading the page much faster for returning visitors.

#### after

![7. audit after caching](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/7. audit after caching.png)

![7. after caching](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/7. after caching.png)



### Result

![result](https://raw.githubusercontent.com/Techdemo/project-2-1819/master/assets/result.png)

As a result. The full pageload is brought back to around 4.7s.
