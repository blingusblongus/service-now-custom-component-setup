# Now Experience UI Custom Table Component Setup

## Setup

1. To initialize the project, follow [the instructions Dan posted](https://creator-dna.com/blog/macos-setup). They worked perfectly for me (on Mac).
2. in `package.json`, add `"react-error-overlay": "6.0.9"` to "devDependencies" and `npm install`

>*This solves the 'process is not defined error' that prevents you from interacting with the DOM in the development environment. Without this line in the dependencies, it will render an invisible iframe over all of the html elements on the DOM, which is not very helpful when you want to click on them*

At this point, you should be able to run `snc ui-component develop` and view the component in the browser, and, if you want to, deploy it with `snc ui-component deploy --force`. 

> *When overwriting a component that's been deployed to an instance, existing links to that component in UI builder seem to break and will bork your existing UI builder project. I didn't investigate enough to really figure out what was going on or how to prevent it, but just created a new page variant when deploying to quickly test new iterations. I'm sure there's a way to fix this...?* 

I eventually refactored out my view and actions to better match the [Now Experience Component Examples](https://github.com/blingusblongus/now-experience-component-examples), but it was easier initially to keep the component and render function as they are, together in index.js.

## Config

To pass values from the UI Builder UI to a custom component, the component state must be configured to accept 'properties' (a reserved property of the state object), and they also must be referenced in the project's `now-ui.json` file (this is where all the information relevant to the UI Builder UI lives).