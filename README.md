# Now Experience UI Custom Table Component Setup

## Setup

1. To initialize the project, follow [the instructions Dan posted](https://creator-dna.com/blog/macos-setup). They worked perfectly for me (on Mac). Good luck on windows.
2. in `package.json`, add `"react-error-overlay": "6.0.9"` to "devDependencies" and `npm install`

>*This solves the 'process is not defined error' that prevents you from interacting with the DOM in the development environment. Without this line in the dependencies, it will render an invisible iframe over all of the html elements on the DOM, which is not very helpful when you want to click on them*

At this point, you should be able to run `snc ui-component develop` and view the component in the browser, and, if you want to, deploy it with `snc ui-component deploy --force`. 

> *When overwriting a component that's been deployed to an instance, existing links to that component in UI builder seem to break and will bork your existing UI builder project. I didn't investigate enough to really figure out what was going on or how to prevent it, but just created a new page variant when deploying to quickly test new iterations. I'm sure there's a way to fix this...?* 

I eventually refactored out my view and actions to better match the [Now Experience Component Examples](https://github.com/blingusblongus/now-experience-component-examples), but it was easier initially to keep the component and render function as they are, together in index.js.

## Config

To pass values from the UI Builder UI to a custom component, the component state must be configured to accept 'properties' (a reserved property of the state object), and they also must be referenced in the project's `now-ui.json` file (this is where all the information relevant to the UI Builder UI lives).

1. In `now-ui.json`, add a 'properties' property to your component. This should include an array of json objects with the following properties: 
    1. "name" - the variable name that is referenced in the component state initialization
    2. "description" - 
    3. "readOnly" - whether the field is editable in UI Builder
    4. "fieldType" - the type of input expected; however, I think this is just for documentation, because properties are passed in as strings regardless of the type provided here
    5. "required" - bool; is this property required for the component to render
    6. "defaultValue" - The default value to be displayed in the UI builder sidebar pane

        >*Note: the defaultValues provided in the now-ui.json just *
```
{
	"components": {
	    "x-792462-properties-test": {
	        "innerComponents": [],
			"uiBuilder": {
				"associatedTypes": ["global.core", "global.landing-page"],
				"label": "Table GET",
				"icon": "document-outline",
				"description": "Retrieve and filter a table",
				"category": "primitives"
			},
			"properties": [
				{
					"name": "userName",
					"label": "User",
					"description": "Name of user to greet",
					"readOnly": false,
					"fieldType": "string",
					"required": false,
					"defaultValue": "Jon"
				},
				{
					"name": "tableName",
					"label": "Table",
					"description": "Table to retrieve",
					"readOnly": false,
					"fieldType": "string",
					"required": false,
					"defaultValue": "sys_user"
				},
                ...
```

## Troubleshooting

- If you run into CORS errors in development, you may need to set a proxy in now-cli.json. For me, it ended up working whether or not I had the now-cli file configured (as long as you're logged in via the cli), but that suggestion still popped up on a lot of the documentation. ¯\\_(ツ)_/¯

```
"development": {
    "proxy": {
      "origin" : "https://{your-instance}.service-now.com/",
      "proxies": ["/api"]
    }
  },
  ```

## Further Mysteries

- I haven't looked into it much, but 