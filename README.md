# modr.jquery.chop
A modular content chopper plugin with accordion, tabbed navigation and url parameter support

> See https://github.com/janrembold/modr for framework details.

**Module name:** `chop` 

**Default wrapper:** `jQuery`

**List of modules:**

- `core` - The main module to coordinate initialization of other modules
- `accordion` - The accordion module
- `tabs` - The tabbed navigation module
- `url` - The URL handling module, responsible for parameterized opening



# `core` module
The `core` module is initialized after all modules are locked and loaded.
It shows its content either in accordion, tabbed navigation or a hybrid style.


## Options

### `start` (default: 1) 
This is the element that should be loaded on startup, starting by 1.

### `loadingClass` (default: 'chop--loading')
This class is located on the root element on which the plugin was initialized.
It handles the loading styles, like visibility, loading indicators or similar styles.


## Events

| wrapped | event name | element | description | 
| --- | --- | --- | --- |  
| before/after | init.core.chop | root | Is fired when core gets initialized |
| before/after | set.start.chop | root | Is fired when start element is overridden by data-start attribute on root element |


# TODOs

- add readme
- add better core decision to init accordion or tabbed nav 
- add css3 toggle for tabs 
