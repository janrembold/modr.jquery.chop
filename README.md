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

> See https://github.com/janrembold/modr#global-utility-methods for details

| wrapped | event name | element | description | 
| --- | --- | --- | --- |  
| before/after | init.core.chop | root | Is fired when core gets initialized |
| before/after | set.start.chop | root | Is fired when start element is overridden by data-start attribute on root element |


# `accordion` module
The `accordion` module is a standalone accordion or collapsable element.


## Options

### `autoClose` (default: true) 
Open accordion items are closed automatically when another item is clicked to open if this option is set to true.
If autoClose is disabled items stay open and scrolling to newly opened items (option: scroll) is disabled too. 

### `duration` (default: 400)
This is the animation duration in ms for opening/closing of accordion items.
 
### `scroll` (default: true)
If enabled this option forces the accordion to scroll the opening accordion header back into viewport. 
This works only if the newly opened item will scroll out of the top viewport. 
The offset can be manually changed with the function `onScrollAddTopOffset`, see option below.

### `onScrollAddTopOffset` (default: function() { return 0; })
The return value of this function is added to the top offset of the scroll target. 
It can be used to add custom offset, e.g. for sticky headers or custom margins.


## Events

| wrapped | event name | element | description | 
| --- | --- | --- | --- |  
| before/after | init.accordion.chop | root | Is fired when accordion gets initialized |
| before/after | open.accordion.chop | the opening item | Is fired when accordion item opens |
| before/after | close.accordion.chop | the closing item | Is fired when accordion item closes |



# TODOs

- add readme
- add better core decision to init accordion or tabbed nav 
- add css3 toggle for tabs 
