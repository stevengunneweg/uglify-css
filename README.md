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

## Future Improvements

### Sourcemaps

For debugging perposes it would come in handy to have a sourcemap to know what the original name of a class/variable was.
Currently a `uglify-css.map.json` file is generated with key (old) - value (new) pairs.

### More CLI options

Adding options to disable class uglification for example.
