# Uglify CSS

When building your application, with most frameworks your JS will be minified and/or uglified to reduce the file size as much as possible.

Uglify-CSS is built to do the same but for your CSS.

## Install

```
npm install uglify-css
```

## Implementation

Uglify-CSS scans all CSS files in the target folder and lists all classes and variables. The variables are then uglified and applied to all html, js and css files in the target folder.

### Command line usage

```
npx uglify-css [--help | -h] [--dry-run | -d]
```

### Example

```css
:root {
	--color-primary: #ff0000;
}

#test {
	background: var(--color-primary);
}
```

Will turn in to

```css
:root {
	--a: #ff0000;
}

#test {
	background: var(--a);
}
```

In this case this reduces the CSS by 12 characters for every place this variable is used, quickly reducing the CSS file size without changing functionality.

### Caveats

Only classes/variables containing a dash can be replaced at this time. Since uglify-css does a regex replace the risk of replacing too much is too big.

## Tests

In the `tests` folder you will find an Angular and a Vue application. The content of these apps are identical. When running uglify-css you can observe the following improvements.

Angular

```
dist/angular/browser/styles-2OWODMB7.css - 17676 -> 12939 (-26.8%)
dist/angular/browser/polyfills-FFHMD2TL.js - 34519 -> 34519 (0%)
dist/angular/browser/main-SCX6R5WO.js - 111296 -> 110281 (-0.91%)
dist/angular/browser/index.html - 7303 -> 5541 (-24.13%)
```

Vue

```
dist/index.html - 456 -> 456 (0%)
dist/assets/index-DOXljpdd.css - 17669 -> 12885 (-27.08%)
dist/assets/index-BlAT0E4W.js - 66403 -> 65364 (-1.56%)
```

You can run these tests yourself by running `npm run test:angular` or `npm run test:vue` from the root of this repository.

## Future Improvements

### Sourcemaps

For debugging perposes it would come in handy to have a sourcemap to know what the original name of a class/variable was.
Currently a `uglify-css.map.json` file is generated with key (old) - value (new) pairs.

### More CLI options

Adding options to disable class uglification for example.
