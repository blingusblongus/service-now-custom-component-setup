# Now Experience UI Custom Table Component Setup

## Short Version
1. Follow [Dan's instructions](https://creator-dna.com/blog/macos-setup), at which point you should be able to deploy a static component to your instance.
2. Define the UI Builder sidebar fields by adding a 'properties' array to `now-ui.json`.
3. Connect these properties to the state of the component by adding a 'properties' object (with `propertyName: { default: 'default value' }` in the createCustomElement() function in the component's `index.js` file.
4. Reference passed in properties inside components by with `const { properties } = state`
5. Set up an Effect to query the ServiceNow REST api using the passed-in properties
6. Connect that effect with the appropriate action and action handler (probably `{ COMPONENT_RENDERED } = actionTypes`, with actionTypes imported from '@service-now/core-ui`)
7. Update component state with the response from the REST api, and render the result

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

        >*Note: the defaultValues provided in the now-ui.json will populate the fields on the UI Builder sidebar, but will are NOT used as the default values on state initialization - those get set in the createElement() function in index.js. So, if you're not careful, fields in the UI sidebar may initially show values that don't match the actual values being used, until those fields edited for the first time.*
```
// now-ui.json

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
2. In the createCustomElement() function, add a property called 'properties' to the arguments - this will be automatically mapped with the matching properties defined in `now-ui.json`
```
// index.js (component level);

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		userName: { default: 'default user' },
		tableName: { default: 'sys_user' },
		fields: { default: '' },
		limit: { default: '25' },
		queries: { default: '' }
	},
```
3. Access the properties in the view by destructuring state: `const { properties } = state`. Note that state is passed to the view (and effects, if included) by the createCustomElement() function, but must be passed manually to any subcomponents within the view.

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

## Questions For Further Development

- Not sure what the best way to dynamically style components is. [SN suggests themes](https://developer.servicenow.com/dev.do#!/reference/now-experience/quebec/ui-framework/main-concepts/styles), but I suspect that, for cases where we want maximum flexibility over just a few css properties, using CSS modules controlled from the UI Builder sidebar might be simpler. 

## Useful Links

- [Dan's Setup Instructions](https://creator-dna.com/blog/macos-setup)
- [SN Table REST API docs](https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI#table-GET?navFilter=table) 