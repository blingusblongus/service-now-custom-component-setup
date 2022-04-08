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
    ...
```
3. Access the properties in the view by destructuring state: `const { properties } = state`. Note that state is passed to the view (and effects, if included) by the createCustomElement() function, but must be passed manually to any subcomponents within the view.

## Setting up REST calls and Actions

Using the properties passed in from the UI builder sidebar, you can then just formulate a normal request to the REST API, and update the state when the data is returned.

```
// This isn't actually how I did it, because I made it more complicated than it needed to be by using action handlers to hook into the lifecycle...but here's the simplified and unstreamlined way to do exactly one REST call when the component loads, and then rerender when the data arrives.

const { tableName, limit, fields, queries } = properties;

// build REST params
if(!state.tableData){
    let url = 'api/now/table/`
    url += `${tableName}?sysparm_limit=${limit}&sysparm_fields=${fields}`;
    url += `&sysparm_query=${queries.replace(' ', '')}`;

    axios.get(url)
            .then(response => {
                updateState({tableData: response.data.result})
            })
            .catch(err => console.log(err) // or handle err somehow);
}

```

>*I just this minute realized that using actions is actually completely optional. It's just SN's weird way of using the component lifecycle to kick off events, and send information by dispatching actions from anywhere in the component. Ultimately, it's definitely useful for complex components or doing certain actions at different stages of the lifecycle, but for simple cases, using actions to kick off REST calls isn't necessary. So I'm not actually going to describe them here because I only barely know what I'm talking about*


## Ok, Actions

Now Experience Components use action handlers to pass any data you don't want to pass down directly through props, and also to kick off other actions if you have a more complicated workflow or functions you want to reuse (like handling and displaying errors, for instance). In the object passed into the createCustomElement() function, you can add the property actionHandlers, which maps to an object in which the keys are the actions, and the values contain methods to execute. Dispatched actions follow the format of dispatch(type, payload). For example:

```
//dispatch is included in the state of any element made with createCustomElement, and can be accessed by destructuring:

const view = (state, {dispatch}) => {


	//clicking this element will dispatch an action that can be picked up by any custom element
	return <div on-click={() => dispatch('EXAMPLE_TYPE', {msg: 'I was clicked'})}>Click Me</div>
}


// it gets picked up here:
createCustomElement('element-name', {
	...
	actionHandlers: {
		//actions are passed to the handler along with a bunch of coeffects, including state, you can destructure to access them
		EXAMPLE_TYPE: ({action}) => {
			alert(action.payload);
		}
	}
})
```

## Making the Table Interactive

For a simple but interactive test to expand functionality, I set a goal to make table fields editable on-click, and have the on-blur event trigger a PUT request to update the table on the ServiceNow instance. To achieve this, it is necessary to:

1. Track the selected cell in the component state.
2. Conditionally render table cells based on state.
3. Capture the info from the changed cell on blur.
4. Trigger a REST call with the captured info. 

The pattern that SN suggests is to create an entirely new subcomponent using the provided createCustomElement() function and the snabbdom renderer, which would be best practice for a large and complex component, where multiple subcomponents all need to be tracking their own state - this is ideal for performance reasons. However, for simplicity's sake, I kept all stateful data in the top-level component, and just conditionally rendered an html input in whichever cell matches the field and sys_id of the editLocation property of the component state. The on-click event triggers an action

## Troubleshooting

- If you run into CORS errors in development, make sure the url you're providing is just the endpoint, not the whole address (`axios.get('api/now/tables/tableName')`, for example). If it still doesn't work, you may need to set a proxy in now-cli.json. For me, it ended up working whether or not I had the now-cli file configured (as long as you're logged in via the cli, and using their action/effect to make the request), but that suggestion still popped up on a lot of the documentation. ¯\\_(ツ)_/¯

    ```
    "development": {
        "proxy": {
        "origin" : "https://{your-instance}.service-now.com/",
        "proxies": ["/api"]
        }
    },
    ```
- Hmu with any questions about stuff that I didn't explain clearly or went different for you, or other questions about how to organize or pass properties to child components.

## Questions For Further Development

- Not sure what the best way to dynamically style components is. [SN suggests themes](https://developer.servicenow.com/dev.do#!/reference/now-experience/quebec/ui-framework/main-concepts/styles), but I suspect that, for cases where we want maximum flexibility over just a few css properties, using CSS modules controlled from the UI Builder sidebar might be simpler.
- PUT requests should be easy, but I haven't tried them yet. I can tell the multi-step pattern they use for managing Effects is designed to streamline the process of things like using different REST methods, but I haven't quite grokked that step of the process.
- How do we keep pages from breaking when new versions of components are deployed? This is a major issue that must have a simple resolution out there somewhere...
- What libraries can we use? I couldn't get it to work with React libraries, which is extremely unfortunate.
- The response returned from the REST API doesn't include the table labels, so we need to figure out how to retrieve those from whatever SN table their stored in and match them up

## Useful Links

- [Dan's Setup Instructions](https://creator-dna.com/blog/macos-setup)
- [SN Table REST API docs](https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI#table-GET?navFilter=table) 
- [SN Component Examples on Github](https://github.com/ServiceNowDevProgram/now-experience-component-examples)
- [SN UI Framework Docs](https://developer.servicenow.com/dev.do#!/reference/now-experience/rome/ui-framework/getting-started/introduction)
- [SN UI Framework Actions](https://developer.servicenow.com/dev.do#!/reference/now-experience/rome/ui-framework/main-concepts/dispatching-actions)