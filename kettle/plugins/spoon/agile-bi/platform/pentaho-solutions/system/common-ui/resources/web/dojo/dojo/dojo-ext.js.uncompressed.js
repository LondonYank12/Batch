/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/
/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/
if(!dojo._hasResource["dojo.date.stamp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date.stamp"] = true;
dojo.provide("dojo.date.stamp");

dojo.getObject("date.stamp", true, dojo);

// Methods to convert dates to or from a wire (string) format using well-known conventions

dojo.date.stamp.fromISOString = function(/*String*/formattedString, /*Number?*/defaultTime){
	//	summary:
	//		Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
	//
	//	description:
	//		Accepts a string formatted according to a profile of ISO8601 as defined by
	//		[RFC3339](http://www.ietf.org/rfc/rfc3339.txt), except that partial input is allowed.
	//		Can also process dates as specified [by the W3C](http://www.w3.org/TR/NOTE-datetime)
	//		The following combinations are valid:
	//
	//			* dates only
	//			|	* yyyy
	//			|	* yyyy-MM
	//			|	* yyyy-MM-dd
	// 			* times only, with an optional time zone appended
	//			|	* THH:mm
	//			|	* THH:mm:ss
	//			|	* THH:mm:ss.SSS
	// 			* and "datetimes" which could be any combination of the above
	//
	//		timezones may be specified as Z (for UTC) or +/- followed by a time expression HH:mm
	//		Assumes the local time zone if not specified.  Does not validate.  Improperly formatted
	//		input may return null.  Arguments which are out of bounds will be handled
	// 		by the Date constructor (e.g. January 32nd typically gets resolved to February 1st)
	//		Only years between 100 and 9999 are supported.
	//
  	//	formattedString:
	//		A string such as 2005-06-30T08:05:00-07:00 or 2005-06-30 or T08:05:00
	//
	//	defaultTime:
	//		Used for defaults for fields omitted in the formattedString.
	//		Uses 1970-01-01T00:00:00.0Z by default.

	if(!dojo.date.stamp._isoRegExp){
		dojo.date.stamp._isoRegExp =
//TODO: could be more restrictive and check for 00-59, etc.
			/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
	}

	var match = dojo.date.stamp._isoRegExp.exec(formattedString),
		result = null;

	if(match){
		match.shift();
		if(match[1]){match[1]--;} // Javascript Date months are 0-based
		if(match[6]){match[6] *= 1000;} // Javascript Date expects fractional seconds as milliseconds

		if(defaultTime){
			// mix in defaultTime.  Relatively expensive, so use || operators for the fast path of defaultTime === 0
			defaultTime = new Date(defaultTime);
			dojo.forEach(dojo.map(["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds"], function(prop){
				return defaultTime["get" + prop]();
			}), function(value, index){
				match[index] = match[index] || value;
			});
		}
		result = new Date(match[0]||1970, match[1]||0, match[2]||1, match[3]||0, match[4]||0, match[5]||0, match[6]||0); //TODO: UTC defaults
		if(match[0] < 100){
			result.setFullYear(match[0] || 1970);
		}

		var offset = 0,
			zoneSign = match[7] && match[7].charAt(0);
		if(zoneSign != 'Z'){
			offset = ((match[8] || 0) * 60) + (Number(match[9]) || 0);
			if(zoneSign != '-'){ offset *= -1; }
		}
		if(zoneSign){
			offset -= result.getTimezoneOffset();
		}
		if(offset){
			result.setTime(result.getTime() + offset * 60000);
		}
	}

	return result; // Date or null
};

/*=====
	dojo.date.stamp.__Options = function(){
		//	selector: String
		//		"date" or "time" for partial formatting of the Date object.
		//		Both date and time will be formatted by default.
		//	zulu: Boolean
		//		if true, UTC/GMT is used for a timezone
		//	milliseconds: Boolean
		//		if true, output milliseconds
		this.selector = selector;
		this.zulu = zulu;
		this.milliseconds = milliseconds;
	}
=====*/

dojo.date.stamp.toISOString = function(/*Date*/dateObject, /*dojo.date.stamp.__Options?*/options){
	//	summary:
	//		Format a Date object as a string according a subset of the ISO-8601 standard
	//
	//	description:
	//		When options.selector is omitted, output follows [RFC3339](http://www.ietf.org/rfc/rfc3339.txt)
	//		The local time zone is included as an offset from GMT, except when selector=='time' (time without a date)
	//		Does not check bounds.  Only years between 100 and 9999 are supported.
	//
	//	dateObject:
	//		A Date object

	var _ = function(n){ return (n < 10) ? "0" + n : n; };
	options = options || {};
	var formattedDate = [],
		getter = options.zulu ? "getUTC" : "get",
		date = "";
	if(options.selector != "time"){
		var year = dateObject[getter+"FullYear"]();
		date = ["0000".substr((year+"").length)+year, _(dateObject[getter+"Month"]()+1), _(dateObject[getter+"Date"]())].join('-');
	}
	formattedDate.push(date);
	if(options.selector != "date"){
		var time = [_(dateObject[getter+"Hours"]()), _(dateObject[getter+"Minutes"]()), _(dateObject[getter+"Seconds"]())].join(':');
		var millis = dateObject[getter+"Milliseconds"]();
		if(options.milliseconds){
			time += "."+ (millis < 100 ? "0" : "") + _(millis);
		}
		if(options.zulu){
			time += "Z";
		}else if(options.selector != "time"){
			var timezoneOffset = dateObject.getTimezoneOffset();
			var absOffset = Math.abs(timezoneOffset);
			time += (timezoneOffset > 0 ? "-" : "+") +
				_(Math.floor(absOffset/60)) + ":" + _(absOffset%60);
		}
		formattedDate.push(time);
	}
	return formattedDate.join('T'); // String
};

}

if(!dojo._hasResource["dojo.parser"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.parser"] = true;
dojo.provide("dojo.parser");



new Date("X"); // workaround for #11279, new Date("") == NaN

dojo.parser = new function(){
	// summary:
	//		The Dom/Widget parsing package

	var d = dojo;

	function val2type(/*Object*/ value){
		// summary:
		//		Returns name of type of given value.

		if(d.isString(value)){ return "string"; }
		if(typeof value == "number"){ return "number"; }
		if(typeof value == "boolean"){ return "boolean"; }
		if(d.isFunction(value)){ return "function"; }
		if(d.isArray(value)){ return "array"; } // typeof [] == "object"
		if(value instanceof Date) { return "date"; } // assume timestamp
		if(value instanceof d._Url){ return "url"; }
		return "object";
	}

	function str2obj(/*String*/ value, /*String*/ type){
		// summary:
		//		Convert given string value to given type
		switch(type){
			case "string":
				return value;
			case "number":
				return value.length ? Number(value) : NaN;
			case "boolean":
				// for checked/disabled value might be "" or "checked".	 interpret as true.
				return typeof value == "boolean" ? value : !(value.toLowerCase()=="false");
			case "function":
				if(d.isFunction(value)){
					// IE gives us a function, even when we say something like onClick="foo"
					// (in which case it gives us an invalid function "function(){ foo }").
					//	Therefore, convert to string
					value=value.toString();
					value=d.trim(value.substring(value.indexOf('{')+1, value.length-1));
				}
				try{
					if(value === "" || value.search(/[^\w\.]+/i) != -1){
						// The user has specified some text for a function like "return x+5"
						return new Function(value);
					}else{
						// The user has specified the name of a function like "myOnClick"
						// or a single word function "return"
						return d.getObject(value, false) || new Function(value);
					}
				}catch(e){ return new Function(); }
			case "array":
				return value ? value.split(/\s*,\s*/) : [];
			case "date":
				switch(value){
					case "": return new Date("");	// the NaN of dates
					case "now": return new Date();	// current date
					default: return d.date.stamp.fromISOString(value);
				}
			case "url":
				return d.baseUrl + value;
			default:
				return d.fromJson(value);
		}
	}

	var dummyClass = {}, instanceClasses = {
		// map from fully qualified name (like "dijit.Button") to structure like
		// { cls: dijit.Button, params: {label: "string", disabled: "boolean"} }
	};

	// Widgets like BorderContainer add properties to _Widget via dojo.extend().
	// If BorderContainer is loaded after _Widget's parameter list has been cached,
	// we need to refresh that parameter list (for _Widget and all widgets that extend _Widget).
	// TODO: remove this in 2.0, when we stop caching parameters.
	d.connect(d, "extend", function(){
		instanceClasses = {};
	});

	function getProtoInfo(cls, params){
		// cls: A prototype
		//		The prototype of the class to check props on
		// params: Object
		//		The parameters object to mix found parameters onto.
		for(var name in cls){
			if(name.charAt(0)=="_"){ continue; }	// skip internal properties
			if(name in dummyClass){ continue; }		// skip "constructor" and "toString"
			params[name] = val2type(cls[name]);
		}
		return params;
	}

	function getClassInfo(/*String*/ className, /*Boolean*/ skipParamsLookup){
		// summary:
		//		Maps a widget name string like "dijit.form.Button" to the widget constructor itself,
		//		and a list of that widget's parameters and their types
		// className:
		//		fully qualified name (like "dijit.form.Button")
		// returns:
		//		structure like
		//			{
		//				cls: dijit.Button,
		//				params: { label: "string", disabled: "boolean"}
		//			}

		var c = instanceClasses[className];
		if(!c){
			// get pointer to widget class
			var cls = d.getObject(className), params = null;
			if(!cls){ return null; }		// class not defined [yet]
			if(!skipParamsLookup){ // from fastpath, we don't need to lookup the attrs on the proto because they are explicit
				params = getProtoInfo(cls.prototype, {})
			}
			c = { cls: cls, params: params };
			
		}else if(!skipParamsLookup && !c.params){
			// if we're calling getClassInfo and have a cls proto, but no params info, scan that cls for params now
			// and update the pointer in instanceClasses[className]. This happens when a widget appears in another
			// widget's template which still uses dojoType, but an instance of the widget appears prior with a data-dojo-type,
			// skipping this lookup the first time.
			c.params = getProtoInfo(c.cls.prototype, {});
		}
		
		return c;
	}

	this._functionFromScript = function(script, attrData){
		// summary:
		//		Convert a <script type="dojo/method" args="a, b, c"> ... </script>
		//		into a function
		// script: DOMNode
		//		The <script> DOMNode
		// attrData: String
		//		For HTML5 compliance, searches for attrData + "args" (typically
		//		"data-dojo-args") instead of "args"
		var preamble = "";
		var suffix = "";
		var argsStr = (script.getAttribute(attrData + "args") || script.getAttribute("args"));
		if(argsStr){
			d.forEach(argsStr.split(/\s*,\s*/), function(part, idx){
				preamble += "var "+part+" = arguments["+idx+"]; ";
			});
		}
		var withStr = script.getAttribute("with");
		if(withStr && withStr.length){
			d.forEach(withStr.split(/\s*,\s*/), function(part){
				preamble += "with("+part+"){";
				suffix += "}";
			});
		}
		return new Function(preamble+script.innerHTML+suffix);
	};

	this.instantiate = function(/* Array */nodes, /* Object? */mixin, /* Object? */args){
		// summary:
		//		Takes array of nodes, and turns them into class instances and
		//		potentially calls a startup method to allow them to connect with
		//		any children.
		// nodes: Array
		//		Array of nodes or objects like
		//	|		{
		//	|			type: "dijit.form.Button",
		//	|			node: DOMNode,
		//	|			scripts: [ ... ],	// array of <script type="dojo/..."> children of node
		//	|			inherited: { ... }	// settings inherited from ancestors like dir, theme, etc.
		//	|		}
		// mixin: Object?
		//		An object that will be mixed in with each node in the array.
		//		Values in the mixin will override values in the node, if they
		//		exist.
		// args: Object?
		//		An object used to hold kwArgs for instantiation.
		//		See parse.args argument for details.

		var thelist = [],
		mixin = mixin||{};
		args = args||{};

		// TODO: for 2.0 default to data-dojo- regardless of scopeName (or maybe scopeName won't exist in 2.0)
		var attrName = (args.scope || d._scopeName) + "Type",	// typically "dojoType"
			attrData = "data-" + (args.scope || d._scopeName) + "-";	// typically "data-dojo-"

		d.forEach(nodes, function(obj){
			if(!obj){ return; }

			// Get pointers to DOMNode, dojoType string, and clsInfo (metadata about the dojoType), etc.
			var node, type, clsInfo, clazz, scripts, fastpath;
			if(obj.node){
				// new format of nodes[] array, object w/lots of properties pre-computed for me
				node = obj.node;
				type = obj.type;
				fastpath = obj.fastpath;
				clsInfo = obj.clsInfo || (type && getClassInfo(type, fastpath));
				clazz = clsInfo && clsInfo.cls;
				scripts = obj.scripts;
			}else{
				// old (backwards compatible) format of nodes[] array, simple array of DOMNodes. no fastpath/data-dojo-type support here.
				node = obj;
				type = attrName in mixin ? mixin[attrName] : node.getAttribute(attrName);
				clsInfo = type && getClassInfo(type);
				clazz = clsInfo && clsInfo.cls;
				scripts = (clazz && (clazz._noScript || clazz.prototype._noScript) ? [] :
							d.query("> script[type^='dojo/']", node));
			}
			if(!clsInfo){
				throw new Error("Could not load class '" + type);
			}

			// Setup hash to hold parameter settings for this widget.	Start with the parameter
			// settings inherited from ancestors ("dir" and "lang").
			// Inherited setting may later be overridden by explicit settings on node itself.
			var params = {};
				
			if(args.defaults){
				// settings for the document itself (or whatever subtree is being parsed)
				d._mixin(params, args.defaults);
			}
			if(obj.inherited){
				// settings from dir=rtl or lang=... on a node above this node
				d._mixin(params, obj.inherited);
			}
			
			// mix things found in data-dojo-props into the params
			if(fastpath){
				var extra = node.getAttribute(attrData + "props");
				if(extra && extra.length){
					try{
						extra = d.fromJson.call(args.propsThis, "{" + extra + "}");
						d._mixin(params, extra);
					}catch(e){
						// give the user a pointer to their invalid parameters. FIXME: can we kill this in production?
						throw new Error(e.toString() + " in data-dojo-props='" + extra + "'");
					}
				}

				// For the benefit of _Templated, check if node has data-dojo-attach-point/data-dojo-attach-event
				// and mix those in as though they were parameters
				var attachPoint = node.getAttribute(attrData + "attach-point");
				if(attachPoint){
					params.dojoAttachPoint = attachPoint;
				}
				var attachEvent = node.getAttribute(attrData + "attach-event");
				if(attachEvent){
					params.dojoAttachEvent = attachEvent;
				}
				dojo.mixin(params, mixin);
			}else{
				// FIXME: we need something like "deprecateOnce()" to throw dojo.deprecation for something.
				// remove this logic in 2.0
				// read parameters (ie, attributes) specified on DOMNode

				var attributes = node.attributes;

				// clsInfo.params lists expected params like {"checked": "boolean", "n": "number"}
				for(var name in clsInfo.params){
					var item = name in mixin ? { value:mixin[name], specified:true } : attributes.getNamedItem(name);
					if(!item || (!item.specified && (!dojo.isIE || name.toLowerCase()!="value"))){ continue; }
					var value = item.value;
					// Deal with IE quirks for 'class' and 'style'
					switch(name){
					case "class":
						value = "className" in mixin ? mixin.className : node.className;
						break;
					case "style":
						value = "style" in mixin ? mixin.style : (node.style && node.style.cssText); // FIXME: Opera?
					}
					var _type = clsInfo.params[name];
					if(typeof value == "string"){
						params[name] = str2obj(value, _type);
					}else{
						params[name] = value;
					}
				}
			}

			// Process <script type="dojo/*"> script tags
			// <script type="dojo/method" event="foo"> tags are added to params, and passed to
			// the widget on instantiation.
			// <script type="dojo/method"> tags (with no event) are executed after instantiation
			// <script type="dojo/connect" event="foo"> tags are dojo.connected after instantiation
			// note: dojo/* script tags cannot exist in self closing widgets, like <input />
			var connects = [],	// functions to connect after instantiation
				calls = [];		// functions to call after instantiation

			d.forEach(scripts, function(script){
				node.removeChild(script);
				// FIXME: drop event="" support in 2.0. use data-dojo-event="" instead
				var event = (script.getAttribute(attrData + "event") || script.getAttribute("event")),
					type = script.getAttribute("type"),
					nf = d.parser._functionFromScript(script, attrData);
				if(event){
					if(type == "dojo/connect"){
						connects.push({event: event, func: nf});
					}else{
						params[event] = nf;
					}
				}else{
					calls.push(nf);
				}
			});

			var markupFactory = clazz.markupFactory || clazz.prototype && clazz.prototype.markupFactory;
			// create the instance
			var instance = markupFactory ? markupFactory(params, node, clazz) : new clazz(params, node);
			thelist.push(instance);

			// map it to the JS namespace if that makes sense
			// FIXME: in 2.0, drop jsId support. use data-dojo-id instead
			var jsname = (node.getAttribute(attrData + "id") || node.getAttribute("jsId"));
			if(jsname){
				d.setObject(jsname, instance);
			}

			// process connections and startup functions
			d.forEach(connects, function(connect){
				d.connect(instance, connect.event, null, connect.func);
			});
			d.forEach(calls, function(func){
				func.call(instance);
			});
		});

		// Call startup on each top level instance if it makes sense (as for
		// widgets).  Parent widgets will recursively call startup on their
		// (non-top level) children
		if(!mixin._started){
			// TODO: for 2.0, when old instantiate() API is desupported, store parent-child
			// relationships in the nodes[] array so that no getParent() call is needed.
			// Note that will  require a parse() call from ContentPane setting a param that the
			// ContentPane is the parent widget (so that the parse doesn't call startup() on the
			// ContentPane's children)
			d.forEach(thelist, function(instance){
				if( !args.noStart && instance  &&
					dojo.isFunction(instance.startup) &&
					!instance._started &&
					(!instance.getParent || !instance.getParent())
				){
					instance.startup();
				}
			});
		}
		return thelist;
	};

	this.parse = function(rootNode, args){
		// summary:
		//		Scan the DOM for class instances, and instantiate them.
		//
		// description:
		//		Search specified node (or root node) recursively for class instances,
		//		and instantiate them. Searches for either data-dojo-type="Class" or
		//		dojoType="Class" where "Class" is a a fully qualified class name,
		//		like `dijit.form.Button`
		//
		//		Using `data-dojo-type`:
		//		Attributes using can be mixed into the parameters used to instantitate the
		//		Class by using a `data-dojo-props` attribute on the node being converted.
		//		`data-dojo-props` should be a string attribute to be converted from JSON.
		//
		//		Using `dojoType`:
		//		Attributes are read from the original domNode and converted to appropriate
		//		types by looking up the Class prototype values. This is the default behavior
		//		from Dojo 1.0 to Dojo 1.5. `dojoType` support is deprecated, and will
		//		go away in Dojo 2.0.
		//
		// rootNode: DomNode?
		//		A default starting root node from which to start the parsing. Can be
		//		omitted, defaulting to the entire document. If omitted, the `args`
		//		object can be passed in this place. If the `args` object has a
		//		`rootNode` member, that is used.
		//
		// args: Object
		//		a kwArgs object passed along to instantiate()
		//
		//			* noStart: Boolean?
		//				when set will prevent the parser from calling .startup()
		//				when locating the nodes.
		//			* rootNode: DomNode?
		//				identical to the function's `rootNode` argument, though
		//				allowed to be passed in via this `args object.
		//			* template: Boolean
		//				If true, ignores ContentPane's stopParser flag and parses contents inside of
		//				a ContentPane inside of a template.   This allows dojoAttachPoint on widgets/nodes
		//				nested inside the ContentPane to work.
		//			* inherited: Object
		//				Hash possibly containing dir and lang settings to be applied to
		//				parsed widgets, unless there's another setting on a sub-node that overrides
		//			* scope: String
		//				Root for attribute names to search for.   If scopeName is dojo,
		//				will search for data-dojo-type (or dojoType).   For backwards compatibility
		//				reasons defaults to dojo._scopeName (which is "dojo" except when
		//				multi-version support is used, when it will be something like dojo16, dojo20, etc.)
		//			* propsThis: Object
		//				If specified, "this" referenced from data-dojo-props will refer to propsThis.
		//				Intended for use from the widgets-in-template feature of `dijit._Templated`
		//
		// example:
		//		Parse all widgets on a page:
		//	|		dojo.parser.parse();
		//
		// example:
		//		Parse all classes within the node with id="foo"
		//	|		dojo.parser.parse(dojo.byId('foo'));
		//
		// example:
		//		Parse all classes in a page, but do not call .startup() on any
		//		child
		//	|		dojo.parser.parse({ noStart: true })
		//
		// example:
		//		Parse all classes in a node, but do not call .startup()
		//	|		dojo.parser.parse(someNode, { noStart:true });
		//	|		// or
		//	|		dojo.parser.parse({ noStart:true, rootNode: someNode });

		// determine the root node based on the passed arguments.
		var root;
		if(!args && rootNode && rootNode.rootNode){
			args = rootNode;
			root = args.rootNode;
		}else{
			root = rootNode;
		}
		args = args || {};

		var attrName = (args.scope || d._scopeName) + "Type",		// typically "dojoType"
			attrData = "data-" + (args.scope || d._scopeName) + "-";	// typically "data-dojo-"

		function scan(parent, list){
			// summary:
			//		Parent is an Object representing a DOMNode, with or without a dojoType specified.
			//		Scan parent's children looking for nodes with dojoType specified, storing in list[].
			//		If parent has a dojoType, also collects <script type=dojo/*> children and stores in parent.scripts[].
			// parent: Object
			//		Object representing the parent node, like
			//	|	{
			//	|		node: DomNode,			// scan children of this node
			//	|		inherited: {dir: "rtl"},	// dir/lang setting inherited from above node
			//	|
			//	|		// attributes only set if node has dojoType specified
			//	|		scripts: [],			// empty array, put <script type=dojo/*> in here
			//	|		clsInfo: { cls: dijit.form.Button, ...}
			//	|	}
			// list: DomNode[]
			//		Output array of objects (same format as parent) representing nodes to be turned into widgets

			// Effective dir and lang settings on parent node, either set directly or inherited from grandparent
			var inherited = dojo.clone(parent.inherited);
			dojo.forEach(["dir", "lang"], function(name){
				// TODO: what if this is a widget and dir/lang are declared in data-dojo-props?
				var val = parent.node.getAttribute(name);
				if(val){
					inherited[name] = val;
				}
			});

			// if parent is a widget, then search for <script type=dojo/*> tags and put them in scripts[].
			var scripts = parent.clsInfo && !parent.clsInfo.cls.prototype._noScript ? parent.scripts : null;

			// unless parent is a widget with the stopParser flag set, continue search for dojoType, recursively
			var recurse = (!parent.clsInfo || !parent.clsInfo.cls.prototype.stopParser) || (args && args.template);

			// scan parent's children looking for dojoType and <script type=dojo/*>
			for(var child = parent.node.firstChild; child; child = child.nextSibling){
				if(child.nodeType == 1){
					// FIXME: desupport dojoType in 2.0. use data-dojo-type instead
					var type, html5 = recurse && child.getAttribute(attrData + "type");
					if(html5){
						type = html5;
					}else{
						// fallback to backward compatible mode, using dojoType. remove in 2.0
						type = recurse && child.getAttribute(attrName);
					}
					
					var fastpath = html5 == type;

					if(type){
						// if dojoType/data-dojo-type specified, add to output array of nodes to instantiate
						var params = {
							"type": type,
							fastpath: fastpath,
							clsInfo: getClassInfo(type, fastpath), // note: won't find classes declared via dojo.Declaration
							node: child,
							scripts: [], // <script> nodes that are parent's children
							inherited: inherited // dir & lang attributes inherited from parent
						};
						list.push(params);

						// Recurse, collecting <script type="dojo/..."> children, and also looking for
						// descendant nodes with dojoType specified (unless the widget has the stopParser flag),
						scan(params, list);
					}else if(scripts && child.nodeName.toLowerCase() == "script"){
						// if <script type="dojo/...">, save in scripts[]
						type = child.getAttribute("type");
						if (type && /^dojo\/\w/i.test(type)) {
							scripts.push(child);
						}
					}else if(recurse){
						// Recurse, looking for grandchild nodes with dojoType specified
						scan({
							node: child,
							inherited: inherited
						}, list);
					}
				}
			}
		}

		// Make list of all nodes on page w/dojoType specified
		var list = [];
		scan({
			node: root ? dojo.byId(root) : dojo.body(),
			inherited: (args && args.inherited) || {
				dir: dojo._isBodyLtr() ? "ltr" : "rtl"
			}
		}, list);

		// go build the object instances
		var mixin = args && args.template ? {template: true} : null;
		return this.instantiate(list, mixin, args); // Array
	};
}();

//Register the parser callback. It should be the first callback
//after the a11y test.

(function(){
	var parseRunner = function(){
		if(dojo.config.parseOnLoad){
			dojo.parser.parse();
		}
	};

	// FIXME: need to clobber cross-dependency!!
	if(dojo.getObject("dijit.wai.onload") === dojo._loaders[0]){
		dojo._loaders.splice(1, 0, parseRunner);
	}else{
		dojo._loaders.unshift(parseRunner);
	}
})();

}

if(!dojo._hasResource["dojox.html.entities"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.html.entities"] = true;
dojo.provide("dojox.html.entities");

(function(){
	// dojox.html.entities.html [public] Array
	//		Entity characters for HTML, represented as an array of
	//		character code, entity name (minus & and ; wrapping.
	//		The function wrapper is to fix global leking with the build tools.
	
	var _applyEncodingMap = function(str, map){
		// summary:
		//		Private internal function for performing encoding of entity characters.
		// tags:
		//		private
	
		// Check to see if we have genned and cached a regexp for this map yet
		// If we have, use it, if not, gen it, cache, then use.
		var mapper, regexp;
		if(map._encCache &&
			map._encCache.regexp &&
			map._encCache.mapper &&
			map.length == map._encCache.length){
			mapper = map._encCache.mapper;
			regexp = map._encCache.regexp;
		}else{
			mapper = {};
			regexp = ["["];
			var i;
			for(i = 0; i < map.length; i++){
				mapper[map[i][0]] = "&" + map[i][1] + ";";
				regexp.push(map[i][0]);
			}
			regexp.push("]");
			regexp = new RegExp(regexp.join(""), "g");
			map._encCache = {
				mapper: mapper,
				regexp: regexp,
				length: map.length
			};
		}
		str = str.replace(regexp, function(c){
			return mapper[c];
		});
		return str;
	};
	
	var _applyDecodingMap = function(str, map){
		// summary:
		//		Private internal function for performing decoding of entity characters.
		// tags:
		//		private
		var mapper, regexp;
		if(map._decCache &&
			map._decCache.regexp &&
			map._decCache.mapper &&
			map.length == map._decCache.length){
			mapper = map._decCache.mapper;
			regexp = map._decCache.regexp;
		}else{
			mapper = {};
			regexp = ["("];
			var i;
			for(i = 0; i < map.length; i++){
				var e = "&" + map[i][1] + ";";
				if(i){regexp.push("|");}
				mapper[e] = map[i][0];
				regexp.push(e);
			}
			regexp.push(")");
			regexp = new RegExp(regexp.join(""), "g");
			map._decCache = {
				mapper: mapper,
				regexp: regexp,
				length: map.length
			};
		}
		str = str.replace(regexp, function(c){
			return mapper[c];
		});
		return str;
	};
	
	dojox.html.entities.html = [
		["\u0026","amp"], ["\u0022","quot"],["\u003C","lt"], ["\u003E","gt"],
		["\u00A0","nbsp"]
	];
	
	// dojox.html.entities.latin [public] Array
	//		Entity characters for Latin characters and similar, represented as an array of
	//		character code, entity name (minus & and ; wrapping.
	dojox.html.entities.latin = [
		["\u00A1","iexcl"],["\u00A2","cent"],["\u00A3","pound"],["\u20AC","euro"],
		["\u00A4","curren"],["\u00A5","yen"],["\u00A6","brvbar"],["\u00A7","sect"],
		["\u00A8","uml"],["\u00A9","copy"],["\u00AA","ordf"],["\u00AB","laquo"],
		["\u00AC","not"],["\u00AD","shy"],["\u00AE","reg"],["\u00AF","macr"],
		["\u00B0","deg"],["\u00B1","plusmn"],["\u00B2","sup2"],["\u00B3","sup3"],
		["\u00B4","acute"],["\u00B5","micro"],["\u00B6","para"],["\u00B7","middot"],
		["\u00B8","cedil"],["\u00B9","sup1"],["\u00BA","ordm"],["\u00BB","raquo"],
		["\u00BC","frac14"],["\u00BD","frac12"],["\u00BE","frac34"],["\u00BF","iquest"],
		["\u00C0","Agrave"],["\u00C1","Aacute"],["\u00C2","Acirc"],["\u00C3","Atilde"],
		["\u00C4","Auml"],["\u00C5","Aring"],["\u00C6","AElig"],["\u00C7","Ccedil"],
		["\u00C8","Egrave"],["\u00C9","Eacute"],["\u00CA","Ecirc"],["\u00CB","Euml"],
		["\u00CC","Igrave"],["\u00CD","Iacute"],["\u00CE","Icirc"],["\u00CF","Iuml"],
		["\u00D0","ETH"],["\u00D1","Ntilde"],["\u00D2","Ograve"],["\u00D3","Oacute"],
		["\u00D4","Ocirc"],["\u00D5","Otilde"],["\u00D6","Ouml"],["\u00D7","times"],
		["\u00D8","Oslash"],["\u00D9","Ugrave"],["\u00DA","Uacute"],["\u00DB","Ucirc"],
		["\u00DC","Uuml"],["\u00DD","Yacute"],["\u00DE","THORN"],["\u00DF","szlig"],
		["\u00E0","agrave"],["\u00E1","aacute"],["\u00E2","acirc"],["\u00E3","atilde"],
		["\u00E4","auml"],["\u00E5","aring"],["\u00E6","aelig"],["\u00E7","ccedil"],
		["\u00E8","egrave"],["\u00E9","eacute"],["\u00EA","ecirc"],["\u00EB","euml"],
		["\u00EC","igrave"],["\u00ED","iacute"],["\u00EE","icirc"],["\u00EF","iuml"],
		["\u00F0","eth"],["\u00F1","ntilde"],["\u00F2","ograve"],["\u00F3","oacute"],
		["\u00F4","ocirc"],["\u00F5","otilde"],["\u00F6","ouml"],["\u00F7","divide"],
		["\u00F8","oslash"],["\u00F9","ugrave"],["\u00FA","uacute"],["\u00FB","ucirc"],
		["\u00FC","uuml"],["\u00FD","yacute"],["\u00FE","thorn"],["\u00FF","yuml"],
		["\u0192","fnof"],["\u0391","Alpha"],["\u0392","Beta"],["\u0393","Gamma"],
		["\u0394","Delta"],["\u0395","Epsilon"],["\u0396","Zeta"],["\u0397","Eta"],
		["\u0398","Theta"], ["\u0399","Iota"],["\u039A","Kappa"],["\u039B","Lambda"],
		["\u039C","Mu"],["\u039D","Nu"],["\u039E","Xi"],["\u039F","Omicron"],
		["\u03A0","Pi"],["\u03A1","Rho"],["\u03A3","Sigma"],["\u03A4","Tau"],
		["\u03A5","Upsilon"],["\u03A6","Phi"],["\u03A7","Chi"],["\u03A8","Psi"],
		["\u03A9","Omega"],["\u03B1","alpha"],["\u03B2","beta"],["\u03B3","gamma"],
		["\u03B4","delta"],["\u03B5","epsilon"],["\u03B6","zeta"],["\u03B7","eta"],
		["\u03B8","theta"],["\u03B9","iota"],["\u03BA","kappa"],["\u03BB","lambda"],
		["\u03BC","mu"],["\u03BD","nu"],["\u03BE","xi"],["\u03BF","omicron"],
		["\u03C0","pi"],["\u03C1","rho"],["\u03C2","sigmaf"],["\u03C3","sigma"],
		["\u03C4","tau"],["\u03C5","upsilon"],["\u03C6","phi"],["\u03C7","chi"],
		["\u03C8","psi"],["\u03C9","omega"],["\u03D1","thetasym"],["\u03D2","upsih"],
		["\u03D6","piv"],["\u2022","bull"],["\u2026","hellip"],["\u2032","prime"],
		["\u2033","Prime"],["\u203E","oline"],["\u2044","frasl"],["\u2118","weierp"],
		["\u2111","image"],["\u211C","real"],["\u2122","trade"],["\u2135","alefsym"],
		["\u2190","larr"],["\u2191","uarr"],["\u2192","rarr"],["\u2193","darr"],
		["\u2194","harr"],["\u21B5","crarr"],["\u21D0","lArr"],["\u21D1","uArr"],
		["\u21D2","rArr"],["\u21D3","dArr"],["\u21D4","hArr"],["\u2200","forall"],
		["\u2202","part"],["\u2203","exist"],["\u2205","empty"],["\u2207","nabla"],
		["\u2208","isin"],["\u2209","notin"],["\u220B","ni"],["\u220F","prod"],
		["\u2211","sum"],["\u2212","minus"],["\u2217","lowast"],["\u221A","radic"],
		["\u221D","prop"],["\u221E","infin"],["\u2220","ang"],["\u2227","and"],
		["\u2228","or"],["\u2229","cap"],["\u222A","cup"],["\u222B","int"],
		["\u2234","there4"],["\u223C","sim"],["\u2245","cong"],["\u2248","asymp"],
		["\u2260","ne"],["\u2261","equiv"],["\u2264","le"],["\u2265","ge"],
		["\u2282","sub"],["\u2283","sup"],["\u2284","nsub"],["\u2286","sube"],
		["\u2287","supe"],["\u2295","oplus"],["\u2297","otimes"],["\u22A5","perp"],
		["\u22C5","sdot"],["\u2308","lceil"],["\u2309","rceil"],["\u230A","lfloor"],
		["\u230B","rfloor"],["\u2329","lang"],["\u232A","rang"],["\u25CA","loz"],
		["\u2660","spades"],["\u2663","clubs"],["\u2665","hearts"],["\u2666","diams"],
		["\u0152","Elig"],["\u0153","oelig"],["\u0160","Scaron"],["\u0161","scaron"],
		["\u0178","Yuml"],["\u02C6","circ"],["\u02DC","tilde"],["\u2002","ensp"],
		["\u2003","emsp"],["\u2009","thinsp"],["\u200C","zwnj"],["\u200D","zwj"],
		["\u200E","lrm"],["\u200F","rlm"],["\u2013","ndash"],["\u2014","mdash"],
		["\u2018","lsquo"],["\u2019","rsquo"],["\u201A","sbquo"],["\u201C","ldquo"],
		["\u201D","rdquo"],["\u201E","bdquo"],["\u2020","dagger"],["\u2021","Dagger"],
		["\u2030","permil"],["\u2039","lsaquo"],["\u203A","rsaquo"]
	];
	
	dojox.html.entities.encode = function(str/*string*/, m /*array?*/){
		// summary:
		//		Function to obtain an entity encoding for a specified character
		// str:
		//		The string to process for possible entity encoding.
		// m:
		//		An optional list of character to entity name mappings (array of
		//		arrays).  If not provided, it uses the and Latin entities as the
		//		set to map and escape.
		// tags:
		//		public
		if(str){
			if(!m){
				// Apply the basic mappings.  HTML should always come first when decoding
				// as well.
				str = _applyEncodingMap(str, dojox.html.entities.html);
				str = _applyEncodingMap(str, dojox.html.entities.latin);
	
			}else{
				str = _applyEncodingMap(str, m);
			}
		}
		return str;
	};
	
	dojox.html.entities.decode = function(str/*string*/, m /*array?*/){
		// summary:
		//		Function to obtain an entity encoding for a specified character
		// str:
		//		The string to process for possible entity encoding to decode.
		// m:
		//		An optional list of character to entity name mappings (array of
		//		arrays).  If not provided, it uses the HTML and Latin entities as the
		//		set to map and decode.
		// tags:
		//		public
		if(str){
			if(!m){
				// Apply the basic mappings.  HTML should always come first when decoding
				// as well.
				str = _applyDecodingMap(str, dojox.html.entities.html);
				str = _applyDecodingMap(str, dojox.html.entities.latin);
	
			}else{
				str = _applyDecodingMap(str, m);
			}
		}
		return str;
	};
})();

}

if(!dojo._hasResource["dijit._base.manager"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.manager"] = true;
dojo.provide("dijit._base.manager");


dojo.declare("dijit.WidgetSet", null, {
	// summary:
	//		A set of widgets indexed by id. A default instance of this class is
	//		available as `dijit.registry`
	//
	// example:
	//		Create a small list of widgets:
	//		|	var ws = new dijit.WidgetSet();
	//		|	ws.add(dijit.byId("one"));
	//		| 	ws.add(dijit.byId("two"));
	//		|	// destroy both:
	//		|	ws.forEach(function(w){ w.destroy(); });
	//
	// example:
	//		Using dijit.registry:
	//		|	dijit.registry.forEach(function(w){ /* do something */ });

	constructor: function(){
		this._hash = {};
		this.length = 0;
	},

	add: function(/*dijit._Widget*/ widget){
		// summary:
		//		Add a widget to this list. If a duplicate ID is detected, a error is thrown.
		//
		// widget: dijit._Widget
		//		Any dijit._Widget subclass.
		if(this._hash[widget.id]){
			throw new Error("Tried to register widget with id==" + widget.id + " but that id is already registered");
		}
		this._hash[widget.id] = widget;
		this.length++;
	},

	remove: function(/*String*/ id){
		// summary:
		//		Remove a widget from this WidgetSet. Does not destroy the widget; simply
		//		removes the reference.
		if(this._hash[id]){
			delete this._hash[id];
			this.length--;
		}
	},

	forEach: function(/*Function*/ func, /* Object? */thisObj){
		// summary:
		//		Call specified function for each widget in this set.
		//
		// func:
		//		A callback function to run for each item. Is passed the widget, the index
		//		in the iteration, and the full hash, similar to `dojo.forEach`.
		//
		// thisObj:
		//		An optional scope parameter
		//
		// example:
		//		Using the default `dijit.registry` instance:
		//		|	dijit.registry.forEach(function(widget){
		//		|		console.log(widget.declaredClass);
		//		|	});
		//
		// returns:
		//		Returns self, in order to allow for further chaining.

		thisObj = thisObj || dojo.global;
		var i = 0, id;
		for(id in this._hash){
			func.call(thisObj, this._hash[id], i++, this._hash);
		}
		return this;	// dijit.WidgetSet
	},

	filter: function(/*Function*/ filter, /* Object? */thisObj){
		// summary:
		//		Filter down this WidgetSet to a smaller new WidgetSet
		//		Works the same as `dojo.filter` and `dojo.NodeList.filter`
		//
		// filter:
		//		Callback function to test truthiness. Is passed the widget
		//		reference and the pseudo-index in the object.
		//
		// thisObj: Object?
		//		Option scope to use for the filter function.
		//
		// example:
		//		Arbitrary: select the odd widgets in this list
		//		|	dijit.registry.filter(function(w, i){
		//		|		return i % 2 == 0;
		//		|	}).forEach(function(w){ /* odd ones */ });

		thisObj = thisObj || dojo.global;
		var res = new dijit.WidgetSet(), i = 0, id;
		for(id in this._hash){
			var w = this._hash[id];
			if(filter.call(thisObj, w, i++, this._hash)){
				res.add(w);
			}
		}
		return res; // dijit.WidgetSet
	},

	byId: function(/*String*/ id){
		// summary:
		//		Find a widget in this list by it's id.
		// example:
		//		Test if an id is in a particular WidgetSet
		//		| var ws = new dijit.WidgetSet();
		//		| ws.add(dijit.byId("bar"));
		//		| var t = ws.byId("bar") // returns a widget
		//		| var x = ws.byId("foo"); // returns undefined

		return this._hash[id];	// dijit._Widget
	},

	byClass: function(/*String*/ cls){
		// summary:
		//		Reduce this widgetset to a new WidgetSet of a particular `declaredClass`
		//
		// cls: String
		//		The Class to scan for. Full dot-notated string.
		//
		// example:
		//		Find all `dijit.TitlePane`s in a page:
		//		|	dijit.registry.byClass("dijit.TitlePane").forEach(function(tp){ tp.close(); });

		var res = new dijit.WidgetSet(), id, widget;
		for(id in this._hash){
			widget = this._hash[id];
			if(widget.declaredClass == cls){
				res.add(widget);
			}
		 }
		 return res; // dijit.WidgetSet
},

	toArray: function(){
		// summary:
		//		Convert this WidgetSet into a true Array
		//
		// example:
		//		Work with the widget .domNodes in a real Array
		//		|	dojo.map(dijit.registry.toArray(), function(w){ return w.domNode; });

		var ar = [];
		for(var id in this._hash){
			ar.push(this._hash[id]);
		}
		return ar;	// dijit._Widget[]
},

	map: function(/* Function */func, /* Object? */thisObj){
		// summary:
		//		Create a new Array from this WidgetSet, following the same rules as `dojo.map`
		// example:
		//		|	var nodes = dijit.registry.map(function(w){ return w.domNode; });
		//
		// returns:
		//		A new array of the returned values.
		return dojo.map(this.toArray(), func, thisObj); // Array
	},

	every: function(func, thisObj){
		// summary:
		// 		A synthetic clone of `dojo.every` acting explicitly on this WidgetSet
		//
		// func: Function
		//		A callback function run for every widget in this list. Exits loop
		//		when the first false return is encountered.
		//
		// thisObj: Object?
		//		Optional scope parameter to use for the callback

		thisObj = thisObj || dojo.global;
		var x = 0, i;
		for(i in this._hash){
			if(!func.call(thisObj, this._hash[i], x++, this._hash)){
				return false; // Boolean
			}
		}
		return true; // Boolean
	},

	some: function(func, thisObj){
		// summary:
		// 		A synthetic clone of `dojo.some` acting explictly on this WidgetSet
		//
		// func: Function
		//		A callback function run for every widget in this list. Exits loop
		//		when the first true return is encountered.
		//
		// thisObj: Object?
		//		Optional scope parameter to use for the callback

		thisObj = thisObj || dojo.global;
		var x = 0, i;
		for(i in this._hash){
			if(func.call(thisObj, this._hash[i], x++, this._hash)){
				return true; // Boolean
			}
		}
		return false; // Boolean
	}

});

(function(){

	/*=====
	dijit.registry = {
		// summary:
		//		A list of widgets on a page.
		// description:
		//		Is an instance of `dijit.WidgetSet`
	};
	=====*/
	dijit.registry = new dijit.WidgetSet();

	var hash = dijit.registry._hash,
		attr = dojo.attr,
		hasAttr = dojo.hasAttr,
		style = dojo.style;

	dijit.byId = function(/*String|dijit._Widget*/ id){
		// summary:
		//		Returns a widget by it's id, or if passed a widget, no-op (like dojo.byId())
		return typeof id == "string" ? hash[id] : id; // dijit._Widget
	};

	var _widgetTypeCtr = {};
	dijit.getUniqueId = function(/*String*/widgetType){
		// summary:
		//		Generates a unique id for a given widgetType
	
		var id;
		do{
			id = widgetType + "_" +
				(widgetType in _widgetTypeCtr ?
					++_widgetTypeCtr[widgetType] : _widgetTypeCtr[widgetType] = 0);
		}while(hash[id]);
		return dijit._scopeName == "dijit" ? id : dijit._scopeName + "_" + id; // String
	};
	
	dijit.findWidgets = function(/*DomNode*/ root){
		// summary:
		//		Search subtree under root returning widgets found.
		//		Doesn't search for nested widgets (ie, widgets inside other widgets).
	
		var outAry = [];
	
		function getChildrenHelper(root){
			for(var node = root.firstChild; node; node = node.nextSibling){
				if(node.nodeType == 1){
					var widgetId = node.getAttribute("widgetId");
					if(widgetId){
						var widget = hash[widgetId];
						if(widget){	// may be null on page w/multiple dojo's loaded
							outAry.push(widget);
						}
					}else{
						getChildrenHelper(node);
					}
				}
			}
		}
	
		getChildrenHelper(root);
		return outAry;
	};
	
	dijit._destroyAll = function(){
		// summary:
		//		Code to destroy all widgets and do other cleanup on page unload
	
		// Clean up focus manager lingering references to widgets and nodes
		dijit._curFocus = null;
		dijit._prevFocus = null;
		dijit._activeStack = [];
	
		// Destroy all the widgets, top down
		dojo.forEach(dijit.findWidgets(dojo.body()), function(widget){
			// Avoid double destroy of widgets like Menu that are attached to <body>
			// even though they are logically children of other widgets.
			if(!widget._destroyed){
				if(widget.destroyRecursive){
					widget.destroyRecursive();
				}else if(widget.destroy){
					widget.destroy();
				}
			}
		});
	};
	
	if(dojo.isIE){
		// Only run _destroyAll() for IE because we think it's only necessary in that case,
		// and because it causes problems on FF.  See bug #3531 for details.
		dojo.addOnWindowUnload(function(){
			dijit._destroyAll();
		});
	}
	
	dijit.byNode = function(/*DOMNode*/ node){
		// summary:
		//		Returns the widget corresponding to the given DOMNode
		return hash[node.getAttribute("widgetId")]; // dijit._Widget
	};
	
	dijit.getEnclosingWidget = function(/*DOMNode*/ node){
		// summary:
		//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
		//		the node is not contained within the DOM tree of any widget
		while(node){
			var id = node.getAttribute && node.getAttribute("widgetId");
			if(id){
				return hash[id];
			}
			node = node.parentNode;
		}
		return null;
	};

	var shown = (dijit._isElementShown = function(/*Element*/ elem){
		var s = style(elem);
		return (s.visibility != "hidden")
			&& (s.visibility != "collapsed")
			&& (s.display != "none")
			&& (attr(elem, "type") != "hidden");
	});
	
	dijit.hasDefaultTabStop = function(/*Element*/ elem){
		// summary:
		//		Tests if element is tab-navigable even without an explicit tabIndex setting
	
		// No explicit tabIndex setting, need to investigate node type
		switch(elem.nodeName.toLowerCase()){
			case "a":
				// An <a> w/out a tabindex is only navigable if it has an href
				return hasAttr(elem, "href");
			case "area":
			case "button":
			case "input":
			case "object":
			case "select":
			case "textarea":
				// These are navigable by default
				return true;
			case "iframe":
				// If it's an editor <iframe> then it's tab navigable.
				var body;
				try{
					// non-IE
					var contentDocument = elem.contentDocument;
					if("designMode" in contentDocument && contentDocument.designMode == "on"){
						return true;
					}
					body = contentDocument.body;
				}catch(e1){
					// contentWindow.document isn't accessible within IE7/8
					// if the iframe.src points to a foreign url and this
					// page contains an element, that could get focus
					try{
						body = elem.contentWindow.document.body;
					}catch(e2){
						return false;
					}
				}
				return body.contentEditable == 'true' || (body.firstChild && body.firstChild.contentEditable == 'true');
			default:
				return elem.contentEditable == 'true';
		}
	};
	
	var isTabNavigable = (dijit.isTabNavigable = function(/*Element*/ elem){
		// summary:
		//		Tests if an element is tab-navigable
	
		// TODO: convert (and rename method) to return effective tabIndex; will save time in _getTabNavigable()
		if(attr(elem, "disabled")){
			return false;
		}else if(hasAttr(elem, "tabIndex")){
			// Explicit tab index setting
			return attr(elem, "tabIndex") >= 0; // boolean
		}else{
			// No explicit tabIndex setting, so depends on node type
			return dijit.hasDefaultTabStop(elem);
		}
	});

	dijit._getTabNavigable = function(/*DOMNode*/ root){
		// summary:
		//		Finds descendants of the specified root node.
		//
		// description:
		//		Finds the following descendants of the specified root node:
		//		* the first tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the last tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the first element in document order with the lowest
		//		  positive tabIndex value
		//		* the last element in document order with the highest
		//		  positive tabIndex value
		var first, last, lowest, lowestTabindex, highest, highestTabindex, radioSelected = {};
		function radioName(node) {
			// If this element is part of a radio button group, return the name for that group.
			return node && node.tagName.toLowerCase() == "input" &&
				node.type && node.type.toLowerCase() == "radio" &&
				node.name && node.name.toLowerCase();
		}
		var walkTree = function(/*DOMNode*/parent){
			dojo.query("> *", parent).forEach(function(child){
				// Skip hidden elements, and also non-HTML elements (those in custom namespaces) in IE,
				// since show() invokes getAttribute("type"), which crash on VML nodes in IE.
				if((dojo.isIE && child.scopeName!=="HTML") || !shown(child)){
					return;
				}

				if(isTabNavigable(child)){
					var tabindex = attr(child, "tabIndex");
					if(!hasAttr(child, "tabIndex") || tabindex == 0){
						if(!first){ first = child; }
						last = child;
					}else if(tabindex > 0){
						if(!lowest || tabindex < lowestTabindex){
							lowestTabindex = tabindex;
							lowest = child;
						}
						if(!highest || tabindex >= highestTabindex){
							highestTabindex = tabindex;
							highest = child;
						}
					}
					var rn = radioName(child);
					if(dojo.attr(child, "checked") && rn) {
						radioSelected[rn] = child;
					}
				}
				if(child.nodeName.toUpperCase() != 'SELECT'){
					walkTree(child);
				}
			});
		};
		if(shown(root)){ walkTree(root) }
		function rs(node) {
			// substitute checked radio button for unchecked one, if there is a checked one with the same name.
			return radioSelected[radioName(node)] || node;
		}
		return { first: rs(first), last: rs(last), lowest: rs(lowest), highest: rs(highest) };
	}
	dijit.getFirstInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is first in the tabbing order
		var elems = dijit._getTabNavigable(dojo.byId(root));
		return elems.lowest ? elems.lowest : elems.first; // DomNode
	};
	
	dijit.getLastInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is last in the tabbing order
		var elems = dijit._getTabNavigable(dojo.byId(root));
		return elems.last ? elems.last : elems.highest; // DomNode
	};
	
	/*=====
	dojo.mixin(dijit, {
		// defaultDuration: Integer
		//		The default animation speed (in ms) to use for all Dijit
		//		transitional animations, unless otherwise specified
		//		on a per-instance basis. Defaults to 200, overrided by
		//		`djConfig.defaultDuration`
		defaultDuration: 200
	});
	=====*/
	
	dijit.defaultDuration = dojo.config["defaultDuration"] || 200;

})();

}

if(!dojo._hasResource["dojo.Stateful"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.Stateful"] = true;
dojo.provide("dojo.Stateful");


dojo.declare("dojo.Stateful", null, {
	// summary:
	//		Base class for objects that provide named properties with optional getter/setter
	//		control and the ability to watch for property changes
	// example:
	//	|	var obj = new dojo.Stateful();
	//	|	obj.watch("foo", function(){
	//	|		console.log("foo changed to " + this.get("foo"));
	//	|	});
	//	|	obj.set("foo","bar");
	postscript: function(mixin){
		if(mixin){
			dojo.mixin(this, mixin);
		}
	},
	
	get: function(/*String*/name){
		// summary:
		//		Get a property on a Stateful instance.
		//	name:
		//		The property to get.
		// description:
		//		Get a named property on a Stateful object. The property may
		//		potentially be retrieved via a getter method in subclasses. In the base class
		// 		this just retrieves the object's property.
		// 		For example:
		//	|	stateful = new dojo.Stateful({foo: 3});
		//	|	stateful.get("foo") // returns 3
		//	|	stateful.foo // returns 3
		
		return this[name];
	},
	set: function(/*String*/name, /*Object*/value){
		// summary:
		//		Set a property on a Stateful instance
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		// description:
		//		Sets named properties on a stateful object and notifies any watchers of
		// 		the property. A programmatic setter may be defined in subclasses.
		// 		For example:
		//	|	stateful = new dojo.Stateful();
		//	|	stateful.watch(function(name, oldValue, value){
		//	|		// this will be called on the set below
		//	|	}
		//	|	stateful.set(foo, 5);
		//
		//	set() may also be called with a hash of name/value pairs, ex:
		//	|	myObj.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	})
		//	This is equivalent to calling set(foo, "Howdy") and set(bar, 3)
		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks){
			this._watchCallbacks(name, oldValue, value);
		}
		return this;
	},
	watch: function(/*String?*/name, /*Function*/callback){
		// summary:
		//		Watches a property for changes
		//	name:
		//		Indicates the property to watch. This is optional (the callback may be the
		// 		only parameter), and if omitted, all the properties will be watched
		// returns:
		//		An object handle for the watch. The unwatch method of this object
		// 		can be used to discontinue watching this property:
		//		|	var watchHandle = obj.watch("foo", callback);
		//		|	watchHandle.unwatch(); // callback won't be called now
		//	callback:
		//		The function to execute when the property changes. This will be called after
		//		the property has been changed. The callback will be called with the |this|
		//		set to the instance, the first argument as the name of the property, the
		// 		second argument as the old value and the third argument as the new value.
		
		var callbacks = this._watchCallbacks;
		if(!callbacks){
			var self = this;
			callbacks = this._watchCallbacks = function(name, oldValue, value, ignoreCatchall){
				var notify = function(propertyCallbacks){
					if(propertyCallbacks){
                        propertyCallbacks = propertyCallbacks.slice();
						for(var i = 0, l = propertyCallbacks.length; i < l; i++){
							try{
								propertyCallbacks[i].call(self, name, oldValue, value);
							}catch(e){
								console.error(e);
							}
						}
					}
				};
				notify(callbacks['_' + name]);
				if(!ignoreCatchall){
					notify(callbacks["*"]); // the catch-all
				}
			}; // we use a function instead of an object so it will be ignored by JSON conversion
		}
		if(!callback && typeof name === "function"){
			callback = name;
			name = "*";
		}else{
			// prepend with dash to prevent name conflicts with function (like "name" property)
			name = '_' + name;
		}
		var propertyCallbacks = callbacks[name];
		if(typeof propertyCallbacks !== "object"){
			propertyCallbacks = callbacks[name] = [];
		}
		propertyCallbacks.push(callback);
		return {
			unwatch: function(){
				propertyCallbacks.splice(dojo.indexOf(propertyCallbacks, callback), 1);
			}
		};
	}
	
});

}

if(!dojo._hasResource["dijit._WidgetBase"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._WidgetBase"] = true;
dojo.provide("dijit._WidgetBase");




(function(){

dojo.declare("dijit._WidgetBase", dojo.Stateful, {
	// summary:
	//		Future base class for all Dijit widgets.
	//		_Widget extends this class adding support for various features needed by desktop.

	// id: [const] String
	//		A unique, opaque ID string that can be assigned by users or by the
	//		system. If the developer passes an ID which is known not to be
	//		unique, the specified ID is ignored and the system-generated ID is
	//		used instead.
	id: "",

	// lang: [const] String
	//		Rarely used.  Overrides the default Dojo locale used to render this widget,
	//		as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
	//		Value must be among the list of locales specified during by the Dojo bootstrap,
	//		formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
	lang: "",

	// dir: [const] String
	//		Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
	//		attribute. Either left-to-right "ltr" or right-to-left "rtl".  If undefined, widgets renders in page's
	//		default direction.
	dir: "",

	// class: String
	//		HTML class attribute
	"class": "",

	// style: String||Object
	//		HTML style attributes as cssText string or name/value hash
	style: "",

	// title: String
	//		HTML title attribute.
	//
	//		For form widgets this specifies a tooltip to display when hovering over
	//		the widget (just like the native HTML title attribute).
	//
	//		For TitlePane or for when this widget is a child of a TabContainer, AccordionContainer,
	//		etc., it's used to specify the tab label, accordion pane title, etc.
	title: "",

	// tooltip: String
	//		When this widget's title attribute is used to for a tab label, accordion pane title, etc.,
	//		this specifies the tooltip to appear when the mouse is hovered over that text.
	tooltip: "",

	// baseClass: [protected] String
	//		Root CSS class of the widget (ex: dijitTextBox), used to construct CSS classes to indicate
	//		widget state.
	baseClass: "",

	// srcNodeRef: [readonly] DomNode
	//		pointer to original DOM node
	srcNodeRef: null,

	// domNode: [readonly] DomNode
	//		This is our visible representation of the widget! Other DOM
	//		Nodes may by assigned to other properties, usually through the
	//		template system's dojoAttachPoint syntax, but the domNode
	//		property is the canonical "top level" node in widget UI.
	domNode: null,

	// containerNode: [readonly] DomNode
	//		Designates where children of the source DOM node will be placed.
	//		"Children" in this case refers to both DOM nodes and widgets.
	//		For example, for myWidget:
	//
	//		|	<div dojoType=myWidget>
	//		|		<b> here's a plain DOM node
	//		|		<span dojoType=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//		|	</div>
	//
	//		containerNode would point to:
	//
	//		|		<b> here's a plain DOM node
	//		|		<span dojoType=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//
	//		In templated widgets, "containerNode" is set via a
	//		dojoAttachPoint assignment.
	//
	//		containerNode must be defined for any widget that accepts innerHTML
	//		(like ContentPane or BorderContainer or even Button), and conversely
	//		is null for widgets that don't, like TextBox.
	containerNode: null,

/*=====
	// _started: Boolean
	//		startup() has completed.
	_started: false,
=====*/

	// attributeMap: [protected] Object
	//		attributeMap sets up a "binding" between attributes (aka properties)
	//		of the widget and the widget's DOM.
	//		Changes to widget attributes listed in attributeMap will be
	//		reflected into the DOM.
	//
	//		For example, calling set('title', 'hello')
	//		on a TitlePane will automatically cause the TitlePane's DOM to update
	//		with the new title.
	//
	//		attributeMap is a hash where the key is an attribute of the widget,
	//		and the value reflects a binding to a:
	//
	//		- DOM node attribute
	// |		focus: {node: "focusNode", type: "attribute"}
	// 		Maps this.focus to this.focusNode.focus
	//
	//		- DOM node innerHTML
	//	|		title: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node innerText
	//	|		title: { node: "titleNode", type: "innerText" }
	//		Maps this.title to this.titleNode.innerText
	//
	//		- DOM node CSS class
	// |		myClass: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		There are also some shorthands for backwards compatibility:
	//		- string --> { node: string, type: "attribute" }, for example:
	//	|	"focusNode" ---> { node: "focusNode", type: "attribute" }
	//		- "" --> { node: "domNode", type: "attribute" }
	attributeMap: {id:"", dir:"", lang:"", "class":"", style:"", title:""},

	// _blankGif: [protected] String
	//		Path to a blank 1x1 image.
	//		Used by <img> nodes in templates that really get their image via CSS background-image.
	_blankGif: (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")).toString(),

	//////////// INITIALIZATION METHODS ///////////////////////////////////////

	postscript: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
		// summary:
		//		Kicks off widget instantiation.  See create() for details.
		// tags:
		//		private
		this.create(params, srcNodeRef);
	},

	create: function(/*Object?*/params, /*DomNode|String?*/srcNodeRef){
		// summary:
		//		Kick off the life-cycle of a widget
		// params:
		//		Hash of initialization parameters for widget, including
		//		scalar values (like title, duration etc.) and functions,
		//		typically callbacks like onClick.
		// srcNodeRef:
		//		If a srcNodeRef (DOM node) is specified:
		//			- use srcNodeRef.innerHTML as my contents
		//			- if this is a behavioral widget then apply behavior
		//			  to that srcNodeRef
		//			- otherwise, replace srcNodeRef with my generated DOM
		//			  tree
		// description:
		//		Create calls a number of widget methods (postMixInProperties, buildRendering, postCreate,
		//		etc.), some of which of you'll want to override. See http://docs.dojocampus.org/dijit/_Widget
		//		for a discussion of the widget creation lifecycle.
		//
		//		Of course, adventurous developers could override create entirely, but this should
		//		only be done as a last resort.
		// tags:
		//		private

		// store pointer to original DOM tree
		this.srcNodeRef = dojo.byId(srcNodeRef);

		// For garbage collection.  An array of handles returned by Widget.connect()
		// Each handle returned from Widget.connect() is an array of handles from dojo.connect()
		this._connects = [];

		// For garbage collection.  An array of handles returned by Widget.subscribe()
		// The handle returned from Widget.subscribe() is the handle returned from dojo.subscribe()
		this._subscribes = [];

		// mix in our passed parameters
		if(this.srcNodeRef && (typeof this.srcNodeRef.id == "string")){ this.id = this.srcNodeRef.id; }
		if(params){
			this.params = params;
			dojo._mixin(this, params);
		}
		this.postMixInProperties();

		// generate an id for the widget if one wasn't specified
		// (be sure to do this before buildRendering() because that function might
		// expect the id to be there.)
		if(!this.id){
			this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		}
		dijit.registry.add(this);

		this.buildRendering();

		if(this.domNode){
			// Copy attributes listed in attributeMap into the [newly created] DOM for the widget.
			// Also calls custom setters for all attributes with custom setters.
			this._applyAttributes();

			// If srcNodeRef was specified, then swap out original srcNode for this widget's DOM tree.
			// For 2.0, move this after postCreate().  postCreate() shouldn't depend on the
			// widget being attached to the DOM since it isn't when a widget is created programmatically like
			// new MyWidget({}).   See #11635.
			var source = this.srcNodeRef;
			if(source && source.parentNode && this.domNode !== source){
				source.parentNode.replaceChild(this.domNode, source);
			}
		}

		if(this.domNode){
			// Note: for 2.0 may want to rename widgetId to dojo._scopeName + "_widgetId",
			// assuming that dojo._scopeName even exists in 2.0
			this.domNode.setAttribute("widgetId", this.id);
		}
		this.postCreate();

		// If srcNodeRef has been processed and removed from the DOM (e.g. TemplatedWidget) then delete it to allow GC.
		if(this.srcNodeRef && !this.srcNodeRef.parentNode){
			delete this.srcNodeRef;
		}

		this._created = true;
	},

	_applyAttributes: function(){
		// summary:
		//		Step during widget creation to copy all widget attributes to the
		//		DOM as per attributeMap and _setXXXAttr functions.
		// description:
		//		Skips over blank/false attribute values, unless they were explicitly specified
		//		as parameters to the widget, since those are the default anyway,
		//		and setting tabIndex="" is different than not setting tabIndex at all.
		//
		//		It processes the attributes in the attribute map first, and then
		//		it goes through and processes the attributes for the _setXXXAttr
		//		functions that have been specified
		// tags:
		//		private
		var condAttrApply = function(attr, scope){
			if((scope.params && attr in scope.params) || scope[attr]){
				scope.set(attr, scope[attr]);
			}
		};

		// Do the attributes in attributeMap
		for(var attr in this.attributeMap){
			condAttrApply(attr, this);
		}

		// And also any attributes with custom setters
		dojo.forEach(this._getSetterAttributes(), function(a){
			if(!(a in this.attributeMap)){
				condAttrApply(a, this);
			}
		}, this);
	},

	_getSetterAttributes: function(){
		// summary:
		//		Returns list of attributes with custom setters for this widget
		var ctor = this.constructor;
		if(!ctor._setterAttrs){
			var r = (ctor._setterAttrs = []),
				attrs,
				proto = ctor.prototype;
			for(var fxName in proto){
				if(dojo.isFunction(proto[fxName]) && (attrs = fxName.match(/^_set([a-zA-Z]*)Attr$/)) && attrs[1]){
					r.push(attrs[1].charAt(0).toLowerCase() + attrs[1].substr(1));
				}
			}
		}
		return ctor._setterAttrs;	// String[]
	},

	postMixInProperties: function(){
		// summary:
		//		Called after the parameters to the widget have been read-in,
		//		but before the widget template is instantiated. Especially
		//		useful to set properties that are referenced in the widget
		//		template.
		// tags:
		//		protected
	},

	buildRendering: function(){
		// summary:
		//		Construct the UI for this widget, setting this.domNode
		// description:
		//		Most widgets will mixin `dijit._Templated`, which implements this
		//		method.
		// tags:
		//		protected

		if(!this.domNode){
			// Create root node if it wasn't created by _Templated
			this.domNode = this.srcNodeRef || dojo.create('div');
		}

		// baseClass is a single class name or occasionally a space-separated list of names.
		// Add those classes to the DOMNode.  If RTL mode then also add with Rtl suffix.
		// TODO: make baseClass custom setter
		if(this.baseClass){
			var classes = this.baseClass.split(" ");
			if(!this.isLeftToRight()){
				classes = classes.concat( dojo.map(classes, function(name){ return name+"Rtl"; }));
			}
			dojo.addClass(this.domNode, classes);
		}
	},

	postCreate: function(){
		// summary:
		//		Processing after the DOM fragment is created
		// description:
		//		Called after the DOM fragment has been created, but not necessarily
		//		added to the document.  Do not include any operations which rely on
		//		node dimensions or placement.
		// tags:
		//		protected
	},

	startup: function(){
		// summary:
		//		Processing after the DOM fragment is added to the document
		// description:
		//		Called after a widget and its children have been created and added to the page,
		//		and all related widgets have finished their create() cycle, up through postCreate().
		//		This is useful for composite widgets that need to control or layout sub-widgets.
		//		Many layout widgets can use this as a wiring phase.
		this._started = true;
	},

	//////////// DESTROY FUNCTIONS ////////////////////////////////

	destroyRecursive: function(/*Boolean?*/ preserveDom){
		// summary:
		// 		Destroy this widget and its descendants
		// description:
		//		This is the generic "destructor" function that all widget users
		// 		should call to cleanly discard with a widget. Once a widget is
		// 		destroyed, it is removed from the manager object.
		// preserveDom:
		//		If true, this method will leave the original DOM structure
		//		alone of descendant Widgets. Note: This will NOT work with
		//		dijit._Templated widgets.

		this._beingDestroyed = true;
		this.destroyDescendants(preserveDom);
		this.destroy(preserveDom);
	},

	destroy: function(/*Boolean*/ preserveDom){
		// summary:
		// 		Destroy this widget, but not its descendants.
		//		This method will, however, destroy internal widgets such as those used within a template.
		// preserveDom: Boolean
		//		If true, this method will leave the original DOM structure alone.
		//		Note: This will not yet work with _Templated widgets

		this._beingDestroyed = true;
		this.uninitialize();
		var d = dojo,
			dfe = d.forEach,
			dun = d.unsubscribe;
		dfe(this._connects, function(array){
			dfe(array, d.disconnect);
		});
		dfe(this._subscribes, function(handle){
			dun(handle);
		});

		// destroy widgets created as part of template, etc.
		dfe(this._supportingWidgets || [], function(w){
			if(w.destroyRecursive){
				w.destroyRecursive();
			}else if(w.destroy){
				w.destroy();
			}
		});

		this.destroyRendering(preserveDom);
		dijit.registry.remove(this.id);
		this._destroyed = true;
	},

	destroyRendering: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Destroys the DOM nodes associated with this widget
		// preserveDom:
		//		If true, this method will leave the original DOM structure alone
		//		during tear-down. Note: this will not work with _Templated
		//		widgets yet.
		// tags:
		//		protected

		if(this.bgIframe){
			this.bgIframe.destroy(preserveDom);
			delete this.bgIframe;
		}

		if(this.domNode){
			if(preserveDom){
				dojo.removeAttr(this.domNode, "widgetId");
			}else{
				dojo.destroy(this.domNode);
			}
			delete this.domNode;
		}

		if(this.srcNodeRef){
			if(!preserveDom){
				dojo.destroy(this.srcNodeRef);
			}
			delete this.srcNodeRef;
		}
	},

	destroyDescendants: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Recursively destroy the children of this widget and their
		//		descendants.
		// preserveDom:
		//		If true, the preserveDom attribute is passed to all descendant
		//		widget's .destroy() method. Not for use with _Templated
		//		widgets.

		// get all direct descendants and destroy them recursively
		dojo.forEach(this.getChildren(), function(widget){
			if(widget.destroyRecursive){
				widget.destroyRecursive(preserveDom);
			}
		});
	},

	uninitialize: function(){
		// summary:
		//		Stub function. Override to implement custom widget tear-down
		//		behavior.
		// tags:
		//		protected
		return false;
	},

	////////////////// GET/SET, CUSTOM SETTERS, ETC. ///////////////////

	_setClassAttr: function(/*String*/ value){
		// summary:
		//		Custom setter for the CSS "class" attribute
		// tags:
		//		protected
		var mapNode = this[this.attributeMap["class"] || 'domNode'];
		dojo.replaceClass(mapNode, value, this["class"]);
		this._set("class", value);
	},

	_setStyleAttr: function(/*String||Object*/ value){
		// summary:
		//		Sets the style attribute of the widget according to value,
		//		which is either a hash like {height: "5px", width: "3px"}
		//		or a plain string
		// description:
		//		Determines which node to set the style on based on style setting
		//		in attributeMap.
		// tags:
		//		protected

		var mapNode = this[this.attributeMap.style || 'domNode'];

		// Note: technically we should revert any style setting made in a previous call
		// to his method, but that's difficult to keep track of.

		if(dojo.isObject(value)){
			dojo.style(mapNode, value);
		}else{
			if(mapNode.style.cssText){
				mapNode.style.cssText += "; " + value;
			}else{
				mapNode.style.cssText = value;
			}
		}

		this._set("style", value);
	},

	_attrToDom: function(/*String*/ attr, /*String*/ value){
		// summary:
		//		Reflect a widget attribute (title, tabIndex, duration etc.) to
		//		the widget DOM, as specified in attributeMap.
		//		Note some attributes like "type"
		//		cannot be processed this way as they are not mutable.
		//
		// tags:
		//		private

		var commands = this.attributeMap[attr];
		dojo.forEach(dojo.isArray(commands) ? commands : [commands], function(command){

			// Get target node and what we are doing to that node
			var mapNode = this[command.node || command || "domNode"];	// DOM node
			var type = command.type || "attribute";	// class, innerHTML, innerText, or attribute

			switch(type){
				case "attribute":
					if(dojo.isFunction(value)){ // functions execute in the context of the widget
						value = dojo.hitch(this, value);
					}

					// Get the name of the DOM node attribute; usually it's the same
					// as the name of the attribute in the widget (attr), but can be overridden.
					// Also maps handler names to lowercase, like onSubmit --> onsubmit
					var attrName = command.attribute ? command.attribute :
						(/^on[A-Z][a-zA-Z]*$/.test(attr) ? attr.toLowerCase() : attr);

					dojo.attr(mapNode, attrName, value);
					break;
				case "innerText":
					mapNode.innerHTML = "";
					mapNode.appendChild(dojo.doc.createTextNode(value));
					break;
				case "innerHTML":
					mapNode.innerHTML = value;
					break;
				case "class":
					dojo.replaceClass(mapNode, value, this[attr]);
					break;
			}
		}, this);
	},

	get: function(name){
		// summary:
		//		Get a property from a widget.
		//	name:
		//		The property to get.
		// description:
		//		Get a named property from a widget. The property may
		//		potentially be retrieved via a getter method. If no getter is defined, this
		// 		just retrieves the object's property.
		// 		For example, if the widget has a properties "foo"
		//		and "bar" and a method named "_getFooAttr", calling:
		//	|	myWidget.get("foo");
		//		would be equivalent to writing:
		//	|	widget._getFooAttr();
		//		and:
		//	|	myWidget.get("bar");
		//		would be equivalent to writing:
		//	|	widget.bar;
		var names = this._getAttrNames(name);
		return this[names.g] ? this[names.g]() : this[name];
	},
	
	set: function(name, value){
		// summary:
		//		Set a property on a widget
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		// description:
		//		Sets named properties on a widget which may potentially be handled by a
		// 		setter in the widget.
		// 		For example, if the widget has a properties "foo"
		//		and "bar" and a method named "_setFooAttr", calling:
		//	|	myWidget.set("foo", "Howdy!");
		//		would be equivalent to writing:
		//	|	widget._setFooAttr("Howdy!");
		//		and:
		//	|	myWidget.set("bar", 3);
		//		would be equivalent to writing:
		//	|	widget.bar = 3;
		//
		//	set() may also be called with a hash of name/value pairs, ex:
		//	|	myWidget.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	})
		//	This is equivalent to calling set(foo, "Howdy") and set(bar, 3)

		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var names = this._getAttrNames(name);
		if(this[names.s]){
			// use the explicit setter
			var result = this[names.s].apply(this, Array.prototype.slice.call(arguments, 1));
		}else{
			// if param is specified as DOM node attribute, copy it
			if(name in this.attributeMap){
				this._attrToDom(name, value);
			}
			this._set(name, value);
		}
		return result || this;
	},
	
	_attrPairNames: {},		// shared between all widgets
	_getAttrNames: function(name){
		// summary:
		//		Helper function for get() and set().
		//		Caches attribute name values so we don't do the string ops every time.
		// tags:
		//		private

		var apn = this._attrPairNames;
		if(apn[name]){ return apn[name]; }
		var uc = name.charAt(0).toUpperCase() + name.substr(1);
		return (apn[name] = {
			n: name+"Node",
			s: "_set"+uc+"Attr",
			g: "_get"+uc+"Attr"
		});
	},

	_set: function(/*String*/ name, /*anything*/ value){
		// summary:
		//		Helper function to set new value for specified attribute, and call handlers
		//		registered with watch() if the value has changed.
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks && this._created && value !== oldValue){
			this._watchCallbacks(name, oldValue, value);
		}
	},

	toString: function(){
		// summary:
		//		Returns a string that represents the widget
		// description:
		//		When a widget is cast to a string, this method will be used to generate the
		//		output. Currently, it does not implement any sort of reversible
		//		serialization.
		return '[Widget ' + this.declaredClass + ', ' + (this.id || 'NO ID') + ']'; // String
	},

	getDescendants: function(){
		// summary:
		//		Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
		//		This method should generally be avoided as it returns widgets declared in templates, which are
		//		supposed to be internal/hidden, but it's left here for back-compat reasons.

		return this.containerNode ? dojo.query('[widgetId]', this.containerNode).map(dijit.byNode) : []; // dijit._Widget[]
	},

	getChildren: function(){
		// summary:
		//		Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
		//		Does not return nested widgets, nor widgets that are part of this widget's template.
		return this.containerNode ? dijit.findWidgets(this.containerNode) : []; // dijit._Widget[]
	},

	connect: function(
			/*Object|null*/ obj,
			/*String|Function*/ event,
			/*String|Function*/ method){
		// summary:
		//		Connects specified obj/event to specified method of this object
		//		and registers for disconnect() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.connect, except with the
		//		implicit use of this widget as the target object.
		//		Events connected with `this.connect` are disconnected upon
		//		destruction.
		// returns:
		//		A handle that can be passed to `disconnect` in order to disconnect before
		//		the widget is destroyed.
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when foo.bar() is called, call the listener we're going to
		//	|	// provide in the scope of btn
		//	|	btn.connect(foo, "bar", function(){
		//	|		console.debug(this.toString());
		//	|	});
		// tags:
		//		protected

		var handles = [dojo._connect(obj, event, this, method)];
		this._connects.push(handles);
		return handles;		// _Widget.Handle
	},

	disconnect: function(/* _Widget.Handle */ handles){
		// summary:
		//		Disconnects handle created by `connect`.
		//		Also removes handle from this widget's list of connects.
		// tags:
		//		protected
		for(var i=0; i<this._connects.length; i++){
			if(this._connects[i] == handles){
				dojo.forEach(handles, dojo.disconnect);
				this._connects.splice(i, 1);
				return;
			}
		}
	},

	subscribe: function(
			/*String*/ topic,
			/*String|Function*/ method){
		// summary:
		//		Subscribes to the specified topic and calls the specified method
		//		of this object and registers for unsubscribe() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.subscribe, except with the
		//		implicit use of this widget as the target object.
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when /my/topic is published, this button changes its label to
		//	|   // be the parameter of the topic.
		//	|	btn.subscribe("/my/topic", function(v){
		//	|		this.set("label", v);
		//	|	});
		var handle = dojo.subscribe(topic, this, method);

		// return handles for Any widget that may need them
		this._subscribes.push(handle);
		return handle;
	},

	unsubscribe: function(/*Object*/ handle){
		// summary:
		//		Unsubscribes handle created by this.subscribe.
		//		Also removes handle from this widget's list of subscriptions
		for(var i=0; i<this._subscribes.length; i++){
			if(this._subscribes[i] == handle){
				dojo.unsubscribe(handle);
				this._subscribes.splice(i, 1);
				return;
			}
		}
	},

	isLeftToRight: function(){
		// summary:
		//		Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
		// tags:
		//		protected
		return this.dir ? (this.dir == "ltr") : dojo._isBodyLtr(); //Boolean
	},

	placeAt: function(/* String|DomNode|_Widget */reference, /* String?|Int? */position){
		// summary:
		//		Place this widget's domNode reference somewhere in the DOM based
		//		on standard dojo.place conventions, or passing a Widget reference that
		//		contains and addChild member.
		//
		// description:
		//		A convenience function provided in all _Widgets, providing a simple
		//		shorthand mechanism to put an existing (or newly created) Widget
		//		somewhere in the dom, and allow chaining.
		//
		// reference:
		//		The String id of a domNode, a domNode reference, or a reference to a Widget posessing
		//		an addChild method.
		//
		// position:
		//		If passed a string or domNode reference, the position argument
		//		accepts a string just as dojo.place does, one of: "first", "last",
		//		"before", or "after".
		//
		//		If passed a _Widget reference, and that widget reference has an ".addChild" method,
		//		it will be called passing this widget instance into that method, supplying the optional
		//		position index passed.
		//
		// returns:
		//		dijit._Widget
		//		Provides a useful return of the newly created dijit._Widget instance so you
		//		can "chain" this function by instantiating, placing, then saving the return value
		//		to a variable.
		//
		// example:
		// | 	// create a Button with no srcNodeRef, and place it in the body:
		// | 	var button = new dijit.form.Button({ label:"click" }).placeAt(dojo.body());
		// | 	// now, 'button' is still the widget reference to the newly created button
		// | 	dojo.connect(button, "onClick", function(e){ console.log('click'); });
		//
		// example:
		// |	// create a button out of a node with id="src" and append it to id="wrapper":
		// | 	var button = new dijit.form.Button({},"src").placeAt("wrapper");
		//
		// example:
		// |	// place a new button as the first element of some div
		// |	var button = new dijit.form.Button({ label:"click" }).placeAt("wrapper","first");
		//
		// example:
		// |	// create a contentpane and add it to a TabContainer
		// |	var tc = dijit.byId("myTabs");
		// |	new dijit.layout.ContentPane({ href:"foo.html", title:"Wow!" }).placeAt(tc)

		if(reference.declaredClass && reference.addChild){
			reference.addChild(this, position);
		}else{
			dojo.place(this.domNode, reference, position);
		}
		return this;
	}
});

})();

}

if(!dojo._hasResource["dojo.window"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.window"] = true;
dojo.provide("dojo.window");

dojo.getObject("window", true, dojo);

dojo.window.getBox = function(){
	// summary:
	//		Returns the dimensions and scroll position of the viewable area of a browser window

	var scrollRoot = (dojo.doc.compatMode == 'BackCompat') ? dojo.body() : dojo.doc.documentElement;

	// get scroll position
	var scroll = dojo._docScroll(); // scrollRoot.scrollTop/Left should work
	return { w: scrollRoot.clientWidth, h: scrollRoot.clientHeight, l: scroll.x, t: scroll.y };
};

dojo.window.get = function(doc){
	// summary:
	// 		Get window object associated with document doc

	// In some IE versions (at least 6.0), document.parentWindow does not return a
	// reference to the real window object (maybe a copy), so we must fix it as well
	// We use IE specific execScript to attach the real window reference to
	// document._parentWindow for later use
	if(dojo.isIE && window !== document.parentWindow){
		/*
		In IE 6, only the variable "window" can be used to connect events (others
		may be only copies).
		*/
		doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
		//to prevent memory leak, unset it after use
		//another possibility is to add an onUnload handler which seems overkill to me (liucougar)
		var win = doc._parentWindow;
		doc._parentWindow = null;
		return win;	//	Window
	}

	return doc.parentWindow || doc.defaultView;	//	Window
};

dojo.window.scrollIntoView = function(/*DomNode*/ node, /*Object?*/ pos){
	// summary:
	//		Scroll the passed node into view, if it is not already.
	
	// don't rely on node.scrollIntoView working just because the function is there

	try{ // catch unexpected/unrecreatable errors (#7808) since we can recover using a semi-acceptable native method
		node = dojo.byId(node);
		var doc = node.ownerDocument || dojo.doc,
			body = doc.body || dojo.body(),
			html = doc.documentElement || body.parentNode,
			isIE = dojo.isIE, isWK = dojo.isWebKit;
		// if an untested browser, then use the native method
		if((!(dojo.isMoz || isIE || isWK || dojo.isOpera) || node == body || node == html) && (typeof node.scrollIntoView != "undefined")){
			node.scrollIntoView(false); // short-circuit to native if possible
			return;
		}
		var backCompat = doc.compatMode == 'BackCompat',
			clientAreaRoot = backCompat? body : html,
			scrollRoot = isWK ? body : clientAreaRoot,
			rootWidth = clientAreaRoot.clientWidth,
			rootHeight = clientAreaRoot.clientHeight,
			rtl = !dojo._isBodyLtr(),
			nodePos = pos || dojo.position(node),
			el = node.parentNode,
			isFixed = function(el){
				return ((isIE <= 6 || (isIE && backCompat))? false : (dojo.style(el, 'position').toLowerCase() == "fixed"));
			};
		if(isFixed(node)){ return; } // nothing to do

		while(el){
			if(el == body){ el = scrollRoot; }
			var elPos = dojo.position(el),
				fixedPos = isFixed(el);
	
			if(el == scrollRoot){
				elPos.w = rootWidth; elPos.h = rootHeight;
				if(scrollRoot == html && isIE && rtl){ elPos.x += scrollRoot.offsetWidth-elPos.w; } // IE workaround where scrollbar causes negative x
				if(elPos.x < 0 || !isIE){ elPos.x = 0; } // IE can have values > 0
				if(elPos.y < 0 || !isIE){ elPos.y = 0; }
			}else{
				var pb = dojo._getPadBorderExtents(el);
				elPos.w -= pb.w; elPos.h -= pb.h; elPos.x += pb.l; elPos.y += pb.t;
			}
	
			if(el != scrollRoot){ // body, html sizes already have the scrollbar removed
				var clientSize = el.clientWidth,
					scrollBarSize = elPos.w - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.w = clientSize;
					if(isIE && rtl){ elPos.x += scrollBarSize; }
				}
				clientSize = el.clientHeight;
				scrollBarSize = elPos.h - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.h = clientSize;
				}
			}
			if(fixedPos){ // bounded by viewport, not parents
				if(elPos.y < 0){
					elPos.h += elPos.y; elPos.y = 0;
				}
				if(elPos.x < 0){
					elPos.w += elPos.x; elPos.x = 0;
				}
				if(elPos.y + elPos.h > rootHeight){
					elPos.h = rootHeight - elPos.y;
				}
				if(elPos.x + elPos.w > rootWidth){
					elPos.w = rootWidth - elPos.x;
				}
			}
			// calculate overflow in all 4 directions
			var l = nodePos.x - elPos.x, // beyond left: < 0
				t = nodePos.y - Math.max(elPos.y, 0), // beyond top: < 0
				r = l + nodePos.w - elPos.w, // beyond right: > 0
				bot = t + nodePos.h - elPos.h; // beyond bottom: > 0
			if(r * l > 0){
				var s = Math[l < 0? "max" : "min"](l, r);
				nodePos.x += el.scrollLeft;
				el.scrollLeft += (isIE >= 8 && !backCompat && rtl)? -s : s;
				nodePos.x -= el.scrollLeft;
			}
			if(bot * t > 0){
				nodePos.y += el.scrollTop;
				el.scrollTop += Math[t < 0? "max" : "min"](t, bot);
				nodePos.y -= el.scrollTop;
			}
			el = (el != scrollRoot) && !fixedPos && el.parentNode;
		}
	}catch(error){
		console.error('scrollIntoView: ' + error);
		node.scrollIntoView(false);
	}
};

}

if(!dojo._hasResource["dijit._base.focus"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.focus"] = true;
dojo.provide("dijit._base.focus");




// summary:
//		These functions are used to query or set the focus and selection.
//
//		Also, they trace when widgets become activated/deactivated,
//		so that the widget can fire _onFocus/_onBlur events.
//		"Active" here means something similar to "focused", but
//		"focus" isn't quite the right word because we keep track of
//		a whole stack of "active" widgets.  Example: ComboButton --> Menu -->
//		MenuItem.  The onBlur event for ComboButton doesn't fire due to focusing
//		on the Menu or a MenuItem, since they are considered part of the
//		ComboButton widget.  It only happens when focus is shifted
//		somewhere completely different.

dojo.mixin(dijit, {
	// _curFocus: DomNode
	//		Currently focused item on screen
	_curFocus: null,

	// _prevFocus: DomNode
	//		Previously focused item on screen
	_prevFocus: null,

	isCollapsed: function(){
		// summary:
		//		Returns true if there is no text selected
		return dijit.getBookmark().isCollapsed;
	},

	getBookmark: function(){
		// summary:
		//		Retrieves a bookmark that can be used with moveToBookmark to return to the same range
		var bm, rg, tg, sel = dojo.doc.selection, cf = dijit._curFocus;

		if(dojo.global.getSelection){
			//W3C Range API for selections.
			sel = dojo.global.getSelection();
			if(sel){
				if(sel.isCollapsed){
					tg = cf? cf.tagName : "";
					if(tg){
						//Create a fake rangelike item to restore selections.
						tg = tg.toLowerCase();
						if(tg == "textarea" ||
								(tg == "input" && (!cf.type || cf.type.toLowerCase() == "text"))){
							sel = {
								start: cf.selectionStart,
								end: cf.selectionEnd,
								node: cf,
								pRange: true
							};
							return {isCollapsed: (sel.end <= sel.start), mark: sel}; //Object.
						}
					}
					bm = {isCollapsed:true};
				}else{
					rg = sel.getRangeAt(0);
					bm = {isCollapsed: false, mark: rg.cloneRange()};
				}
			}
		}else if(sel){
			// If the current focus was a input of some sort and no selection, don't bother saving
			// a native bookmark.  This is because it causes issues with dialog/page selection restore.
			// So, we need to create psuedo bookmarks to work with.
			tg = cf ? cf.tagName : "";
			tg = tg.toLowerCase();
			if(cf && tg && (tg == "button" || tg == "textarea" || tg == "input")){
				if(sel.type && sel.type.toLowerCase() == "none"){
					return {
						isCollapsed: true,
						mark: null
					}
				}else{
					rg = sel.createRange();
					return {
						isCollapsed: rg.text && rg.text.length?false:true,
						mark: {
							range: rg,
							pRange: true
						}
					};
				}
			}
			bm = {};

			//'IE' way for selections.
			try{
				// createRange() throws exception when dojo in iframe
				//and nothing selected, see #9632
				rg = sel.createRange();
				bm.isCollapsed = !(sel.type == 'Text' ? rg.htmlText.length : rg.length);
			}catch(e){
				bm.isCollapsed = true;
				return bm;
			}
			if(sel.type.toUpperCase() == 'CONTROL'){
				if(rg.length){
					bm.mark=[];
					var i=0,len=rg.length;
					while(i<len){
						bm.mark.push(rg.item(i++));
					}
				}else{
					bm.isCollapsed = true;
					bm.mark = null;
				}
			}else{
				bm.mark = rg.getBookmark();
			}
		}else{
			console.warn("No idea how to store the current selection for this browser!");
		}
		return bm; // Object
	},

	moveToBookmark: function(/*Object*/bookmark){
		// summary:
		//		Moves current selection to a bookmark
		// bookmark:
		//		This should be a returned object from dijit.getBookmark()

		var _doc = dojo.doc,
			mark = bookmark.mark;
		if(mark){
			if(dojo.global.getSelection){
				//W3C Rangi API (FF, WebKit, Opera, etc)
				var sel = dojo.global.getSelection();
				if(sel && sel.removeAllRanges){
					if(mark.pRange){
						var r = mark;
						var n = r.node;
						n.selectionStart = r.start;
						n.selectionEnd = r.end;
					}else{
						sel.removeAllRanges();
						sel.addRange(mark);
					}
				}else{
					console.warn("No idea how to restore selection for this browser!");
				}
			}else if(_doc.selection && mark){
				//'IE' way.
				var rg;
				if(mark.pRange){
					rg = mark.range;
				}else if(dojo.isArray(mark)){
					rg = _doc.body.createControlRange();
					//rg.addElement does not have call/apply method, so can not call it directly
					//rg is not available in "range.addElement(item)", so can't use that either
					dojo.forEach(mark, function(n){
						rg.addElement(n);
					});
				}else{
					rg = _doc.body.createTextRange();
					rg.moveToBookmark(mark);
				}
				rg.select();
			}
		}
	},

	getFocus: function(/*Widget?*/ menu, /*Window?*/ openedForWindow){
		// summary:
		//		Called as getFocus(), this returns an Object showing the current focus
		//		and selected text.
		//
		//		Called as getFocus(widget), where widget is a (widget representing) a button
		//		that was just pressed, it returns where focus was before that button
		//		was pressed.   (Pressing the button may have either shifted focus to the button,
		//		or removed focus altogether.)   In this case the selected text is not returned,
		//		since it can't be accurately determined.
		//
		// menu: dijit._Widget or {domNode: DomNode} structure
		//		The button that was just pressed.  If focus has disappeared or moved
		//		to this button, returns the previous focus.  In this case the bookmark
		//		information is already lost, and null is returned.
		//
		// openedForWindow:
		//		iframe in which menu was opened
		//
		// returns:
		//		A handle to restore focus/selection, to be passed to `dijit.focus`
		var node = !dijit._curFocus || (menu && dojo.isDescendant(dijit._curFocus, menu.domNode)) ? dijit._prevFocus : dijit._curFocus;
		return {
			node: node,
			bookmark: (node == dijit._curFocus) && dojo.withGlobal(openedForWindow || dojo.global, dijit.getBookmark),
			openedForWindow: openedForWindow
		}; // Object
	},

	focus: function(/*Object || DomNode */ handle){
		// summary:
		//		Sets the focused node and the selection according to argument.
		//		To set focus to an iframe's content, pass in the iframe itself.
		// handle:
		//		object returned by get(), or a DomNode

		if(!handle){ return; }

		var node = "node" in handle ? handle.node : handle,		// because handle is either DomNode or a composite object
			bookmark = handle.bookmark,
			openedForWindow = handle.openedForWindow,
			collapsed = bookmark ? bookmark.isCollapsed : false;

		// Set the focus
		// Note that for iframe's we need to use the <iframe> to follow the parentNode chain,
		// but we need to set focus to iframe.contentWindow
		if(node){
			var focusNode = (node.tagName.toLowerCase() == "iframe") ? node.contentWindow : node;
			if(focusNode && focusNode.focus){
				try{
					// Gecko throws sometimes if setting focus is impossible,
					// node not displayed or something like that
					focusNode.focus();
				}catch(e){/*quiet*/}
			}
			dijit._onFocusNode(node);
		}

		// set the selection
		// do not need to restore if current selection is not empty
		// (use keyboard to select a menu item) or if previous selection was collapsed
		// as it may cause focus shift (Esp in IE).
		if(bookmark && dojo.withGlobal(openedForWindow || dojo.global, dijit.isCollapsed) && !collapsed){
			if(openedForWindow){
				openedForWindow.focus();
			}
			try{
				dojo.withGlobal(openedForWindow || dojo.global, dijit.moveToBookmark, null, [bookmark]);
			}catch(e2){
				/*squelch IE internal error, see http://trac.dojotoolkit.org/ticket/1984 */
			}
		}
	},

	// _activeStack: dijit._Widget[]
	//		List of currently active widgets (focused widget and it's ancestors)
	_activeStack: [],

	registerIframe: function(/*DomNode*/ iframe){
		// summary:
		//		Registers listeners on the specified iframe so that any click
		//		or focus event on that iframe (or anything in it) is reported
		//		as a focus/click event on the <iframe> itself.
		// description:
		//		Currently only used by editor.
		// returns:
		//		Handle to pass to unregisterIframe()
		return dijit.registerWin(iframe.contentWindow, iframe);
	},

	unregisterIframe: function(/*Object*/ handle){
		// summary:
		//		Unregisters listeners on the specified iframe created by registerIframe.
		//		After calling be sure to delete or null out the handle itself.
		// handle:
		//		Handle returned by registerIframe()

		dijit.unregisterWin(handle);
	},

	registerWin: function(/*Window?*/targetWindow, /*DomNode?*/ effectiveNode){
		// summary:
		//		Registers listeners on the specified window (either the main
		//		window or an iframe's window) to detect when the user has clicked somewhere
		//		or focused somewhere.
		// description:
		//		Users should call registerIframe() instead of this method.
		// targetWindow:
		//		If specified this is the window associated with the iframe,
		//		i.e. iframe.contentWindow.
		// effectiveNode:
		//		If specified, report any focus events inside targetWindow as
		//		an event on effectiveNode, rather than on evt.target.
		// returns:
		//		Handle to pass to unregisterWin()

		// TODO: make this function private in 2.0; Editor/users should call registerIframe(),

		var mousedownListener = function(evt){
			dijit._justMouseDowned = true;
			setTimeout(function(){ dijit._justMouseDowned = false; }, 0);
			
			// workaround weird IE bug where the click is on an orphaned node
			// (first time clicking a Select/DropDownButton inside a TooltipDialog)
			if(dojo.isIE && evt && evt.srcElement && evt.srcElement.parentNode == null){
				return;
			}

			dijit._onTouchNode(effectiveNode || evt.target || evt.srcElement, "mouse");
		};
		//dojo.connect(targetWindow, "onscroll", ???);

		// Listen for blur and focus events on targetWindow's document.
		// IIRC, I'm using attachEvent() rather than dojo.connect() because focus/blur events don't bubble
		// through dojo.connect(), and also maybe to catch the focus events early, before onfocus handlers
		// fire.
		// Connect to <html> (rather than document) on IE to avoid memory leaks, but document on other browsers because
		// (at least for FF) the focus event doesn't fire on <html> or <body>.
		var doc = dojo.isIE ? targetWindow.document.documentElement : targetWindow.document;
		if(doc){
			if(dojo.isIE){
				targetWindow.document.body.attachEvent('onmousedown', mousedownListener);
				var activateListener = function(evt){
					// IE reports that nodes like <body> have gotten focus, even though they have tabIndex=-1,
					// Should consider those more like a mouse-click than a focus....
					if(evt.srcElement.tagName.toLowerCase() != "#document" &&
						dijit.isTabNavigable(evt.srcElement)){
						dijit._onFocusNode(effectiveNode || evt.srcElement);
					}else{
						dijit._onTouchNode(effectiveNode || evt.srcElement);
					}
				};
				doc.attachEvent('onactivate', activateListener);
				var deactivateListener =  function(evt){
					dijit._onBlurNode(effectiveNode || evt.srcElement);
				};
				doc.attachEvent('ondeactivate', deactivateListener);

				return function(){
					targetWindow.document.detachEvent('onmousedown', mousedownListener);
					doc.detachEvent('onactivate', activateListener);
					doc.detachEvent('ondeactivate', deactivateListener);
					doc = null;	// prevent memory leak (apparent circular reference via closure)
				};
			}else{
				doc.body.addEventListener('mousedown', mousedownListener, true);
				var focusListener = function(evt){
					dijit._onFocusNode(effectiveNode || evt.target);
				};
				doc.addEventListener('focus', focusListener, true);
				var blurListener = function(evt){
					dijit._onBlurNode(effectiveNode || evt.target);
				};
				doc.addEventListener('blur', blurListener, true);

				return function(){
					doc.body.removeEventListener('mousedown', mousedownListener, true);
					doc.removeEventListener('focus', focusListener, true);
					doc.removeEventListener('blur', blurListener, true);
					doc = null;	// prevent memory leak (apparent circular reference via closure)
				};
			}
		}
	},

	unregisterWin: function(/*Handle*/ handle){
		// summary:
		//		Unregisters listeners on the specified window (either the main
		//		window or an iframe's window) according to handle returned from registerWin().
		//		After calling be sure to delete or null out the handle itself.

		// Currently our handle is actually a function
		handle && handle();
	},

	_onBlurNode: function(/*DomNode*/ node){
		// summary:
		// 		Called when focus leaves a node.
		//		Usually ignored, _unless_ it *isn't* follwed by touching another node,
		//		which indicates that we tabbed off the last field on the page,
		//		in which case every widget is marked inactive
		dijit._prevFocus = dijit._curFocus;
		dijit._curFocus = null;

		if(dijit._justMouseDowned){
			// the mouse down caused a new widget to be marked as active; this blur event
			// is coming late, so ignore it.
			return;
		}

		// if the blur event isn't followed by a focus event then mark all widgets as inactive.
		if(dijit._clearActiveWidgetsTimer){
			clearTimeout(dijit._clearActiveWidgetsTimer);
		}
		dijit._clearActiveWidgetsTimer = setTimeout(function(){
			delete dijit._clearActiveWidgetsTimer;
			dijit._setStack([]);
			dijit._prevFocus = null;
		}, 100);
	},

	_onTouchNode: function(/*DomNode*/ node, /*String*/ by){
		// summary:
		//		Callback when node is focused or mouse-downed
		// node:
		//		The node that was touched.
		// by:
		//		"mouse" if the focus/touch was caused by a mouse down event

		// ignore the recent blurNode event
		if(dijit._clearActiveWidgetsTimer){
			clearTimeout(dijit._clearActiveWidgetsTimer);
			delete dijit._clearActiveWidgetsTimer;
		}

		// compute stack of active widgets (ex: ComboButton --> Menu --> MenuItem)
		var newStack=[];
		try{
			while(node){
				var popupParent = dojo.attr(node, "dijitPopupParent");
				if(popupParent){
					node=dijit.byId(popupParent).domNode;
				}else if(node.tagName && node.tagName.toLowerCase() == "body"){
					// is this the root of the document or just the root of an iframe?
					if(node === dojo.body()){
						// node is the root of the main document
						break;
					}
					// otherwise, find the iframe this node refers to (can't access it via parentNode,
					// need to do this trick instead). window.frameElement is supported in IE/FF/Webkit
					node=dojo.window.get(node.ownerDocument).frameElement;
				}else{
					// if this node is the root node of a widget, then add widget id to stack,
					// except ignore clicks on disabled widgets (actually focusing a disabled widget still works,
					// to support MenuItem)
					var id = node.getAttribute && node.getAttribute("widgetId"),
						widget = id && dijit.byId(id);
					if(widget && !(by == "mouse" && widget.get("disabled"))){
						newStack.unshift(id);
					}
					node=node.parentNode;
				}
			}
		}catch(e){ /* squelch */ }

		dijit._setStack(newStack, by);
	},

	_onFocusNode: function(/*DomNode*/ node){
		// summary:
		//		Callback when node is focused

		if(!node){
			return;
		}

		if(node.nodeType == 9){
			// Ignore focus events on the document itself.  This is here so that
			// (for example) clicking the up/down arrows of a spinner
			// (which don't get focus) won't cause that widget to blur. (FF issue)
			return;
		}

		dijit._onTouchNode(node);

		if(node == dijit._curFocus){ return; }
		if(dijit._curFocus){
			dijit._prevFocus = dijit._curFocus;
		}
		dijit._curFocus = node;
		dojo.publish("focusNode", [node]);
	},

	_setStack: function(/*String[]*/ newStack, /*String*/ by){
		// summary:
		//		The stack of active widgets has changed.  Send out appropriate events and records new stack.
		// newStack:
		//		array of widget id's, starting from the top (outermost) widget
		// by:
		//		"mouse" if the focus/touch was caused by a mouse down event

		var oldStack = dijit._activeStack;
		dijit._activeStack = newStack;

		// compare old stack to new stack to see how many elements they have in common
		for(var nCommon=0; nCommon<Math.min(oldStack.length, newStack.length); nCommon++){
			if(oldStack[nCommon] != newStack[nCommon]){
				break;
			}
		}

		var widget;
		// for all elements that have gone out of focus, send blur event
		for(var i=oldStack.length-1; i>=nCommon; i--){
			widget = dijit.byId(oldStack[i]);
			if(widget){
				widget._focused = false;
				widget.set("focused", false);
				widget._hasBeenBlurred = true;
				if(widget._onBlur){
					widget._onBlur(by);
				}
				dojo.publish("widgetBlur", [widget, by]);
			}
		}

		// for all element that have come into focus, send focus event
		for(i=nCommon; i<newStack.length; i++){
			widget = dijit.byId(newStack[i]);
			if(widget){
				widget._focused = true;
				widget.set("focused", true);
				if(widget._onFocus){
					widget._onFocus(by);
				}
				dojo.publish("widgetFocus", [widget, by]);
			}
		}
	}
});

// register top window and all the iframes it contains
dojo.addOnLoad(function(){
	var handle = dijit.registerWin(window);
	if(dojo.isIE){
		dojo.addOnWindowUnload(function(){
			dijit.unregisterWin(handle);
			handle = null;
		})
	}
});

}

if(!dojo._hasResource["dojo.AdapterRegistry"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.AdapterRegistry"] = true;
dojo.provide("dojo.AdapterRegistry");


dojo.AdapterRegistry = function(/*Boolean?*/ returnWrappers){
	//	summary:
	//		A registry to make contextual calling/searching easier.
	//	description:
	//		Objects of this class keep list of arrays in the form [name, check,
	//		wrap, directReturn] that are used to determine what the contextual
	//		result of a set of checked arguments is. All check/wrap functions
	//		in this registry should be of the same arity.
	//	example:
	//	|	// create a new registry
	//	|	var reg = new dojo.AdapterRegistry();
	//	|	reg.register("handleString",
	//	|		dojo.isString,
	//	|		function(str){
	//	|			// do something with the string here
	//	|		}
	//	|	);
	//	|	reg.register("handleArr",
	//	|		dojo.isArray,
	//	|		function(arr){
	//	|			// do something with the array here
	//	|		}
	//	|	);
	//	|
	//	|	// now we can pass reg.match() *either* an array or a string and
	//	|	// the value we pass will get handled by the right function
	//	|	reg.match("someValue"); // will call the first function
	//	|	reg.match(["someValue"]); // will call the second

	this.pairs = [];
	this.returnWrappers = returnWrappers || false; // Boolean
};

dojo.extend(dojo.AdapterRegistry, {
	register: function(/*String*/ name, /*Function*/ check, /*Function*/ wrap, /*Boolean?*/ directReturn, /*Boolean?*/ override){
		//	summary:
		//		register a check function to determine if the wrap function or
		//		object gets selected
		//	name:
		//		a way to identify this matcher.
		//	check:
		//		a function that arguments are passed to from the adapter's
		//		match() function.  The check function should return true if the
		//		given arguments are appropriate for the wrap function.
		//	directReturn:
		//		If directReturn is true, the value passed in for wrap will be
		//		returned instead of being called. Alternately, the
		//		AdapterRegistry can be set globally to "return not call" using
		//		the returnWrappers property. Either way, this behavior allows
		//		the registry to act as a "search" function instead of a
		//		function interception library.
		//	override:
		//		If override is given and true, the check function will be given
		//		highest priority. Otherwise, it will be the lowest priority
		//		adapter.
		this.pairs[((override) ? "unshift" : "push")]([name, check, wrap, directReturn]);
	},

	match: function(/* ... */){
		// summary:
		//		Find an adapter for the given arguments. If no suitable adapter
		//		is found, throws an exception. match() accepts any number of
		//		arguments, all of which are passed to all matching functions
		//		from the registered pairs.
		for(var i = 0; i < this.pairs.length; i++){
			var pair = this.pairs[i];
			if(pair[1].apply(this, arguments)){
				if((pair[3])||(this.returnWrappers)){
					return pair[2];
				}else{
					return pair[2].apply(this, arguments);
				}
			}
		}
		throw new Error("No match found");
	},

	unregister: function(name){
		// summary: Remove a named adapter from the registry

		// FIXME: this is kind of a dumb way to handle this. On a large
		// registry this will be slow-ish and we can use the name as a lookup
		// should we choose to trade memory for speed.
		for(var i = 0; i < this.pairs.length; i++){
			var pair = this.pairs[i];
			if(pair[0] == name){
				this.pairs.splice(i, 1);
				return true;
			}
		}
		return false;
	}
});

}

if(!dojo._hasResource["dijit._base.place"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.place"] = true;
dojo.provide("dijit._base.place");




dijit.getViewport = function(){
	// summary:
	//		Returns the dimensions and scroll position of the viewable area of a browser window

	return dojo.window.getBox();
};

/*=====
dijit.__Position = function(){
	// x: Integer
	//		horizontal coordinate in pixels, relative to document body
	// y: Integer
	//		vertical coordinate in pixels, relative to document body

	thix.x = x;
	this.y = y;
}
=====*/


dijit.placeOnScreen = function(
	/* DomNode */			node,
	/* dijit.__Position */	pos,
	/* String[] */			corners,
	/* dijit.__Position? */	padding){
	// summary:
	//		Positions one of the node's corners at specified position
	//		such that node is fully visible in viewport.
	// description:
	//		NOTE: node is assumed to be absolutely or relatively positioned.
	//	pos:
	//		Object like {x: 10, y: 20}
	//	corners:
	//		Array of Strings representing order to try corners in, like ["TR", "BL"].
	//		Possible values are:
	//			* "BL" - bottom left
	//			* "BR" - bottom right
	//			* "TL" - top left
	//			* "TR" - top right
	//	padding:
	//		set padding to put some buffer around the element you want to position.
	// example:
	//		Try to place node's top right corner at (10,20).
	//		If that makes node go (partially) off screen, then try placing
	//		bottom left corner at (10,20).
	//	|	placeOnScreen(node, {x: 10, y: 20}, ["TR", "BL"])

	var choices = dojo.map(corners, function(corner){
		var c = { corner: corner, pos: {x:pos.x,y:pos.y} };
		if(padding){
			c.pos.x += corner.charAt(1) == 'L' ? padding.x : -padding.x;
			c.pos.y += corner.charAt(0) == 'T' ? padding.y : -padding.y;
		}
		return c;
	});

	return dijit._place(node, choices);
}

dijit._place = function(/*DomNode*/ node, choices, layoutNode, /*Object*/ aroundNodeCoords){
	// summary:
	//		Given a list of spots to put node, put it at the first spot where it fits,
	//		of if it doesn't fit anywhere then the place with the least overflow
	// choices: Array
	//		Array of elements like: {corner: 'TL', pos: {x: 10, y: 20} }
	//		Above example says to put the top-left corner of the node at (10,20)
	// layoutNode: Function(node, aroundNodeCorner, nodeCorner, size)
	//		for things like tooltip, they are displayed differently (and have different dimensions)
	//		based on their orientation relative to the parent.   This adjusts the popup based on orientation.
	//		It also passes in the available size for the popup, which is useful for tooltips to
	//		tell them that their width is limited to a certain amount.   layoutNode() may return a value expressing
	//		how much the popup had to be modified to fit into the available space.   This is used to determine
	//		what the best placement is.
	// aroundNodeCoords: Object
	//		Size of aroundNode, ex: {w: 200, h: 50}

	// get {x: 10, y: 10, w: 100, h:100} type obj representing position of
	// viewport over document
	var view = dojo.window.getBox();

	// This won't work if the node is inside a <div style="position: relative">,
	// so reattach it to dojo.doc.body.   (Otherwise, the positioning will be wrong
	// and also it might get cutoff)
	if(!node.parentNode || String(node.parentNode.tagName).toLowerCase() != "body"){
		dojo.body().appendChild(node);
	}

	var best = null;
	dojo.some(choices, function(choice){
		var corner = choice.corner;
		var pos = choice.pos;
		var overflow = 0;

		// calculate amount of space available given specified position of node
		var spaceAvailable = {
			w: corner.charAt(1) == 'L' ? (view.l + view.w) - pos.x : pos.x - view.l,
			h: corner.charAt(1) == 'T' ? (view.t + view.h) - pos.y : pos.y - view.t
		};

		// configure node to be displayed in given position relative to button
		// (need to do this in order to get an accurate size for the node, because
		// a tooltip's size changes based on position, due to triangle)
		if(layoutNode){
			var res = layoutNode(node, choice.aroundCorner, corner, spaceAvailable, aroundNodeCoords);
			overflow = typeof res == "undefined" ? 0 : res;
		}

		// get node's size
		var style = node.style;
		var oldDisplay = style.display;
		var oldVis = style.visibility;
		style.visibility = "hidden";
		style.display = "";
		var mb = dojo.marginBox(node);
		style.display = oldDisplay;
		style.visibility = oldVis;

		// coordinates and size of node with specified corner placed at pos,
		// and clipped by viewport
		var startX = Math.max(view.l, corner.charAt(1) == 'L' ? pos.x : (pos.x - mb.w)),
			startY = Math.max(view.t, corner.charAt(0) == 'T' ? pos.y : (pos.y - mb.h)),
			endX = Math.min(view.l + view.w, corner.charAt(1) == 'L' ? (startX + mb.w) : pos.x),
			endY = Math.min(view.t + view.h, corner.charAt(0) == 'T' ? (startY + mb.h) : pos.y),
			width = endX - startX,
			height = endY - startY;

		overflow += (mb.w - width) + (mb.h - height);

		if(best == null || overflow < best.overflow){
			best = {
				corner: corner,
				aroundCorner: choice.aroundCorner,
				x: startX,
				y: startY,
				w: width,
				h: height,
				overflow: overflow,
				spaceAvailable: spaceAvailable
			};
		}
		
		return !overflow;
	});

	// In case the best position is not the last one we checked, need to call
	// layoutNode() again.
	if(best.overflow && layoutNode){
		layoutNode(node, best.aroundCorner, best.corner, best.spaceAvailable, aroundNodeCoords);
	}

	// And then position the node.   Do this last, after the layoutNode() above
	// has sized the node, due to browser quirks when the viewport is scrolled
	// (specifically that a Tooltip will shrink to fit as though the window was
	// scrolled to the left).
	//
	// In RTL mode, set style.right rather than style.left so in the common case,
	// window resizes move the popup along with the aroundNode.
	var l = dojo._isBodyLtr(),
		s = node.style;
	s.top = best.y + "px";
	s[l ? "left" : "right"] = (l ? best.x : view.w - best.x - best.w) + "px";
	
	return best;
}

dijit.placeOnScreenAroundNode = function(
	/* DomNode */		node,
	/* DomNode */		aroundNode,
	/* Object */		aroundCorners,
	/* Function? */		layoutNode){

	// summary:
	//		Position node adjacent or kitty-corner to aroundNode
	//		such that it's fully visible in viewport.
	//
	// description:
	//		Place node such that corner of node touches a corner of
	//		aroundNode, and that node is fully visible.
	//
	// aroundCorners:
	//		Ordered list of pairs of corners to try matching up.
	//		Each pair of corners is represented as a key/value in the hash,
	//		where the key corresponds to the aroundNode's corner, and
	//		the value corresponds to the node's corner:
	//
	//	|	{ aroundNodeCorner1: nodeCorner1, aroundNodeCorner2: nodeCorner2, ...}
	//
	//		The following strings are used to represent the four corners:
	//			* "BL" - bottom left
	//			* "BR" - bottom right
	//			* "TL" - top left
	//			* "TR" - top right
	//
	// layoutNode: Function(node, aroundNodeCorner, nodeCorner)
	//		For things like tooltip, they are displayed differently (and have different dimensions)
	//		based on their orientation relative to the parent.   This adjusts the popup based on orientation.
	//
	// example:
	//	|	dijit.placeOnScreenAroundNode(node, aroundNode, {'BL':'TL', 'TR':'BR'});
	//		This will try to position node such that node's top-left corner is at the same position
	//		as the bottom left corner of the aroundNode (ie, put node below
	//		aroundNode, with left edges aligned).  If that fails it will try to put
	// 		the bottom-right corner of node where the top right corner of aroundNode is
	//		(ie, put node above aroundNode, with right edges aligned)
	//

	// get coordinates of aroundNode
	aroundNode = dojo.byId(aroundNode);
	var aroundNodePos = dojo.position(aroundNode, true);

	// place the node around the calculated rectangle
	return dijit._placeOnScreenAroundRect(node,
		aroundNodePos.x, aroundNodePos.y, aroundNodePos.w, aroundNodePos.h,	// rectangle
		aroundCorners, layoutNode);
};

/*=====
dijit.__Rectangle = function(){
	// x: Integer
	//		horizontal offset in pixels, relative to document body
	// y: Integer
	//		vertical offset in pixels, relative to document body
	// width: Integer
	//		width in pixels
	// height: Integer
	//		height in pixels

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
=====*/


dijit.placeOnScreenAroundRectangle = function(
	/* DomNode */			node,
	/* dijit.__Rectangle */	aroundRect,
	/* Object */			aroundCorners,
	/* Function */			layoutNode){

	// summary:
	//		Like dijit.placeOnScreenAroundNode(), except that the "around"
	//		parameter is an arbitrary rectangle on the screen (x, y, width, height)
	//		instead of a dom node.

	return dijit._placeOnScreenAroundRect(node,
		aroundRect.x, aroundRect.y, aroundRect.width, aroundRect.height,	// rectangle
		aroundCorners, layoutNode);
};

dijit._placeOnScreenAroundRect = function(
	/* DomNode */		node,
	/* Number */		x,
	/* Number */		y,
	/* Number */		width,
	/* Number */		height,
	/* Object */		aroundCorners,
	/* Function */		layoutNode){

	// summary:
	//		Like dijit.placeOnScreenAroundNode(), except it accepts coordinates
	//		of a rectangle to place node adjacent to.

	// TODO: combine with placeOnScreenAroundRectangle()

	// Generate list of possible positions for node
	var choices = [];
	for(var nodeCorner in aroundCorners){
		choices.push( {
			aroundCorner: nodeCorner,
			corner: aroundCorners[nodeCorner],
			pos: {
				x: x + (nodeCorner.charAt(1) == 'L' ? 0 : width),
				y: y + (nodeCorner.charAt(0) == 'T' ? 0 : height)
			}
		});
	}

	return dijit._place(node, choices, layoutNode, {w: width, h: height});
};

dijit.placementRegistry= new dojo.AdapterRegistry();
dijit.placementRegistry.register("node",
	function(n, x){
		return typeof x == "object" &&
			typeof x.offsetWidth != "undefined" && typeof x.offsetHeight != "undefined";
	},
	dijit.placeOnScreenAroundNode);
dijit.placementRegistry.register("rect",
	function(n, x){
		return typeof x == "object" &&
			"x" in x && "y" in x && "width" in x && "height" in x;
	},
	dijit.placeOnScreenAroundRectangle);

dijit.placeOnScreenAroundElement = function(
	/* DomNode */		node,
	/* Object */		aroundElement,
	/* Object */		aroundCorners,
	/* Function */		layoutNode){

	// summary:
	//		Like dijit.placeOnScreenAroundNode(), except it accepts an arbitrary object
	//		for the "around" argument and finds a proper processor to place a node.

	return dijit.placementRegistry.match.apply(dijit.placementRegistry, arguments);
};

dijit.getPopupAroundAlignment = function(/*Array*/ position, /*Boolean*/ leftToRight){
	// summary:
	//		Transforms the passed array of preferred positions into a format suitable for passing as the aroundCorners argument to dijit.placeOnScreenAroundElement.
	//
	// position: String[]
	//		This variable controls the position of the drop down.
	//		It's an array of strings with the following values:
	//
	//			* before: places drop down to the left of the target node/widget, or to the right in
	//			  the case of RTL scripts like Hebrew and Arabic
	//			* after: places drop down to the right of the target node/widget, or to the left in
	//			  the case of RTL scripts like Hebrew and Arabic
	//			* above: drop down goes above target node
	//			* below: drop down goes below target node
	//
	//		The list is positions is tried, in order, until a position is found where the drop down fits
	//		within the viewport.
	//
	// leftToRight: Boolean
	//		Whether the popup will be displaying in leftToRight mode.
	//
	var align = {};
	dojo.forEach(position, function(pos){
		switch(pos){
			case "after":
				align[leftToRight ? "BR" : "BL"] = leftToRight ? "BL" : "BR";
				break;
			case "before":
				align[leftToRight ? "BL" : "BR"] = leftToRight ? "BR" : "BL";
				break;
			case "below-alt":
				leftToRight = !leftToRight;
				// fall through
			case "below":
				// first try to align left borders, next try to align right borders (or reverse for RTL mode)
				align[leftToRight ? "BL" : "BR"] = leftToRight ? "TL" : "TR";
				align[leftToRight ? "BR" : "BL"] = leftToRight ? "TR" : "TL";
				break;
			case "above-alt":
				leftToRight = !leftToRight;
				// fall through
			case "above":
			default:
				// first try to align left borders, next try to align right borders (or reverse for RTL mode)
				align[leftToRight ? "TL" : "TR"] = leftToRight ? "BL" : "BR";
				align[leftToRight ? "TR" : "TL"] = leftToRight ? "BR" : "BL";
				break;
		}
	});
	return align;
};

}

if(!dojo._hasResource["dijit._base.window"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.window"] = true;
dojo.provide("dijit._base.window");



dijit.getDocumentWindow = function(doc){
	return dojo.window.get(doc);
};

}

if(!dojo._hasResource["dijit._base.popup"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.popup"] = true;
dojo.provide("dijit._base.popup");





/*=====
dijit.popup.__OpenArgs = function(){
	// popup: Widget
	//		widget to display
	// parent: Widget
	//		the button etc. that is displaying this popup
	// around: DomNode
	//		DOM node (typically a button); place popup relative to this node.  (Specify this *or* "x" and "y" parameters.)
	// x: Integer
	//		Absolute horizontal position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
	// y: Integer
	//		Absolute vertical position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
	// orient: Object|String
	//		When the around parameter is specified, orient should be an
	//		ordered list of tuples of the form (around-node-corner, popup-node-corner).
	//		dijit.popup.open() tries to position the popup according to each tuple in the list, in order,
	//		until the popup appears fully within the viewport.
	//
	//		The default value is {BL:'TL', TL:'BL'}, which represents a list of two tuples:
	//			1. (BL, TL)
	//			2. (TL, BL)
	//		where BL means "bottom left" and "TL" means "top left".
	//		So by default, it first tries putting the popup below the around node, left-aligning them,
	//		and then tries to put it above the around node, still left-aligning them.   Note that the
	//		default is horizontally reversed when in RTL mode.
	//
	//		When an (x,y) position is specified rather than an around node, orient is either
	//		"R" or "L".  R (for right) means that it tries to put the popup to the right of the mouse,
	//		specifically positioning the popup's top-right corner at the mouse position, and if that doesn't
	//		fit in the viewport, then it tries, in order, the bottom-right corner, the top left corner,
	//		and the top-right corner.
	// onCancel: Function
	//		callback when user has canceled the popup by
	//			1. hitting ESC or
	//			2. by using the popup widget's proprietary cancel mechanism (like a cancel button in a dialog);
	//			   i.e. whenever popupWidget.onCancel() is called, args.onCancel is called
	// onClose: Function
	//		callback whenever this popup is closed
	// onExecute: Function
	//		callback when user "executed" on the popup/sub-popup by selecting a menu choice, etc. (top menu only)
	// padding: dijit.__Position
	//		adding a buffer around the opening position. This is only useful when around is not set.
	this.popup = popup;
	this.parent = parent;
	this.around = around;
	this.x = x;
	this.y = y;
	this.orient = orient;
	this.onCancel = onCancel;
	this.onClose = onClose;
	this.onExecute = onExecute;
	this.padding = padding;
}
=====*/

dijit.popup = {
	// summary:
	//		This singleton is used to show/hide widgets as popups.

	// _stack: dijit._Widget[]
	//		Stack of currently popped up widgets.
	//		(someone opened _stack[0], and then it opened _stack[1], etc.)
	_stack: [],
	
	// _beginZIndex: Number
	//		Z-index of the first popup.   (If first popup opens other
	//		popups they get a higher z-index.)
	_beginZIndex: 1000,

	_idGen: 1,

	_createWrapper: function(/*Widget || DomNode*/ widget){
		// summary:
		//		Initialization for widgets that will be used as popups.
		//		Puts widget inside a wrapper DIV (if not already in one),
		//		and returns pointer to that wrapper DIV.

		var wrapper = widget.declaredClass ? widget._popupWrapper : (dojo.hasClass(widget.parentNode, "dijitPopup") && widget.parentNode),
			node = widget.domNode || widget;

		if(!wrapper){
			// Create wrapper <div> for when this widget [in the future] will be used as a popup.
			// This is done early because of IE bugs where creating/moving DOM nodes causes focus
			// to go wonky, see tests/robot/Toolbar.html to reproduce
			wrapper = dojo.create("div",{
				"class":"dijitPopup",
				style:{ display: "none"},
				role: "presentation"
			}, dojo.body());
			wrapper.appendChild(node);

			var s = node.style;
			s.display = "";
			s.visibility = "";
			s.position = "";
			s.top = "0px";

			if(widget.declaredClass){		// TODO: in 2.0 change signature to always take widget, then remove if()
				widget._popupWrapper = wrapper;
				dojo.connect(widget, "destroy", function(){
					dojo.destroy(wrapper);
					delete widget._popupWrapper;
				});
			}
		}
		
		return wrapper;
	},

	moveOffScreen: function(/*Widget || DomNode*/ widget){
		// summary:
		//		Moves the popup widget off-screen.
		//		Do not use this method to hide popups when not in use, because
		//		that will create an accessibility issue: the offscreen popup is
		//		still in the tabbing order.

		// Create wrapper if not already there
		var wrapper = this._createWrapper(widget);

		dojo.style(wrapper, {
			visibility: "hidden",
			top: "-9999px",		// prevent transient scrollbar causing misalign (#5776), and initial flash in upper left (#10111)
			display: ""
		});
	},

	hide: function(/*dijit._Widget*/ widget){
		// summary:
		//		Hide this popup widget (until it is ready to be shown).
		//		Initialization for widgets that will be used as popups
		//
		// 		Also puts widget inside a wrapper DIV (if not already in one)
		//
		//		If popup widget needs to layout it should
		//		do so when it is made visible, and popup._onShow() is called.

		// Create wrapper if not already there
		var wrapper = this._createWrapper(widget);

		dojo.style(wrapper, "display", "none");
	},
		
	getTopPopup: function(){
		// summary:
		//		Compute the closest ancestor popup that's *not* a child of another popup.
		//		Ex: For a TooltipDialog with a button that spawns a tree of menus, find the popup of the button.
		var stack = this._stack;
		for(var pi=stack.length-1; pi > 0 && stack[pi].parent === stack[pi-1].widget; pi--){
			/* do nothing, just trying to get right value for pi */
		}
		return stack[pi];
	},

	open: function(/*dijit.popup.__OpenArgs*/ args){
		// summary:
		//		Popup the widget at the specified position
		//
		// example:
		//		opening at the mouse position
		//		|		dijit.popup.open({popup: menuWidget, x: evt.pageX, y: evt.pageY});
		//
		// example:
		//		opening the widget as a dropdown
		//		|		dijit.popup.open({parent: this, popup: menuWidget, around: this.domNode, onClose: function(){...}});
		//
		//		Note that whatever widget called dijit.popup.open() should also listen to its own _onBlur callback
		//		(fired from _base/focus.js) to know that focus has moved somewhere else and thus the popup should be closed.

		var stack = this._stack,
			widget = args.popup,
			orient = args.orient || (
				(args.parent ? args.parent.isLeftToRight() : dojo._isBodyLtr()) ?
				{'BL':'TL', 'BR':'TR', 'TL':'BL', 'TR':'BR'} :
				{'BR':'TR', 'BL':'TL', 'TR':'BR', 'TL':'BL'}
			),
			around = args.around,
			id = (args.around && args.around.id) ? (args.around.id+"_dropdown") : ("popup_"+this._idGen++);

		// If we are opening a new popup that isn't a child of a currently opened popup, then
		// close currently opened popup(s).   This should happen automatically when the old popups
		// gets the _onBlur() event, except that the _onBlur() event isn't reliable on IE, see [22198].
		while(stack.length && (!args.parent || !dojo.isDescendant(args.parent.domNode, stack[stack.length-1].widget.domNode))){
			dijit.popup.close(stack[stack.length-1].widget);
		}

		// Get pointer to popup wrapper, and create wrapper if it doesn't exist
		var wrapper = this._createWrapper(widget);


		dojo.attr(wrapper, {
			id: id,
			style: {
				zIndex: this._beginZIndex + stack.length
			},
			"class": "dijitPopup " + (widget.baseClass || widget["class"] || "").split(" ")[0] +"Popup",
			dijitPopupParent: args.parent ? args.parent.id : ""
		});

		if(dojo.isIE || dojo.isMoz){
			if(!widget.bgIframe){
				// setting widget.bgIframe triggers cleanup in _Widget.destroy()
				widget.bgIframe = new dijit.BackgroundIframe(wrapper);
			}
		}

		// position the wrapper node and make it visible
		var best = around ?
			dijit.placeOnScreenAroundElement(wrapper, around, orient, widget.orient ? dojo.hitch(widget, "orient") : null) :
			dijit.placeOnScreen(wrapper, args, orient == 'R' ? ['TR','BR','TL','BL'] : ['TL','BL','TR','BR'], args.padding);

		wrapper.style.display = "";
		wrapper.style.visibility = "visible";
		widget.domNode.style.visibility = "visible";	// counteract effects from _HasDropDown

		var handlers = [];

		// provide default escape and tab key handling
		// (this will work for any widget, not just menu)
		handlers.push(dojo.connect(wrapper, "onkeypress", this, function(evt){
			if(evt.charOrCode == dojo.keys.ESCAPE && args.onCancel){
				dojo.stopEvent(evt);
				args.onCancel();
			}else if(evt.charOrCode === dojo.keys.TAB){
				dojo.stopEvent(evt);
				var topPopup = this.getTopPopup();
				if(topPopup && topPopup.onCancel){
					topPopup.onCancel();
				}
			}
		}));

		// watch for cancel/execute events on the popup and notify the caller
		// (for a menu, "execute" means clicking an item)
		if(widget.onCancel){
			handlers.push(dojo.connect(widget, "onCancel", args.onCancel));
		}

		handlers.push(dojo.connect(widget, widget.onExecute ? "onExecute" : "onChange", this, function(){
			var topPopup = this.getTopPopup();
			if(topPopup && topPopup.onExecute){
				topPopup.onExecute();
			}
		}));

		stack.push({
			widget: widget,
			parent: args.parent,
			onExecute: args.onExecute,
			onCancel: args.onCancel,
 			onClose: args.onClose,
			handlers: handlers
		});

		if(widget.onOpen){
			// TODO: in 2.0 standardize onShow() (used by StackContainer) and onOpen() (used here)
			widget.onOpen(best);
		}

		return best;
	},

	close: function(/*dijit._Widget?*/ popup){
		// summary:
		//		Close specified popup and any popups that it parented.
		//		If no popup is specified, closes all popups.

		var stack = this._stack;

		// Basically work backwards from the top of the stack closing popups
		// until we hit the specified popup, but IIRC there was some issue where closing
		// a popup would cause others to close too.  Thus if we are trying to close B in [A,B,C]
		// closing C might close B indirectly and then the while() condition will run where stack==[A]...
		// so the while condition is constructed defensively.
		while((popup && dojo.some(stack, function(elem){return elem.widget == popup;})) ||
			(!popup && stack.length)){
			var top = stack.pop(),
				widget = top.widget,
				onClose = top.onClose;

			if(widget.onClose){
				// TODO: in 2.0 standardize onHide() (used by StackContainer) and onClose() (used here)
				widget.onClose();
			}
			dojo.forEach(top.handlers, dojo.disconnect);

			// Hide the widget and it's wrapper unless it has already been destroyed in above onClose() etc.
			if(widget && widget.domNode){
				this.hide(widget);
			}
                        
			if(onClose){
				onClose();
			}
		}
	}
};

// TODO: remove dijit._frames, it isn't being used much, since popups never release their
// iframes (see [22236])
dijit._frames = new function(){
	// summary:
	//		cache of iframes

	var queue = [];

	this.pop = function(){
		var iframe;
		if(queue.length){
			iframe = queue.pop();
			iframe.style.display="";
		}else{
			if(dojo.isIE < 9){
				var burl = dojo.config["dojoBlankHtmlUrl"] || (dojo.moduleUrl("dojo", "resources/blank.html")+"") || "javascript:\"\"";
				var html="<iframe src='" + burl + "'"
					+ " style='position: absolute; left: 0px; top: 0px;"
					+ "z-index: -1; filter:Alpha(Opacity=\"0\");'>";
				iframe = dojo.doc.createElement(html);
			}else{
			 	iframe = dojo.create("iframe");
				iframe.src = 'javascript:""';
				iframe.className = "dijitBackgroundIframe";
				dojo.style(iframe, "opacity", 0.1);
			}
			iframe.tabIndex = -1; // Magic to prevent iframe from getting focus on tab keypress - as style didn't work.
			dijit.setWaiRole(iframe,"presentation");
		}
		return iframe;
	};

	this.push = function(iframe){
		iframe.style.display="none";
		queue.push(iframe);
	}
}();


dijit.BackgroundIframe = function(/*DomNode*/ node){
	// summary:
	//		For IE/FF z-index schenanigans. id attribute is required.
	//
	// description:
	//		new dijit.BackgroundIframe(node)
	//			Makes a background iframe as a child of node, that fills
	//			area (and position) of node

	if(!node.id){ throw new Error("no id"); }
	if(dojo.isIE || dojo.isMoz){
		var iframe = (this.iframe = dijit._frames.pop());
		node.appendChild(iframe);
		if(dojo.isIE<7 || dojo.isQuirks){
			this.resize(node);
			this._conn = dojo.connect(node, 'onresize', this, function(){
				this.resize(node);
			});
		}else{
			dojo.style(iframe, {
				width: '100%',
				height: '100%'
			});
		}
	}
};

dojo.extend(dijit.BackgroundIframe, {
	resize: function(node){
		// summary:
		// 		Resize the iframe so it's the same size as node.
		//		Needed on IE6 and IE/quirks because height:100% doesn't work right.
		if(this.iframe){
			dojo.style(this.iframe, {
				width: node.offsetWidth + 'px',
				height: node.offsetHeight + 'px'
			});
		}
	},
	destroy: function(){
		// summary:
		//		destroy the iframe
		if(this._conn){
			dojo.disconnect(this._conn);
			this._conn = null;
		}
		if(this.iframe){
			dijit._frames.push(this.iframe);
			delete this.iframe;
		}
	}
});

}

if(!dojo._hasResource["dijit._base.scroll"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.scroll"] = true;
dojo.provide("dijit._base.scroll");



dijit.scrollIntoView = function(/*DomNode*/ node, /*Object?*/ pos){
	// summary:
	//		Scroll the passed node into view, if it is not already.
	//		Deprecated, use `dojo.window.scrollIntoView` instead.
	
	dojo.window.scrollIntoView(node, pos);
};

}

if(!dojo._hasResource["dojo.uacss"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.uacss"] = true;
dojo.provide("dojo.uacss");


(function(){
	// summary:
	//		Applies pre-set CSS classes to the top-level HTML node, based on:
	// 			- browser (ex: dj_ie)
	//			- browser version (ex: dj_ie6)
	//			- box model (ex: dj_contentBox)
	//			- text direction (ex: dijitRtl)
	//
	//		In addition, browser, browser version, and box model are
	//		combined with an RTL flag when browser text is RTL.  ex: dj_ie-rtl.

	var d = dojo,
		html = d.doc.documentElement,
		ie = d.isIE,
		opera = d.isOpera,
		maj = Math.floor,
		ff = d.isFF,
		boxModel = d.boxModel.replace(/-/,''),

		classes = {
			dj_ie: ie,
			dj_ie6: maj(ie) == 6,
			dj_ie7: maj(ie) == 7,
			dj_ie8: maj(ie) == 8,
			dj_ie9: maj(ie) == 9,
			dj_quirks: d.isQuirks,
			dj_iequirks: ie && d.isQuirks,

			// NOTE: Opera not supported by dijit
			dj_opera: opera,

			dj_khtml: d.isKhtml,

			dj_webkit: d.isWebKit,
			dj_safari: d.isSafari,
			dj_chrome: d.isChrome,

			dj_gecko: d.isMozilla,
			dj_ff3: maj(ff) == 3
		}; // no dojo unsupported browsers

	classes["dj_" + boxModel] = true;

	// apply browser, browser version, and box model class names
	var classStr = "";
	for(var clz in classes){
		if(classes[clz]){
			classStr += clz + " ";
		}
	}
	html.className = d.trim(html.className + " " + classStr);

	// If RTL mode, then add dj_rtl flag plus repeat existing classes with -rtl extension.
	// We can't run the code below until the <body> tag has loaded (so we can check for dir=rtl).
	// Unshift() is to run sniff code before the parser.
	dojo._loaders.unshift(function(){
		if(!dojo._isBodyLtr()){
			var rtlClassStr = "dj_rtl dijitRtl " + classStr.replace(/ /g, "-rtl ")
			html.className = d.trim(html.className + " " + rtlClassStr);
		}
	});
})();

}

if(!dojo._hasResource["dijit._base.sniff"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.sniff"] = true;
dojo.provide("dijit._base.sniff");



// summary:
//		Applies pre-set CSS classes to the top-level HTML node, see
//		`dojo.uacss` for details.
//
//		Simply doing a require on this module will
//		establish this CSS.  Modified version of Morris' CSS hack.

}

if(!dojo._hasResource["dijit._base.typematic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.typematic"] = true;
dojo.provide("dijit._base.typematic");


dijit.typematic = {
	// summary:
	//		These functions are used to repetitively call a user specified callback
	//		method when a specific key or mouse click over a specific DOM node is
	//		held down for a specific amount of time.
	//		Only 1 such event is allowed to occur on the browser page at 1 time.

	_fireEventAndReload: function(){
		this._timer = null;
		this._callback(++this._count, this._node, this._evt);
		
		// Schedule next event, timer is at most minDelay (default 10ms) to avoid
		// browser overload (particularly avoiding starving DOH robot so it never gets to send a mouseup)
		this._currentTimeout = Math.max(
			this._currentTimeout < 0 ? this._initialDelay :
				(this._subsequentDelay > 1 ? this._subsequentDelay : Math.round(this._currentTimeout * this._subsequentDelay)),
			this._minDelay);
		this._timer = setTimeout(dojo.hitch(this, "_fireEventAndReload"), this._currentTimeout);
	},

	trigger: function(/*Event*/ evt, /*Object*/ _this, /*DOMNode*/ node, /*Function*/ callback, /*Object*/ obj, /*Number*/ subsequentDelay, /*Number*/ initialDelay, /*Number?*/ minDelay){
		// summary:
		//		Start a timed, repeating callback sequence.
		//		If already started, the function call is ignored.
		//		This method is not normally called by the user but can be
		//		when the normal listener code is insufficient.
		// evt:
		//		key or mouse event object to pass to the user callback
		// _this:
		//		pointer to the user's widget space.
		// node:
		//		the DOM node object to pass the the callback function
		// callback:
		//		function to call until the sequence is stopped called with 3 parameters:
		// count:
		//		integer representing number of repeated calls (0..n) with -1 indicating the iteration has stopped
		// node:
		//		the DOM node object passed in
		// evt:
		//		key or mouse event object
		// obj:
		//		user space object used to uniquely identify each typematic sequence
		// subsequentDelay (optional):
		//		if > 1, the number of milliseconds until the 3->n events occur
		//		or else the fractional time multiplier for the next event's delay, default=0.9
		// initialDelay (optional):
		//		the number of milliseconds until the 2nd event occurs, default=500ms
		// minDelay (optional):
		//		the maximum delay in milliseconds for event to fire, default=10ms
		if(obj != this._obj){
			this.stop();
			this._initialDelay = initialDelay || 500;
			this._subsequentDelay = subsequentDelay || 0.90;
			this._minDelay = minDelay || 10;
			this._obj = obj;
			this._evt = evt;
			this._node = node;
			this._currentTimeout = -1;
			this._count = -1;
			this._callback = dojo.hitch(_this, callback);
			this._fireEventAndReload();
			this._evt = dojo.mixin({faux: true}, evt);
		}
	},

	stop: function(){
		// summary:
		//		Stop an ongoing timed, repeating callback sequence.
		if(this._timer){
			clearTimeout(this._timer);
			this._timer = null;
		}
		if(this._obj){
			this._callback(-1, this._node, this._evt);
			this._obj = null;
		}
	},

	addKeyListener: function(/*DOMNode*/ node, /*Object*/ keyObject, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay, /*Number?*/ minDelay){
		// summary:
		//		Start listening for a specific typematic key.
		//		See also the trigger method for other parameters.
		// keyObject:
		//		an object defining the key to listen for:
		// 		charOrCode:
		//			the printable character (string) or keyCode (number) to listen for.
		// 		keyCode:
		//			(deprecated - use charOrCode) the keyCode (number) to listen for (implies charCode = 0).
		// 		charCode:
		//			(deprecated - use charOrCode) the charCode (number) to listen for.
		// 		ctrlKey:
		//			desired ctrl key state to initiate the callback sequence:
		//			- pressed (true)
		//			- released (false)
		//			- either (unspecified)
		// 		altKey:
		//			same as ctrlKey but for the alt key
		// 		shiftKey:
		//			same as ctrlKey but for the shift key
		// returns:
		//		an array of dojo.connect handles
		if(keyObject.keyCode){
			keyObject.charOrCode = keyObject.keyCode;
			dojo.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
		}else if(keyObject.charCode){
			keyObject.charOrCode = String.fromCharCode(keyObject.charCode);
			dojo.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
		}
		return [
			dojo.connect(node, "onkeypress", this, function(evt){
				if(evt.charOrCode == keyObject.charOrCode &&
				(keyObject.ctrlKey === undefined || keyObject.ctrlKey == evt.ctrlKey) &&
				(keyObject.altKey === undefined || keyObject.altKey == evt.altKey) &&
				(keyObject.metaKey === undefined || keyObject.metaKey == (evt.metaKey || false)) && // IE doesn't even set metaKey
				(keyObject.shiftKey === undefined || keyObject.shiftKey == evt.shiftKey)){
					dojo.stopEvent(evt);
					dijit.typematic.trigger(evt, _this, node, callback, keyObject, subsequentDelay, initialDelay, minDelay);
				}else if(dijit.typematic._obj == keyObject){
					dijit.typematic.stop();
				}
			}),
			dojo.connect(node, "onkeyup", this, function(evt){
				if(dijit.typematic._obj == keyObject){
					dijit.typematic.stop();
				}
			})
		];
	},

	addMouseListener: function(/*DOMNode*/ node, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay, /*Number?*/ minDelay){
		// summary:
		//		Start listening for a typematic mouse click.
		//		See the trigger method for other parameters.
		// returns:
		//		an array of dojo.connect handles
		var dc = dojo.connect;
		return [
			dc(node, "mousedown", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.trigger(evt, _this, node, callback, node, subsequentDelay, initialDelay, minDelay);
			}),
			dc(node, "mouseup", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.stop();
			}),
			dc(node, "mouseout", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.stop();
			}),
			dc(node, "mousemove", this, function(evt){
				evt.preventDefault();
			}),
			dc(node, "dblclick", this, function(evt){
				dojo.stopEvent(evt);
				if(dojo.isIE){
					dijit.typematic.trigger(evt, _this, node, callback, node, subsequentDelay, initialDelay, minDelay);
					setTimeout(dojo.hitch(this, dijit.typematic.stop), 50);
				}
			})
		];
	},

	addListener: function(/*Node*/ mouseNode, /*Node*/ keyNode, /*Object*/ keyObject, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay, /*Number?*/ minDelay){
		// summary:
		//		Start listening for a specific typematic key and mouseclick.
		//		This is a thin wrapper to addKeyListener and addMouseListener.
		//		See the addMouseListener and addKeyListener methods for other parameters.
		// mouseNode:
		//		the DOM node object to listen on for mouse events.
		// keyNode:
		//		the DOM node object to listen on for key events.
		// returns:
		//		an array of dojo.connect handles
		return this.addKeyListener(keyNode, keyObject, _this, callback, subsequentDelay, initialDelay, minDelay).concat(
			this.addMouseListener(mouseNode, _this, callback, subsequentDelay, initialDelay, minDelay));
	}
};

}

if(!dojo._hasResource["dijit._base.wai"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.wai"] = true;
dojo.provide("dijit._base.wai");


dijit.wai = {
	onload: function(){
		// summary:
		//		Detects if we are in high-contrast mode or not

		// This must be a named function and not an anonymous
		// function, so that the widget parsing code can make sure it
		// registers its onload function after this function.
		// DO NOT USE "this" within this function.

		// create div for testing if high contrast mode is on or images are turned off
		var div = dojo.create("div",{
			id: "a11yTestNode",
			style:{
				cssText:'border: 1px solid;'
					+ 'border-color:red green;'
					+ 'position: absolute;'
					+ 'height: 5px;'
					+ 'top: -999px;'
					+ 'background-image: url("' + (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")) + '");'
			}
		}, dojo.body());

		// test it
		var cs = dojo.getComputedStyle(div);
		if(cs){
			var bkImg = cs.backgroundImage;
			var needsA11y = (cs.borderTopColor == cs.borderRightColor) || (bkImg != null && (bkImg == "none" || bkImg == "url(invalid-url:)" ));
			dojo[needsA11y ? "addClass" : "removeClass"](dojo.body(), "dijit_a11y");
			if(dojo.isIE){
				div.outerHTML = "";		// prevent mixed-content warning, see http://support.microsoft.com/kb/925014
			}else{
				dojo.body().removeChild(div);
			}
		}
	}
};

// Test if computer is in high contrast mode.
// Make sure the a11y test runs first, before widgets are instantiated.
if(dojo.isIE || dojo.isMoz){	// NOTE: checking in Safari messes things up
	dojo._loaders.unshift(dijit.wai.onload);
}

dojo.mixin(dijit, {
	hasWaiRole: function(/*Element*/ elem, /*String?*/ role){
		// summary:
		//		Determines if an element has a particular role.
		// returns:
		//		True if elem has the specific role attribute and false if not.
		// 		For backwards compatibility if role parameter not provided,
		// 		returns true if has a role
		var waiRole = this.getWaiRole(elem);
		return role ? (waiRole.indexOf(role) > -1) : (waiRole.length > 0);
	},

	getWaiRole: function(/*Element*/ elem){
		// summary:
		//		Gets the role for an element (which should be a wai role).
		// returns:
		//		The role of elem or an empty string if elem
		//		does not have a role.
		 return dojo.trim((dojo.attr(elem, "role") || "").replace("wairole:",""));
	},

	setWaiRole: function(/*Element*/ elem, /*String*/ role){
		// summary:
		//		Sets the role on an element.
		// description:
		//		Replace existing role attribute with new role.

			dojo.attr(elem, "role", role);
	},

	removeWaiRole: function(/*Element*/ elem, /*String*/ role){
		// summary:
		//		Removes the specified role from an element.
		// 		Removes role attribute if no specific role provided (for backwards compat.)

		var roleValue = dojo.attr(elem, "role");
		if(!roleValue){ return; }
		if(role){
			var t = dojo.trim((" " + roleValue + " ").replace(" " + role + " ", " "));
			dojo.attr(elem, "role", t);
		}else{
			elem.removeAttribute("role");
		}
	},

	hasWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary:
		//		Determines if an element has a given state.
		// description:
		//		Checks for an attribute called "aria-"+state.
		// returns:
		//		true if elem has a value for the given state and
		//		false if it does not.

		return elem.hasAttribute ? elem.hasAttribute("aria-"+state) : !!elem.getAttribute("aria-"+state);
	},

	getWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary:
		//		Gets the value of a state on an element.
		// description:
		//		Checks for an attribute called "aria-"+state.
		// returns:
		//		The value of the requested state on elem
		//		or an empty string if elem has no value for state.

		return elem.getAttribute("aria-"+state) || "";
	},

	setWaiState: function(/*Element*/ elem, /*String*/ state, /*String*/ value){
		// summary:
		//		Sets a state on an element.
		// description:
		//		Sets an attribute called "aria-"+state.

		elem.setAttribute("aria-"+state, value);
	},

	removeWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary:
		//		Removes a state from an element.
		// description:
		//		Sets an attribute called "aria-"+state.

		elem.removeAttribute("aria-"+state);
	}
});

}

if(!dojo._hasResource["dijit._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base"] = true;
dojo.provide("dijit._base");












}

if(!dojo._hasResource["dijit._Widget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Widget"] = true;
dojo.provide("dijit._Widget");





////////////////// DEFERRED CONNECTS ///////////////////

// This code is to assist deferring dojo.connect() calls in widgets (connecting to events on the widgets'
// DOM nodes) until someone actually needs to monitor that event.
dojo.connect(dojo, "_connect",
	function(/*dijit._Widget*/ widget, /*String*/ event){
		if(widget && dojo.isFunction(widget._onConnect)){
			widget._onConnect(event);
		}
	});

dijit._connectOnUseEventHandler = function(/*Event*/ event){};

////////////////// ONDIJITCLICK SUPPORT ///////////////////

// Keep track of where the last keydown event was, to help avoid generating
// spurious ondijitclick events when:
// 1. focus is on a <button> or <a>
// 2. user presses then releases the ENTER key
// 3. onclick handler fires and shifts focus to another node, with an ondijitclick handler
// 4. onkeyup event fires, causing the ondijitclick handler to fire
dijit._lastKeyDownNode = null;
if(dojo.isIE){
	(function(){
		var keydownCallback = function(evt){
			dijit._lastKeyDownNode = evt.srcElement;
		};
		dojo.doc.attachEvent('onkeydown', keydownCallback);
		dojo.addOnWindowUnload(function(){
			dojo.doc.detachEvent('onkeydown', keydownCallback);
		});
	})();
}else{
	dojo.doc.addEventListener('keydown', function(evt){
		dijit._lastKeyDownNode = evt.target;
	}, true);
}

(function(){

dojo.declare("dijit._Widget", dijit._WidgetBase, {
	// summary:
	//		Base class for all Dijit widgets.
	//
	//		Extends _WidgetBase, adding support for:
	//			- deferred connections
	//				A call like dojo.connect(myWidget, "onMouseMove", func)
	//				will essentially do a dojo.connect(myWidget.domNode, "onMouseMove", func)
	//			- ondijitclick
	//				Support new dojoAttachEvent="ondijitclick: ..." that is triggered by a mouse click or a SPACE/ENTER keypress
	//			- focus related functions
	//				In particular, the onFocus()/onBlur() callbacks.   Driven internally by
	//				dijit/_base/focus.js.
	//			- deprecated methods
	//			- onShow(), onHide(), onClose()
	//
	//		Also, by loading code in dijit/_base, turns on:
	//			- browser sniffing (putting browser id like .dj_ie on <html> node)
	//			- high contrast mode sniffing (add .dijit_a11y class to <body> if machine is in high contrast mode)
	

	////////////////// DEFERRED CONNECTS ///////////////////

	// _deferredConnects: [protected] Object
	//		attributeMap addendum for event handlers that should be connected only on first use
	_deferredConnects: {
		onClick: "",
		onDblClick: "",
		onKeyDown: "",
		onKeyPress: "",
		onKeyUp: "",
		onMouseMove: "",
		onMouseDown: "",
		onMouseOut: "",
		onMouseOver: "",
		onMouseLeave: "",
		onMouseEnter: "",
		onMouseUp: ""
	},

	onClick: dijit._connectOnUseEventHandler,
	/*=====
	onClick: function(event){
		// summary:
		//		Connect to this function to receive notifications of mouse click events.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onDblClick: dijit._connectOnUseEventHandler,
	/*=====
	onDblClick: function(event){
		// summary:
		//		Connect to this function to receive notifications of mouse double click events.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onKeyDown: dijit._connectOnUseEventHandler,
	/*=====
	onKeyDown: function(event){
		// summary:
		//		Connect to this function to receive notifications of keys being pressed down.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onKeyPress: dijit._connectOnUseEventHandler,
	/*=====
	onKeyPress: function(event){
		// summary:
		//		Connect to this function to receive notifications of printable keys being typed.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onKeyUp: dijit._connectOnUseEventHandler,
	/*=====
	onKeyUp: function(event){
		// summary:
		//		Connect to this function to receive notifications of keys being released.
		// event:
		//		key Event
		// tags:
		//		callback
	},
	=====*/
	onMouseDown: dijit._connectOnUseEventHandler,
	/*=====
	onMouseDown: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse button is pressed down.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseMove: dijit._connectOnUseEventHandler,
	/*=====
	onMouseMove: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves over nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseOut: dijit._connectOnUseEventHandler,
	/*=====
	onMouseOut: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves off of nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseOver: dijit._connectOnUseEventHandler,
	/*=====
	onMouseOver: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves onto nodes contained within this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseLeave: dijit._connectOnUseEventHandler,
	/*=====
	onMouseLeave: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves off of this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseEnter: dijit._connectOnUseEventHandler,
	/*=====
	onMouseEnter: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse moves onto this widget.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/
	onMouseUp: dijit._connectOnUseEventHandler,
	/*=====
	onMouseUp: function(event){
		// summary:
		//		Connect to this function to receive notifications of when the mouse button is released.
		// event:
		//		mouse Event
		// tags:
		//		callback
	},
	=====*/

	create: function(/*Object?*/params, /*DomNode|String?*/srcNodeRef){
		// To avoid double-connects, remove entries from _deferredConnects
		// that have been setup manually by a subclass (ex, by dojoAttachEvent).
		// If a subclass has redefined a callback (ex: onClick) then assume it's being
		// connected to manually.
		this._deferredConnects = dojo.clone(this._deferredConnects);
		for(var attr in this.attributeMap){
			delete this._deferredConnects[attr]; // can't be in both attributeMap and _deferredConnects
		}
		for(attr in this._deferredConnects){
			if(this[attr] !== dijit._connectOnUseEventHandler){
				delete this._deferredConnects[attr];	// redefined, probably dojoAttachEvent exists
			}
		}

		this.inherited(arguments);

		if(this.domNode){
			// If the developer has specified a handler as a widget parameter
			// (ex: new Button({onClick: ...})
			// then naturally need to connect from DOM node to that handler immediately,
			for(attr in this.params){
				this._onConnect(attr);
			}
		}
	},

	_onConnect: function(/*String*/ event){
		// summary:
		//		Called when someone connects to one of my handlers.
		//		"Turn on" that handler if it isn't active yet.
		//
		//		This is also called for every single initialization parameter
		//		so need to do nothing for parameters like "id".
		// tags:
		//		private
		if(event in this._deferredConnects){
			var mapNode = this[this._deferredConnects[event] || 'domNode'];
			this.connect(mapNode, event.toLowerCase(), event);
			delete this._deferredConnects[event];
		}
	},

	////////////////// FOCUS RELATED ///////////////////
	// _onFocus() and _onBlur() are called by the focus manager

	// focused: [readonly] Boolean
	//		This widget or a widget it contains has focus, or is "active" because
	//		it was recently clicked.
	focused: false,

	isFocusable: function(){
		// summary:
		//		Return true if this widget can currently be focused
		//		and false if not
		return this.focus && (dojo.style(this.domNode, "display") != "none");
	},

	onFocus: function(){
		// summary:
		//		Called when the widget becomes "active" because
		//		it or a widget inside of it either has focus, or has recently
		//		been clicked.
		// tags:
		//		callback
	},

	onBlur: function(){
		// summary:
		//		Called when the widget stops being "active" because
		//		focus moved to something outside of it, or the user
		//		clicked somewhere outside of it, or the widget was
		//		hidden.
		// tags:
		//		callback
	},

	_onFocus: function(e){
		// summary:
		//		This is where widgets do processing for when they are active,
		//		such as changing CSS classes.  See onFocus() for more details.
		// tags:
		//		protected
		this.onFocus();
	},

	_onBlur: function(){
		// summary:
		//		This is where widgets do processing for when they stop being active,
		//		such as changing CSS classes.  See onBlur() for more details.
		// tags:
		//		protected
		this.onBlur();
	},

	////////////////// DEPRECATED METHODS ///////////////////

	setAttribute: function(/*String*/ attr, /*anything*/ value){
		// summary:
		//		Deprecated.  Use set() instead.
		// tags:
		//		deprecated
		dojo.deprecated(this.declaredClass+"::setAttribute(attr, value) is deprecated. Use set() instead.", "", "2.0");
		this.set(attr, value);
	},

	attr: function(/*String|Object*/name, /*Object?*/value){
		// summary:
		//		Set or get properties on a widget instance.
		//	name:
		//		The property to get or set. If an object is passed here and not
		//		a string, its keys are used as names of attributes to be set
		//		and the value of the object as values to set in the widget.
		//	value:
		//		Optional. If provided, attr() operates as a setter. If omitted,
		//		the current value of the named property is returned.
		// description:
		//		This method is deprecated, use get() or set() directly.

		// Print deprecation warning but only once per calling function
		if(dojo.config.isDebug){
			var alreadyCalledHash = arguments.callee._ach || (arguments.callee._ach = {}),
				caller = (arguments.callee.caller || "unknown caller").toString();
			if(!alreadyCalledHash[caller]){
				dojo.deprecated(this.declaredClass + "::attr() is deprecated. Use get() or set() instead, called from " +
				caller, "", "2.0");
				alreadyCalledHash[caller] = true;
			}
		}

		var args = arguments.length;
		if(args >= 2 || typeof name === "object"){ // setter
			return this.set.apply(this, arguments);
		}else{ // getter
			return this.get(name);
		}
	},
	
	////////////////// ONDIJITCLICK SUPPORT ///////////////////

	// nodesWithKeyClick: [private] String[]
	//		List of nodes that correctly handle click events via native browser support,
	//		and don't need dijit's help
	nodesWithKeyClick: ["input", "button"],

	connect: function(
			/*Object|null*/ obj,
			/*String|Function*/ event,
			/*String|Function*/ method){
		// summary:
		//		Connects specified obj/event to specified method of this object
		//		and registers for disconnect() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.connect, except with the
		//		implicit use of this widget as the target object.
		//		This version of connect also provides a special "ondijitclick"
		//		event which triggers on a click or space or enter keyup.
		//		Events connected with `this.connect` are disconnected upon
		//		destruction.
		// returns:
		//		A handle that can be passed to `disconnect` in order to disconnect before
		//		the widget is destroyed.
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when foo.bar() is called, call the listener we're going to
		//	|	// provide in the scope of btn
		//	|	btn.connect(foo, "bar", function(){
		//	|		console.debug(this.toString());
		//	|	});
		// tags:
		//		protected

		var d = dojo,
			dc = d._connect,
			handles = this.inherited(arguments, [obj, event == "ondijitclick" ? "onclick" : event, method]);

		if(event == "ondijitclick"){
			// add key based click activation for unsupported nodes.
			// do all processing onkey up to prevent spurious clicks
			// for details see comments at top of this file where _lastKeyDownNode is defined
			if(d.indexOf(this.nodesWithKeyClick, obj.nodeName.toLowerCase()) == -1){ // is NOT input or button
				var m = d.hitch(this, method);
				handles.push(
					dc(obj, "onkeydown", this, function(e){
						//console.log(this.id + ": onkeydown, e.target = ", e.target, ", lastKeyDownNode was ", dijit._lastKeyDownNode, ", equality is ", (e.target === dijit._lastKeyDownNode));
						if((e.keyCode == d.keys.ENTER || e.keyCode == d.keys.SPACE) &&
							!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey){
							// needed on IE for when focus changes between keydown and keyup - otherwise dropdown menus do not work
							dijit._lastKeyDownNode = e.target;
							
							// Stop event to prevent scrolling on space key in IE.
							// But don't do this for _HasDropDown because it surpresses the onkeypress
							// event needed to open the drop down when the user presses the SPACE key.
							if(!("openDropDown" in this && obj == this._buttonNode)){
								e.preventDefault();
							}
						}
			 		}),
					dc(obj, "onkeyup", this, function(e){
						//console.log(this.id + ": onkeyup, e.target = ", e.target, ", lastKeyDownNode was ", dijit._lastKeyDownNode, ", equality is ", (e.target === dijit._lastKeyDownNode));
						if( (e.keyCode == d.keys.ENTER || e.keyCode == d.keys.SPACE) &&
							e.target == dijit._lastKeyDownNode &&	// === breaks greasemonkey
							!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey){
								//need reset here or have problems in FF when focus returns to trigger element after closing popup/alert
								dijit._lastKeyDownNode = null;
								return m(e);
						}
					})
				);
			}
		}

		return handles;		// _Widget.Handle
	},

	////////////////// MISCELLANEOUS METHODS ///////////////////

	_onShow: function(){
		// summary:
		//		Internal method called when this widget is made visible.
		//		See `onShow` for details.
		this.onShow();
	},

	onShow: function(){
		// summary:
		//		Called when this widget becomes the selected pane in a
		//		`dijit.layout.TabContainer`, `dijit.layout.StackContainer`,
		//		`dijit.layout.AccordionContainer`, etc.
		//
		//		Also called to indicate display of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
		// tags:
		//		callback
	},

	onHide: function(){
		// summary:
			//		Called when another widget becomes the selected pane in a
			//		`dijit.layout.TabContainer`, `dijit.layout.StackContainer`,
			//		`dijit.layout.AccordionContainer`, etc.
			//
			//		Also called to indicate hide of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
			// tags:
			//		callback
	},

	onClose: function(){
		// summary:
		//		Called when this widget is being displayed as a popup (ex: a Calendar popped
		//		up from a DateTextBox), and it is hidden.
		//		This is called from the dijit.popup code, and should not be called directly.
		//
		//		Also used as a parameter for children of `dijit.layout.StackContainer` or subclasses.
		//		Callback if a user tries to close the child.   Child will be closed if this function returns true.
		// tags:
		//		extension

		return true;		// Boolean
	}
});

})();

}

if(!dojo._hasResource["dojo.fx.Toggler"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.fx.Toggler"] = true;
dojo.provide("dojo.fx.Toggler");


dojo.declare("dojo.fx.Toggler", null, {
	// summary:
	//		A simple `dojo.Animation` toggler API.
	//
	// description:
	//		class constructor for an animation toggler. It accepts a packed
	//		set of arguments about what type of animation to use in each
	//		direction, duration, etc. All available members are mixed into
	//		these animations from the constructor (for example, `node`,
	//		`showDuration`, `hideDuration`).
	//
	// example:
	//	|	var t = new dojo.fx.Toggler({
	//	|		node: "nodeId",
	//	|		showDuration: 500,
	//	|		// hideDuration will default to "200"
	//	|		showFunc: dojo.fx.wipeIn,
	//	|		// hideFunc will default to "fadeOut"
	//	|	});
	//	|	t.show(100); // delay showing for 100ms
	//	|	// ...time passes...
	//	|	t.hide();

	// node: DomNode
	//		the node to target for the showing and hiding animations
	node: null,

	// showFunc: Function
	//		The function that returns the `dojo.Animation` to show the node
	showFunc: dojo.fadeIn,

	// hideFunc: Function
	//		The function that returns the `dojo.Animation` to hide the node
	hideFunc: dojo.fadeOut,

	// showDuration:
	//		Time in milliseconds to run the show Animation
	showDuration: 200,

	// hideDuration:
	//		Time in milliseconds to run the hide Animation
	hideDuration: 200,

	// FIXME: need a policy for where the toggler should "be" the next
	// time show/hide are called if we're stopped somewhere in the
	// middle.
	// FIXME: also would be nice to specify individual showArgs/hideArgs mixed into
	// each animation individually.
	// FIXME: also would be nice to have events from the animations exposed/bridged

	/*=====
	_showArgs: null,
	_showAnim: null,

	_hideArgs: null,
	_hideAnim: null,

	_isShowing: false,
	_isHiding: false,
	=====*/

	constructor: function(args){
		var _t = this;

		dojo.mixin(_t, args);
		_t.node = args.node;
		_t._showArgs = dojo.mixin({}, args);
		_t._showArgs.node = _t.node;
		_t._showArgs.duration = _t.showDuration;
		_t.showAnim = _t.showFunc(_t._showArgs);

		_t._hideArgs = dojo.mixin({}, args);
		_t._hideArgs.node = _t.node;
		_t._hideArgs.duration = _t.hideDuration;
		_t.hideAnim = _t.hideFunc(_t._hideArgs);

		dojo.connect(_t.showAnim, "beforeBegin", dojo.hitch(_t.hideAnim, "stop", true));
		dojo.connect(_t.hideAnim, "beforeBegin", dojo.hitch(_t.showAnim, "stop", true));
	},

	show: function(delay){
		// summary: Toggle the node to showing
		// delay: Integer?
		//		Ammount of time to stall playing the show animation
		return this.showAnim.play(delay || 0);
	},

	hide: function(delay){
		// summary: Toggle the node to hidden
		// delay: Integer?
		//		Ammount of time to stall playing the hide animation
		return this.hideAnim.play(delay || 0);
	}
});

}

if(!dojo._hasResource["dojo.fx"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.fx"] = true;
dojo.provide("dojo.fx");



/*=====
dojo.fx = {
	// summary: Effects library on top of Base animations
};
=====*/
(function(){
	
	var d = dojo,
		_baseObj = {
			_fire: function(evt, args){
				if(this[evt]){
					this[evt].apply(this, args||[]);
				}
				return this;
			}
		};

	var _chain = function(animations){
		this._index = -1;
		this._animations = animations||[];
		this._current = this._onAnimateCtx = this._onEndCtx = null;

		this.duration = 0;
		d.forEach(this._animations, function(a){
			this.duration += a.duration;
			if(a.delay){ this.duration += a.delay; }
		}, this);
	};
	d.extend(_chain, {
		_onAnimate: function(){
			this._fire("onAnimate", arguments);
		},
		_onEnd: function(){
			d.disconnect(this._onAnimateCtx);
			d.disconnect(this._onEndCtx);
			this._onAnimateCtx = this._onEndCtx = null;
			if(this._index + 1 == this._animations.length){
				this._fire("onEnd");
			}else{
				// switch animations
				this._current = this._animations[++this._index];
				this._onAnimateCtx = d.connect(this._current, "onAnimate", this, "_onAnimate");
				this._onEndCtx = d.connect(this._current, "onEnd", this, "_onEnd");
				this._current.play(0, true);
			}
		},
		play: function(/*int?*/ delay, /*Boolean?*/ gotoStart){
			if(!this._current){ this._current = this._animations[this._index = 0]; }
			if(!gotoStart && this._current.status() == "playing"){ return this; }
			var beforeBegin = d.connect(this._current, "beforeBegin", this, function(){
					this._fire("beforeBegin");
				}),
				onBegin = d.connect(this._current, "onBegin", this, function(arg){
					this._fire("onBegin", arguments);
				}),
				onPlay = d.connect(this._current, "onPlay", this, function(arg){
					this._fire("onPlay", arguments);
					d.disconnect(beforeBegin);
					d.disconnect(onBegin);
					d.disconnect(onPlay);
				});
			if(this._onAnimateCtx){
				d.disconnect(this._onAnimateCtx);
			}
			this._onAnimateCtx = d.connect(this._current, "onAnimate", this, "_onAnimate");
			if(this._onEndCtx){
				d.disconnect(this._onEndCtx);
			}
			this._onEndCtx = d.connect(this._current, "onEnd", this, "_onEnd");
			this._current.play.apply(this._current, arguments);
			return this;
		},
		pause: function(){
			if(this._current){
				var e = d.connect(this._current, "onPause", this, function(arg){
						this._fire("onPause", arguments);
						d.disconnect(e);
					});
				this._current.pause();
			}
			return this;
		},
		gotoPercent: function(/*Decimal*/percent, /*Boolean?*/ andPlay){
			this.pause();
			var offset = this.duration * percent;
			this._current = null;
			d.some(this._animations, function(a){
				if(a.duration <= offset){
					this._current = a;
					return true;
				}
				offset -= a.duration;
				return false;
			});
			if(this._current){
				this._current.gotoPercent(offset / this._current.duration, andPlay);
			}
			return this;
		},
		stop: function(/*boolean?*/ gotoEnd){
			if(this._current){
				if(gotoEnd){
					for(; this._index + 1 < this._animations.length; ++this._index){
						this._animations[this._index].stop(true);
					}
					this._current = this._animations[this._index];
				}
				var e = d.connect(this._current, "onStop", this, function(arg){
						this._fire("onStop", arguments);
						d.disconnect(e);
					});
				this._current.stop();
			}
			return this;
		},
		status: function(){
			return this._current ? this._current.status() : "stopped";
		},
		destroy: function(){
			if(this._onAnimateCtx){ d.disconnect(this._onAnimateCtx); }
			if(this._onEndCtx){ d.disconnect(this._onEndCtx); }
		}
	});
	d.extend(_chain, _baseObj);

	dojo.fx.chain = function(/*dojo.Animation[]*/ animations){
		// summary:
		//		Chain a list of `dojo.Animation`s to run in sequence
		//
		// description:
		//		Return a `dojo.Animation` which will play all passed
		//		`dojo.Animation` instances in sequence, firing its own
		//		synthesized events simulating a single animation. (eg:
		//		onEnd of this animation means the end of the chain,
		//		not the individual animations within)
		//
		// example:
		//	Once `node` is faded out, fade in `otherNode`
		//	|	dojo.fx.chain([
		//	|		dojo.fadeIn({ node:node }),
		//	|		dojo.fadeOut({ node:otherNode })
		//	|	]).play();
		//
		return new _chain(animations) // dojo.Animation
	};

	var _combine = function(animations){
		this._animations = animations||[];
		this._connects = [];
		this._finished = 0;

		this.duration = 0;
		d.forEach(animations, function(a){
			var duration = a.duration;
			if(a.delay){ duration += a.delay; }
			if(this.duration < duration){ this.duration = duration; }
			this._connects.push(d.connect(a, "onEnd", this, "_onEnd"));
		}, this);
		
		this._pseudoAnimation = new d.Animation({curve: [0, 1], duration: this.duration});
		var self = this;
		d.forEach(["beforeBegin", "onBegin", "onPlay", "onAnimate", "onPause", "onStop", "onEnd"],
			function(evt){
				self._connects.push(d.connect(self._pseudoAnimation, evt,
					function(){ self._fire(evt, arguments); }
				));
			}
		);
	};
	d.extend(_combine, {
		_doAction: function(action, args){
			d.forEach(this._animations, function(a){
				a[action].apply(a, args);
			});
			return this;
		},
		_onEnd: function(){
			if(++this._finished > this._animations.length){
				this._fire("onEnd");
			}
		},
		_call: function(action, args){
			var t = this._pseudoAnimation;
			t[action].apply(t, args);
		},
		play: function(/*int?*/ delay, /*Boolean?*/ gotoStart){
			this._finished = 0;
			this._doAction("play", arguments);
			this._call("play", arguments);
			return this;
		},
		pause: function(){
			this._doAction("pause", arguments);
			this._call("pause", arguments);
			return this;
		},
		gotoPercent: function(/*Decimal*/percent, /*Boolean?*/ andPlay){
			var ms = this.duration * percent;
			d.forEach(this._animations, function(a){
				a.gotoPercent(a.duration < ms ? 1 : (ms / a.duration), andPlay);
			});
			this._call("gotoPercent", arguments);
			return this;
		},
		stop: function(/*boolean?*/ gotoEnd){
			this._doAction("stop", arguments);
			this._call("stop", arguments);
			return this;
		},
		status: function(){
			return this._pseudoAnimation.status();
		},
		destroy: function(){
			d.forEach(this._connects, dojo.disconnect);
		}
	});
	d.extend(_combine, _baseObj);

	dojo.fx.combine = function(/*dojo.Animation[]*/ animations){
		// summary:
		//		Combine a list of `dojo.Animation`s to run in parallel
		//
		// description:
		//		Combine an array of `dojo.Animation`s to run in parallel,
		//		providing a new `dojo.Animation` instance encompasing each
		//		animation, firing standard animation events.
		//
		// example:
		//	Fade out `node` while fading in `otherNode` simultaneously
		//	|	dojo.fx.combine([
		//	|		dojo.fadeIn({ node:node }),
		//	|		dojo.fadeOut({ node:otherNode })
		//	|	]).play();
		//
		// example:
		//	When the longest animation ends, execute a function:
		//	|	var anim = dojo.fx.combine([
		//	|		dojo.fadeIn({ node: n, duration:700 }),
		//	|		dojo.fadeOut({ node: otherNode, duration: 300 })
		//	|	]);
		//	|	dojo.connect(anim, "onEnd", function(){
		//	|		// overall animation is done.
		//	|	});
		//	|	anim.play(); // play the animation
		//
		return new _combine(animations); // dojo.Animation
	};

	dojo.fx.wipeIn = function(/*Object*/ args){
		// summary:
		//		Expand a node to it's natural height.
		//
		// description:
		//		Returns an animation that will expand the
		//		node defined in 'args' object from it's current height to
		//		it's natural height (with no scrollbar).
		//		Node must have no margin/border/padding.
		//
		// args: Object
		//		A hash-map of standard `dojo.Animation` constructor properties
		//		(such as easing: node: duration: and so on)
		//
		// example:
		//	|	dojo.fx.wipeIn({
		//	|		node:"someId"
		//	|	}).play()
		var node = args.node = d.byId(args.node), s = node.style, o;

		var anim = d.animateProperty(d.mixin({
			properties: {
				height: {
					// wrapped in functions so we wait till the last second to query (in case value has changed)
					start: function(){
						// start at current [computed] height, but use 1px rather than 0
						// because 0 causes IE to display the whole panel
						o = s.overflow;
						s.overflow = "hidden";
						if(s.visibility == "hidden" || s.display == "none"){
							s.height = "1px";
							s.display = "";
							s.visibility = "";
							return 1;
						}else{
							var height = d.style(node, "height");
							return Math.max(height, 1);
						}
					},
					end: function(){
						return node.scrollHeight;
					}
				}
			}
		}, args));

		d.connect(anim, "onEnd", function(){
			s.height = "auto";
			s.overflow = o;
		});

		return anim; // dojo.Animation
	};

	dojo.fx.wipeOut = function(/*Object*/ args){
		// summary:
		//		Shrink a node to nothing and hide it.
		//
		// description:
		//		Returns an animation that will shrink node defined in "args"
		//		from it's current height to 1px, and then hide it.
		//
		// args: Object
		//		A hash-map of standard `dojo.Animation` constructor properties
		//		(such as easing: node: duration: and so on)
		//
		// example:
		//	|	dojo.fx.wipeOut({ node:"someId" }).play()
		
		var node = args.node = d.byId(args.node), s = node.style, o;
		
		var anim = d.animateProperty(d.mixin({
			properties: {
				height: {
					end: 1 // 0 causes IE to display the whole panel
				}
			}
		}, args));

		d.connect(anim, "beforeBegin", function(){
			o = s.overflow;
			s.overflow = "hidden";
			s.display = "";
		});
		d.connect(anim, "onEnd", function(){
			s.overflow = o;
			s.height = "auto";
			s.display = "none";
		});

		return anim; // dojo.Animation
	};

	dojo.fx.slideTo = function(/*Object*/ args){
		// summary:
		//		Slide a node to a new top/left position
		//
		// description:
		//		Returns an animation that will slide "node"
		//		defined in args Object from its current position to
		//		the position defined by (args.left, args.top).
		//
		// args: Object
		//		A hash-map of standard `dojo.Animation` constructor properties
		//		(such as easing: node: duration: and so on). Special args members
		//		are `top` and `left`, which indicate the new position to slide to.
		//
		// example:
		//	|	dojo.fx.slideTo({ node: node, left:"40", top:"50", units:"px" }).play()

		var node = args.node = d.byId(args.node),
			top = null, left = null;

		var init = (function(n){
			return function(){
				var cs = d.getComputedStyle(n);
				var pos = cs.position;
				top = (pos == 'absolute' ? n.offsetTop : parseInt(cs.top) || 0);
				left = (pos == 'absolute' ? n.offsetLeft : parseInt(cs.left) || 0);
				if(pos != 'absolute' && pos != 'relative'){
					var ret = d.position(n, true);
					top = ret.y;
					left = ret.x;
					n.style.position="absolute";
					n.style.top=top+"px";
					n.style.left=left+"px";
				}
			};
		})(node);
		init();

		var anim = d.animateProperty(d.mixin({
			properties: {
				top: args.top || 0,
				left: args.left || 0
			}
		}, args));
		d.connect(anim, "beforeBegin", anim, init);

		return anim; // dojo.Animation
	};

})();

}

if(!dojo._hasResource["dojo.NodeList-fx"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.NodeList-fx"] = true;
dojo.provide("dojo.NodeList-fx");



/*=====
dojo["NodeList-fx"] = {
	// summary: Adds dojo.fx animation support to dojo.query()
};
=====*/

dojo.extend(dojo.NodeList, {
	_anim: function(obj, method, args){
		args = args||{};
		var a = dojo.fx.combine(
			this.map(function(item){
				var tmpArgs = { node: item };
				dojo.mixin(tmpArgs, args);
				return obj[method](tmpArgs);
			})
		);
		return args.auto ? a.play() && this : a; // dojo.Animation|dojo.NodeList
	},

	wipeIn: function(args){
		//	summary:
		//		wipe in all elements of this NodeList via `dojo.fx.wipeIn`
		//
		//	args: Object?
		//		Additional dojo.Animation arguments to mix into this set with the addition of
		//		an `auto` parameter.
		//
		//	returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//		Fade in all tables with class "blah":
		//		|	dojo.query("table.blah").wipeIn().play();
		//
		//	example:
		//		Utilizing `auto` to get the NodeList back:
		//		|	dojo.query(".titles").wipeIn({ auto:true }).onclick(someFunction);
		//
		return this._anim(dojo.fx, "wipeIn", args); // dojo.Animation|dojo.NodeList
	},

	wipeOut: function(args){
		//	summary:
		//		wipe out all elements of this NodeList via `dojo.fx.wipeOut`
		//
		//	args: Object?
		//		Additional dojo.Animation arguments to mix into this set with the addition of
		//		an `auto` parameter.
		//
		//	returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//		Wipe out all tables with class "blah":
		//		|	dojo.query("table.blah").wipeOut().play();
		return this._anim(dojo.fx, "wipeOut", args); // dojo.Animation|dojo.NodeList
	},

	slideTo: function(args){
		//	summary:
		//		slide all elements of the node list to the specified place via `dojo.fx.slideTo`
		//
		//	args: Object?
		//		Additional dojo.Animation arguments to mix into this set with the addition of
		//		an `auto` parameter.
		//
		//	returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//		|	Move all tables with class "blah" to 300/300:
		//		|	dojo.query("table.blah").slideTo({
		//		|		left: 40,
		//		|		top: 50
		//		|	}).play();
		return this._anim(dojo.fx, "slideTo", args); // dojo.Animation|dojo.NodeList
	},


	fadeIn: function(args){
		//	summary:
		//		fade in all elements of this NodeList via `dojo.fadeIn`
		//
		//	args: Object?
		//		Additional dojo.Animation arguments to mix into this set with the addition of
		//		an `auto` parameter.
		//
		//	returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//		Fade in all tables with class "blah":
		//		|	dojo.query("table.blah").fadeIn().play();
		return this._anim(dojo, "fadeIn", args); // dojo.Animation|dojo.NodeList
	},

	fadeOut: function(args){
		//	summary:
		//		fade out all elements of this NodeList via `dojo.fadeOut`
		//
		//	args: Object?
		//		Additional dojo.Animation arguments to mix into this set with the addition of
		//		an `auto` parameter.
		//
		//	returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//		Fade out all elements with class "zork":
		//		|	dojo.query(".zork").fadeOut().play();
		//	example:
		//		Fade them on a delay and do something at the end:
		//		|	var fo = dojo.query(".zork").fadeOut();
		//		|	dojo.connect(fo, "onEnd", function(){ /*...*/ });
		//		|	fo.play();
		//	example:
		//		Using `auto`:
		//		|	dojo.query("li").fadeOut({ auto:true }).filter(filterFn).forEach(doit);
		//
		return this._anim(dojo, "fadeOut", args); // dojo.Animation|dojo.NodeList
	},

	animateProperty: function(args){
		//	summary:
		//		Animate all elements of this NodeList across the properties specified.
		//		syntax identical to `dojo.animateProperty`
		//
		// returns: dojo.Animation|dojo.NodeList
		//		A special args member `auto` can be passed to automatically play the animation.
		//		If args.auto is present, the original dojo.NodeList will be returned for further
		//		chaining. Otherwise the dojo.Animation instance is returned and must be .play()'ed
		//
		//	example:
		//	|	dojo.query(".zork").animateProperty({
		//	|		duration: 500,
		//	|		properties: {
		//	|			color:		{ start: "black", end: "white" },
		//	|			left:		{ end: 300 }
		//	|		}
		//	|	}).play();
		//
		//	example:
		//	|	dojo.query(".grue").animateProperty({
		//	|		auto:true,
		//	|		properties: {
		//	|			height:240
		//	|		}
		//	|	}).onclick(handler);
		return this._anim(dojo, "animateProperty", args); // dojo.Animation|dojo.NodeList
	},

	anim: function( /*Object*/			properties,
					/*Integer?*/		duration,
					/*Function?*/		easing,
					/*Function?*/		onEnd,
					/*Integer?*/		delay){
		//	summary:
		//		Animate one or more CSS properties for all nodes in this list.
		//		The returned animation object will already be playing when it
		//		is returned. See the docs for `dojo.anim` for full details.
		//	properties: Object
		//		the properties to animate. does NOT support the `auto` parameter like other
		//		NodeList-fx methods.
		//	duration: Integer?
		//		Optional. The time to run the animations for
		//	easing: Function?
		//		Optional. The easing function to use.
		//	onEnd: Function?
		//		A function to be called when the animation ends
		//	delay:
		//		how long to delay playing the returned animation
		//	example:
		//		Another way to fade out:
		//	|	dojo.query(".thinger").anim({ opacity: 0 });
		//	example:
		//		animate all elements with the "thigner" class to a width of 500
		//		pixels over half a second
		//	|	dojo.query(".thinger").anim({ width: 500 }, 700);
		var canim = dojo.fx.combine(
			this.map(function(item){
				return dojo.animateProperty({
					node: item,
					properties: properties,
					duration: duration||350,
					easing: easing
				});
			})
		);
		if(onEnd){
			dojo.connect(canim, "onEnd", onEnd);
		}
		return canim.play(delay||0); // dojo.Animation
	}
});

}

if(!dojo._hasResource["dojox.fx.Shadow"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.fx.Shadow"] = true;
dojo.provide("dojox.fx.Shadow");
dojo.experimental("dojox.fx.Shadow");




dojo.declare("dojox.fx.Shadow",
	dijit._Widget,{
	// summary: Adds a drop-shadow to a node.
	//
	// example:
	// |	// add drop shadows to all nodes with class="hasShadow"
	// |	dojo.query(".hasShadow").forEach(function(n){
	// |		var foo = new dojox.fx.Shadow({ node: n });
	// |		foo.startup();
	// |	});
	//
	// shadowPng: String
	// 	Base location for drop-shadow images
	shadowPng: dojo.moduleUrl("dojox.fx", "resources/shadow"),

	// shadowThickness: Integer
	// 	How wide (in px) to make the shadow
	shadowThickness: 7,

	// shadowOffset: Integer
	//	How deep to make the shadow appear to be
	shadowOffset: 3,

	// opacity: Float
	//	Overall opacity of the shadow
	opacity: 0.75,

	// animate: Boolean
	// 	A toggle to disable animated transitions
	animate: false,

	// node: DomNode
	// 	The node we will be applying this shadow to
	node: null,

	startup: function(){
		// summary: Initializes the shadow.

		this.inherited(arguments);
		this.node.style.position = "relative";
		// make all the pieces of the shadow, and position/size them as much
		// as possible (but a lot of the coordinates are set in sizeShadow
		this.pieces={};
		var x1 = -1 * this.shadowThickness;
		var y0 = this.shadowOffset;
		var y1 = this.shadowOffset + this.shadowThickness;
		this._makePiece("tl", "top", y0, "left", x1);
		this._makePiece("l", "top", y1, "left", x1, "scale");
		this._makePiece("tr", "top", y0, "left", 0);
		this._makePiece("r", "top", y1, "left", 0, "scale");
		this._makePiece("bl", "top", 0, "left", x1);
		this._makePiece("b", "top", 0, "left", 0, "crop");
		this._makePiece("br", "top", 0, "left", 0);

		this.nodeList = dojo.query(".shadowPiece",this.node);

		this.setOpacity(this.opacity);
		this.resize();
	},

	_makePiece: function(name, vertAttach, vertCoord, horzAttach, horzCoord, sizing){
		// summary: append a shadow pieces to the node, and position it
		var img;
		var url = this.shadowPng + name.toUpperCase() + ".png";
		if(dojo.isIE < 7){
			img = dojo.create("div");
			img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"'"+
				(sizing?", sizingMethod='"+sizing+"'":"") + ")";
		}else{
			img = dojo.create("img", { src:url });
		}

		img.style.position="absolute";
		img.style[vertAttach]=vertCoord+"px";
		img.style[horzAttach]=horzCoord+"px";
		img.style.width=this.shadowThickness+"px";
		img.style.height=this.shadowThickness+"px";
		dojo.addClass(img,"shadowPiece");
		this.pieces[name]=img;
		this.node.appendChild(img);

	},

	setOpacity: function(/* Float */n,/* Object? */animArgs){
		// summary: set the opacity of the underlay
		// note: does not work in IE? FIXME.
		if(dojo.isIE){ return; }
		if(!animArgs){ animArgs = {}; }
		if(this.animate){
			var _anims = [];
			this.nodeList.forEach(function(node){
				_anims.push(dojo._fade(dojo.mixin(animArgs,{ node: node, end: n })));
			});
			dojo.fx.combine(_anims).play();
		}else{
			this.nodeList.style("opacity",n);
		}

	},

	setDisabled: function(/* Boolean */disabled){
		// summary: enable / disable the shadow
		if(disabled){
			if(this.disabled){ return; }
			if(this.animate){ this.nodeList.fadeOut().play();
			}else{ this.nodeList.style("visibility","hidden"); }
			this.disabled = true;
		}else{
			if(!this.disabled){ return; }
			if(this.animate){ this.nodeList.fadeIn().play();
			}else{ this.nodeList.style("visibility","visible"); }
			this.disabled = false;
		}
	},

	resize: function(/* dojox.fx._arg.ShadowResizeArgs */args){
		// summary: Resizes the shadow based on width and height.
		var x; var y;
		if(args){ x = args.x; y = args.y;
		}else{
			var co = dojo._getBorderBox(this.node);
			x = co.w; y = co.h;
		}
		var sideHeight = y - (this.shadowOffset+this.shadowThickness);
		if (sideHeight < 0) { sideHeight = 0; }
		if (y < 1) { y = 1; }
		if (x < 1) { x = 1; }
		with(this.pieces){
			l.style.height = sideHeight+"px";
			r.style.height = sideHeight+"px";
			b.style.width = x+"px";
			bl.style.top = y+"px";
			b.style.top = y+"px";
			br.style.top = y+"px";
			tr.style.left = x+"px";
			r.style.left = x+"px";
			br.style.left = x+"px";
		}
	}
});

}

if(!dojo._hasResource["dojo.string"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.string"] = true;
dojo.provide("dojo.string");

dojo.getObject("string", true, dojo);

/*=====
dojo.string = {
	// summary: String utilities for Dojo
};
=====*/

dojo.string.rep = function(/*String*/str, /*Integer*/num){
	//	summary:
	//		Efficiently replicate a string `n` times.
	//	str:
	//		the string to replicate
	//	num:
	//		number of times to replicate the string
	
	if(num <= 0 || !str){ return ""; }
	
	var buf = [];
	for(;;){
		if(num & 1){
			buf.push(str);
		}
		if(!(num >>= 1)){ break; }
		str += str;
	}
	return buf.join("");	// String
};

dojo.string.pad = function(/*String*/text, /*Integer*/size, /*String?*/ch, /*Boolean?*/end){
	//	summary:
	//		Pad a string to guarantee that it is at least `size` length by
	//		filling with the character `ch` at either the start or end of the
	//		string. Pads at the start, by default.
	//	text:
	//		the string to pad
	//	size:
	//		length to provide padding
	//	ch:
	//		character to pad, defaults to '0'
	//	end:
	//		adds padding at the end if true, otherwise pads at start
	//	example:
	//	|	// Fill the string to length 10 with "+" characters on the right.  Yields "Dojo++++++".
	//	|	dojo.string.pad("Dojo", 10, "+", true);

	if(!ch){
		ch = '0';
	}
	var out = String(text),
		pad = dojo.string.rep(ch, Math.ceil((size - out.length) / ch.length));
	return end ? out + pad : pad + out;	// String
};

dojo.string.substitute = function(	/*String*/		template,
									/*Object|Array*/map,
									/*Function?*/	transform,
									/*Object?*/		thisObject){
	//	summary:
	//		Performs parameterized substitutions on a string. Throws an
	//		exception if any parameter is unmatched.
	//	template:
	//		a string with expressions in the form `${key}` to be replaced or
	//		`${key:format}` which specifies a format function. keys are case-sensitive.
	//	map:
	//		hash to search for substitutions
	//	transform:
	//		a function to process all parameters before substitution takes
	//		place, e.g. mylib.encodeXML
	//	thisObject:
	//		where to look for optional format function; default to the global
	//		namespace
	//	example:
	//		Substitutes two expressions in a string from an Array or Object
	//	|	// returns "File 'foo.html' is not found in directory '/temp'."
	//	|	// by providing substitution data in an Array
	//	|	dojo.string.substitute(
	//	|		"File '${0}' is not found in directory '${1}'.",
	//	|		["foo.html","/temp"]
	//	|	);
	//	|
	//	|	// also returns "File 'foo.html' is not found in directory '/temp'."
	//	|	// but provides substitution data in an Object structure.  Dotted
	//	|	// notation may be used to traverse the structure.
	//	|	dojo.string.substitute(
	//	|		"File '${name}' is not found in directory '${info.dir}'.",
	//	|		{ name: "foo.html", info: { dir: "/temp" } }
	//	|	);
	//	example:
	//		Use a transform function to modify the values:
	//	|	// returns "file 'foo.html' is not found in directory '/temp'."
	//	|	dojo.string.substitute(
	//	|		"${0} is not found in ${1}.",
	//	|		["foo.html","/temp"],
	//	|		function(str){
	//	|			// try to figure out the type
	//	|			var prefix = (str.charAt(0) == "/") ? "directory": "file";
	//	|			return prefix + " '" + str + "'";
	//	|		}
	//	|	);
	//	example:
	//		Use a formatter
	//	|	// returns "thinger -- howdy"
	//	|	dojo.string.substitute(
	//	|		"${0:postfix}", ["thinger"], null, {
	//	|			postfix: function(value, key){
	//	|				return value + " -- howdy";
	//	|			}
	//	|		}
	//	|	);

	thisObject = thisObject || dojo.global;
	transform = transform ?
		dojo.hitch(thisObject, transform) : function(v){ return v; };

	return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
		function(match, key, format){
			var value = dojo.getObject(key, false, map);
			if(format){
				value = dojo.getObject(format, false, thisObject).call(thisObject, value, key);
			}
			return transform(value, key).toString();
		}); // String
};

/*=====
dojo.string.trim = function(str){
	//	summary:
	//		Trims whitespace from both sides of the string
	//	str: String
	//		String to be trimmed
	//	returns: String
	//		Returns the trimmed string
	//	description:
	//		This version of trim() was taken from [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript).
	//		The short yet performant version of this function is dojo.trim(),
	//		which is part of Dojo base.  Uses String.prototype.trim instead, if available.
	return "";	// String
}
=====*/

dojo.string.trim = String.prototype.trim ?
	dojo.trim : // aliasing to the native function
	function(str){
		str = str.replace(/^\s+/, '');
		for(var i = str.length - 1; i >= 0; i--){
			if(/\S/.test(str.charAt(i))){
				str = str.substring(0, i + 1);
				break;
			}
		}
		return str;
	};

}

if(!dojo._hasResource["dojo.cache"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cache"] = true;
dojo.provide("dojo.cache");


/*=====
dojo.cache = {
	// summary:
	// 		A way to cache string content that is fetchable via `dojo.moduleUrl`.
};
=====*/

	var cache = {};
	dojo.cache = function(/*String||Object*/module, /*String*/url, /*String||Object?*/value){
		// summary:
		// 		A getter and setter for storing the string content associated with the
		// 		module and url arguments.
		// description:
		// 		module and url are used to call `dojo.moduleUrl()` to generate a module URL.
		// 		If value is specified, the cache value for the moduleUrl will be set to
		// 		that value. Otherwise, dojo.cache will fetch the moduleUrl and store it
		// 		in its internal cache and return that cached value for the URL. To clear
		// 		a cache value pass null for value. Since XMLHttpRequest (XHR) is used to fetch the
		// 		the URL contents, only modules on the same domain of the page can use this capability.
		// 		The build system can inline the cache values though, to allow for xdomain hosting.
		// module: String||Object
		// 		If a String, the module name to use for the base part of the URL, similar to module argument
		// 		to `dojo.moduleUrl`. If an Object, something that has a .toString() method that
		// 		generates a valid path for the cache item. For example, a dojo._Url object.
		// url: String
		// 		The rest of the path to append to the path derived from the module argument. If
		// 		module is an object, then this second argument should be the "value" argument instead.
		// value: String||Object?
		// 		If a String, the value to use in the cache for the module/url combination.
		// 		If an Object, it can have two properties: value and sanitize. The value property
		// 		should be the value to use in the cache, and sanitize can be set to true or false,
		// 		to indicate if XML declarations should be removed from the value and if the HTML
		// 		inside a body tag in the value should be extracted as the real value. The value argument
		// 		or the value property on the value argument are usually only used by the build system
		// 		as it inlines cache content.
		//	example:
		//		To ask dojo.cache to fetch content and store it in the cache (the dojo["cache"] style
		// 		of call is used to avoid an issue with the build system erroneously trying to intern
		// 		this example. To get the build system to intern your dojo.cache calls, use the
		// 		"dojo.cache" style of call):
		// 		|	//If template.html contains "<h1>Hello</h1>" that will be
		// 		|	//the value for the text variable.
		//		|	var text = dojo["cache"]("my.module", "template.html");
		//	example:
		//		To ask dojo.cache to fetch content and store it in the cache, and sanitize the input
		// 		 (the dojo["cache"] style of call is used to avoid an issue with the build system
		// 		erroneously trying to intern this example. To get the build system to intern your
		// 		dojo.cache calls, use the "dojo.cache" style of call):
		// 		|	//If template.html contains "<html><body><h1>Hello</h1></body></html>", the
		// 		|	//text variable will contain just "<h1>Hello</h1>".
		//		|	var text = dojo["cache"]("my.module", "template.html", {sanitize: true});
		//	example:
		//		Same example as previous, but demostrates how an object can be passed in as
		//		the first argument, then the value argument can then be the second argument.
		// 		|	//If template.html contains "<html><body><h1>Hello</h1></body></html>", the
		// 		|	//text variable will contain just "<h1>Hello</h1>".
		//		|	var text = dojo["cache"](new dojo._Url("my/module/template.html"), {sanitize: true});

		//Module could be a string, or an object that has a toString() method
		//that will return a useful path. If it is an object, then the "url" argument
		//will actually be the value argument.
		if(typeof module == "string"){
			var pathObj = dojo.moduleUrl(module, url);
		}else{
			pathObj = module;
			value = url;
		}
		var key = pathObj.toString();

		var val = value;
		if(value != undefined && !dojo.isString(value)){
			val = ("value" in value ? value.value : undefined);
		}

		var sanitize = value && value.sanitize ? true : false;

		if(typeof val == "string"){
			//We have a string, set cache value
			val = cache[key] = sanitize ? dojo.cache._sanitize(val) : val;
		}else if(val === null){
			//Remove cached value
			delete cache[key];
		}else{
			//Allow cache values to be empty strings. If key property does
			//not exist, fetch it.
			if(!(key in cache)){
				val = dojo._getText(key);
				cache[key] = sanitize ? dojo.cache._sanitize(val) : val;
			}
			val = cache[key];
		}
		return val; //String
	};

	dojo.cache._sanitize = function(/*String*/val){
		// summary:
		//		Strips <?xml ...?> declarations so that external SVG and XML
		// 		documents can be added to a document without worry. Also, if the string
		//		is an HTML document, only the part inside the body tag is returned.
		// description:
		// 		Copied from dijit._Templated._sanitizeTemplateString.
		if(val){
			val = val.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, "");
			var matches = val.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
			if(matches){
				val = matches[1];
			}
		}else{
			val = "";
		}
		return val; //String
	};

}

if(!dojo._hasResource["dijit._Templated"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Templated"] = true;
dojo.provide("dijit._Templated");






dojo.declare("dijit._Templated",
	null,
	{
		// summary:
		//		Mixin for widgets that are instantiated from a template

		// templateString: [protected] String
		//		A string that represents the widget template. Pre-empts the
		//		templatePath. In builds that have their strings "interned", the
		//		templatePath is converted to an inline templateString, thereby
		//		preventing a synchronous network call.
		//
		//		Use in conjunction with dojo.cache() to load from a file.
		templateString: null,

		// templatePath: [protected deprecated] String
		//		Path to template (HTML file) for this widget relative to dojo.baseUrl.
		//		Deprecated: use templateString with dojo.cache() instead.
		templatePath: null,

		// widgetsInTemplate: [protected] Boolean
		//		Should we parse the template to find widgets that might be
		//		declared in markup inside it?  False by default.
		widgetsInTemplate: false,

		// skipNodeCache: [protected] Boolean
		//		If using a cached widget template node poses issues for a
		//		particular widget class, it can set this property to ensure
		//		that its template is always re-built from a string
		_skipNodeCache: false,

		// _earlyTemplatedStartup: Boolean
		//		A fallback to preserve the 1.0 - 1.3 behavior of children in
		//		templates having their startup called before the parent widget
		//		fires postCreate. Defaults to 'false', causing child widgets to
		//		have their .startup() called immediately before a parent widget
		//		.startup(), but always after the parent .postCreate(). Set to
		//		'true' to re-enable to previous, arguably broken, behavior.
		_earlyTemplatedStartup: false,

/*=====
		// _attachPoints: [private] String[]
		//		List of widget attribute names associated with dojoAttachPoint=... in the
		//		template, ex: ["containerNode", "labelNode"]
 		_attachPoints: [],
 =====*/

/*=====
		// _attachEvents: [private] Handle[]
		//		List of connections associated with dojoAttachEvent=... in the
		//		template
 		_attachEvents: [],
 =====*/

		constructor: function(){
			this._attachPoints = [];
			this._attachEvents = [];
		},

		_stringRepl: function(tmpl){
			// summary:
			//		Does substitution of ${foo} type properties in template string
			// tags:
			//		private
			var className = this.declaredClass, _this = this;
			// Cache contains a string because we need to do property replacement
			// do the property replacement
			return dojo.string.substitute(tmpl, this, function(value, key){
				if(key.charAt(0) == '!'){ value = dojo.getObject(key.substr(1), false, _this); }
				if(typeof value == "undefined"){ throw new Error(className+" template:"+key); } // a debugging aide
				if(value == null){ return ""; }

				// Substitution keys beginning with ! will skip the transform step,
				// in case a user wishes to insert unescaped markup, e.g. ${!foo}
				return key.charAt(0) == "!" ? value :
					// Safer substitution, see heading "Attribute values" in
					// http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
					value.toString().replace(/"/g,"&quot;"); //TODO: add &amp? use encodeXML method?
			}, this);
		},

		buildRendering: function(){
			// summary:
			//		Construct the UI for this widget from a template, setting this.domNode.
			// tags:
			//		protected

			// Lookup cached version of template, and download to cache if it
			// isn't there already.  Returns either a DomNode or a string, depending on
			// whether or not the template contains ${foo} replacement parameters.
			var cached = dijit._Templated.getCachedTemplate(this.templatePath, this.templateString, this._skipNodeCache);

			var node;
			if(dojo.isString(cached)){
				node = dojo._toDom(this._stringRepl(cached));
				if(node.nodeType != 1){
					// Flag common problems such as templates with multiple top level nodes (nodeType == 11)
					throw new Error("Invalid template: " + cached);
				}
			}else{
				// if it's a node, all we have to do is clone it
				node = cached.cloneNode(true);
			}

			this.domNode = node;

			// Call down to _Widget.buildRendering() to get base classes assigned
			// TODO: change the baseClass assignment to attributeMap
			this.inherited(arguments);

			// recurse through the node, looking for, and attaching to, our
			// attachment points and events, which should be defined on the template node.
			this._attachTemplateNodes(node);

			if(this.widgetsInTemplate){
				// Store widgets that we need to start at a later point in time
				var cw = (this._startupWidgets = dojo.parser.parse(node, {
					noStart: !this._earlyTemplatedStartup,
					template: true,
					inherited: {dir: this.dir, lang: this.lang},
					propsThis: this,	// so data-dojo-props of widgets in the template can reference "this" to refer to me
					scope: "dojo"	// even in multi-version mode templates use dojoType/data-dojo-type
				}));

				this._supportingWidgets = dijit.findWidgets(node);

				this._attachTemplateNodes(cw, function(n,p){
					return n[p];
				});
			}

			this._fillContent(this.srcNodeRef);
		},

		_fillContent: function(/*DomNode*/ source){
			// summary:
			//		Relocate source contents to templated container node.
			//		this.containerNode must be able to receive children, or exceptions will be thrown.
			// tags:
			//		protected
			var dest = this.containerNode;
			if(source && dest){
				while(source.hasChildNodes()){
					dest.appendChild(source.firstChild);
				}
			}
		},

		_attachTemplateNodes: function(rootNode, getAttrFunc){
			// summary:
			//		Iterate through the template and attach functions and nodes accordingly.
			//		Alternately, if rootNode is an array of widgets, then will process dojoAttachPoint
			//		etc. for those widgets.
			// description:
			//		Map widget properties and functions to the handlers specified in
			//		the dom node and it's descendants. This function iterates over all
			//		nodes and looks for these properties:
			//			* dojoAttachPoint
			//			* dojoAttachEvent
			//			* waiRole
			//			* waiState
			// rootNode: DomNode|Array[Widgets]
			//		the node to search for properties. All children will be searched.
			// getAttrFunc: Function?
			//		a function which will be used to obtain property for a given
			//		DomNode/Widget
			// tags:
			//		private

			getAttrFunc = getAttrFunc || function(n,p){ return n.getAttribute(p); };

			var nodes = dojo.isArray(rootNode) ? rootNode : (rootNode.all || rootNode.getElementsByTagName("*"));
			var x = dojo.isArray(rootNode) ? 0 : -1;
			for(; x<nodes.length; x++){
				var baseNode = (x == -1) ? rootNode : nodes[x];
				if(this.widgetsInTemplate && (getAttrFunc(baseNode, "dojoType") || getAttrFunc(baseNode, "data-dojo-type"))){
					continue;
				}
				// Process dojoAttachPoint
				var attachPoint = getAttrFunc(baseNode, "dojoAttachPoint") || getAttrFunc(baseNode, "data-dojo-attach-point");
				if(attachPoint){
					var point, points = attachPoint.split(/\s*,\s*/);
					while((point = points.shift())){
						if(dojo.isArray(this[point])){
							this[point].push(baseNode);
						}else{
							this[point]=baseNode;
						}
						this._attachPoints.push(point);
					}
				}

				// Process dojoAttachEvent
				var attachEvent = getAttrFunc(baseNode, "dojoAttachEvent") || getAttrFunc(baseNode, "data-dojo-attach-event");;
				if(attachEvent){
					// NOTE: we want to support attributes that have the form
					// "domEvent: nativeEvent; ..."
					var event, events = attachEvent.split(/\s*,\s*/);
					var trim = dojo.trim;
					while((event = events.shift())){
						if(event){
							var thisFunc = null;
							if(event.indexOf(":") != -1){
								// oh, if only JS had tuple assignment
								var funcNameArr = event.split(":");
								event = trim(funcNameArr[0]);
								thisFunc = trim(funcNameArr[1]);
							}else{
								event = trim(event);
							}
							if(!thisFunc){
								thisFunc = event;
							}
							this._attachEvents.push(this.connect(baseNode, event, thisFunc));
						}
					}
				}

				// waiRole, waiState
				// TODO: remove this in 2.0, templates are now using role=... and aria-XXX=... attributes directicly
				var role = getAttrFunc(baseNode, "waiRole");
				if(role){
					dijit.setWaiRole(baseNode, role);
				}
				var values = getAttrFunc(baseNode, "waiState");
				if(values){
					dojo.forEach(values.split(/\s*,\s*/), function(stateValue){
						if(stateValue.indexOf('-') != -1){
							var pair = stateValue.split('-');
							dijit.setWaiState(baseNode, pair[0], pair[1]);
						}
					});
				}
			}
		},

		startup: function(){
			dojo.forEach(this._startupWidgets, function(w){
				if(w && !w._started && w.startup){
					w.startup();
				}
			});
			this.inherited(arguments);
		},

		destroyRendering: function(){
			// Delete all attach points to prevent IE6 memory leaks.
			dojo.forEach(this._attachPoints, function(point){
				delete this[point];
			}, this);
			this._attachPoints = [];

			// And same for event handlers
			dojo.forEach(this._attachEvents, this.disconnect, this);
			this._attachEvents = [];
			
			this.inherited(arguments);
		}
	}
);

// key is either templatePath or templateString; object is either string or DOM tree
dijit._Templated._templateCache = {};

dijit._Templated.getCachedTemplate = function(templatePath, templateString, alwaysUseString){
	// summary:
	//		Static method to get a template based on the templatePath or
	//		templateString key
	// templatePath: String||dojo.uri.Uri
	//		The URL to get the template from.
	// templateString: String?
	//		a string to use in lieu of fetching the template from a URL. Takes precedence
	//		over templatePath
	// returns: Mixed
	//		Either string (if there are ${} variables that need to be replaced) or just
	//		a DOM tree (if the node can be cloned directly)

	// is it already cached?
	var tmplts = dijit._Templated._templateCache;
	var key = templateString || templatePath;
	var cached = tmplts[key];
	if(cached){
		try{
			// if the cached value is an innerHTML string (no ownerDocument) or a DOM tree created within the current document, then use the current cached value
			if(!cached.ownerDocument || cached.ownerDocument == dojo.doc){
				// string or node of the same document
				return cached;
			}
		}catch(e){ /* squelch */ } // IE can throw an exception if cached.ownerDocument was reloaded
		dojo.destroy(cached);
	}

	// If necessary, load template string from template path
	if(!templateString){
		templateString = dojo.cache(templatePath, {sanitize: true});
	}
	templateString = dojo.string.trim(templateString);

	if(alwaysUseString || templateString.match(/\$\{([^\}]+)\}/g)){
		// there are variables in the template so all we can do is cache the string
		return (tmplts[key] = templateString); //String
	}else{
		// there are no variables in the template so we can cache the DOM tree
		var node = dojo._toDom(templateString);
		if(node.nodeType != 1){
			throw new Error("Invalid template: " + templateString);
		}
		return (tmplts[key] = node); //Node
	}
};

if(dojo.isIE){
	dojo.addOnWindowUnload(function(){
		var cache = dijit._Templated._templateCache;
		for(var key in cache){
			var value = cache[key];
			if(typeof value == "object"){ // value is either a string or a DOM node template
				dojo.destroy(value);
			}
			delete cache[key];
		}
	});
}

// These arguments can be specified for widgets which are used in templates.
// Since any widget can be specified as sub widgets in template, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget,{
	dojoAttachEvent: "",
	dojoAttachPoint: "",
	waiRole: "",
	waiState:""
});

}

if(!dojo._hasResource["dojo.dnd.common"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.common"] = true;
dojo.provide("dojo.dnd.common");

dojo.getObject("dnd", true, dojo);

dojo.dnd.getCopyKeyState = dojo.isCopyKey;

dojo.dnd._uniqueId = 0;
dojo.dnd.getUniqueId = function(){
	// summary:
	//		returns a unique string for use with any DOM element
	var id;
	do{
		id = dojo._scopeName + "Unique" + (++dojo.dnd._uniqueId);
	}while(dojo.byId(id));
	return id;
};

dojo.dnd._empty = {};

dojo.dnd.isFormElement = function(/*Event*/ e){
	// summary:
	//		returns true if user clicked on a form element
	var t = e.target;
	if(t.nodeType == 3 /*TEXT_NODE*/){
		t = t.parentNode;
	}
	return " button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;	// Boolean
};

}

if(!dojo._hasResource["dojo.dnd.autoscroll"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.autoscroll"] = true;
dojo.provide("dojo.dnd.autoscroll");


dojo.getObject("dnd", true, dojo);

dojo.dnd.getViewport = dojo.window.getBox;

dojo.dnd.V_TRIGGER_AUTOSCROLL = 32;
dojo.dnd.H_TRIGGER_AUTOSCROLL = 32;

dojo.dnd.V_AUTOSCROLL_VALUE = 16;
dojo.dnd.H_AUTOSCROLL_VALUE = 16;

dojo.dnd.autoScroll = function(e){
	// summary:
	//		a handler for onmousemove event, which scrolls the window, if
	//		necesary
	// e: Event
	//		onmousemove event

	// FIXME: needs more docs!
	var v = dojo.window.getBox(), dx = 0, dy = 0;
	if(e.clientX < dojo.dnd.H_TRIGGER_AUTOSCROLL){
		dx = -dojo.dnd.H_AUTOSCROLL_VALUE;
	}else if(e.clientX > v.w - dojo.dnd.H_TRIGGER_AUTOSCROLL){
		dx = dojo.dnd.H_AUTOSCROLL_VALUE;
	}
	if(e.clientY < dojo.dnd.V_TRIGGER_AUTOSCROLL){
		dy = -dojo.dnd.V_AUTOSCROLL_VALUE;
	}else if(e.clientY > v.h - dojo.dnd.V_TRIGGER_AUTOSCROLL){
		dy = dojo.dnd.V_AUTOSCROLL_VALUE;
	}
	window.scrollBy(dx, dy);
};

dojo.dnd._validNodes = {"div": 1, "p": 1, "td": 1};
dojo.dnd._validOverflow = {"auto": 1, "scroll": 1};

dojo.dnd.autoScrollNodes = function(e){
	// summary:
	//		a handler for onmousemove event, which scrolls the first avaialble
	//		Dom element, it falls back to dojo.dnd.autoScroll()
	// e: Event
	//		onmousemove event

	// FIXME: needs more docs!
	for(var n = e.target; n;){
		if(n.nodeType == 1 && (n.tagName.toLowerCase() in dojo.dnd._validNodes)){
			var s = dojo.getComputedStyle(n);
			if(s.overflow.toLowerCase() in dojo.dnd._validOverflow){
				var b = dojo._getContentBox(n, s), t = dojo.position(n, true);
				//console.log(b.l, b.t, t.x, t.y, n.scrollLeft, n.scrollTop);
				var w = Math.min(dojo.dnd.H_TRIGGER_AUTOSCROLL, b.w / 2),
					h = Math.min(dojo.dnd.V_TRIGGER_AUTOSCROLL, b.h / 2),
					rx = e.pageX - t.x, ry = e.pageY - t.y, dx = 0, dy = 0;
				if(dojo.isWebKit || dojo.isOpera){
					// FIXME: this code should not be here, it should be taken into account
					// either by the event fixing code, or the dojo.position()
					// FIXME: this code doesn't work on Opera 9.5 Beta
					rx += dojo.body().scrollLeft;
					ry += dojo.body().scrollTop;
				}
				if(rx > 0 && rx < b.w){
					if(rx < w){
						dx = -w;
					}else if(rx > b.w - w){
						dx = w;
					}
				}
				//console.log("ry =", ry, "b.h =", b.h, "h =", h);
				if(ry > 0 && ry < b.h){
					if(ry < h){
						dy = -h;
					}else if(ry > b.h - h){
						dy = h;
					}
				}
				var oldLeft = n.scrollLeft, oldTop = n.scrollTop;
				n.scrollLeft = n.scrollLeft + dx;
				n.scrollTop  = n.scrollTop  + dy;
				if(oldLeft != n.scrollLeft || oldTop != n.scrollTop){ return; }
			}
		}
		try{
			n = n.parentNode;
		}catch(x){
			n = null;
		}
	}
	dojo.dnd.autoScroll(e);
};

}

if(!dojo._hasResource["dojo.dnd.Mover"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Mover"] = true;
dojo.provide("dojo.dnd.Mover");




dojo.declare("dojo.dnd.Mover", null, {
	constructor: function(node, e, host){
		// summary:
		//		an object which makes a node follow the mouse, or touch-drag on touch devices.
		//		Used as a default mover, and as a base class for custom movers.
		// node: Node
		//		a node (or node's id) to be moved
		// e: Event
		//		a mouse event, which started the move;
		//		only pageX and pageY properties are used
		// host: Object?
		//		object which implements the functionality of the move,
		//	 	and defines proper events (onMoveStart and onMoveStop)
		this.node = dojo.byId(node);
		var pos = e.touches ? e.touches[0] : e;
		this.marginBox = {l: pos.pageX, t: pos.pageY};
		this.mouseButton = e.button;
		var h = (this.host = host), d = node.ownerDocument;
		this.events = [
			// At the start of a drag, onFirstMove is called, and then the following two
			// connects are disconnected
			dojo.connect(d, "onmousemove", this, "onFirstMove"),
			dojo.connect(d, "ontouchmove", this, "onFirstMove"),

			// These are called continually during the drag
			dojo.connect(d, "onmousemove", this, "onMouseMove"),
			dojo.connect(d, "ontouchmove", this, "onMouseMove"),

			// And these are called at the end of the drag
			dojo.connect(d, "onmouseup",   this, "onMouseUp"),
			dojo.connect(d, "ontouchend", this, "onMouseUp"),

			// cancel text selection and text dragging
			dojo.connect(d, "ondragstart",   dojo.stopEvent),
			dojo.connect(d.body, "onselectstart", dojo.stopEvent)
		];
		// notify that the move has started
		if(h && h.onMoveStart){
			h.onMoveStart(this);
		}
	},
	// mouse event processors
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove/ontouchmove
		// e: Event
		//		mouse/touch event
		dojo.dnd.autoScroll(e);
		var m = this.marginBox,
			pos = e.touches ? e.touches[0] : e;
		this.host.onMove(this, {l: m.l + pos.pageX, t: m.t + pos.pageY}, e);
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		if(dojo.isWebKit && dojo.isMac && this.mouseButton == 2 ?
				e.button == 0 : this.mouseButton == e.button){ // TODO Should condition be met for touch devices, too?
			this.destroy();
		}
		dojo.stopEvent(e);
	},
	// utilities
	onFirstMove: function(e){
		// summary:
		//		makes the node absolute; it is meant to be called only once.
		// 		relative and absolutely positioned nodes are assumed to use pixel units
		var s = this.node.style, l, t, h = this.host;
		switch(s.position){
			case "relative":
			case "absolute":
				// assume that left and top values are in pixels already
				l = Math.round(parseFloat(s.left)) || 0;
				t = Math.round(parseFloat(s.top)) || 0;
				break;
			default:
				s.position = "absolute";	// enforcing the absolute mode
				var m = dojo.marginBox(this.node);
				// event.pageX/pageY (which we used to generate the initial
				// margin box) includes padding and margin set on the body.
				// However, setting the node's position to absolute and then
				// doing dojo.marginBox on it *doesn't* take that additional
				// space into account - so we need to subtract the combined
				// padding and margin.  We use getComputedStyle and
				// _getMarginBox/_getContentBox to avoid the extra lookup of
				// the computed style.
				var b = dojo.doc.body;
				var bs = dojo.getComputedStyle(b);
				var bm = dojo._getMarginBox(b, bs);
				var bc = dojo._getContentBox(b, bs);
				l = m.l - (bc.l - bm.l);
				t = m.t - (bc.t - bm.t);
				break;
		}
		this.marginBox.l = l - this.marginBox.l;
		this.marginBox.t = t - this.marginBox.t;
		if(h && h.onFirstMove){
			h.onFirstMove(this, e);
		}
		
		// Disconnect onmousemove and ontouchmove events that call this function
		dojo.disconnect(this.events.shift());
		dojo.disconnect(this.events.shift());
	},
	destroy: function(){
		// summary:
		//		stops the move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		// undo global settings
		var h = this.host;
		if(h && h.onMoveStop){
			h.onMoveStop(this);
		}
		// destroy objects
		this.events = this.node = this.host = null;
	}
});

}

if(!dojo._hasResource["dojo.dnd.Moveable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Moveable"] = true;
dojo.provide("dojo.dnd.Moveable");



/*=====
dojo.declare("dojo.dnd.__MoveableArgs", [], {
	// handle: Node||String
	//		A node (or node's id), which is used as a mouse handle.
	//		If omitted, the node itself is used as a handle.
	handle: null,

	// delay: Number
	//		delay move by this number of pixels
	delay: 0,

	// skip: Boolean
	//		skip move of form elements
	skip: false,

	// mover: Object
	//		a constructor of custom Mover
	mover: dojo.dnd.Mover
});
=====*/

dojo.declare("dojo.dnd.Moveable", null, {
	// object attributes (for markup)
	handle: "",
	delay: 0,
	skip: false,
	
	constructor: function(node, params){
		// summary:
		//		an object, which makes a node moveable
		// node: Node
		//		a node (or node's id) to be moved
		// params: dojo.dnd.__MoveableArgs?
		//		optional parameters
		this.node = dojo.byId(node);
		if(!params){ params = {}; }
		this.handle = params.handle ? dojo.byId(params.handle) : null;
		if(!this.handle){ this.handle = this.node; }
		this.delay = params.delay > 0 ? params.delay : 0;
		this.skip  = params.skip;
		this.mover = params.mover ? params.mover : dojo.dnd.Mover;
		this.events = [
			dojo.connect(this.handle, "onmousedown", this, "onMouseDown"),
			dojo.connect(this.handle, "ontouchstart", this, "onMouseDown"),
			// cancel text selection and text dragging
			dojo.connect(this.handle, "ondragstart",   this, "onSelectStart"),
			dojo.connect(this.handle, "onselectstart", this, "onSelectStart")
		];
	},

	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.Moveable(node, params);
	},

	// methods
	destroy: function(){
		// summary:
		//		stops watching for possible move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		this.events = this.node = this.handle = null;
	},
	
	// mouse event processors
	onMouseDown: function(e){
		// summary:
		//		event processor for onmousedown/ontouchstart, creates a Mover for the node
		// e: Event
		//		mouse/touch event
		if(this.skip && dojo.dnd.isFormElement(e)){ return; }
		if(this.delay){
			this.events.push(
				dojo.connect(this.handle, "onmousemove", this, "onMouseMove"),
				dojo.connect(this.handle, "ontouchmove", this, "onMouseMove"),
				dojo.connect(this.handle, "onmouseup", this, "onMouseUp"),
				dojo.connect(this.handle, "ontouchend", this, "onMouseUp")
			);
			var pos = e.touches ? e.touches[0] : e;
			this._lastX = pos.pageX;
			this._lastY = pos.pageY;
		}else{
			this.onDragDetected(e);
		}
		dojo.stopEvent(e);
	},
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove/ontouchmove, used only for delayed drags
		// e: Event
		//		mouse/touch event
		var pos = e.touches ? e.touches[0] : e;
		if(Math.abs(pos.pageX - this._lastX) > this.delay || Math.abs(pos.pageY - this._lastY) > this.delay){
			this.onMouseUp(e);
			this.onDragDetected(e);
		}
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup, used only for delayed drags
		// e: Event
		//		mouse event
		for(var i = 0; i < 2; ++i){
			dojo.disconnect(this.events.pop());
		}
		dojo.stopEvent(e);
	},
	onSelectStart: function(e){
		// summary:
		//		event processor for onselectevent and ondragevent
		// e: Event
		//		mouse event
		if(!this.skip || !dojo.dnd.isFormElement(e)){
			dojo.stopEvent(e);
		}
	},
	
	// local events
	onDragDetected: function(/* Event */ e){
		// summary:
		//		called when the drag is detected;
		//		responsible for creation of the mover
		new this.mover(this.node, e, this);
	},
	onMoveStart: function(/* dojo.dnd.Mover */ mover){
		// summary:
		//		called before every move operation
		dojo.publish("/dnd/move/start", [mover]);
		dojo.addClass(dojo.body(), "dojoMove");
		dojo.addClass(this.node, "dojoMoveItem");
	},
	onMoveStop: function(/* dojo.dnd.Mover */ mover){
		// summary:
		//		called after every move operation
		dojo.publish("/dnd/move/stop", [mover]);
		dojo.removeClass(dojo.body(), "dojoMove");
		dojo.removeClass(this.node, "dojoMoveItem");
	},
	onFirstMove: function(/* dojo.dnd.Mover */ mover, /* Event */ e){
		// summary:
		//		called during the very first move notification;
		//		can be used to initialize coordinates, can be overwritten.
		
		// default implementation does nothing
	},
	onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop, /* Event */ e){
		// summary:
		//		called during every move notification;
		//		should actually move the node; can be overwritten.
		this.onMoving(mover, leftTop);
		var s = mover.node.style;
		s.left = leftTop.l + "px";
		s.top  = leftTop.t + "px";
		this.onMoved(mover, leftTop);
	},
	onMoving: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary:
		//		called before every incremental move; can be overwritten.
		
		// default implementation does nothing
	},
	onMoved: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary:
		//		called after every incremental move; can be overwritten.
		
		// default implementation does nothing
	}
});

}

if(!dojo._hasResource["dojo.dnd.move"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.move"] = true;
dojo.provide("dojo.dnd.move");




/*=====
dojo.declare("dojo.dnd.move.__constrainedMoveableArgs", [dojo.dnd.__MoveableArgs], {
	// constraints: Function
	//		Calculates a constraint box.
	//		It is called in a context of the moveable object.
	constraints: function(){},

	// within: Boolean
	//		restrict move within boundaries.
	within: false
});
=====*/

dojo.declare("dojo.dnd.move.constrainedMoveable", dojo.dnd.Moveable, {
	// object attributes (for markup)
	constraints: function(){},
	within: false,
	
	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.constrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary:
		//		an object that makes a node moveable
		// node: Node
		//		a node (or node's id) to be moved
		// params: dojo.dnd.move.__constrainedMoveableArgs?
		//		an optional object with additional parameters;
		//		the rest is passed to the base class
		if(!params){ params = {}; }
		this.constraints = params.constraints;
		this.within = params.within;
	},
	onFirstMove: function(/* dojo.dnd.Mover */ mover){
		// summary:
		//		called during the very first move notification;
		//		can be used to initialize coordinates, can be overwritten.
		var c = this.constraintBox = this.constraints.call(this, mover);
		c.r = c.l + c.w;
		c.b = c.t + c.h;
		if(this.within){
			var mb = dojo._getMarginSize(mover.node);
			c.r -= mb.w;
			c.b -= mb.h;
		}
	},
	onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary:
		//		called during every move notification;
		//		should actually move the node; can be overwritten.
		var c = this.constraintBox, s = mover.node.style;
		this.onMoving(mover, leftTop);
		leftTop.l = leftTop.l < c.l ? c.l : c.r < leftTop.l ? c.r : leftTop.l;
		leftTop.t = leftTop.t < c.t ? c.t : c.b < leftTop.t ? c.b : leftTop.t;
		s.left = leftTop.l + "px";
		s.top  = leftTop.t + "px";
		this.onMoved(mover, leftTop);
	}
});

/*=====
dojo.declare("dojo.dnd.move.__boxConstrainedMoveableArgs", [dojo.dnd.move.__constrainedMoveableArgs], {
	// box: Object
	//		a constraint box
	box: {}
});
=====*/

dojo.declare("dojo.dnd.move.boxConstrainedMoveable", dojo.dnd.move.constrainedMoveable, {
	// box:
	//		object attributes (for markup)
	box: {},
	
	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.boxConstrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary:
		//		an object, which makes a node moveable
		// node: Node
		//		a node (or node's id) to be moved
		// params: dojo.dnd.move.__boxConstrainedMoveableArgs?
		//		an optional object with parameters
		var box = params && params.box;
		this.constraints = function(){ return box; };
	}
});

/*=====
dojo.declare("dojo.dnd.move.__parentConstrainedMoveableArgs", [dojo.dnd.move.__constrainedMoveableArgs], {
	// area: String
	//		A parent's area to restrict the move.
	//		Can be "margin", "border", "padding", or "content".
	area: ""
});
=====*/

dojo.declare("dojo.dnd.move.parentConstrainedMoveable", dojo.dnd.move.constrainedMoveable, {
	// area:
	//		object attributes (for markup)
	area: "content",

	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.parentConstrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary:
		//		an object, which makes a node moveable
		// node: Node
		//		a node (or node's id) to be moved
		// params: dojo.dnd.move.__parentConstrainedMoveableArgs?
		//		an optional object with parameters
		var area = params && params.area;
		this.constraints = function(){
			var n = this.node.parentNode,
				s = dojo.getComputedStyle(n),
				mb = dojo._getMarginBox(n, s);
			if(area == "margin"){
				return mb;	// Object
			}
			var t = dojo._getMarginExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			if(area == "border"){
				return mb;	// Object
			}
			t = dojo._getBorderExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			if(area == "padding"){
				return mb;	// Object
			}
			t = dojo._getPadExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			return mb;	// Object
		};
	}
});

// patching functions one level up for compatibility

dojo.dnd.constrainedMover = dojo.dnd.move.constrainedMover;
dojo.dnd.boxConstrainedMover = dojo.dnd.move.boxConstrainedMover;
dojo.dnd.parentConstrainedMover = dojo.dnd.move.parentConstrainedMover;

}

if(!dojo._hasResource["dojo.dnd.TimedMoveable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.TimedMoveable"] = true;
dojo.provide("dojo.dnd.TimedMoveable");



/*=====
dojo.declare("dojo.dnd.__TimedMoveableArgs", [dojo.dnd.__MoveableArgs], {
	// timeout: Number
	//		delay move by this number of ms,
	//		accumulating position changes during the timeout
	timeout: 0
});
=====*/

(function(){
	// precalculate long expressions
	var oldOnMove = dojo.dnd.Moveable.prototype.onMove;
		
	dojo.declare("dojo.dnd.TimedMoveable", dojo.dnd.Moveable, {
		// summary:
		//		A specialized version of Moveable to support an FPS throttling.
		//		This class puts an upper restriction on FPS, which may reduce
		//		the CPU load. The additional parameter "timeout" regulates
		//		the delay before actually moving the moveable object.
		
		// object attributes (for markup)
		timeout: 40,	// in ms, 40ms corresponds to 25 fps
	
		constructor: function(node, params){
			// summary:
			//		an object that makes a node moveable with a timer
			// node: Node||String
			//		a node (or node's id) to be moved
			// params: dojo.dnd.__TimedMoveableArgs
			//		object with additional parameters.
			
			// sanitize parameters
			if(!params){ params = {}; }
			if(params.timeout && typeof params.timeout == "number" && params.timeout >= 0){
				this.timeout = params.timeout;
			}
		},
	
		// markup methods
		markupFactory: function(params, node){
			return new dojo.dnd.TimedMoveable(node, params);
		},
	
		onMoveStop: function(/* dojo.dnd.Mover */ mover){
			if(mover._timer){
				// stop timer
				clearTimeout(mover._timer)
				// reflect the last received position
				oldOnMove.call(this, mover, mover._leftTop)
			}
			dojo.dnd.Moveable.prototype.onMoveStop.apply(this, arguments);
		},
		onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
			mover._leftTop = leftTop;
			if(!mover._timer){
				var _t = this;	// to avoid using dojo.hitch()
				mover._timer = setTimeout(function(){
					// we don't have any pending requests
					mover._timer = null;
					// reflect the last received position
					oldOnMove.call(_t, mover, mover._leftTop);
				}, this.timeout);
			}
		}
	});
})();

}

if(!dojo._hasResource["dijit._CssStateMixin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._CssStateMixin"] = true;
dojo.provide("dijit._CssStateMixin");


dojo.declare("dijit._CssStateMixin", [], {
	// summary:
	//		Mixin for widgets to set CSS classes on the widget DOM nodes depending on hover/mouse press/focus
	//		state changes, and also higher-level state changes such becoming disabled or selected.
	//
	// description:
	//		By mixing this class into your widget, and setting the this.baseClass attribute, it will automatically
	//		maintain CSS classes on the widget root node (this.domNode) depending on hover,
	//		active, focus, etc. state.   Ex: with a baseClass of dijitButton, it will apply the classes
	//		dijitButtonHovered and dijitButtonActive, as the user moves the mouse over the widget and clicks it.
	//
	//		It also sets CSS like dijitButtonDisabled based on widget semantic state.
	//
	//		By setting the cssStateNodes attribute, a widget can also track events on subnodes (like buttons
	//		within the widget).

	// cssStateNodes: [protected] Object
	//		List of sub-nodes within the widget that need CSS classes applied on mouse hover/press and focus
	//.
	//		Each entry in the hash is a an attachpoint names (like "upArrowButton") mapped to a CSS class names
	//		(like "dijitUpArrowButton"). Example:
	//	|		{
	//	|			"upArrowButton": "dijitUpArrowButton",
	//	|			"downArrowButton": "dijitDownArrowButton"
	//	|		}
	//		The above will set the CSS class dijitUpArrowButton to the this.upArrowButton DOMNode when it
	//		is hovered, etc.
	cssStateNodes: {},

	// hovering: [readonly] Boolean
	//		True if cursor is over this widget
	hovering: false,
	
	// active: [readonly] Boolean
	//		True if mouse was pressed while over this widget, and hasn't been released yet
	active: false,

	_applyAttributes: function(){
		// This code would typically be in postCreate(), but putting in _applyAttributes() for
		// performance: so the class changes happen before DOM is inserted into the document.
		// Change back to postCreate() in 2.0.  See #11635.

		this.inherited(arguments);

		// Automatically monitor mouse events (essentially :hover and :active) on this.domNode
		dojo.forEach(["onmouseenter", "onmouseleave", "onmousedown"], function(e){
			this.connect(this.domNode, e, "_cssMouseEvent");
		}, this);
		
		// Monitoring changes to disabled, readonly, etc. state, and update CSS class of root node
		dojo.forEach(["disabled", "readOnly", "checked", "selected", "focused", "state", "hovering", "active"], function(attr){
			this.watch(attr, dojo.hitch(this, "_setStateClass"));
		}, this);

		// Events on sub nodes within the widget
		for(var ap in this.cssStateNodes){
			this._trackMouseState(this[ap], this.cssStateNodes[ap]);
		}
		// Set state initially; there's probably no hover/active/focus state but widget might be
		// disabled/readonly/checked/selected so we want to set CSS classes for those conditions.
		this._setStateClass();
	},

	_cssMouseEvent: function(/*Event*/ event){
		// summary:
		//	Sets hovering and active properties depending on mouse state,
		//	which triggers _setStateClass() to set appropriate CSS classes for this.domNode.

		if(!this.disabled){
			switch(event.type){
				case "mouseenter":
				case "mouseover":	// generated on non-IE browsers even though we connected to mouseenter
					this._set("hovering", true);
					this._set("active", this._mouseDown);
					break;

				case "mouseleave":
				case "mouseout":	// generated on non-IE browsers even though we connected to mouseleave
					this._set("hovering", false);
					this._set("active", false);
					break;

				case "mousedown" :
					this._set("active", true);
					this._mouseDown = true;
					// Set a global event to handle mouseup, so it fires properly
					// even if the cursor leaves this.domNode before the mouse up event.
					// Alternately could set active=false on mouseout.
					var mouseUpConnector = this.connect(dojo.body(), "onmouseup", function(){
						this._mouseDown = false;
						this._set("active", false);
						this.disconnect(mouseUpConnector);
					});
					break;
			}
		}
	},

	_setStateClass: function(){
		// summary:
		//		Update the visual state of the widget by setting the css classes on this.domNode
		//		(or this.stateNode if defined) by combining this.baseClass with
		//		various suffixes that represent the current widget state(s).
		//
		// description:
		//		In the case where a widget has multiple
		//		states, it sets the class based on all possible
		//	 	combinations.  For example, an invalid form widget that is being hovered
		//		will be "dijitInput dijitInputInvalid dijitInputHover dijitInputInvalidHover".
		//
		//		The widget may have one or more of the following states, determined
		//		by this.state, this.checked, this.valid, and this.selected:
		//			- Error - ValidationTextBox sets this.state to "Error" if the current input value is invalid
		//			- Incomplete - ValidationTextBox sets this.state to "Incomplete" if the current input value is not finished yet
		//			- Checked - ex: a checkmark or a ToggleButton in a checked state, will have this.checked==true
		//			- Selected - ex: currently selected tab will have this.selected==true
		//
		//		In addition, it may have one or more of the following states,
		//		based on this.disabled and flags set in _onMouse (this.active, this.hovering) and from focus manager (this.focused):
		//			- Disabled	- if the widget is disabled
		//			- Active		- if the mouse (or space/enter key?) is being pressed down
		//			- Focused		- if the widget has focus
		//			- Hover		- if the mouse is over the widget

		// Compute new set of classes
		var newStateClasses = this.baseClass.split(" ");

		function multiply(modifier){
			newStateClasses = newStateClasses.concat(dojo.map(newStateClasses, function(c){ return c+modifier; }), "dijit"+modifier);
		}

		if(!this.isLeftToRight()){
			// For RTL mode we need to set an addition class like dijitTextBoxRtl.
			multiply("Rtl");
		}

		if(this.checked){
			multiply("Checked");
		}
		if(this.state){
			multiply(this.state);
		}
		if(this.selected){
			multiply("Selected");
		}

		if(this.disabled){
			multiply("Disabled");
		}else if(this.readOnly){
			multiply("ReadOnly");
		}else{
			if(this.active){
				multiply("Active");
			}else if(this.hovering){
				multiply("Hover");
			}
		}

		if(this._focused){
			multiply("Focused");
		}

		// Remove old state classes and add new ones.
		// For performance concerns we only write into domNode.className once.
		var tn = this.stateNode || this.domNode,
			classHash = {};	// set of all classes (state and otherwise) for node

		dojo.forEach(tn.className.split(" "), function(c){ classHash[c] = true; });

		if("_stateClasses" in this){
			dojo.forEach(this._stateClasses, function(c){ delete classHash[c]; });
		}

		dojo.forEach(newStateClasses, function(c){ classHash[c] = true; });

		var newClasses = [];
		for(var c in classHash){
			newClasses.push(c);
		}
		tn.className = newClasses.join(" ");

		this._stateClasses = newStateClasses;
	},

	_trackMouseState: function(/*DomNode*/ node, /*String*/ clazz){
		// summary:
		//		Track mouse/focus events on specified node and set CSS class on that node to indicate
		//		current state.   Usually not called directly, but via cssStateNodes attribute.
		// description:
		//		Given class=foo, will set the following CSS class on the node
		//			- fooActive: if the user is currently pressing down the mouse button while over the node
		//			- fooHover: if the user is hovering the mouse over the node, but not pressing down a button
		//			- fooFocus: if the node is focused
		//
		//		Note that it won't set any classes if the widget is disabled.
		// node: DomNode
		//		Should be a sub-node of the widget, not the top node (this.domNode), since the top node
		//		is handled specially and automatically just by mixing in this class.
		// clazz: String
		//		CSS class name (ex: dijitSliderUpArrow).

		// Current state of node (initially false)
		// NB: setting specifically to false because dojo.toggleClass() needs true boolean as third arg
		var hovering=false, active=false, focused=false;

		var self = this,
			cn = dojo.hitch(this, "connect", node);

		function setClass(){
			var disabled = ("disabled" in self && self.disabled) || ("readonly" in self && self.readonly);
			dojo.toggleClass(node, clazz+"Hover", hovering && !active && !disabled);
			dojo.toggleClass(node, clazz+"Active", active && !disabled);
			dojo.toggleClass(node, clazz+"Focused", focused && !disabled);
		}

		// Mouse
		cn("onmouseenter", function(){
			hovering = true;
			setClass();
		});
		cn("onmouseleave", function(){
			hovering = false;
			active = false;
			setClass();
		});
		cn("onmousedown", function(){
			active = true;
			setClass();
		});
		cn("onmouseup", function(){
			active = false;
			setClass();
		});

		// Focus
		cn("onfocus", function(){
			focused = true;
			setClass();
		});
		cn("onblur", function(){
			focused = false;
			setClass();
		});

		// Just in case widget is enabled/disabled while it has focus/hover/active state.
		// Maybe this is overkill.
		this.watch("disabled", setClass);
		this.watch("readOnly", setClass);
	}
});

}

if(!dojo._hasResource["dijit.form._FormMixin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._FormMixin"] = true;
dojo.provide("dijit.form._FormMixin");



dojo.declare("dijit.form._FormMixin", null, {
	// summary:
	//		Mixin for containers of form widgets (i.e. widgets that represent a single value
	//		and can be children of a <form> node or dijit.form.Form widget)
	// description:
	//		Can extract all the form widgets
	//		values and combine them into a single javascript object, or alternately
	//		take such an object and set the values for all the contained
	//		form widgets

/*=====
	// value: Object
	//		Name/value hash for each child widget with a name and value.
	//		Child widgets without names are not part of the hash.
	//
	//		If there are multiple child widgets w/the same name, value is an array,
	//		unless they are radio buttons in which case value is a scalar (since only
	//		one radio button can be checked at a time).
	//
	//		If a child widget's name is a dot separated list (like a.b.c.d), it's a nested structure.
	//
	//		Example:
	//	|	{ name: "John Smith", interests: ["sports", "movies"] }
=====*/

	// state: [readonly] String
	//		Will be "Error" if one or more of the child widgets has an invalid value,
	//		"Incomplete" if not all of the required child widgets are filled in.  Otherwise, "",
	//		which indicates that the form is ready to be submitted.
	state: "",

	//	TODO:
	//	* Repeater
	//	* better handling for arrays.  Often form elements have names with [] like
	//	* people[3].sex (for a list of people [{name: Bill, sex: M}, ...])
	//
	//

		reset: function(){
			dojo.forEach(this.getDescendants(), function(widget){
				if(widget.reset){
					widget.reset();
				}
			});
		},

		validate: function(){
			// summary:
			//		returns if the form is valid - same as isValid - but
			//		provides a few additional (ui-specific) features.
			//		1 - it will highlight any sub-widgets that are not
			//			valid
			//		2 - it will call focus() on the first invalid
			//			sub-widget
			var didFocus = false;
			return dojo.every(dojo.map(this.getDescendants(), function(widget){
				// Need to set this so that "required" widgets get their
				// state set.
				widget._hasBeenBlurred = true;
				var valid = widget.disabled || !widget.validate || widget.validate();
				if(!valid && !didFocus){
					// Set focus of the first non-valid widget
					dojo.window.scrollIntoView(widget.containerNode || widget.domNode);
					widget.focus();
					didFocus = true;
				}
	 			return valid;
	 		}), function(item){ return item; });
		},

		setValues: function(val){
			dojo.deprecated(this.declaredClass+"::setValues() is deprecated. Use set('value', val) instead.", "", "2.0");
			return this.set('value', val);
		},
		_setValueAttr: function(/*Object*/ obj){
			// summary:
			//		Fill in form values from according to an Object (in the format returned by get('value'))

			// generate map from name --> [list of widgets with that name]
			var map = { };
			dojo.forEach(this.getDescendants(), function(widget){
				if(!widget.name){ return; }
				var entry = map[widget.name] || (map[widget.name] = [] );
				entry.push(widget);
			});

			for(var name in map){
				if(!map.hasOwnProperty(name)){
					continue;
				}
				var widgets = map[name],						// array of widgets w/this name
					values = dojo.getObject(name, false, obj);	// list of values for those widgets

				if(values === undefined){
					continue;
				}
				if(!dojo.isArray(values)){
					values = [ values ];
				}
				if(typeof widgets[0].checked == 'boolean'){
					// for checkbox/radio, values is a list of which widgets should be checked
					dojo.forEach(widgets, function(w, i){
						w.set('value', dojo.indexOf(values, w.value) != -1);
					});
				}else if(widgets[0].multiple){
					// it takes an array (e.g. multi-select)
					widgets[0].set('value', values);
				}else{
					// otherwise, values is a list of values to be assigned sequentially to each widget
					dojo.forEach(widgets, function(w, i){
						w.set('value', values[i]);
					});
				}
			}

			/***
			 * 	TODO: code for plain input boxes (this shouldn't run for inputs that are part of widgets)

			dojo.forEach(this.containerNode.elements, function(element){
				if(element.name == ''){return};	// like "continue"
				var namePath = element.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var p=namePath[j - 1];
					// repeater support block
					var nameA=p.split("[");
					if(nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if

						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
						myObj=myObj[nameA[0]][nameIndex];
						continue;
					} // repeater support ends

					if(typeof(myObj[p]) == "undefined"){
						myObj=undefined;
						break;
					};
					myObj=myObj[p];
				}

				if(typeof(myObj) == "undefined"){
					return;		// like "continue"
				}
				if(typeof(myObj[name]) == "undefined" && this.ignoreNullValues){
					return;		// like "continue"
				}

				// TODO: widget values (just call set('value', ...) on the widget)

				// TODO: maybe should call dojo.getNodeProp() instead
				switch(element.type){
					case "checkbox":
						element.checked = (name in myObj) &&
							dojo.some(myObj[name], function(val){ return val == element.value; });
						break;
					case "radio":
						element.checked = (name in myObj) && myObj[name] == element.value;
						break;
					case "select-multiple":
						element.selectedIndex=-1;
						dojo.forEach(element.options, function(option){
							option.selected = dojo.some(myObj[name], function(val){ return option.value == val; });
						});
						break;
					case "select-one":
						element.selectedIndex="0";
						dojo.forEach(element.options, function(option){
							option.selected = option.value == myObj[name];
						});
						break;
					case "hidden":
					case "text":
					case "textarea":
					case "password":
						element.value = myObj[name] || "";
						break;
				}
	  		});
	  		*/
			
			// Note: no need to call this._set("value", ...) as the child updates will trigger onChange events
			// which I am monitoring.
		},

		getValues: function(){
			dojo.deprecated(this.declaredClass+"::getValues() is deprecated. Use get('value') instead.", "", "2.0");
			return this.get('value');
		},
		_getValueAttr: function(){
			// summary:
			// 		Returns Object representing form values.   See description of `value` for details.
			// description:

			// The value is updated into this.value every time a child has an onChange event,
			// so in the common case this function could just return this.value.   However,
			// that wouldn't work when:
			//
			// 1. User presses return key to submit a form.  That doesn't fire an onchange event,
			// and even if it did it would come too late due to the setTimout(..., 0) in _handleOnChange()
			//
			// 2. app for some reason calls this.get("value") while the user is typing into a
			// form field.   Not sure if that case needs to be supported or not.

			// get widget values
			var obj = { };
			dojo.forEach(this.getDescendants(), function(widget){
				var name = widget.name;
				if(!name || widget.disabled){ return; }

				// Single value widget (checkbox, radio, or plain <input> type widget)
				var value = widget.get('value');

				// Store widget's value(s) as a scalar, except for checkboxes which are automatically arrays
				if(typeof widget.checked == 'boolean'){
					if(/Radio/.test(widget.declaredClass)){
						// radio button
						if(value !== false){
							dojo.setObject(name, value, obj);
						}else{
							// give radio widgets a default of null
							value = dojo.getObject(name, false, obj);
							if(value === undefined){
								dojo.setObject(name, null, obj);
							}
						}
					}else{
						// checkbox/toggle button
						var ary=dojo.getObject(name, false, obj);
						if(!ary){
							ary=[];
							dojo.setObject(name, ary, obj);
						}
						if(value !== false){
							ary.push(value);
						}
					}
				}else{
					var prev=dojo.getObject(name, false, obj);
					if(typeof prev != "undefined"){
						if(dojo.isArray(prev)){
							prev.push(value);
						}else{
							dojo.setObject(name, [prev, value], obj);
						}
					}else{
						// unique name
						dojo.setObject(name, value, obj);
					}
				}
			});

			/***
			 * code for plain input boxes (see also dojo.formToObject, can we use that instead of this code?
			 * but it doesn't understand [] notation, presumably)
			var obj = { };
			dojo.forEach(this.containerNode.elements, function(elm){
				if(!elm.name)	{
					return;		// like "continue"
				}
				var namePath = elm.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var nameIndex = null;
					var p=namePath[j - 1];
					var nameA=p.split("[");
					if(nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if
						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
					} else if(typeof(myObj[nameA[0]]) == "undefined"){
						myObj[nameA[0]] = { }
					} // if

					if(nameA.length == 1){
						myObj=myObj[nameA[0]];
					} else{
						myObj=myObj[nameA[0]][nameIndex];
					} // if
				} // for

				if((elm.type != "select-multiple" && elm.type != "checkbox" && elm.type != "radio") || (elm.type == "radio" && elm.checked)){
					if(name == name.split("[")[0]){
						myObj[name]=elm.value;
					} else{
						// can not set value when there is no name
					}
				} else if(elm.type == "checkbox" && elm.checked){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					myObj[name].push(elm.value);
				} else if(elm.type == "select-multiple"){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					for(var jdx=0,len3=elm.options.length; jdx<len3; ++jdx){
						if(elm.options[jdx].selected){
							myObj[name].push(elm.options[jdx].value);
						}
					}
				} // if
				name=undefined;
			}); // forEach
			***/
			return obj;
		},

	 	isValid: function(){
	 		// summary:
	 		//		Returns true if all of the widgets are valid.
			//		Deprecated, will be removed in 2.0.  Use get("state") instead.

			return this.state == "";
		},

		onValidStateChange: function(isValid){
			// summary:
			//		Stub function to connect to if you want to do something
			//		(like disable/enable a submit button) when the valid
			//		state changes on the form as a whole.
			//
			//		Deprecated.  Will be removed in 2.0.  Use watch("state", ...) instead.
		},

		_getState: function(){
			// summary:
			//		Compute what this.state should be based on state of children
			var states = dojo.map(this._descendants, function(w){
				return w.get("state") || "";
			});

			return dojo.indexOf(states, "Error") >= 0 ? "Error" :
				dojo.indexOf(states, "Incomplete") >= 0 ? "Incomplete" : "";
		},

		disconnectChildren: function(){
			// summary:
			//		Remove connections to monitor changes to children's value, error state, and disabled state,
			//		in order to update Form.value and Form.state.
			dojo.forEach(this._childConnections || [], dojo.hitch(this, "disconnect"));
			dojo.forEach(this._childWatches || [], function(w){ w.unwatch(); });
		},

		connectChildren: function(/*Boolean*/ inStartup){
			// summary:
			//		Setup connections to monitor changes to children's value, error state, and disabled state,
			//		in order to update Form.value and Form.state.
			//
			//		You can call this function directly, ex. in the event that you
			//		programmatically add a widget to the form *after* the form has been
			//		initialized.

			var _this = this;

			// Remove old connections, if any
			this.disconnectChildren();

			this._descendants = this.getDescendants();

			// (Re)set this.value and this.state.   Send watch() notifications but not on startup.
			var set = inStartup ? function(name, val){ _this[name] = val; } : dojo.hitch(this, "_set");
			set("value", this.get("value"));
			set("state", this._getState());

			// Monitor changes to error state and disabled state in order to update
			// Form.state
			var conns = (this._childConnections = []),
				watches = (this._childWatches = []);
			dojo.forEach(dojo.filter(this._descendants,
				function(item){ return item.validate; }
			),
			function(widget){
				// We are interested in whenever the widget changes validity state - or
				// whenever the disabled attribute on that widget is changed.
				dojo.forEach(["state", "disabled"], function(attr){
					watches.push(widget.watch(attr, function(attr, oldVal, newVal){
						_this.set("state", _this._getState());
					}));
				});
			});

			// And monitor calls to child.onChange so we can update this.value
			var onChange = function(){
				// summary:
				//		Called when child's value or disabled state changes
				
				// Use setTimeout() to collapse value changes in multiple children into a single
				// update to my value.   Multiple updates will occur on:
				//	1. Form.set()
				//	2. Form.reset()
				//	3. user selecting a radio button (which will de-select another radio button,
				//		 causing two onChange events)
				if(_this._onChangeDelayTimer){
					clearTimeout(_this._onChangeDelayTimer);
				}
				_this._onChangeDelayTimer = setTimeout(function(){
					delete _this._onChangeDelayTimer;
					_this._set("value", _this.get("value"));
				}, 10);
			};
			dojo.forEach(
				dojo.filter(this._descendants, function(item){ return item.onChange; } ),
				function(widget){
					// When a child widget's value changes,
					// the efficient thing to do is to just update that one attribute in this.value,
					// but that gets a little complicated when a checkbox is checked/unchecked
					// since this.value["checkboxName"] contains an array of all the checkboxes w/the same name.
					// Doing simple thing for now.
					conns.push(_this.connect(widget, "onChange", onChange));

					// Disabling/enabling a child widget should remove it's value from this.value.
					// Again, this code could be more efficient, doing simple thing for now.
					watches.push(widget.watch("disabled", onChange));
				}
			);
		},

		startup: function(){
			this.inherited(arguments);

			// Initialize value and valid/invalid state tracking.  Needs to be done in startup()
			// so that children are initialized.
			this.connectChildren(true);

			// Make state change call onValidStateChange(), will be removed in 2.0
			this.watch("state", function(attr, oldVal, newVal){ this.onValidStateChange(newVal == ""); });
		},

		destroy: function(){
			this.disconnectChildren();
			this.inherited(arguments);
		}

	});

}

if(!dojo._hasResource["dijit._DialogMixin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._DialogMixin"] = true;
dojo.provide("dijit._DialogMixin");



dojo.declare("dijit._DialogMixin", null,
	{
		// summary:
		//		This provides functions useful to Dialog and TooltipDialog

		attributeMap: dijit._Widget.prototype.attributeMap,

		execute: function(/*Object*/ formContents){
			// summary:
			//		Callback when the user hits the submit button.
			//		Override this method to handle Dialog execution.
			// description:
			//		After the user has pressed the submit button, the Dialog
			//		first calls onExecute() to notify the container to hide the
			//		dialog and restore focus to wherever it used to be.
			//
			//		*Then* this method is called.
			// type:
			//		callback
		},

		onCancel: function(){
			// summary:
			//	    Called when user has pressed the Dialog's cancel button, to notify container.
			// description:
			//	    Developer shouldn't override or connect to this method;
			//		it's a private communication device between the TooltipDialog
			//		and the thing that opened it (ex: `dijit.form.DropDownButton`)
			// type:
			//		protected
		},

		onExecute: function(){
			// summary:
			//	    Called when user has pressed the dialog's OK button, to notify container.
			// description:
			//	    Developer shouldn't override or connect to this method;
			//		it's a private communication device between the TooltipDialog
			//		and the thing that opened it (ex: `dijit.form.DropDownButton`)
			// type:
			//		protected
		},

		_onSubmit: function(){
			// summary:
			//		Callback when user hits submit button
			// type:
			//		protected
			this.onExecute();	// notify container that we are about to execute
			this.execute(this.get('value'));
		},

		_getFocusItems: function(){
			// summary:
			//		Finds focusable items in dialog,
			//		and sets this._firstFocusItem and this._lastFocusItem
			// tags:
			//		protected

			var elems = dijit._getTabNavigable(this.containerNode);
			this._firstFocusItem = elems.lowest || elems.first || this.closeButtonNode || this.domNode;
			this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
		}
	}
);

}

if(!dojo._hasResource["dijit.DialogUnderlay"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.DialogUnderlay"] = true;
dojo.provide("dijit.DialogUnderlay");





dojo.declare(
	"dijit.DialogUnderlay",
	[dijit._Widget, dijit._Templated],
	{
		// summary:
		//		The component that blocks the screen behind a `dijit.Dialog`
		//
		// description:
		// 		A component used to block input behind a `dijit.Dialog`. Only a single
		//		instance of this widget is created by `dijit.Dialog`, and saved as
		//		a reference to be shared between all Dialogs as `dijit._underlay`
		//
		//		The underlay itself can be styled based on and id:
		//	|	#myDialog_underlay { background-color:red; }
		//
		//		In the case of `dijit.Dialog`, this id is based on the id of the Dialog,
		//		suffixed with _underlay.

		// Template has two divs; outer div is used for fade-in/fade-out, and also to hold background iframe.
		// Inner div has opacity specified in CSS file.
		templateString: "<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' dojoAttachPoint='node'></div></div>",

		// Parameters on creation or updatable later

		// dialogId: String
		//		Id of the dialog.... DialogUnderlay's id is based on this id
		dialogId: "",

		// class: String
		//		This class name is used on the DialogUnderlay node, in addition to dijitDialogUnderlay
		"class": "",

		attributeMap: { id: "domNode" },

		_setDialogIdAttr: function(id){
			dojo.attr(this.node, "id", id + "_underlay");
			this._set("dialogId", id);
		},

		_setClassAttr: function(clazz){
			this.node.className = "dijitDialogUnderlay " + clazz;
			this._set("class", clazz);
		},

		postCreate: function(){
			// summary:
			//		Append the underlay to the body
			dojo.body().appendChild(this.domNode);
		},

		layout: function(){
			// summary:
			//		Sets the background to the size of the viewport
			//
			// description:
			//		Sets the background to the size of the viewport (rather than the size
			//		of the document) since we need to cover the whole browser window, even
			//		if the document is only a few lines long.
			// tags:
			//		private

			var is = this.node.style,
				os = this.domNode.style;

			// hide the background temporarily, so that the background itself isn't
			// causing scrollbars to appear (might happen when user shrinks browser
			// window and then we are called to resize)
			os.display = "none";

			// then resize and show
			var viewport = dojo.window.getBox();
			os.top = viewport.t + "px";
			os.left = viewport.l + "px";
			is.width = viewport.w + "px";
			is.height = viewport.h + "px";
			os.display = "block";
		},

		show: function(){
			// summary:
			//		Show the dialog underlay
			this.domNode.style.display = "block";
			this.layout();
			this.bgIframe = new dijit.BackgroundIframe(this.domNode);
		},

		hide: function(){
			// summary:
			//		Hides the dialog underlay
			this.bgIframe.destroy();
			delete this.bgIframe;
			this.domNode.style.display = "none";
		}
	}
);

}

if(!dojo._hasResource["dijit._Container"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Container"] = true;
dojo.provide("dijit._Container");


dojo.declare("dijit._Container",
	null,
	{
		// summary:
		//		Mixin for widgets that contain a set of widget children.
		// description:
		//		Use this mixin for widgets that needs to know about and
		//		keep track of their widget children. Suitable for widgets like BorderContainer
		//		and TabContainer which contain (only) a set of child widgets.
		//
		//		It's not suitable for widgets like ContentPane
		//		which contains mixed HTML (plain DOM nodes in addition to widgets),
		//		and where contained widgets are not necessarily directly below
		//		this.containerNode.   In that case calls like addChild(node, position)
		//		wouldn't make sense.

		// isContainer: [protected] Boolean
		//		Indicates that this widget acts as a "parent" to the descendant widgets.
		//		When the parent is started it will call startup() on the child widgets.
		//		See also `isLayoutContainer`.
		isContainer: true,

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// all widgets with descendants must set containerNode
	 				this.containerNode = this.domNode;
			}
		},

		addChild: function(/*dijit._Widget*/ widget, /*int?*/ insertIndex){
			// summary:
			//		Makes the given widget a child of this widget.
			// description:
			//		Inserts specified child widget's dom node as a child of this widget's
			//		container node, and possibly does other processing (such as layout).

			var refNode = this.containerNode;
			if(insertIndex && typeof insertIndex == "number"){
				var children = this.getChildren();
				if(children && children.length >= insertIndex){
					refNode = children[insertIndex-1].domNode;
					insertIndex = "after";
				}
			}
			dojo.place(widget.domNode, refNode, insertIndex);

			// If I've been started but the child widget hasn't been started,
			// start it now.  Make sure to do this after widget has been
			// inserted into the DOM tree, so it can see that it's being controlled by me,
			// so it doesn't try to size itself.
			if(this._started && !widget._started){
				widget.startup();
			}
		},

		removeChild: function(/*Widget or int*/ widget){
			// summary:
			//		Removes the passed widget instance from this widget but does
			//		not destroy it.  You can also pass in an integer indicating
			//		the index within the container to remove

			if(typeof widget == "number"){
				widget = this.getChildren()[widget];
			}

			if(widget){
				var node = widget.domNode;
				if(node && node.parentNode){
					node.parentNode.removeChild(node); // detach but don't destroy
				}
			}
		},

		hasChildren: function(){
			// summary:
			//		Returns true if widget has children, i.e. if this.containerNode contains something.
			return this.getChildren().length > 0;	// Boolean
		},

		destroyDescendants: function(/*Boolean*/ preserveDom){
			// summary:
			//      Destroys all the widgets inside this.containerNode,
			//      but not this widget itself
			dojo.forEach(this.getChildren(), function(child){ child.destroyRecursive(preserveDom); });
		},

		_getSiblingOfChild: function(/*dijit._Widget*/ child, /*int*/ dir){
			// summary:
			//		Get the next or previous widget sibling of child
			// dir:
			//		if 1, get the next sibling
			//		if -1, get the previous sibling
			// tags:
			//      private
			var node = child.domNode,
				which = (dir>0 ? "nextSibling" : "previousSibling");
			do{
				node = node[which];
			}while(node && (node.nodeType != 1 || !dijit.byNode(node)));
			return node && dijit.byNode(node);	// dijit._Widget
		},

		getIndexOfChild: function(/*dijit._Widget*/ child){
			// summary:
			//		Gets the index of the child in this container or -1 if not found
			return dojo.indexOf(this.getChildren(), child);	// int
		},

		startup: function(){
			// summary:
			//		Called after all the widgets have been instantiated and their
			//		dom nodes have been inserted somewhere under dojo.doc.body.
			//
			//		Widgets should override this method to do any initialization
			//		dependent on other widgets existing, and then call
			//		this superclass method to finish things off.
			//
			//		startup() in subclasses shouldn't do anything
			//		size related because the size of the widget hasn't been set yet.

			if(this._started){ return; }

			// Startup all children of this widget
			dojo.forEach(this.getChildren(), function(child){ child.startup(); });

			this.inherited(arguments);
		}
	}
);

}

if(!dojo._hasResource["dijit._Contained"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Contained"] = true;
dojo.provide("dijit._Contained");


dojo.declare("dijit._Contained",
		null,
		{
			// summary:
			//		Mixin for widgets that are children of a container widget
			//
			// example:
			// | 	// make a basic custom widget that knows about it's parents
			// |	dojo.declare("my.customClass",[dijit._Widget,dijit._Contained],{});

			getParent: function(){
				// summary:
				//		Returns the parent widget of this widget, assuming the parent
				//		specifies isContainer
				var parent = dijit.getEnclosingWidget(this.domNode.parentNode);
				return parent && parent.isContainer ? parent : null;
			},

			_getSibling: function(/*String*/ which){
				// summary:
				//      Returns next or previous sibling
				// which:
				//      Either "next" or "previous"
				// tags:
				//      private
				var node = this.domNode;
				do{
					node = node[which+"Sibling"];
				}while(node && node.nodeType != 1);
				return node && dijit.byNode(node);	// dijit._Widget
			},

			getPreviousSibling: function(){
				// summary:
				//		Returns null if this is the first child of the parent,
				//		otherwise returns the next element sibling to the "left".

				return this._getSibling("previous"); // dijit._Widget
			},

			getNextSibling: function(){
				// summary:
				//		Returns null if this is the last child of the parent,
				//		otherwise returns the next element sibling to the "right".

				return this._getSibling("next"); // dijit._Widget
			},

			getIndexInParent: function(){
				// summary:
				//		Returns the index of this widget within its container parent.
				//		It returns -1 if the parent does not exist, or if the parent
				//		is not a dijit._Container

				var p = this.getParent();
				if(!p || !p.getIndexOfChild){
					return -1; // int
				}
				return p.getIndexOfChild(this); // int
			}
		}
	);

}

if(!dojo._hasResource["dijit.layout._LayoutWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout._LayoutWidget"] = true;
dojo.provide("dijit.layout._LayoutWidget");





dojo.declare("dijit.layout._LayoutWidget",
	[dijit._Widget, dijit._Container, dijit._Contained],
	{
		// summary:
		//		Base class for a _Container widget which is responsible for laying out its children.
		//		Widgets which mixin this code must define layout() to manage placement and sizing of the children.

		// baseClass: [protected extension] String
		//		This class name is applied to the widget's domNode
		//		and also may be used to generate names for sub nodes,
		//		for example dijitTabContainer-content.
		baseClass: "dijitLayoutContainer",

		// isLayoutContainer: [protected] Boolean
		//		Indicates that this widget is going to call resize() on its
		//		children widgets, setting their size, when they become visible.
		isLayoutContainer: true,

		buildRendering: function(){
			this.inherited(arguments);
			dojo.addClass(this.domNode, "dijitContainer");
		},

		startup: function(){
			// summary:
			//		Called after all the widgets have been instantiated and their
			//		dom nodes have been inserted somewhere under dojo.doc.body.
			//
			//		Widgets should override this method to do any initialization
			//		dependent on other widgets existing, and then call
			//		this superclass method to finish things off.
			//
			//		startup() in subclasses shouldn't do anything
			//		size related because the size of the widget hasn't been set yet.

			if(this._started){ return; }

			// Need to call inherited first - so that child widgets get started
			// up correctly
			this.inherited(arguments);

			// If I am a not being controlled by a parent layout widget...
			var parent = this.getParent && this.getParent()
			if(!(parent && parent.isLayoutContainer)){
				// Do recursive sizing and layout of all my descendants
				// (passing in no argument to resize means that it has to glean the size itself)
				this.resize();

				// Since my parent isn't a layout container, and my style *may be* width=height=100%
				// or something similar (either set directly or via a CSS class),
				// monitor when my size changes so that I can re-layout.
				// For browsers where I can't directly monitor when my size changes,
				// monitor when the viewport changes size, which *may* indicate a size change for me.
				this.connect(dojo.isIE ? this.domNode : dojo.global, 'onresize', function(){
					// Using function(){} closure to ensure no arguments to resize.
					this.resize();
				});
			}
		},

		resize: function(changeSize, resultSize){
			// summary:
			//		Call this to resize a widget, or after its size has changed.
			// description:
			//		Change size mode:
			//			When changeSize is specified, changes the marginBox of this widget
			//			and forces it to relayout its contents accordingly.
			//			changeSize may specify height, width, or both.
			//
			//			If resultSize is specified it indicates the size the widget will
			//			become after changeSize has been applied.
			//
			//		Notification mode:
			//			When changeSize is null, indicates that the caller has already changed
			//			the size of the widget, or perhaps it changed because the browser
			//			window was resized.  Tells widget to relayout its contents accordingly.
			//
			//			If resultSize is also specified it indicates the size the widget has
			//			become.
			//
			//		In either mode, this method also:
			//			1. Sets this._borderBox and this._contentBox to the new size of
			//				the widget.  Queries the current domNode size if necessary.
			//			2. Calls layout() to resize contents (and maybe adjust child widgets).
			//
			// changeSize: Object?
			//		Sets the widget to this margin-box size and position.
			//		May include any/all of the following properties:
			//	|	{w: int, h: int, l: int, t: int}
			//
			// resultSize: Object?
			//		The margin-box size of this widget after applying changeSize (if
			//		changeSize is specified).  If caller knows this size and
			//		passes it in, we don't need to query the browser to get the size.
			//	|	{w: int, h: int}

			var node = this.domNode;

			// set margin box size, unless it wasn't specified, in which case use current size
			if(changeSize){
				dojo.marginBox(node, changeSize);

				// set offset of the node
				if(changeSize.t){ node.style.top = changeSize.t + "px"; }
				if(changeSize.l){ node.style.left = changeSize.l + "px"; }
			}

			// If either height or width wasn't specified by the user, then query node for it.
			// But note that setting the margin box and then immediately querying dimensions may return
			// inaccurate results, so try not to depend on it.
			var mb = resultSize || {};
			dojo.mixin(mb, changeSize || {});	// changeSize overrides resultSize
			if( !("h" in mb) || !("w" in mb) ){
				mb = dojo.mixin(dojo.marginBox(node), mb);	// just use dojo.marginBox() to fill in missing values
			}

			// Compute and save the size of my border box and content box
			// (w/out calling dojo.contentBox() since that may fail if size was recently set)
			var cs = dojo.getComputedStyle(node);
			var me = dojo._getMarginExtents(node, cs);
			var be = dojo._getBorderExtents(node, cs);
			var bb = (this._borderBox = {
				w: mb.w - (me.w + be.w),
				h: mb.h - (me.h + be.h)
			});
			var pe = dojo._getPadExtents(node, cs);
			this._contentBox = {
				l: dojo._toPixelValue(node, cs.paddingLeft),
				t: dojo._toPixelValue(node, cs.paddingTop),
				w: bb.w - pe.w,
				h: bb.h - pe.h
			};

			// Callback for widget to adjust size of its children
			this.layout();
		},

		layout: function(){
			// summary:
			//		Widgets override this method to size and position their contents/children.
			//		When this is called this._contentBox is guaranteed to be set (see resize()).
			//
			//		This is called after startup(), and also when the widget's size has been
			//		changed.
			// tags:
			//		protected extension
		},

		_setupChild: function(/*dijit._Widget*/child){
			// summary:
			//		Common setup for initial children and children which are added after startup
			// tags:
			//		protected extension

			var cls = this.baseClass + "-child "
				+ (child.baseClass ? this.baseClass + "-" + child.baseClass : "");
			dojo.addClass(child.domNode, cls);
		},

		addChild: function(/*dijit._Widget*/ child, /*Integer?*/ insertIndex){
			// Overrides _Container.addChild() to call _setupChild()
			this.inherited(arguments);
			if(this._started){
				this._setupChild(child);
			}
		},

		removeChild: function(/*dijit._Widget*/ child){
			// Overrides _Container.removeChild() to remove class added by _setupChild()
			var cls = this.baseClass + "-child"
					+ (child.baseClass ?
						" " + this.baseClass + "-" + child.baseClass : "");
			dojo.removeClass(child.domNode, cls);
			
			this.inherited(arguments);
		}
	}
);

dijit.layout.marginBox2contentBox = function(/*DomNode*/ node, /*Object*/ mb){
	// summary:
	//		Given the margin-box size of a node, return its content box size.
	//		Functions like dojo.contentBox() but is more reliable since it doesn't have
	//		to wait for the browser to compute sizes.
	var cs = dojo.getComputedStyle(node);
	var me = dojo._getMarginExtents(node, cs);
	var pb = dojo._getPadBorderExtents(node, cs);
	return {
		l: dojo._toPixelValue(node, cs.paddingLeft),
		t: dojo._toPixelValue(node, cs.paddingTop),
		w: mb.w - (me.w + pb.w),
		h: mb.h - (me.h + pb.h)
	};
};

(function(){
	var capitalize = function(word){
		return word.substring(0,1).toUpperCase() + word.substring(1);
	};

	var size = function(widget, dim){
		// size the child
		widget.resize ? widget.resize(dim) : dojo.marginBox(widget.domNode, dim);

		// record child's size, but favor our own numbers when we have them.
		// the browser lies sometimes
		dojo.mixin(widget, dojo.marginBox(widget.domNode));
		dojo.mixin(widget, dim);
	};

	dijit.layout.layoutChildren = function(/*DomNode*/ container, /*Object*/ dim, /*Widget[]*/ children,
			/*String?*/ changedRegionId, /*Number?*/ changedRegionSize){
		// summary
		//		Layout a bunch of child dom nodes within a parent dom node
		// container:
		//		parent node
		// dim:
		//		{l, t, w, h} object specifying dimensions of container into which to place children
		// children:
		//		an array of Widgets or at least objects containing:
		//			* domNode: pointer to DOM node to position
		//			* region or layoutAlign: position to place DOM node
		//			* resize(): (optional) method to set size of node
		//			* id: (optional) Id of widgets, referenced from resize object, below.
		// changedRegionId:
		//		If specified, the slider for the region with the specified id has been dragged, and thus
		//		the region's height or width should be adjusted according to changedRegionSize
		// changedRegionSize:
		//		See changedRegionId.

		// copy dim because we are going to modify it
		dim = dojo.mixin({}, dim);

		dojo.addClass(container, "dijitLayoutContainer");

		// Move "client" elements to the end of the array for layout.  a11y dictates that the author
		// needs to be able to put them in the document in tab-order, but this algorithm requires that
		// client be last.    TODO: move these lines to LayoutContainer?   Unneeded other places I think.
		children = dojo.filter(children, function(item){ return item.region != "center" && item.layoutAlign != "client"; })
			.concat(dojo.filter(children, function(item){ return item.region == "center" || item.layoutAlign == "client"; }));

		// set positions/sizes
		dojo.forEach(children, function(child){
			var elm = child.domNode,
				pos = (child.region || child.layoutAlign);

			// set elem to upper left corner of unused space; may move it later
			var elmStyle = elm.style;
			elmStyle.left = dim.l+"px";
			elmStyle.top = dim.t+"px";
			elmStyle.bottom = elmStyle.right = "auto";

			dojo.addClass(elm, "dijitAlign" + capitalize(pos));

			// Size adjustments to make to this child widget
			var sizeSetting = {};

			// Check for optional size adjustment due to splitter drag (height adjustment for top/bottom align
			// panes and width adjustment for left/right align panes.
			if(changedRegionId && changedRegionId == child.id){
				sizeSetting[child.region == "top" || child.region == "bottom" ? "h" : "w"] = changedRegionSize;
			}

			// set size && adjust record of remaining space.
			// note that setting the width of a <div> may affect its height.
			if(pos == "top" || pos == "bottom"){
				sizeSetting.w = dim.w;
				size(child, sizeSetting);
				dim.h -= child.h;
				if(pos == "top"){
					dim.t += child.h;
				}else{
					elmStyle.top = dim.t + dim.h + "px";
				}
			}else if(pos == "left" || pos == "right"){
				sizeSetting.h = dim.h;
				size(child, sizeSetting);
				dim.w -= child.w;
				if(pos == "left"){
					dim.l += child.w;
				}else{
					elmStyle.left = dim.l + dim.w + "px";
				}
			}else if(pos == "client" || pos == "center"){
				size(child, dim);
			}
		});
	};

})();

}

if(!dojo._hasResource["dijit.layout._ContentPaneResizeMixin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout._ContentPaneResizeMixin"] = true;
dojo.provide("dijit.layout._ContentPaneResizeMixin");



dojo.declare("dijit.layout._ContentPaneResizeMixin", null, {
	// summary:
	//		Resize() functionality of ContentPane.   If there's a single layout widget
	//		child then it will call resize() with the same dimensions as the ContentPane.
	//		Otherwise just calls resize on each child.
	//
	//		Also implements basic startup() functionality, where starting the parent
	//		will start the children

	// doLayout: Boolean
	//		- false - don't adjust size of children
	//		- true - if there is a single visible child widget, set it's size to
	//				however big the ContentPane is
	doLayout: true,

	// isContainer: [protected] Boolean
	//		Indicates that this widget acts as a "parent" to the descendant widgets.
	//		When the parent is started it will call startup() on the child widgets.
	//		See also `isLayoutContainer`.
	isContainer: true,

	// isLayoutContainer: [protected] Boolean
	//		Indicates that this widget will call resize() on it's child widgets
	//		when they become visible.
	isLayoutContainer: true,

	_startChildren: function(){
		// summary:
		//		Call startup() on all children including non _Widget ones like dojo.dnd.Source objects

		// This starts all the widgets
		dojo.forEach(this.getChildren(), function(child){
			child.startup();
			child._started = true;
		});
	},

	startup: function(){
		// summary:
		//		See `dijit.layout._LayoutWidget.startup` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.

		if(this._started){ return; }

		var parent = dijit._Contained.prototype.getParent.call(this);
		this._childOfLayoutWidget = parent && parent.isLayoutContainer;

		// I need to call resize() on my child/children (when I become visible), unless
		// I'm the child of a layout widget in which case my parent will call resize() on me and I'll do it then.
		this._needLayout = !this._childOfLayoutWidget;

		this.inherited(arguments);

		this._startChildren();
	},

	_checkIfSingleChild: function(){
		// summary:
		//		Test if we have exactly one visible widget as a child,
		//		and if so assume that we are a container for that widget,
		//		and should propagate startup() and resize() calls to it.
		//		Skips over things like data stores since they aren't visible.

		var childNodes = dojo.query("> *", this.containerNode).filter(function(node){
				return node.tagName !== "SCRIPT"; // or a regexp for hidden elements like script|area|map|etc..
			}),
			childWidgetNodes = childNodes.filter(function(node){
				return dojo.hasAttr(node, "data-dojo-type") || dojo.hasAttr(node, "dojoType") || dojo.hasAttr(node, "widgetId");
			}),
			candidateWidgets = dojo.filter(childWidgetNodes.map(dijit.byNode), function(widget){
				return widget && widget.domNode && widget.resize;
			});

		if(
			// all child nodes are widgets
			childNodes.length == childWidgetNodes.length &&

			// all but one are invisible (like dojo.data)
			candidateWidgets.length == 1
		){
			this._singleChild = candidateWidgets[0];
		}else{
			delete this._singleChild;
		}

		// So we can set overflow: hidden to avoid a safari bug w/scrollbars showing up (#9449)
		dojo.toggleClass(this.containerNode, this.baseClass + "SingleChild", !!this._singleChild);
	},

	resize: function(changeSize, resultSize){
		// summary:
		//		See `dijit.layout._LayoutWidget.resize` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.
		this._layout(changeSize, resultSize);
	},

	_layout: function(changeSize, resultSize){
		// summary:
		//		Resize myself according to optional changeSize/resultSize parameters, like a layout widget.
		//		Also, since I am a Container widget, each of my children expects me to
		//		call resize() or layout() on them.
		//
		//		Should be called on initialization and also whenever we get new content
		//		(from an href, or from set('content', ...))... but deferred until
		//		the ContentPane is visible

		// Set margin box size, unless it wasn't specified, in which case use current size.
		if(changeSize){
			dojo.marginBox(this.domNode, changeSize);
		}

		// Compute content box size of containerNode in case we [later] need to size our single child.
		var cn = this.containerNode;
		if(cn === this.domNode){
			// If changeSize or resultSize was passed to this method and this.containerNode ==
			// this.domNode then we can compute the content-box size without querying the node,
			// which is more reliable (similar to LayoutWidget.resize) (see for example #9449).
			var mb = resultSize || {};
			dojo.mixin(mb, changeSize || {}); // changeSize overrides resultSize
			if(!("h" in mb) || !("w" in mb)){
				mb = dojo.mixin(dojo.marginBox(cn), mb); // just use dojo.marginBox() to fill in missing values
			}
			this._contentBox = dijit.layout.marginBox2contentBox(cn, mb);
		}else{
			this._contentBox = dojo.contentBox(cn);
		}

		this._layoutChildren();

		delete this._needLayout;
	},
	
	_layoutChildren: function(){
		// Call _checkIfSingleChild() again in case app has manually mucked w/the content
		// of the ContentPane (rather than changing it through the set("content", ...) API.
		if(this.doLayout){
			this._checkIfSingleChild();
		}

		if(this._singleChild && this._singleChild.resize){
			var cb = this._contentBox || dojo.contentBox(this.containerNode);

			// note: if widget has padding this._contentBox will have l and t set,
			// but don't pass them to resize() or it will doubly-offset the child
			this._singleChild.resize({w: cb.w, h: cb.h});
		}else{
			// All my child widgets are independently sized (rather than matching my size),
			// but I still need to call resize() on each child to make it layout.
			dojo.forEach(this.getChildren(), function(widget){
				if(widget.resize){
					widget.resize();
				}
			});
		}
	}
});

}

if(!dojo._hasResource["dojo.html"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.html"] = true;
dojo.provide("dojo.html");


dojo.getObject("html", true, dojo);

// the parser might be needed..
(function(){ // private scope, sort of a namespace

	// idCounter is incremented with each instantiation to allow asignment of a unique id for tracking, logging purposes
	var idCounter = 0,
		d = dojo;
	
	dojo.html._secureForInnerHtml = function(/*String*/ cont){
		// summary:
		//		removes !DOCTYPE and title elements from the html string.
		//
		//		khtml is picky about dom faults, you can't attach a style or <title> node as child of body
		//		must go into head, so we need to cut out those tags
		//	cont:
		//		An html string for insertion into the dom
		//
		return cont.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig, ""); // String
	};

/*====
	dojo.html._emptyNode = function(node){
		// summary:
		//		removes all child nodes from the given node
		//	node: DOMNode
		//		the parent element
	};
=====*/
	dojo.html._emptyNode = dojo.empty;

	dojo.html._setNodeContent = function(/* DomNode */ node, /* String|DomNode|NodeList */ cont){
		// summary:
		//		inserts the given content into the given node
		//	node:
		//		the parent element
		//	content:
		//		the content to be set on the parent element.
		//		This can be an html string, a node reference or a NodeList, dojo.NodeList, Array or other enumerable list of nodes
		
		// always empty
		d.empty(node);

		if(cont) {
			if(typeof cont == "string") {
				cont = d._toDom(cont, node.ownerDocument);
			}
			if(!cont.nodeType && d.isArrayLike(cont)) {
				// handle as enumerable, but it may shrink as we enumerate it
				for(var startlen=cont.length, i=0; i<cont.length; i=startlen==cont.length ? i+1 : 0) {
					d.place( cont[i], node, "last");
				}
			} else {
				// pass nodes, documentFragments and unknowns through to dojo.place
				d.place(cont, node, "last");
			}
		}

		// return DomNode
		return node;
	};

	// we wrap up the content-setting operation in a object
	dojo.declare("dojo.html._ContentSetter", null,
		{
			// node: DomNode|String
			//		An node which will be the parent element that we set content into
			node: "",

			// content: String|DomNode|DomNode[]
			//		The content to be placed in the node. Can be an HTML string, a node reference, or a enumerable list of nodes
			content: "",
			
			// id: String?
			//		Usually only used internally, and auto-generated with each instance
			id: "",

			// cleanContent: Boolean
			//		Should the content be treated as a full html document,
			//		and the real content stripped of <html>, <body> wrapper before injection
			cleanContent: false,
			
			// extractContent: Boolean
			//		Should the content be treated as a full html document, and the real content stripped of <html>, <body> wrapper before injection
			extractContent: false,

			// parseContent: Boolean
			//		Should the node by passed to the parser after the new content is set
			parseContent: false,

			// parserScope: String
			//		Flag passed to parser.  Root for attribute names to search for.   If scopeName is dojo,
			//		will search for data-dojo-type (or dojoType).  For backwards compatibility
			//		reasons defaults to dojo._scopeName (which is "dojo" except when
			//		multi-version support is used, when it will be something like dojo16, dojo20, etc.)
			parserScope: dojo._scopeName,

			// startup: Boolean
			//		Start the child widgets after parsing them.   Only obeyed if parseContent is true.
			startup: true,
			
			// lifecyle methods
			constructor: function(/* Object */params, /* String|DomNode */node){
				//	summary:
				//		Provides a configurable, extensible object to wrap the setting on content on a node
				//		call the set() method to actually set the content..
 
				// the original params are mixed directly into the instance "this"
				dojo.mixin(this, params || {});

				// give precedence to params.node vs. the node argument
				// and ensure its a node, not an id string
				node = this.node = dojo.byId( this.node || node );
	
				if(!this.id){
					this.id = [
						"Setter",
						(node) ? node.id || node.tagName : "",
						idCounter++
					].join("_");
				}
			},
			set: function(/* String|DomNode|NodeList? */ cont, /* Object? */ params){
				// summary:
				//		front-end to the set-content sequence
				//	cont:
				//		An html string, node or enumerable list of nodes for insertion into the dom
				//		If not provided, the object's content property will be used
				if(undefined !== cont){
					this.content = cont;
				}
				// in the re-use scenario, set needs to be able to mixin new configuration
				if(params){
					this._mixin(params);
				}

				this.onBegin();
				this.setContent();
				this.onEnd();

				return this.node;
			},
			setContent: function(){
				// summary:
				//		sets the content on the node

				var node = this.node;
				if(!node) {
				    // can't proceed
					throw new Error(this.declaredClass + ": setContent given no node");
				}
				try{
					node = dojo.html._setNodeContent(node, this.content);
				}catch(e){
					// check if a domfault occurs when we are appending this.errorMessage
					// like for instance if domNode is a UL and we try append a DIV
	
					// FIXME: need to allow the user to provide a content error message string
					var errMess = this.onContentError(e);
					try{
						node.innerHTML = errMess;
					}catch(e){
						console.error('Fatal ' + this.declaredClass + '.setContent could not change content due to '+e.message, e);
					}
				}
				// always put back the node for the next method
				this.node = node; // DomNode
			},
			
			empty: function() {
				// summary
				//	cleanly empty out existing content

				// destroy any widgets from a previous run
				// NOTE: if you dont want this you'll need to empty
				// the parseResults array property yourself to avoid bad things happenning
				if(this.parseResults && this.parseResults.length) {
					dojo.forEach(this.parseResults, function(w) {
						if(w.destroy){
							w.destroy();
						}
					});
					delete this.parseResults;
				}
				// this is fast, but if you know its already empty or safe, you could
				// override empty to skip this step
				dojo.html._emptyNode(this.node);
			},
	
			onBegin: function(){
				// summary
				//		Called after instantiation, but before set();
				//		It allows modification of any of the object properties
				//		- including the node and content provided - before the set operation actually takes place
				//		This default implementation checks for cleanContent and extractContent flags to
				//		optionally pre-process html string content
				var cont = this.content;
	
				if(dojo.isString(cont)){
					if(this.cleanContent){
						cont = dojo.html._secureForInnerHtml(cont);
					}
  
					if(this.extractContent){
						var match = cont.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
						if(match){ cont = match[1]; }
					}
				}

				// clean out the node and any cruft associated with it - like widgets
				this.empty();
				
				this.content = cont;
				return this.node; /* DomNode */
			},
	
			onEnd: function(){
				// summary
				//		Called after set(), when the new content has been pushed into the node
				//		It provides an opportunity for post-processing before handing back the node to the caller
				//		This default implementation checks a parseContent flag to optionally run the dojo parser over the new content
				if(this.parseContent){
					// populates this.parseResults if you need those..
					this._parse();
				}
				return this.node; /* DomNode */
			},
	
			tearDown: function(){
				// summary
				//		manually reset the Setter instance if its being re-used for example for another set()
				// description
				//		tearDown() is not called automatically.
				//		In normal use, the Setter instance properties are simply allowed to fall out of scope
				//		but the tearDown method can be called to explicitly reset this instance.
				delete this.parseResults;
				delete this.node;
				delete this.content;
			},
  
			onContentError: function(err){
				return "Error occured setting content: " + err;
			},
			
			_mixin: function(params){
				// mix properties/methods into the instance
				// TODO: the intention with tearDown is to put the Setter's state
				// back to that of the original constructor (vs. deleting/resetting everything regardless of ctor params)
				// so we could do something here to move the original properties aside for later restoration
				var empty = {}, key;
				for(key in params){
					if(key in empty){ continue; }
					// TODO: here's our opportunity to mask the properties we dont consider configurable/overridable
					// .. but history shows we'll almost always guess wrong
					this[key] = params[key];
				}
			},
			_parse: function(){
				// summary:
				//		runs the dojo parser over the node contents, storing any results in this.parseResults
				//		Any errors resulting from parsing are passed to _onError for handling

				var rootNode = this.node;
				try{
					// store the results (widgets, whatever) for potential retrieval
					this.parseResults = dojo.parser.parse({
						rootNode: rootNode,
						noStart: !this.startup,
						inherited: {
							dir: this.dir,
							lang: this.lang
						},
						scope: this.parserScope
					});
				}catch(e){
					this._onError('Content', e, "Error parsing in _ContentSetter#"+this.id);
				}
			},
  
			_onError: function(type, err, consoleText){
				// summary:
				//		shows user the string that is returned by on[type]Error
				//		overide/implement on[type]Error and return your own string to customize
				var errText = this['on' + type + 'Error'].call(this, err);
				if(consoleText){
					console.error(consoleText, err);
				}else if(errText){ // a empty string won't change current content
					dojo.html._setNodeContent(this.node, errText, true);
				}
			}
	}); // end dojo.declare()

	dojo.html.set = function(/* DomNode */ node, /* String|DomNode|NodeList */ cont, /* Object? */ params){
			// summary:
			//		inserts (replaces) the given content into the given node. dojo.place(cont, node, "only")
			//		may be a better choice for simple HTML insertion.
			// description:
			//		Unless you need to use the params capabilities of this method, you should use
			//		dojo.place(cont, node, "only"). dojo.place() has more robust support for injecting
			//		an HTML string into the DOM, but it only handles inserting an HTML string as DOM
			//		elements, or inserting a DOM node. dojo.place does not handle NodeList insertions
			//		or the other capabilities as defined by the params object for this method.
			//	node:
			//		the parent element that will receive the content
			//	cont:
			//		the content to be set on the parent element.
			//		This can be an html string, a node reference or a NodeList, dojo.NodeList, Array or other enumerable list of nodes
			//	params:
			//		Optional flags/properties to configure the content-setting. See dojo.html._ContentSetter
			//	example:
			//		A safe string/node/nodelist content replacement/injection with hooks for extension
			//		Example Usage:
			//		dojo.html.set(node, "some string");
			//		dojo.html.set(node, contentNode, {options});
			//		dojo.html.set(node, myNode.childNodes, {options});
		if(undefined == cont){
			console.warn("dojo.html.set: no cont argument provided, using empty string");
			cont = "";
		}
		if(!params){
			// simple and fast
			return dojo.html._setNodeContent(node, cont, true);
		}else{
			// more options but slower
			// note the arguments are reversed in order, to match the convention for instantiation via the parser
			var op = new dojo.html._ContentSetter(dojo.mixin(
					params,
					{ content: cont, node: node }
			));
			return op.set();
		}
	};
})();

}

if(!dojo._hasResource["dojo.i18n"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.i18n"] = true;
dojo.provide("dojo.i18n");

dojo.getObject("i18n", true, dojo);

/*=====
dojo.i18n = {
	// summary: Utility classes to enable loading of resources for internationalization (i18n)
};
=====*/

// when using a real AMD loader, dojo.i18n.getLocalization is already defined by dojo/lib/backCompat
dojo.i18n.getLocalization = dojo.i18n.getLocalization || function(/*String*/packageName, /*String*/bundleName, /*String?*/locale){
	//	summary:
	//		Returns an Object containing the localization for a given resource
	//		bundle in a package, matching the specified locale.
	//	description:
	//		Returns a hash containing name/value pairs in its prototypesuch
	//		that values can be easily overridden.  Throws an exception if the
	//		bundle is not found.  Bundle must have already been loaded by
	//		`dojo.requireLocalization()` or by a build optimization step.  NOTE:
	//		try not to call this method as part of an object property
	//		definition (`var foo = { bar: dojo.i18n.getLocalization() }`).  In
	//		some loading situations, the bundle may not be available in time
	//		for the object definition.  Instead, call this method inside a
	//		function that is run after all modules load or the page loads (like
	//		in `dojo.addOnLoad()`), or in a widget lifecycle method.
	//	packageName:
	//		package which is associated with this resource
	//	bundleName:
	//		the base filename of the resource bundle (without the ".js" suffix)
	//	locale:
	//		the variant to load (optional).  By default, the locale defined by
	//		the host environment: dojo.locale

	locale = dojo.i18n.normalizeLocale(locale);

	// look for nearest locale match
	var elements = locale.split('-');
	var module = [packageName,"nls",bundleName].join('.');
		var bundle = dojo._loadedModules[module];
	if(bundle){
		var localization;
		for(var i = elements.length; i > 0; i--){
			var loc = elements.slice(0, i).join('_');
			if(bundle[loc]){
				localization = bundle[loc];
				break;
			}
		}
		if(!localization){
			localization = bundle.ROOT;
		}

		// make a singleton prototype so that the caller won't accidentally change the values globally
		if(localization){
			var clazz = function(){};
			clazz.prototype = localization;
			return new clazz(); // Object
		}
	}

	throw new Error("Bundle not found: " + bundleName + " in " + packageName+" , locale=" + locale);
};

dojo.i18n.normalizeLocale = function(/*String?*/locale){
	//	summary:
	//		Returns canonical form of locale, as used by Dojo.
	//
	//  description:
	//		All variants are case-insensitive and are separated by '-' as specified in [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		If no locale is specified, the dojo.locale is returned.  dojo.locale is defined by
	//		the user agent's locale unless overridden by djConfig.

	var result = locale ? locale.toLowerCase() : dojo.locale;
	if(result == "root"){
		result = "ROOT";
	}
	return result; // String
};

dojo.i18n._requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
	//	summary:
	//		See dojo.requireLocalization()
	//	description:
	// 		Called by the bootstrap, but factored out so that it is only
	// 		included in the build when needed.

	var targetLocale = dojo.i18n.normalizeLocale(locale);
 	var bundlePackage = [moduleName, "nls", bundleName].join(".");
	// NOTE:
	//		When loading these resources, the packaging does not match what is
	//		on disk.  This is an implementation detail, as this is just a
	//		private data structure to hold the loaded resources.  e.g.
	//		`tests/hello/nls/en-us/salutations.js` is loaded as the object
	//		`tests.hello.nls.salutations.en_us={...}` The structure on disk is
	//		intended to be most convenient for developers and translators, but
	//		in memory it is more logical and efficient to store in a different
	//		order.  Locales cannot use dashes, since the resulting path will
	//		not evaluate as valid JS, so we translate them to underscores.

	//Find the best-match locale to load if we have available flat locales.
	var bestLocale = "";
	if(availableFlatLocales){
		var flatLocales = availableFlatLocales.split(",");
		for(var i = 0; i < flatLocales.length; i++){
			//Locale must match from start of string.
			//Using ["indexOf"] so customBase builds do not see
			//this as a dojo._base.array dependency.
			if(targetLocale["indexOf"](flatLocales[i]) == 0){
				if(flatLocales[i].length > bestLocale.length){
					bestLocale = flatLocales[i];
				}
			}
		}
		if(!bestLocale){
			bestLocale = "ROOT";
		}
	}

	//See if the desired locale is already loaded.
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = dojo._loadedModules[bundlePackage];
	var localizedBundle = null;
	if(bundle){
		if(dojo.config.localizationComplete && bundle._built){return;}
		var jsLoc = tempLocale.replace(/-/g, '_');
		var translationPackage = bundlePackage+"."+jsLoc;
		localizedBundle = dojo._loadedModules[translationPackage];
	}

	if(!localizedBundle){
		bundle = dojo["provide"](bundlePackage);
		var syms = dojo._getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;

		dojo.i18n._searchLocalePath(tempLocale, availableFlatLocales, function(loc){
			var jsLoc = loc.replace(/-/g, '_');
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if(!dojo._loadedModules[translationPackage]){
				// Mark loaded whether it's found or not, so that further load attempts will not be made
				dojo["provide"](translationPackage);
				var module = [modpath];
				if(loc != "ROOT"){module.push(loc);}
				module.push(bundleName);
				var filespec = module.join("/") + '.js';
				loaded = dojo._loadPath(filespec, null, function(hash){
					hash = hash.root || hash;
					// Use singleton with prototype to point to parent bundle, then mix-in result from loadPath
					var clazz = function(){};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for(var j in hash){ bundle[jsLoc][j] = hash[j]; }
				});
			}else{
				loaded = true;
			}
			if(loaded && bundle[jsLoc]){
				parent = bundle[jsLoc];
			}else{
				bundle[jsLoc] = parent;
			}

			if(availableFlatLocales){
				//Stop the locale path searching if we know the availableFlatLocales, since
				//the first call to this function will load the only bundle that is needed.
				return true;
			}
		});
	}

	//Save the best locale bundle as the target locale bundle when we know the
	//the available bundles.
	if(availableFlatLocales && targetLocale != bestLocale){
		bundle[targetLocale.replace(/-/g, '_')] = bundle[bestLocale.replace(/-/g, '_')];
	}
};

(function(){
	// If other locales are used, dojo.requireLocalization should load them as
	// well, by default.
	//
	// Override dojo.requireLocalization to do load the default bundle, then
	// iterate through the extraLocale list and load those translations as
	// well, unless a particular locale was requested.

	var extra = dojo.config.extraLocale;
	if(extra){
		if(!extra instanceof Array){
			extra = [extra];
		}

		var req = dojo.i18n._requireLocalization;
		dojo.i18n._requireLocalization = function(m, b, locale, availableFlatLocales){
			req(m,b,locale, availableFlatLocales);
			if(locale){return;}
			for(var i=0; i<extra.length; i++){
				req(m,b,extra[i], availableFlatLocales);
			}
		};
	}
})();

dojo.i18n._searchLocalePath = function(/*String*/locale, /*Boolean*/down, /*Function*/searchFunc){
	//	summary:
	//		A helper method to assist in searching for locale-based resources.
	//		Will iterate through the variants of a particular locale, either up
	//		or down, executing a callback function.  For example, "en-us" and
	//		true will try "en-us" followed by "en" and finally "ROOT".

	locale = dojo.i18n.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	searchlist.push(false);
	if(down){searchlist.reverse();}

	for(var j = searchlist.length - 1; j >= 0; j--){
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if(stop){ break; }
	}
};

dojo.i18n._preloadLocalizations = function(/*String*/bundlePrefix, /*Array*/localesGenerated){
	//	summary:
	//		Load built, flattened resource bundles, if available for all
	//		locales used in the page. Only called by built layer files.

	function preload(locale){
		locale = dojo.i18n.normalizeLocale(locale);
		dojo.i18n._searchLocalePath(locale, true, function(loc){
			for(var i=0; i<localesGenerated.length;i++){
				if(localesGenerated[i] == loc){
					dojo["require"](bundlePrefix+"_"+loc);
					return true; // Boolean
				}
			}
			return false; // Boolean
		});
	}
	preload();
	var extra = dojo.config.extraLocale||[];
	for(var i=0; i<extra.length; i++){
		preload(extra[i]);
	}
};

}

if(!dojo._hasResource["dijit.layout.ContentPane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.ContentPane"] = true;
dojo.provide("dijit.layout.ContentPane");








dojo.declare(
	"dijit.layout.ContentPane", [dijit._Widget, dijit.layout._ContentPaneResizeMixin],
{
	// summary:
	//		A widget containing an HTML fragment, specified inline
	//		or by uri.  Fragment may include widgets.
	//
	// description:
	//		This widget embeds a document fragment in the page, specified
	//		either by uri, javascript generated markup or DOM reference.
	//		Any widgets within this content are instantiated and managed,
	//		but laid out according to the HTML structure.  Unlike IFRAME,
	//		ContentPane embeds a document fragment as would be found
	//		inside the BODY tag of a full HTML document.  It should not
	//		contain the HTML, HEAD, or BODY tags.
	//		For more advanced functionality with scripts and
	//		stylesheets, see dojox.layout.ContentPane.  This widget may be
	//		used stand alone or as a base class for other widgets.
	//		ContentPane is useful as a child of other layout containers
	//		such as BorderContainer or TabContainer, but note that those
	//		widgets can contain any widget as a child.
	//
	// example:
	//		Some quick samples:
	//		To change the innerHTML: cp.set('content', '<b>new content</b>')
	//
	//		Or you can send it a NodeList: cp.set('content', dojo.query('div [class=selected]', userSelection))
	//
	//		To do an ajax update: cp.set('href', url)

	// href: String
	//		The href of the content that displays now.
	//		Set this at construction if you want to load data externally when the
	//		pane is shown.  (Set preload=true to load it immediately.)
	//		Changing href after creation doesn't have any effect; Use set('href', ...);
	href: "",

/*=====
	// content: String || DomNode || NodeList || dijit._Widget
	//		The innerHTML of the ContentPane.
	//		Note that the initialization parameter / argument to set("content", ...)
	//		can be a String, DomNode, Nodelist, or _Widget.
	content: "",
=====*/

	// extractContent: Boolean
	//		Extract visible content from inside of <body> .... </body>.
	//		I.e., strip <html> and <head> (and it's contents) from the href
	extractContent: false,

	// parseOnLoad: Boolean
	//		Parse content and create the widgets, if any.
	parseOnLoad: true,

	// parserScope: String
	//		Flag passed to parser.  Root for attribute names to search for.   If scopeName is dojo,
	//		will search for data-dojo-type (or dojoType).  For backwards compatibility
	//		reasons defaults to dojo._scopeName (which is "dojo" except when
	//		multi-version support is used, when it will be something like dojo16, dojo20, etc.)
	parserScope: dojo._scopeName,

	// preventCache: Boolean
	//		Prevent caching of data from href's by appending a timestamp to the href.
	preventCache: false,

	// preload: Boolean
	//		Force load of data on initialization even if pane is hidden.
	preload: false,

	// refreshOnShow: Boolean
	//		Refresh (re-download) content when pane goes from hidden to shown
	refreshOnShow: false,

	// loadingMessage: String
	//		Message that shows while downloading
	loadingMessage: "<span class='dijitContentPaneLoading'>${loadingState}</span>",

	// errorMessage: String
	//		Message that shows if an error occurs
	errorMessage: "<span class='dijitContentPaneError'>${errorState}</span>",

	// isLoaded: [readonly] Boolean
	//		True if the ContentPane has data in it, either specified
	//		during initialization (via href or inline content), or set
	//		via set('content', ...) / set('href', ...)
	//
	//		False if it doesn't have any content, or if ContentPane is
	//		still in the process of downloading href.
	isLoaded: false,

	baseClass: "dijitContentPane",

	// ioArgs: Object
	//		Parameters to pass to xhrGet() request, for example:
	// |	<div dojoType="dijit.layout.ContentPane" href="./bar" ioArgs="{timeout: 500}">
	ioArgs: {},

	// onLoadDeferred: [readonly] dojo.Deferred
	//		This is the `dojo.Deferred` returned by set('href', ...) and refresh().
	//		Calling onLoadDeferred.addCallback() or addErrback() registers your
	//		callback to be called only once, when the prior set('href', ...) call or
	//		the initial href parameter to the constructor finishes loading.
	//
	//		This is different than an onLoad() handler which gets called any time any href
	//		or content is loaded.
	onLoadDeferred: null,

	// Override _Widget's attributeMap because we don't want the title attribute (used to specify
	// tab labels) to be copied to ContentPane.domNode... otherwise a tooltip shows up over the
	// entire pane.
	attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		title: []
	}),

	// Flag to parser that I'll parse my contents, so it shouldn't.
	stopParser: true,

	// template: [private] Boolean
	//		Flag from the parser that this ContentPane is inside a template
	//		so the contents are pre-parsed.
	// (TODO: this declaration can be commented out in 2.0)
	template: false,

	create: function(params, srcNodeRef){
		// Convert a srcNodeRef argument into a content parameter, so that the original contents are
		// processed in the same way as contents set via set("content", ...), calling the parser etc.
		// Avoid modifying original params object since that breaks NodeList instantiation, see #11906.
		if((!params || !params.template) && srcNodeRef && !("href" in params) && !("content" in params)){
			var df = dojo.doc.createDocumentFragment();
			srcNodeRef = dojo.byId(srcNodeRef)
			while(srcNodeRef.firstChild){
				df.appendChild(srcNodeRef.firstChild);
			}
			params = dojo.delegate(params, {content: df});
		}
		this.inherited(arguments, [params, srcNodeRef]);
	},

	postMixInProperties: function(){
		this.inherited(arguments);
		var messages = dojo.i18n.getLocalization("dijit", "loading", this.lang);
		this.loadingMessage = dojo.string.substitute(this.loadingMessage, messages);
		this.errorMessage = dojo.string.substitute(this.errorMessage, messages);
	},

	buildRendering: function(){
		this.inherited(arguments);

		// Since we have no template we need to set this.containerNode ourselves, to make getChildren() work.
		// For subclasses of ContentPane that do have a template, does nothing.
		if(!this.containerNode){
			this.containerNode = this.domNode;
		}

		// remove the title attribute so it doesn't show up when hovering
		// over a node  (TODO: remove in 2.0, no longer needed after #11490)
		this.domNode.title = "";

		if(!dojo.attr(this.domNode,"role")){
			dijit.setWaiRole(this.domNode, "group");
		}
	},

	_startChildren: function(){
		// summary:
		//		Call startup() on all children including non _Widget ones like dojo.dnd.Source objects

		// This starts all the widgets
		this.inherited(arguments);

		// And this catches stuff like dojo.dnd.Source
		if(this._contentSetter){
			dojo.forEach(this._contentSetter.parseResults, function(obj){
				if(!obj._started && !obj._destroyed && dojo.isFunction(obj.startup)){
					obj.startup();
					obj._started = true;
				}
			}, this);
		}
	},

	startup: function(){
		// summary:
		//		See `dijit.layout._LayoutWidget.startup` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.

		if(this._started){ return; }

		this.inherited(arguments);

		if(this._isShown()){
			this._onShow();
		}
	},

	setHref: function(/*String|Uri*/ href){
		// summary:
		//		Deprecated.   Use set('href', ...) instead.
		dojo.deprecated("dijit.layout.ContentPane.setHref() is deprecated. Use set('href', ...) instead.", "", "2.0");
		return this.set("href", href);
	},
	_setHrefAttr: function(/*String|Uri*/ href){
		// summary:
		//		Hook so set("href", ...) works.
		// description:
		//		Reset the (external defined) content of this pane and replace with new url
		//		Note: It delays the download until widget is shown if preload is false.
		//	href:
		//		url to the page you want to get, must be within the same domain as your mainpage

		// Cancel any in-flight requests (a set('href', ...) will cancel any in-flight set('href', ...))
		this.cancel();

		this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
		this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));

		this._set("href", href);

		// _setHrefAttr() is called during creation and by the user, after creation.
		// Assuming preload == false, only in the second case do we actually load the URL;
		// otherwise it's done in startup(), and only if this widget is shown.
		if(this.preload || (this._created && this._isShown())){
			this._load();
		}else{
			// Set flag to indicate that href needs to be loaded the next time the
			// ContentPane is made visible
			this._hrefChanged = true;
		}

		return this.onLoadDeferred;		// dojo.Deferred
	},

	setContent: function(/*String|DomNode|Nodelist*/data){
		// summary:
		//		Deprecated.   Use set('content', ...) instead.
		dojo.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use set('content', ...) instead.", "", "2.0");
		this.set("content", data);
	},
	_setContentAttr: function(/*String|DomNode|Nodelist*/data){
		// summary:
		//		Hook to make set("content", ...) work.
		//		Replaces old content with data content, include style classes from old content
		//	data:
		//		the new Content may be String, DomNode or NodeList
		//
		//		if data is a NodeList (or an array of nodes) nodes are copied
		//		so you can import nodes from another document implicitly

		// clear href so we can't run refresh and clear content
		// refresh should only work if we downloaded the content
		this._set("href", "");

		// Cancel any in-flight requests (a set('content', ...) will cancel any in-flight set('href', ...))
		this.cancel();

		// Even though user is just setting content directly, still need to define an onLoadDeferred
		// because the _onLoadHandler() handler is still getting called from setContent()
		this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
		if(this._created){
			// For back-compat reasons, call onLoad() for set('content', ...)
			// calls but not for content specified in srcNodeRef (ie: <div dojoType=ContentPane>...</div>)
			// or as initialization parameter (ie: new ContentPane({content: ...})
			this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));
		}

		this._setContent(data || "");

		this._isDownloaded = false; // mark that content is from a set('content') not a set('href')

		return this.onLoadDeferred; 	// dojo.Deferred
	},
	_getContentAttr: function(){
		// summary:
		//		Hook to make get("content") work
		return this.containerNode.innerHTML;
	},

	cancel: function(){
		// summary:
		//		Cancels an in-flight download of content
		if(this._xhrDfd && (this._xhrDfd.fired == -1)){
			this._xhrDfd.cancel();
		}
		delete this._xhrDfd; // garbage collect

		this.onLoadDeferred = null;
	},

	uninitialize: function(){
		if(this._beingDestroyed){
			this.cancel();
		}
		this.inherited(arguments);
	},

	destroyRecursive: function(/*Boolean*/ preserveDom){
		// summary:
		//		Destroy the ContentPane and its contents

		// if we have multiple controllers destroying us, bail after the first
		if(this._beingDestroyed){
			return;
		}
		this.inherited(arguments);
	},

	resize: function(changeSize, resultSize){
		// summary:
		//		See `dijit.layout._LayoutWidget.resize` for description.
		//		Although ContentPane doesn't extend _LayoutWidget, it does implement
		//		the same API.

		// For the TabContainer --> BorderContainer --> ContentPane case, _onShow() is
		// never called, so resize() is our trigger to do the initial href download (see [20099]).
		// However, don't load href for closed TitlePanes.
		if(!this._wasShown && this.open !== false){
			this._onShow();
		}

		this._resizeCalled = true;

		this._scheduleLayout(changeSize, resultSize);
	},

	_isShown: function(){
		// summary:
		//		Returns true if the content is currently shown.
		// description:
		//		If I am a child of a layout widget then it actually returns true if I've ever been visible,
		//		not whether I'm currently visible, since that's much faster than tracing up the DOM/widget
		//		tree every call, and at least solves the performance problem on page load by deferring loading
		//		hidden ContentPanes until they are first shown

		if(this._childOfLayoutWidget){
			// If we are TitlePane, etc - we return that only *IF* we've been resized
			if(this._resizeCalled && "open" in this){
				return this.open;
			}
			return this._resizeCalled;
		}else if("open" in this){
			return this.open;		// for TitlePane, etc.
		}else{
			var node = this.domNode, parent = this.domNode.parentNode;
			return (node.style.display != 'none') && (node.style.visibility != 'hidden') && !dojo.hasClass(node, "dijitHidden") &&
					parent && parent.style && (parent.style.display != 'none');
		}
	},

	_onShow: function(){
		// summary:
		//		Called when the ContentPane is made visible
		// description:
		//		For a plain ContentPane, this is called on initialization, from startup().
		//		If the ContentPane is a hidden pane of a TabContainer etc., then it's
		//		called whenever the pane is made visible.
		//
		//		Does necessary processing, including href download and layout/resize of
		//		child widget(s)

		if(this.href){
			if(!this._xhrDfd && // if there's an href that isn't already being loaded
				(!this.isLoaded || this._hrefChanged || this.refreshOnShow)
			){
				var d = this.refresh();
			}
		}else{
			if(this._needLayout){
				// If a layout has been scheduled for when we become visible, do it now
				this._layout(this._changeSize, this._resultSize);
			}
		}

		this.inherited(arguments);

		// Need to keep track of whether ContentPane has been shown (which is different than
		// whether or not it's currently visible).
		this._wasShown = true;
		
		return d;		// If child has an href, promise that fires when the load is complete
	},

	refresh: function(){
		// summary:
		//		[Re]download contents of href and display
		// description:
		//		1. cancels any currently in-flight requests
		//		2. posts "loading..." message
		//		3. sends XHR to download new data

		// Cancel possible prior in-flight request
		this.cancel();

		this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
		this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));
		this._load();
		return this.onLoadDeferred;		// If child has an href, promise that fires when refresh is complete
	},

	_load: function(){
		// summary:
		//		Load/reload the href specified in this.href

		// display loading message
		this._setContent(this.onDownloadStart(), true);

		var self = this;
		var getArgs = {
			preventCache: (this.preventCache || this.refreshOnShow),
			url: this.href,
			handleAs: "text"
		};
		if(dojo.isObject(this.ioArgs)){
			dojo.mixin(getArgs, this.ioArgs);
		}

		var hand = (this._xhrDfd = (this.ioMethod || dojo.xhrGet)(getArgs));

		hand.addCallback(function(html){
			try{
				self._isDownloaded = true;
				self._setContent(html, false);
				self.onDownloadEnd();
			}catch(err){
				self._onError('Content', err); // onContentError
			}
			delete self._xhrDfd;
			return html;
		});

		hand.addErrback(function(err){
			if(!hand.canceled){
				// show error message in the pane
				self._onError('Download', err); // onDownloadError
			}
			delete self._xhrDfd;
			return err;
		});

		// Remove flag saying that a load is needed
		delete this._hrefChanged;
	},

	_onLoadHandler: function(data){
		// summary:
		//		This is called whenever new content is being loaded
		this._set("isLoaded", true);
		try{
			this.onLoadDeferred.callback(data);
		}catch(e){
			console.error('Error '+this.widgetId+' running custom onLoad code: ' + e.message);
		}
	},

	_onUnloadHandler: function(){
		// summary:
		//		This is called whenever the content is being unloaded
		this._set("isLoaded", false);
		try{
			this.onUnload();
		}catch(e){
			console.error('Error '+this.widgetId+' running custom onUnload code: ' + e.message);
		}
	},

	destroyDescendants: function(){
		// summary:
		//		Destroy all the widgets inside the ContentPane and empty containerNode

		// Make sure we call onUnload (but only when the ContentPane has real content)
		if(this.isLoaded){
			this._onUnloadHandler();
		}

		// Even if this.isLoaded == false there might still be a "Loading..." message
		// to erase, so continue...

		// For historical reasons we need to delete all widgets under this.containerNode,
		// even ones that the user has created manually.
		var setter = this._contentSetter;
		dojo.forEach(this.getChildren(), function(widget){
			if(widget.destroyRecursive){
				widget.destroyRecursive();
			}
		});
		if(setter){
			// Most of the widgets in setter.parseResults have already been destroyed, but
			// things like Menu that have been moved to <body> haven't yet
			dojo.forEach(setter.parseResults, function(widget){
				if(widget.destroyRecursive && widget.domNode && widget.domNode.parentNode == dojo.body()){
					widget.destroyRecursive();
				}
			});
			delete setter.parseResults;
		}

		// And then clear away all the DOM nodes
		dojo.html._emptyNode(this.containerNode);

		// Delete any state information we have about current contents
		delete this._singleChild;
	},

	_setContent: function(/*String|DocumentFragment*/ cont, /*Boolean*/ isFakeContent){
		// summary:
		//		Insert the content into the container node

		// first get rid of child widgets
		this.destroyDescendants();

		// dojo.html.set will take care of the rest of the details
		// we provide an override for the error handling to ensure the widget gets the errors
		// configure the setter instance with only the relevant widget instance properties
		// NOTE: unless we hook into attr, or provide property setters for each property,
		// we need to re-configure the ContentSetter with each use
		var setter = this._contentSetter;
		if(! (setter && setter instanceof dojo.html._ContentSetter)){
			setter = this._contentSetter = new dojo.html._ContentSetter({
				node: this.containerNode,
				_onError: dojo.hitch(this, this._onError),
				onContentError: dojo.hitch(this, function(e){
					// fires if a domfault occurs when we are appending this.errorMessage
					// like for instance if domNode is a UL and we try append a DIV
					var errMess = this.onContentError(e);
					try{
						this.containerNode.innerHTML = errMess;
					}catch(e){
						console.error('Fatal '+this.id+' could not change content due to '+e.message, e);
					}
				})/*,
				_onError */
			});
		};

		var setterParams = dojo.mixin({
			cleanContent: this.cleanContent,
			extractContent: this.extractContent,
			parseContent: this.parseOnLoad,
			parserScope: this.parserScope,
			startup: false,
			dir: this.dir,
			lang: this.lang
		}, this._contentSetterParams || {});

		setter.set( (dojo.isObject(cont) && cont.domNode) ? cont.domNode : cont, setterParams );

		// setter params must be pulled afresh from the ContentPane each time
		delete this._contentSetterParams;

		if(this.doLayout){
			this._checkIfSingleChild();
		}

		if(!isFakeContent){
			if(this._started){
				// Startup each top level child widget (and they will start their children, recursively)
				this._startChildren();
	
				// Call resize() on each of my child layout widgets,
				// or resize() on my single child layout widget...
				// either now (if I'm currently visible) or when I become visible
				this._scheduleLayout();
			}

			this._onLoadHandler(cont);
		}
	},

	_onError: function(type, err, consoleText){
		this.onLoadDeferred.errback(err);

		// shows user the string that is returned by on[type]Error
		// override on[type]Error and return your own string to customize
		var errText = this['on' + type + 'Error'].call(this, err);
		if(consoleText){
			console.error(consoleText, err);
		}else if(errText){// a empty string won't change current content
			this._setContent(errText, true);
		}
	},

	_scheduleLayout: function(changeSize, resultSize){
		// summary:
		//		Resize myself, and call resize() on each of my child layout widgets, either now
		//		(if I'm currently visible) or when I become visible
		if(this._isShown()){
			this._layout(changeSize, resultSize);
		}else{
			this._needLayout = true;
			this._changeSize = changeSize;
			this._resultSize = resultSize;
		}
	},

	// EVENT's, should be overide-able
	onLoad: function(data){
		// summary:
		//		Event hook, is called after everything is loaded and widgetified
		// tags:
		//		callback
	},

	onUnload: function(){
		// summary:
		//		Event hook, is called before old content is cleared
		// tags:
		//		callback
	},

	onDownloadStart: function(){
		// summary:
		//		Called before download starts.
		// description:
		//		The string returned by this function will be the html
		//		that tells the user we are loading something.
		//		Override with your own function if you want to change text.
		// tags:
		//		extension
		return this.loadingMessage;
	},

	onContentError: function(/*Error*/ error){
		// summary:
		//		Called on DOM faults, require faults etc. in content.
		//
		//		In order to display an error message in the pane, return
		//		the error message from this method, as an HTML string.
		//
		//		By default (if this method is not overriden), it returns
		//		nothing, so the error message is just printed to the console.
		// tags:
		//		extension
	},

	onDownloadError: function(/*Error*/ error){
		// summary:
		//		Called when download error occurs.
		//
		//		In order to display an error message in the pane, return
		//		the error message from this method, as an HTML string.
		//
		//		Default behavior (if this method is not overriden) is to display
		//		the error message inside the pane.
		// tags:
		//		extension
		return this.errorMessage;
	},

	onDownloadEnd: function(){
		// summary:
		//		Called when download is finished.
		// tags:
		//		callback
	}
});

}

if(!dojo._hasResource["dijit.TooltipDialog"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.TooltipDialog"] = true;
dojo.provide("dijit.TooltipDialog");






dojo.declare(
		"dijit.TooltipDialog",
		[dijit.layout.ContentPane, dijit._Templated, dijit.form._FormMixin, dijit._DialogMixin],
		{
			// summary:
			//		Pops up a dialog that appears like a Tooltip

			// title: String
			// 		Description of tooltip dialog (required for a11y)
			title: "",

			// doLayout: [protected] Boolean
			//		Don't change this parameter from the default value.
			//		This ContentPane parameter doesn't make sense for TooltipDialog, since TooltipDialog
			//		is never a child of a layout container, nor can you specify the size of
			//		TooltipDialog in order to control the size of an inner widget.
			doLayout: false,

			// autofocus: Boolean
			// 		A Toggle to modify the default focus behavior of a Dialog, which
			// 		is to focus on the first dialog element after opening the dialog.
			//		False will disable autofocusing. Default: true
			autofocus: true,

			// baseClass: [protected] String
			//		The root className to use for the various states of this widget
			baseClass: "dijitTooltipDialog",

			// _firstFocusItem: [private] [readonly] DomNode
			//		The pointer to the first focusable node in the dialog.
			//		Set by `dijit._DialogMixin._getFocusItems`.
			_firstFocusItem: null,

			// _lastFocusItem: [private] [readonly] DomNode
			//		The pointer to which node has focus prior to our dialog.
			//		Set by `dijit._DialogMixin._getFocusItems`.
			_lastFocusItem: null,

			templateString: dojo.cache("dijit", "templates/TooltipDialog.html", "<div role=\"presentation\" tabIndex=\"-1\">\n\t<div class=\"dijitTooltipContainer\" role=\"presentation\">\n\t\t<div class =\"dijitTooltipContents dijitTooltipFocusNode\" dojoAttachPoint=\"containerNode\" role=\"dialog\"></div>\n\t</div>\n\t<div class=\"dijitTooltipConnector\" role=\"presentation\"></div>\n</div>\n"),

			_setTitleAttr: function(/*String*/ title){
				this.containerNode.title = title;
				this._set("title", title)
			},

			postCreate: function(){
				this.inherited(arguments);
				this.connect(this.containerNode, "onkeypress", "_onKey");
			},

			orient: function(/*DomNode*/ node, /*String*/ aroundCorner, /*String*/ corner){
				// summary:
				//		Configure widget to be displayed in given position relative to the button.
				//		This is called from the dijit.popup code, and should not be called
				//		directly.
				// tags:
				//		protected
				var newC = "dijitTooltipAB" + (corner.charAt(1) == 'L' ? "Left" : "Right")
						+ " dijitTooltip"
						+ (corner.charAt(0) == 'T' ? "Below" : "Above");
				
				dojo.replaceClass(this.domNode, newC, this._currentOrientClass || "");
				this._currentOrientClass = newC;
			},

			focus: function(){
				// summary:
				//		Focus on first field
				this._getFocusItems(this.containerNode);
				dijit.focus(this._firstFocusItem);
			},

			onOpen: function(/*Object*/ pos){
				// summary:
				//		Called when dialog is displayed.
				//		This is called from the dijit.popup code, and should not be called directly.
				// tags:
				//		protected

				this.orient(this.domNode,pos.aroundCorner, pos.corner);
				this._onShow(); // lazy load trigger
			},

			onClose: function(){
				// summary:
				//		Called when dialog is hidden.
				//		This is called from the dijit.popup code, and should not be called directly.
				// tags:
				//		protected
				this.onHide();
			},

			_onKey: function(/*Event*/ evt){
				// summary:
				//		Handler for keyboard events
				// description:
				//		Keep keyboard focus in dialog; close dialog on escape key
				// tags:
				//		private

				var node = evt.target;
				var dk = dojo.keys;
				if(evt.charOrCode === dk.TAB){
					this._getFocusItems(this.containerNode);
				}
				var singleFocusItem = (this._firstFocusItem == this._lastFocusItem);
				if(evt.charOrCode == dk.ESCAPE){
					// Use setTimeout to avoid crash on IE, see #10396.
					setTimeout(dojo.hitch(this, "onCancel"), 0);
					dojo.stopEvent(evt);
				}else if(node == this._firstFocusItem && evt.shiftKey && evt.charOrCode === dk.TAB){
					if(!singleFocusItem){
						dijit.focus(this._lastFocusItem); // send focus to last item in dialog
					}
					dojo.stopEvent(evt);
				}else if(node == this._lastFocusItem && evt.charOrCode === dk.TAB && !evt.shiftKey){
					if(!singleFocusItem){
						dijit.focus(this._firstFocusItem); // send focus to first item in dialog
					}
					dojo.stopEvent(evt);
				}else if(evt.charOrCode === dk.TAB){
					// we want the browser's default tab handling to move focus
					// but we don't want the tab to propagate upwards
					evt.stopPropagation();
				}
			}
		}
	);

}

if(!dojo._hasResource["dijit.Dialog"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Dialog"] = true;
dojo.provide("dijit.Dialog");















// dijit/TooltipDialog required for back-compat.  TODO: remove in 2.0

/*=====
dijit._underlay = function(kwArgs){
	// summary:
	//		A shared instance of a `dijit.DialogUnderlay`
	//
	// description:
	//		A shared instance of a `dijit.DialogUnderlay` created and
	//		used by `dijit.Dialog`, though never created until some Dialog
	//		or subclass thereof is shown.
};
=====*/
dojo.declare(
	"dijit._DialogBase",
	[dijit._Templated, dijit.form._FormMixin, dijit._DialogMixin, dijit._CssStateMixin],
	{
		// summary:
		//		A modal dialog Widget
		//
		// description:
		//		Pops up a modal dialog window, blocking access to the screen
		//		and also graying out the screen Dialog is extended from
		//		ContentPane so it supports all the same parameters (href, etc.)
		//
		// example:
		// |	<div dojoType="dijit.Dialog" href="test.html"></div>
		//
		// example:
		// |	var foo = new dijit.Dialog({ title: "test dialog", content: "test content" };
		// |	dojo.body().appendChild(foo.domNode);
		// |	foo.startup();

		templateString: dojo.cache("dijit", "templates/Dialog.html", "<div class=\"dijitDialog\" role=\"dialog\" aria-labelledby=\"${id}_title\">\n\t<div dojoAttachPoint=\"titleBar\" class=\"dijitDialogTitleBar\">\n\t<span dojoAttachPoint=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"></span>\n\t<span dojoAttachPoint=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" dojoAttachEvent=\"ondijitclick: onCancel\" title=\"${buttonCancel}\" role=\"button\" tabIndex=\"-1\">\n\t\t<span dojoAttachPoint=\"closeText\" class=\"closeText\" title=\"${buttonCancel}\">x</span>\n\t</span>\n\t</div>\n\t\t<div dojoAttachPoint=\"containerNode\" class=\"dijitDialogPaneContent\"></div>\n</div>\n"),
		
		baseClass: "dijitDialog",
		
		cssStateNodes: {
			closeButtonNode: "dijitDialogCloseIcon"
		},

		attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
			title: [
				{ node: "titleNode", type: "innerHTML" },
				{ node: "titleBar", type: "attribute" }
			],
			"aria-describedby":""
		}),

		// open: [readonly] Boolean
		//		True if Dialog is currently displayed on screen.
		open: false,

		// duration: Integer
		//		The time in milliseconds it takes the dialog to fade in and out
		duration: dijit.defaultDuration,

		// refocus: Boolean
		// 		A Toggle to modify the default focus behavior of a Dialog, which
		// 		is to re-focus the element which had focus before being opened.
		//		False will disable refocusing. Default: true
		refocus: true,

		// autofocus: Boolean
		// 		A Toggle to modify the default focus behavior of a Dialog, which
		// 		is to focus on the first dialog element after opening the dialog.
		//		False will disable autofocusing. Default: true
		autofocus: true,

		// _firstFocusItem: [private readonly] DomNode
		//		The pointer to the first focusable node in the dialog.
		//		Set by `dijit._DialogMixin._getFocusItems`.
		_firstFocusItem: null,

		// _lastFocusItem: [private readonly] DomNode
		//		The pointer to which node has focus prior to our dialog.
		//		Set by `dijit._DialogMixin._getFocusItems`.
		_lastFocusItem: null,

		// doLayout: [protected] Boolean
		//		Don't change this parameter from the default value.
		//		This ContentPane parameter doesn't make sense for Dialog, since Dialog
		//		is never a child of a layout container, nor can you specify the size of
		//		Dialog in order to control the size of an inner widget.
		doLayout: false,

		// draggable: Boolean
		//		Toggles the moveable aspect of the Dialog. If true, Dialog
		//		can be dragged by it's title. If false it will remain centered
		//		in the viewport.
		draggable: true,

		//aria-describedby: String
		//		Allows the user to add an aria-describedby attribute onto the dialog.   The value should
		//		be the id of the container element of text that describes the dialog purpose (usually
		//		the first text in the dialog).
		//		<div dojoType="dijit.Dialog" aria-describedby="intro" .....>
		//			<div id="intro">Introductory text</div>
		//			<div>rest of dialog contents</div>
		//		</div>
		"aria-describedby":"",

		postMixInProperties: function(){
			var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
			dojo.mixin(this, _nlsResources);
			this.inherited(arguments);
		},

		postCreate: function(){
			dojo.style(this.domNode, {
				display: "none",
				position:"absolute"
			});
			dojo.body().appendChild(this.domNode);

			this.inherited(arguments);

			this.connect(this, "onExecute", "hide");
			this.connect(this, "onCancel", "hide");
			this._modalconnects = [];
		},

		onLoad: function(){
			// summary:
			//		Called when data has been loaded from an href.
			//		Unlike most other callbacks, this function can be connected to (via `dojo.connect`)
			//		but should *not* be overridden.
			// tags:
			//		callback

			// when href is specified we need to reposition the dialog after the data is loaded
			// and find the focusable elements
			this._position();
			if(this.autofocus && dijit._DialogLevelManager.isTop(this)){
				this._getFocusItems(this.domNode);
				dijit.focus(this._firstFocusItem);
			}
			this.inherited(arguments);
		},

		_endDrag: function(e){
			// summary:
			//		Called after dragging the Dialog. Saves the position of the dialog in the viewport.
			// tags:
			//		private
			if(e && e.node && e.node === this.domNode){
				this._relativePosition = dojo.position(e.node);
			}
		},

		_setup: function(){
			// summary:
			//		Stuff we need to do before showing the Dialog for the first
			//		time (but we defer it until right beforehand, for
			//		performance reasons).
			// tags:
			//		private

			var node = this.domNode;

			if(this.titleBar && this.draggable){
				this._moveable = (dojo.isIE == 6) ?
					new dojo.dnd.TimedMoveable(node, { handle: this.titleBar }) :	// prevent overload, see #5285
					new dojo.dnd.Moveable(node, { handle: this.titleBar, timeout: 0 });
				this._dndListener = dojo.subscribe("/dnd/move/stop",this,"_endDrag");
			}else{
				dojo.addClass(node,"dijitDialogFixed");
			}

			this.underlayAttrs = {
				dialogId: this.id,
				"class": dojo.map(this["class"].split(/\s/), function(s){ return s+"_underlay"; }).join(" ")
			};
		},

		_size: function(){
			// summary:
			// 		If necessary, shrink dialog contents so dialog fits in viewport
			// tags:
			//		private

			this._checkIfSingleChild();

			// If we resized the dialog contents earlier, reset them back to original size, so
			// that if the user later increases the viewport size, the dialog can display w/out a scrollbar.
			// Need to do this before the dojo.marginBox(this.domNode) call below.
			if(this._singleChild){
				if(this._singleChildOriginalStyle){
					this._singleChild.domNode.style.cssText = this._singleChildOriginalStyle;
				}
				delete this._singleChildOriginalStyle;
			}else{
				dojo.style(this.containerNode, {
					width:"auto",
					height:"auto"
				});
			}

			var mb = dojo._getMarginSize(this.domNode);
			var viewport = dojo.window.getBox();
			if(mb.w >= viewport.w || mb.h >= viewport.h){
				// Reduce size of dialog contents so that dialog fits in viewport

				var w = Math.min(mb.w, Math.floor(viewport.w * 0.75)),
					h = Math.min(mb.h, Math.floor(viewport.h * 0.75));

				if(this._singleChild && this._singleChild.resize){
					this._singleChildOriginalStyle = this._singleChild.domNode.style.cssText;
					this._singleChild.resize({w: w, h: h});
				}else{
					dojo.style(this.containerNode, {
						width: w + "px",
						height: h + "px",
						overflow: "auto",
						position: "relative"	// workaround IE bug moving scrollbar or dragging dialog
					});
				}
			}else{
				if(this._singleChild && this._singleChild.resize){
					this._singleChild.resize();
				}
			}
		},

		_position: function(){
			// summary:
			//		Position modal dialog in the viewport. If no relative offset
			//		in the viewport has been determined (by dragging, for instance),
			//		center the node. Otherwise, use the Dialog's stored relative offset,
			//		and position the node to top: left: values based on the viewport.
			// tags:
			//		private
			if(!dojo.hasClass(dojo.body(),"dojoMove")){
				var node = this.domNode,
					viewport = dojo.window.getBox(),
					p = this._relativePosition,
					bb = p ? null : dojo._getBorderBox(node),
					l = Math.floor(viewport.l + (p ? p.x : (viewport.w - bb.w) / 2)),
					t = Math.floor(viewport.t + (p ? p.y : (viewport.h - bb.h) / 2))
				;
				dojo.style(node,{
					left: l + "px",
					top: t + "px"
				});
			}
		},

		_onKey: function(/*Event*/ evt){
			// summary:
			//		Handles the keyboard events for accessibility reasons
			// tags:
			//		private

			if(evt.charOrCode){
				var dk = dojo.keys;
				var node = evt.target;
				if(evt.charOrCode === dk.TAB){
					this._getFocusItems(this.domNode);
				}
				var singleFocusItem = (this._firstFocusItem == this._lastFocusItem);
				// see if we are shift-tabbing from first focusable item on dialog
				if(node == this._firstFocusItem && evt.shiftKey && evt.charOrCode === dk.TAB){
					if(!singleFocusItem){
						dijit.focus(this._lastFocusItem); // send focus to last item in dialog
					}
					dojo.stopEvent(evt);
				}else if(node == this._lastFocusItem && evt.charOrCode === dk.TAB && !evt.shiftKey){
					if(!singleFocusItem){
						dijit.focus(this._firstFocusItem); // send focus to first item in dialog
					}
					dojo.stopEvent(evt);
				}else{
					// see if the key is for the dialog
					while(node){
						if(node == this.domNode || dojo.hasClass(node, "dijitPopup")){
							if(evt.charOrCode == dk.ESCAPE){
								this.onCancel();
							}else{
								return; // just let it go
							}
						}
						node = node.parentNode;
					}
					// this key is for the disabled document window
					if(evt.charOrCode !== dk.TAB){ // allow tabbing into the dialog for a11y
						dojo.stopEvent(evt);
					// opera won't tab to a div
					}else if(!dojo.isOpera){
						try{
							this._firstFocusItem.focus();
						}catch(e){ /*squelch*/ }
					}
				}
			}
		},

		show: function(){
			// summary:
			//		Display the dialog
			// returns: dojo.Deferred
			//		Deferred object that resolves when the display animation is complete

			if(this.open){ return; }

			if(!this._started){
				this.startup();
			}

			// first time we show the dialog, there's some initialization stuff to do
			if(!this._alreadyInitialized){
				this._setup();
				this._alreadyInitialized=true;
			}

			if(this._fadeOutDeferred){
				this._fadeOutDeferred.cancel();
			}

			this._modalconnects.push(dojo.connect(window, "onscroll", this, "layout"));
			this._modalconnects.push(dojo.connect(window, "onresize", this, function(){
				// IE gives spurious resize events and can actually get stuck
				// in an infinite loop if we don't ignore them
				var viewport = dojo.window.getBox();
				if(!this._oldViewport ||
						viewport.h != this._oldViewport.h ||
						viewport.w != this._oldViewport.w){
					this.layout();
					this._oldViewport = viewport;
				}
			}));
			this._modalconnects.push(dojo.connect(this.domNode, "onkeypress", this, "_onKey"));

			dojo.style(this.domNode, {
				opacity:0,
				display:""
			});

			this._set("open", true);
			this._onShow(); // lazy load trigger

			this._size();
			this._position();

			// fade-in Animation object, setup below
			var fadeIn;

			this._fadeInDeferred = new dojo.Deferred(dojo.hitch(this, function(){
				fadeIn.stop();
				delete this._fadeInDeferred;
			}));

			fadeIn = dojo.fadeIn({
				node: this.domNode,
				duration: this.duration,
				beforeBegin: dojo.hitch(this, function(){
					dijit._DialogLevelManager.show(this, this.underlayAttrs);
				}),
				onEnd: dojo.hitch(this, function(){
					if(this.autofocus && dijit._DialogLevelManager.isTop(this)){
						// find focusable items each time dialog is shown since if dialog contains a widget the
						// first focusable items can change
						this._getFocusItems(this.domNode);
						dijit.focus(this._firstFocusItem);
					}
					this._fadeInDeferred.callback(true);
					delete this._fadeInDeferred;
				})
			}).play();
			
			return this._fadeInDeferred;
		},

		hide: function(){
			// summary:
			//		Hide the dialog
			// returns: dojo.Deferred
			//		Deferred object that resolves when the hide animation is complete

			// if we haven't been initialized yet then we aren't showing and we can just return
			if(!this._alreadyInitialized){
				return;
			}
			if(this._fadeInDeferred){
				this._fadeInDeferred.cancel();
			}

			// fade-in Animation object, setup below
			var fadeOut;

			this._fadeOutDeferred = new dojo.Deferred(dojo.hitch(this, function(){
				fadeOut.stop();
				delete this._fadeOutDeferred;
			}));

			fadeOut = dojo.fadeOut({
				node: this.domNode,
				duration: this.duration,
				onEnd: dojo.hitch(this, function(){
					this.domNode.style.display = "none";
					dijit._DialogLevelManager.hide(this);
					this.onHide();
					this._fadeOutDeferred.callback(true);
					delete this._fadeOutDeferred;
				})
			 }).play();

			if(this._scrollConnected){
				this._scrollConnected = false;
			}
			dojo.forEach(this._modalconnects, dojo.disconnect);
			this._modalconnects = [];

			if(this._relativePosition){
				delete this._relativePosition;
			}
			this._set("open", false);

			return this._fadeOutDeferred;
		},

		layout: function(){
			// summary:
			//		Position the Dialog and the underlay
			// tags:
			//		private
			if(this.domNode.style.display != "none"){
				if(dijit._underlay){	// avoid race condition during show()
					dijit._underlay.layout();
				}
				this._position();
			}
		},

		destroy: function(){
			if(this._fadeInDeferred){
				this._fadeInDeferred.cancel();
			}
			if(this._fadeOutDeferred){
				this._fadeOutDeferred.cancel();
			}
			if(this._moveable){
				this._moveable.destroy();
			}
			if(this._dndListener){
				dojo.unsubscribe(this._dndListener);
			}
			dojo.forEach(this._modalconnects, dojo.disconnect);

			dijit._DialogLevelManager.hide(this);

			this.inherited(arguments);
		}
	}
);

dojo.declare(
	"dijit.Dialog",
	[dijit.layout.ContentPane, dijit._DialogBase],
	{}
);

dijit._DialogLevelManager = {
	// summary:
	//		Controls the various active "levels" on the page, starting with the
	//		stuff initially visible on the page (at z-index 0), and then having an entry for
	//		each Dialog shown.

	show: function(/*dijit._Widget*/ dialog, /*Object*/ underlayAttrs){
		// summary:
		//		Call right before fade-in animation for new dialog.
		//		Saves current focus, displays/adjusts underlay for new dialog,
		//		and sets the z-index of the dialog itself.
		//
		//		New dialog will be displayed on top of all currently displayed dialogs.
		//
		//		Caller is responsible for setting focus in new dialog after the fade-in
		//		animation completes.

		var ds = dijit._dialogStack;

		// Save current focus
		ds[ds.length-1].focus = dijit.getFocus(dialog);

		// Display the underlay, or if already displayed then adjust for this new dialog
		var underlay = dijit._underlay;
		if(!underlay || underlay._destroyed){
			underlay = dijit._underlay = new dijit.DialogUnderlay(underlayAttrs);
		}else{
			underlay.set(dialog.underlayAttrs);
		}

		// Set z-index a bit above previous dialog
		var zIndex = ds[ds.length-1].dialog ? ds[ds.length-1].zIndex + 2 : 950;
		if(ds.length == 1){	// first dialog
			underlay.show();
		}
		dojo.style(dijit._underlay.domNode, 'zIndex', zIndex - 1);

		// Dialog
		dojo.style(dialog.domNode, 'zIndex', zIndex);

		ds.push({dialog: dialog, underlayAttrs: underlayAttrs, zIndex: zIndex});
	},

	hide: function(/*dijit._Widget*/ dialog){
		// summary:
		//		Called when the specified dialog is hidden/destroyed, after the fade-out
		//		animation ends, in order to reset page focus, fix the underlay, etc.
		//		If the specified dialog isn't open then does nothing.
		//
		//		Caller is responsible for either setting display:none on the dialog domNode,
		//		or calling dijit.popup.hide(), or removing it from the page DOM.

		var ds = dijit._dialogStack;

		if(ds[ds.length-1].dialog == dialog){
			// Removing the top (or only) dialog in the stack, return focus
			// to previous dialog

			ds.pop();

			var pd = ds[ds.length-1];	// the new active dialog (or the base page itself)

			// Adjust underlay
			if(ds.length == 1){
				// Returning to original page.
				// Hide the underlay, unless the underlay widget has already been destroyed
				// because we are being called during page unload (when all widgets are destroyed)
				if(!dijit._underlay._destroyed){
					dijit._underlay.hide();
				}
			}else{
				// Popping back to previous dialog, adjust underlay
				dojo.style(dijit._underlay.domNode, 'zIndex', pd.zIndex - 1);
				dijit._underlay.set(pd.underlayAttrs);
			}

			// Adjust focus
			if(dialog.refocus){
				// If we are returning control to a previous dialog but for some reason
				// that dialog didn't have a focused field, set focus to first focusable item.
				// This situation could happen if two dialogs appeared at nearly the same time,
				// since a dialog doesn't set it's focus until the fade-in is finished.
				var focus = pd.focus;
				if(!focus || (pd.dialog && !dojo.isDescendant(focus.node, pd.dialog.domNode))){
					pd.dialog._getFocusItems(pd.dialog.domNode);
					focus = pd.dialog._firstFocusItem;
				}
	
				try{
					dijit.focus(focus);
				}catch(e){
					/* focus() will fail if user opened the dialog by clicking a non-focusable element */
				}
			}
		}else{
			// Removing a dialog out of order (#9944, #10705).
			// Don't need to mess with underlay or z-index or anything.
			var idx = dojo.indexOf(dojo.map(ds, function(elem){return elem.dialog}), dialog);
			if(idx != -1){
				ds.splice(idx, 1);
			}
		}
	},

	isTop: function(/*dijit._Widget*/ dialog){
		// summary:
		//		Returns true if specified Dialog is the top in the task
		var ds = dijit._dialogStack;
		return ds[ds.length-1].dialog == dialog;
	}
};

// Stack representing the various active "levels" on the page, starting with the
// stuff initially visible on the page (at z-index 0), and then having an entry for
// each Dialog shown.
// Each element in stack has form {
//		dialog: dialogWidget,
//		focus: returnFromGetFocus(),
//		underlayAttrs: attributes to set on underlay (when this widget is active)
// }
dijit._dialogStack = [
	{dialog: null, focus: null, underlayAttrs: null}	// entry for stuff at z-index: 0
];

}

if(!dojo._hasResource["dojo.regexp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.regexp"] = true;
dojo.provide("dojo.regexp");

dojo.getObject("regexp", true, dojo);

/*=====
dojo.regexp = {
	// summary: Regular expressions and Builder resources
};
=====*/

dojo.regexp.escapeString = function(/*String*/str, /*String?*/except){
	//	summary:
	//		Adds escape sequences for special characters in regular expressions
	// except:
	//		a String with special characters to be left unescaped

	return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
		if(except && except.indexOf(ch) != -1){
			return ch;
		}
		return "\\" + ch;
	}); // String
};

dojo.regexp.buildGroupRE = function(/*Object|Array*/arr, /*Function*/re, /*Boolean?*/nonCapture){
	//	summary:
	//		Builds a regular expression that groups subexpressions
	//	description:
	//		A utility function used by some of the RE generators. The
	//		subexpressions are constructed by the function, re, in the second
	//		parameter.  re builds one subexpression for each elem in the array
	//		a, in the first parameter. Returns a string for a regular
	//		expression that groups all the subexpressions.
	// arr:
	//		A single value or an array of values.
	// re:
	//		A function. Takes one parameter and converts it to a regular
	//		expression.
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. Defaults to false

	// case 1: a is a single value.
	if(!(arr instanceof Array)){
		return re(arr); // String
	}

	// case 2: a is an array
	var b = [];
	for(var i = 0; i < arr.length; i++){
		// convert each elem to a RE
		b.push(re(arr[i]));
	}

	 // join the REs as alternatives in a RE group.
	return dojo.regexp.group(b.join("|"), nonCapture); // String
};

dojo.regexp.group = function(/*String*/expression, /*Boolean?*/nonCapture){
	// summary:
	//		adds group match to expression
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression.
	return "(" + (nonCapture ? "?:":"") + expression + ")"; // String
};

}

if(!dojo._hasResource["dojo.cookie"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cookie"] = true;
dojo.provide("dojo.cookie");



/*=====
dojo.__cookieProps = function(){
	//	expires: Date|String|Number?
	//		If a number, the number of days from today at which the cookie
	//		will expire. If a date, the date past which the cookie will expire.
	//		If expires is in the past, the cookie will be deleted.
	//		If expires is omitted or is 0, the cookie will expire when the browser closes. << FIXME: 0 seems to disappear right away? FF3.
	//	path: String?
	//		The path to use for the cookie.
	//	domain: String?
	//		The domain to use for the cookie.
	//	secure: Boolean?
	//		Whether to only send the cookie on secure connections
	this.expires = expires;
	this.path = path;
	this.domain = domain;
	this.secure = secure;
}
=====*/


dojo.cookie = function(/*String*/name, /*String?*/value, /*dojo.__cookieProps?*/props){
	//	summary:
	//		Get or set a cookie.
	//	description:
	// 		If one argument is passed, returns the value of the cookie
	// 		For two or more arguments, acts as a setter.
	//	name:
	//		Name of the cookie
	//	value:
	//		Value for the cookie
	//	props:
	//		Properties for the cookie
	//	example:
	//		set a cookie with the JSON-serialized contents of an object which
	//		will expire 5 days from now:
	//	|	dojo.cookie("configObj", dojo.toJson(config), { expires: 5 });
	//
	//	example:
	//		de-serialize a cookie back into a JavaScript object:
	//	|	var config = dojo.fromJson(dojo.cookie("configObj"));
	//
	//	example:
	//		delete a cookie:
	//	|	dojo.cookie("configObj", null, {expires: -1});
	var c = document.cookie;
	if(arguments.length == 1){
		var matches = c.match(new RegExp("(?:^|; )" + dojo.regexp.escapeString(name) + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined; // String or undefined
	}else{
		props = props || {};
// FIXME: expires=0 seems to disappear right away, not on close? (FF3)  Change docs?
		var exp = props.expires;
		if(typeof exp == "number"){
			var d = new Date();
			d.setTime(d.getTime() + exp*24*60*60*1000);
			exp = props.expires = d;
		}
		if(exp && exp.toUTCString){ props.expires = exp.toUTCString(); }

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value, propName;
		for(propName in props){
			updatedCookie += "; " + propName;
			var propValue = props[propName];
			if(propValue !== true){ updatedCookie += "=" + propValue; }
		}
		document.cookie = updatedCookie;
	}
};

dojo.cookie.isSupported = function(){
	//	summary:
	//		Use to determine if the current browser supports cookies or not.
	//
	//		Returns true if user allows cookies.
	//		Returns false if user doesn't allow cookies.

	if(!("cookieEnabled" in navigator)){
		this("__djCookieTest__", "CookiesAllowed");
		navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
		if(navigator.cookieEnabled){
			this("__djCookieTest__", "", {expires: -1});
		}
	}
	return navigator.cookieEnabled;
};

}

if(!dojo._hasResource["dijit.form._FormWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._FormWidget"] = true;
dojo.provide("dijit.form._FormWidget");






dojo.declare("dijit.form._FormWidget", [dijit._Widget, dijit._Templated, dijit._CssStateMixin],
	{
	// summary:
	//		Base class for widgets corresponding to native HTML elements such as <checkbox> or <button>,
	//		which can be children of a <form> node or a `dijit.form.Form` widget.
	//
	// description:
	//		Represents a single HTML element.
	//		All these widgets should have these attributes just like native HTML input elements.
	//		You can set them during widget construction or afterwards, via `dijit._Widget.attr`.
	//
	//		They also share some common methods.

	// name: [const] String
	//		Name used when submitting form; same as "name" attribute or plain HTML elements
	name: "",

	// alt: String
	//		Corresponds to the native HTML <input> element's attribute.
	alt: "",

	// value: String
	//		Corresponds to the native HTML <input> element's attribute.
	value: "",

	// type: String
	//		Corresponds to the native HTML <input> element's attribute.
	type: "text",

	// tabIndex: Integer
	//		Order fields are traversed when user hits the tab key
	tabIndex: "0",

	// disabled: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "disabled='disabled'", or just "disabled".
	disabled: false,

	// intermediateChanges: Boolean
	//		Fires onChange for each value change or only on demand
	intermediateChanges: false,

	// scrollOnFocus: Boolean
	//		On focus, should this widget scroll into view?
	scrollOnFocus: true,

	// These mixins assume that the focus node is an INPUT, as many but not all _FormWidgets are.
	attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		value: "focusNode",
		id: "focusNode",
		tabIndex: "focusNode",
		alt: "focusNode",
		title: "focusNode"
	}),

	postMixInProperties: function(){
		// Setup name=foo string to be referenced from the template (but only if a name has been specified)
		// Unfortunately we can't use attributeMap to set the name due to IE limitations, see #8660
		// Regarding escaping, see heading "Attribute values" in
		// http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
		this.nameAttrSetting = this.name ? ('name="' + this.name.replace(/'/g, "&quot;") + '"') : '';
		this.inherited(arguments);
	},

	postCreate: function(){
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", "_onMouseDown");
	},

	_setDisabledAttr: function(/*Boolean*/ value){
		this._set("disabled", value);
		dojo.attr(this.focusNode, 'disabled', value);
		if(this.valueNode){
			dojo.attr(this.valueNode, 'disabled', value);
		}
		dijit.setWaiState(this.focusNode, "disabled", value);

		if(value){
			// reset these, because after the domNode is disabled, we can no longer receive
			// mouse related events, see #4200
			this._set("hovering", false);
			this._set("active", false);

			// clear tab stop(s) on this widget's focusable node(s)  (ComboBox has two focusable nodes)
			var attachPointNames = "tabIndex" in this.attributeMap ? this.attributeMap.tabIndex : "focusNode";
			dojo.forEach(dojo.isArray(attachPointNames) ? attachPointNames : [attachPointNames], function(attachPointName){
				var node = this[attachPointName];
				// complex code because tabIndex=-1 on a <div> doesn't work on FF
				if(dojo.isWebKit || dijit.hasDefaultTabStop(node)){	// see #11064 about webkit bug
					node.setAttribute('tabIndex', "-1");
				}else{
					node.removeAttribute('tabIndex');
				}
			}, this);
		}else{
			if(this.tabIndex != ""){
				this.focusNode.setAttribute('tabIndex', this.tabIndex);
			}
		}
	},

	setDisabled: function(/*Boolean*/ disabled){
		// summary:
		//		Deprecated.  Use set('disabled', ...) instead.
		dojo.deprecated("setDisabled("+disabled+") is deprecated. Use set('disabled',"+disabled+") instead.", "", "2.0");
		this.set('disabled', disabled);
	},

	_onFocus: function(e){
		if(this.scrollOnFocus){
			dojo.window.scrollIntoView(this.domNode);
		}
		this.inherited(arguments);
	},

	isFocusable: function(){
		// summary:
		//		Tells if this widget is focusable or not.  Used internally by dijit.
		// tags:
		//		protected
		return !this.disabled && this.focusNode && (dojo.style(this.domNode, "display") != "none");
	},

	focus: function(){
		// summary:
		//		Put focus on this widget
		if(!this.disabled){
			dijit.focus(this.focusNode);
		}
	},

	compare: function(/*anything*/ val1, /*anything*/ val2){
		// summary:
		//		Compare 2 values (as returned by get('value') for this widget).
		// tags:
		//		protected
		if(typeof val1 == "number" && typeof val2 == "number"){
			return (isNaN(val1) && isNaN(val2)) ? 0 : val1 - val2;
		}else if(val1 > val2){
			return 1;
		}else if(val1 < val2){
			return -1;
		}else{
			return 0;
		}
	},

	onChange: function(newValue){
		// summary:
		//		Callback when this widget's value is changed.
		// tags:
		//		callback
	},

	// _onChangeActive: [private] Boolean
	//		Indicates that changes to the value should call onChange() callback.
	//		This is false during widget initialization, to avoid calling onChange()
	//		when the initial value is set.
	_onChangeActive: false,

	_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Called when the value of the widget is set.  Calls onChange() if appropriate
		// newValue:
		//		the new value
		// priorityChange:
		//		For a slider, for example, dragging the slider is priorityChange==false,
		//		but on mouse up, it's priorityChange==true.  If intermediateChanges==false,
		//		onChange is only called form priorityChange=true events.
		// tags:
		//		private
		if(this._lastValueReported == undefined && (priorityChange === null || !this._onChangeActive)){
			// this block executes not for a change, but during initialization,
			// and is used to store away the original value (or for ToggleButton, the original checked state)
			this._resetValue = this._lastValueReported = newValue;
		}
		this._pendingOnChange = this._pendingOnChange
			|| (typeof newValue != typeof this._lastValueReported)
			|| (this.compare(newValue, this._lastValueReported) != 0);
		if((this.intermediateChanges || priorityChange || priorityChange === undefined) && this._pendingOnChange){
			this._lastValueReported = newValue;
			this._pendingOnChange = false;
			if(this._onChangeActive){
				if(this._onChangeHandle){
					clearTimeout(this._onChangeHandle);
				}
				// setTimout allows hidden value processing to run and
				// also the onChange handler can safely adjust focus, etc
				this._onChangeHandle = setTimeout(dojo.hitch(this,
					function(){
						this._onChangeHandle = null;
						this.onChange(newValue);
					}), 0); // try to collapse multiple onChange's fired faster than can be processed
			}
		}
	},

	create: function(){
		// Overrides _Widget.create()
		this.inherited(arguments);
		this._onChangeActive = true;
	},

	destroy: function(){
		if(this._onChangeHandle){ // destroy called before last onChange has fired
			clearTimeout(this._onChangeHandle);
			this.onChange(this._lastValueReported);
		}
		this.inherited(arguments);
	},

	setValue: function(/*String*/ value){
		// summary:
		//		Deprecated.  Use set('value', ...) instead.
		dojo.deprecated("dijit.form._FormWidget:setValue("+value+") is deprecated.  Use set('value',"+value+") instead.", "", "2.0");
		this.set('value', value);
	},

	getValue: function(){
		// summary:
		//		Deprecated.  Use get('value') instead.
		dojo.deprecated(this.declaredClass+"::getValue() is deprecated. Use get('value') instead.", "", "2.0");
		return this.get('value');
	},
	
	_onMouseDown: function(e){
		// If user clicks on the button, even if the mouse is released outside of it,
		// this button should get focus (to mimics native browser buttons).
		// This is also needed on chrome because otherwise buttons won't get focus at all,
		// which leads to bizarre focus restore on Dialog close etc.
		if(!e.ctrlKey && dojo.mouseButtons.isLeft(e) && this.isFocusable()){ // !e.ctrlKey to ignore right-click on mac
			// Set a global event to handle mouseup, so it fires properly
			// even if the cursor leaves this.domNode before the mouse up event.
			var mouseUpConnector = this.connect(dojo.body(), "onmouseup", function(){
				if (this.isFocusable()) {
					this.focus();
				}
				this.disconnect(mouseUpConnector);
			});
		}
	}
});

dojo.declare("dijit.form._FormValueWidget", dijit.form._FormWidget,
{
	// summary:
	//		Base class for widgets corresponding to native HTML elements such as <input> or <select> that have user changeable values.
	// description:
	//		Each _FormValueWidget represents a single input value, and has a (possibly hidden) <input> element,
	//		to which it serializes it's input value, so that form submission (either normal submission or via FormBind?)
	//		works as expected.

	// Don't attempt to mixin the 'type', 'name' attributes here programatically -- they must be declared
	// directly in the template as read by the parser in order to function. IE is known to specifically
	// require the 'name' attribute at element creation time.  See #8484, #8660.
	// TODO: unclear what that {value: ""} is for; FormWidget.attributeMap copies value to focusNode,
	// so maybe {value: ""} is so the value *doesn't* get copied to focusNode?
	// Seems like we really want value removed from attributeMap altogether
	// (although there's no easy way to do that now)

	// readOnly: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "readOnly".
	//		Similar to disabled except readOnly form values are submitted.
	readOnly: false,

	attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
		value: "",
		readOnly: "focusNode"
	}),

	_setReadOnlyAttr: function(/*Boolean*/ value){
		dojo.attr(this.focusNode, 'readOnly', value);
		dijit.setWaiState(this.focusNode, "readonly", value);
		this._set("readOnly", value);
	},

	postCreate: function(){
		this.inherited(arguments);

		if(dojo.isIE){ // IE won't stop the event with keypress
			this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
		}
		// Update our reset value if it hasn't yet been set (because this.set()
		// is only called when there *is* a value)
		if(this._resetValue === undefined){
			this._lastValueReported = this._resetValue = this.value;
		}
	},

	_setValueAttr: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Hook so set('value', value) works.
		// description:
		//		Sets the value of the widget.
		//		If the value has changed, then fire onChange event, unless priorityChange
		//		is specified as null (or false?)
		this._handleOnChange(newValue, priorityChange);
	},

	_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Called when the value of the widget has changed.  Saves the new value in this.value,
		//		and calls onChange() if appropriate.   See _FormWidget._handleOnChange() for details.
		this._set("value", newValue);
		this.inherited(arguments);
	},

	undo: function(){
		// summary:
		//		Restore the value to the last value passed to onChange
		this._setValueAttr(this._lastValueReported, false);
	},

	reset: function(){
		// summary:
		//		Reset the widget's value to what it was at initialization time
		this._hasBeenBlurred = false;
		this._setValueAttr(this._resetValue, true);
	},

	_onKeyDown: function(e){
		if(e.keyCode == dojo.keys.ESCAPE && !(e.ctrlKey || e.altKey || e.metaKey)){
			var te;
			if(dojo.isIE){
				e.preventDefault(); // default behavior needs to be stopped here since keypress is too late
				te = document.createEventObject();
				te.keyCode = dojo.keys.ESCAPE;
				te.shiftKey = e.shiftKey;
				e.srcElement.fireEvent('onkeypress', te);
			}
		}
	},

	_layoutHackIE7: function(){
		// summary:
		//		Work around table sizing bugs on IE7 by forcing redraw

		if(dojo.isIE == 7){ // fix IE7 layout bug when the widget is scrolled out of sight
			var domNode = this.domNode;
			var parent = domNode.parentNode;
			var pingNode = domNode.firstChild || domNode; // target node most unlikely to have a custom filter
			var origFilter = pingNode.style.filter; // save custom filter, most likely nothing
			var _this = this;
			while(parent && parent.clientHeight == 0){ // search for parents that haven't rendered yet
				(function ping(){
					var disconnectHandle = _this.connect(parent, "onscroll",
						function(e){
							_this.disconnect(disconnectHandle); // only call once
							pingNode.style.filter = (new Date()).getMilliseconds(); // set to anything that's unique
							setTimeout(function(){ pingNode.style.filter = origFilter }, 0); // restore custom filter, if any
						}
					);
				})();
				parent = parent.parentNode;
			}
		}
	}
});

}

if(!dojo._hasResource["dijit._HasDropDown"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._HasDropDown"] = true;
dojo.provide("dijit._HasDropDown");



dojo.declare("dijit._HasDropDown",
	null,
	{
		// summary:
		//		Mixin for widgets that need drop down ability.

		// _buttonNode: [protected] DomNode
		//		The button/icon/node to click to display the drop down.
		//		Can be set via a dojoAttachPoint assignment.
		//		If missing, then either focusNode or domNode (if focusNode is also missing) will be used.
		_buttonNode: null,

		// _arrowWrapperNode: [protected] DomNode
		//		Will set CSS class dijitUpArrow, dijitDownArrow, dijitRightArrow etc. on this node depending
		//		on where the drop down is set to be positioned.
		//		Can be set via a dojoAttachPoint assignment.
		//		If missing, then _buttonNode will be used.
		_arrowWrapperNode: null,

		// _popupStateNode: [protected] DomNode
		//		The node to set the popupActive class on.
		//		Can be set via a dojoAttachPoint assignment.
		//		If missing, then focusNode or _buttonNode (if focusNode is missing) will be used.
		_popupStateNode: null,

		// _aroundNode: [protected] DomNode
		//		The node to display the popup around.
		//		Can be set via a dojoAttachPoint assignment.
		//		If missing, then domNode will be used.
		_aroundNode: null,

		// dropDown: [protected] Widget
		//		The widget to display as a popup.  This widget *must* be
		//		defined before the startup function is called.
		dropDown: null,

		// autoWidth: [protected] Boolean
		//		Set to true to make the drop down at least as wide as this
		//		widget.  Set to false if the drop down should just be its
		//		default width
		autoWidth: true,

		// forceWidth: [protected] Boolean
		//		Set to true to make the drop down exactly as wide as this
		//		widget.  Overrides autoWidth.
		forceWidth: false,

		// maxHeight: [protected] Integer
		//		The max height for our dropdown.
		//		Any dropdown taller than this will have scrollbars.
		//		Set to 0 for no max height, or -1 to limit height to available space in viewport
		maxHeight: 0,

		// dropDownPosition: [const] String[]
		//		This variable controls the position of the drop down.
		//		It's an array of strings with the following values:
		//
		//			* before: places drop down to the left of the target node/widget, or to the right in
		//			  the case of RTL scripts like Hebrew and Arabic
		//			* after: places drop down to the right of the target node/widget, or to the left in
		//			  the case of RTL scripts like Hebrew and Arabic
		//			* above: drop down goes above target node
		//			* below: drop down goes below target node
		//
		//		The list is positions is tried, in order, until a position is found where the drop down fits
		//		within the viewport.
		//
		dropDownPosition: ["below","above"],

		// _stopClickEvents: Boolean
		//		When set to false, the click events will not be stopped, in
		//		case you want to use them in your subwidget
		_stopClickEvents: true,

		_onDropDownMouseDown: function(/*Event*/ e){
			// summary:
			//		Callback when the user mousedown's on the arrow icon

			if(this.disabled || this.readOnly){ return; }

			this._docHandler = this.connect(dojo.doc, "onmouseup", "_onDropDownMouseUp");

			this.toggleDropDown();
		},

		_onDropDownMouseUp: function(/*Event?*/ e){
			// summary:
			//		Callback when the user lifts their mouse after mouse down on the arrow icon.
			//		If the drop is a simple menu and the mouse is over the menu, we execute it, otherwise, we focus our
			//		dropDown node.  If the event is missing, then we are not
			//		a mouseup event.
			//
			//		This is useful for the common mouse movement pattern
			//		with native browser <select> nodes:
			//			1. mouse down on the select node (probably on the arrow)
			//			2. move mouse to a menu item while holding down the mouse button
			//			3. mouse up.  this selects the menu item as though the user had clicked it.
			if(e && this._docHandler){
				this.disconnect(this._docHandler);
			}
			var dropDown = this.dropDown, overMenu = false;

			if(e && this._opened){
				// This code deals with the corner-case when the drop down covers the original widget,
				// because it's so large.  In that case mouse-up shouldn't select a value from the menu.
				// Find out if our target is somewhere in our dropdown widget,
				// but not over our _buttonNode (the clickable node)
				var c = dojo.position(this._buttonNode, true);
				if(!(e.pageX >= c.x && e.pageX <= c.x + c.w) ||
					!(e.pageY >= c.y && e.pageY <= c.y + c.h)){
					var t = e.target;
					while(t && !overMenu){
						if(dojo.hasClass(t, "dijitPopup")){
							overMenu = true;
						}else{
							t = t.parentNode;
						}
					}
					if(overMenu){
						t = e.target;
						if(dropDown.onItemClick){
							var menuItem;
							while(t && !(menuItem = dijit.byNode(t))){
								t = t.parentNode;
							}
							if(menuItem && menuItem.onClick && menuItem.getParent){
								menuItem.getParent().onItemClick(menuItem, e);
							}
						}
						return;
					}
				}
			}
			if(this._opened && dropDown.focus && dropDown.autoFocus !== false){
				// Focus the dropdown widget - do it on a delay so that we
				// don't steal our own focus.
				window.setTimeout(dojo.hitch(dropDown, "focus"), 1);
			}
		},

		_onDropDownClick: function(/*Event*/ e){
			// the drop down was already opened on mousedown/keydown; just need to call stopEvent()
			if(this._stopClickEvents){
				dojo.stopEvent(e);
			}
		},

		buildRendering: function(){
			this.inherited(arguments);

			this._buttonNode = this._buttonNode || this.focusNode || this.domNode;
			this._popupStateNode = this._popupStateNode || this.focusNode || this._buttonNode;

			// Add a class to the "dijitDownArrowButton" type class to _buttonNode so theme can set direction of arrow
			// based on where drop down will normally appear
			var defaultPos = {
					"after" : this.isLeftToRight() ? "Right" : "Left",
					"before" : this.isLeftToRight() ? "Left" : "Right",
					"above" : "Up",
					"below" : "Down",
					"left" : "Left",
					"right" : "Right"
			}[this.dropDownPosition[0]] || this.dropDownPosition[0] || "Down";
			dojo.addClass(this._arrowWrapperNode || this._buttonNode, "dijit" + defaultPos + "ArrowButton");
		},

		postCreate: function(){
			// summary:
			//		set up nodes and connect our mouse and keypress events

			this.inherited(arguments);

			this.connect(this._buttonNode, "onmousedown", "_onDropDownMouseDown");
			this.connect(this._buttonNode, "onclick", "_onDropDownClick");
			this.connect(this.focusNode, "onkeypress", "_onKey");
		},

		destroy: function(){
			if(this.dropDown){
				// Destroy the drop down, unless it's already been destroyed.  This can happen because
				// the drop down is a direct child of <body> even though it's logically my child.
				if(!this.dropDown._destroyed){
					this.dropDown.destroyRecursive();
				}
				delete this.dropDown;
			}
			this.inherited(arguments);
		},

		_onKey: function(/*Event*/ e){
			// summary:
			//		Callback when the user presses a key while focused on the button node

			if(this.disabled || this.readOnly){ return; }

			var d = this.dropDown, target = e.target;
			if(d && this._opened && d.handleKey){
				if(d.handleKey(e) === false){
					/* false return code means that the drop down handled the key */
					dojo.stopEvent(e);
					return;
				}
			}
			if(d && this._opened && e.charOrCode == dojo.keys.ESCAPE){
				this.closeDropDown();
				dojo.stopEvent(e);
			}else if(!this._opened &&
					(e.charOrCode == dojo.keys.DOWN_ARROW ||
						( (e.charOrCode == dojo.keys.ENTER || e.charOrCode == " ") &&
						  //ignore enter and space if the event is for a text input
						  ((target.tagName || "").toLowerCase() !== 'input' ||
						     (target.type && target.type.toLowerCase() !== 'text'))))){
				this.toggleDropDown();
				d = this.dropDown;	// drop down may not exist until toggleDropDown() call
				if(d && d.focus){
					setTimeout(dojo.hitch(d, "focus"), 1);
				}
				dojo.stopEvent(e);
			}
		},

		_onBlur: function(){
			// summary:
			//		Called magically when focus has shifted away from this widget and it's dropdown

			// Don't focus on button if the user has explicitly focused on something else (happens
			// when user clicks another control causing the current popup to close)..
			// But if focus is inside of the drop down then reset focus to me, because IE doesn't like
			// it when you display:none a node with focus.
			var focusMe = dijit._curFocus && this.dropDown && dojo.isDescendant(dijit._curFocus, this.dropDown.domNode);

			this.closeDropDown(focusMe);

			this.inherited(arguments);
		},

		isLoaded: function(){
			// summary:
			//		Returns whether or not the dropdown is loaded.  This can
			//		be overridden in order to force a call to loadDropDown().
			// tags:
			//		protected

			return true;
		},

		loadDropDown: function(/* Function */ loadCallback){
			// summary:
			//		Loads the data for the dropdown, and at some point, calls
			//		the given callback.   This is basically a callback when the
			//		user presses the down arrow button to open the drop down.
			// tags:
			//		protected

			loadCallback();
		},

		toggleDropDown: function(){
			// summary:
			//		Callback when the user presses the down arrow button or presses
			//		the down arrow key to open/close the drop down.
			//		Toggle the drop-down widget; if it is up, close it, if not, open it
			// tags:
			//		protected

			if(this.disabled || this.readOnly){ return; }
			if(!this._opened){
				// If we aren't loaded, load it first so there isn't a flicker
				if(!this.isLoaded()){
					this.loadDropDown(dojo.hitch(this, "openDropDown"));
					return;
				}else{
					this.openDropDown();
				}
			}else{
				this.closeDropDown();
			}
		},

		openDropDown: function(){
			// summary:
			//		Opens the dropdown for this widget.   To be called only when this.dropDown
			//		has been created and is ready to display (ie, it's data is loaded).
			// returns:
			//		return value of dijit.popup.open()
			// tags:
			//		protected

			var dropDown = this.dropDown,
				ddNode = dropDown.domNode,
				aroundNode = this._aroundNode || this.domNode,
				self = this;

			// Prepare our popup's height and honor maxHeight if it exists.

			// TODO: isn't maxHeight dependent on the return value from dijit.popup.open(),
			// ie, dependent on how much space is available (BK)

			if(!this._preparedNode){
				this._preparedNode = true;
				// Check if we have explicitly set width and height on the dropdown widget dom node
				if(ddNode.style.width){
					this._explicitDDWidth = true;
				}
				if(ddNode.style.height){
					this._explicitDDHeight = true;
				}
			}

			// Code for resizing dropdown (height limitation, or increasing width to match my width)
			if(this.maxHeight || this.forceWidth || this.autoWidth){
				var myStyle = {
					display: "",
					visibility: "hidden"
				};
				if(!this._explicitDDWidth){
					myStyle.width = "";
				}
				if(!this._explicitDDHeight){
					myStyle.height = "";
				}
				dojo.style(ddNode, myStyle);
				
				// Figure out maximum height allowed (if there is a height restriction)
				var maxHeight = this.maxHeight;
				if(maxHeight == -1){
					// limit height to space available in viewport either above or below my domNode
					// (whichever side has more room)
					var viewport = dojo.window.getBox(),
						position = dojo.position(aroundNode, false);
					maxHeight = Math.floor(Math.max(position.y, viewport.h - (position.y + position.h)));
				}

				// Attach dropDown to DOM and make make visibility:hidden rather than display:none
				// so we call startup() and also get the size
				if(dropDown.startup && !dropDown._started){
					dropDown.startup();
				}

				dijit.popup.moveOffScreen(dropDown);
				// Get size of drop down, and determine if vertical scroll bar needed
				var mb = dojo._getMarginSize(ddNode);
				var overHeight = (maxHeight && mb.h > maxHeight);
				dojo.style(ddNode, {
					overflowX: "hidden",
					overflowY: overHeight ? "auto" : "hidden"
				});
				if(overHeight){
					mb.h = maxHeight;
					if("w" in mb){
						mb.w += 16;	// room for vertical scrollbar
					}
				}else{
					delete mb.h;
				}

				// Adjust dropdown width to match or be larger than my width
				if(this.forceWidth){
					mb.w = aroundNode.offsetWidth;
				}else if(this.autoWidth){
					mb.w = Math.max(mb.w, aroundNode.offsetWidth);
				}else{
					delete mb.w;
				}
				
				// And finally, resize the dropdown to calculated height and width
				if(dojo.isFunction(dropDown.resize)){
					dropDown.resize(mb);
				}else{
					dojo.marginBox(ddNode, mb);
				}
			}

			var retVal = dijit.popup.open({
				parent: this,
				popup: dropDown,
				around: aroundNode,
				orient: dijit.getPopupAroundAlignment((this.dropDownPosition && this.dropDownPosition.length) ? this.dropDownPosition : ["below"],this.isLeftToRight()),
				onExecute: function(){
					self.closeDropDown(true);
				},
				onCancel: function(){
					self.closeDropDown(true);
				},
				onClose: function(){
					dojo.attr(self._popupStateNode, "popupActive", false);
					dojo.removeClass(self._popupStateNode, "dijitHasDropDownOpen");
					self._opened = false;
				}
			});
			dojo.attr(this._popupStateNode, "popupActive", "true");
			dojo.addClass(self._popupStateNode, "dijitHasDropDownOpen");
			this._opened=true;

			// TODO: set this.checked and call setStateClass(), to affect button look while drop down is shown
			return retVal;
		},

		closeDropDown: function(/*Boolean*/ focus){
			// summary:
			//		Closes the drop down on this widget
			// focus:
			//		If true, refocuses the button widget
			// tags:
			//		protected

			if(this._opened){
				if(focus){ this.focus(); }
				dijit.popup.close(this.dropDown);
				this._opened = false;
			}
		}

	}
);

}

if(!dojo._hasResource["dijit.form.Button"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.Button"] = true;
dojo.provide("dijit.form.Button");





dojo.declare("dijit.form.Button",
	dijit.form._FormWidget,
	{
	// summary:
	//		Basically the same thing as a normal HTML button, but with special styling.
	// description:
	//		Buttons can display a label, an icon, or both.
	//		A label should always be specified (through innerHTML) or the label
	//		attribute.  It can be hidden via showLabel=false.
	// example:
	// |	<button dojoType="dijit.form.Button" onClick="...">Hello world</button>
	//
	// example:
	// |	var button1 = new dijit.form.Button({label: "hello world", onClick: foo});
	// |	dojo.body().appendChild(button1.domNode);

	// label: HTML String
	//		Text to display in button.
	//		If the label is hidden (showLabel=false) then and no title has
	//		been specified, then label is also set as title attribute of icon.
	label: "",

	// showLabel: Boolean
	//		Set this to true to hide the label text and display only the icon.
	//		(If showLabel=false then iconClass must be specified.)
	//		Especially useful for toolbars.
	//		If showLabel=true, the label will become the title (a.k.a. tooltip/hint) of the icon.
	//
	//		The exception case is for computers in high-contrast mode, where the label
	//		will still be displayed, since the icon doesn't appear.
	showLabel: true,

	// iconClass: String
	//		Class to apply to DOMNode in button to make it display an icon
	iconClass: "",

	// type: String
	//		Defines the type of button.  "button", "submit", or "reset".
	type: "button",

	baseClass: "dijitButton",

	templateString: dojo.cache("dijit.form", "templates/Button.html", "<span class=\"dijit dijitReset dijitInline\"\n\t><span class=\"dijitReset dijitInline dijitButtonNode\"\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"titleNode,focusNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\"></span\n\t\t\t><span class=\"dijitReset dijitToggleButtonIconChar\">&#x25CF;</span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t\tdojoAttachPoint=\"containerNode\"\n\t\t\t></span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),

	attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
		value: "valueNode"
	}),

	_onClick: function(/*Event*/ e){
		// summary:
		//		Internal function to handle click actions
		if(this.disabled){
			return false;
		}
		this._clicked(); // widget click actions
		return this.onClick(e); // user click actions
	},

	_onButtonClick: function(/*Event*/ e){
		// summary:
		//		Handler when the user activates the button portion.
		if(this._onClick(e) === false){ // returning nothing is same as true
			e.preventDefault(); // needed for checkbox
		}else if(this.type == "submit" && !(this.valueNode||this.focusNode).form){ // see if a nonform widget needs to be signalled
			for(var node=this.domNode; node.parentNode/*#5935*/; node=node.parentNode){
				var widget=dijit.byNode(node);
				if(widget && typeof widget._onSubmit == "function"){
					widget._onSubmit(e);
					break;
				}
			}
		}else if(this.valueNode){
			this.valueNode.click();
			e.preventDefault(); // cancel BUTTON click and continue with hidden INPUT click
		}
	},

	buildRendering: function(){
		this.inherited(arguments);
		dojo.setSelectable(this.focusNode, false);
	},

	_fillContent: function(/*DomNode*/ source){
		// Overrides _Templated._fillContent().
		// If button label is specified as srcNodeRef.innerHTML rather than
		// this.params.label, handle it here.
		// TODO: remove the method in 2.0, parser will do it all for me
		if(source && (!this.params || !("label" in this.params))){
			this.set('label', source.innerHTML);
		}
	},

	_setShowLabelAttr: function(val){
		if(this.containerNode){
			dojo.toggleClass(this.containerNode, "dijitDisplayNone", !val);
		}
		this._set("showLabel", val);
	},

	onClick: function(/*Event*/ e){
		// summary:
		//		Callback for when button is clicked.
		//		If type="submit", return true to perform submit, or false to cancel it.
		// type:
		//		callback
		return true;		// Boolean
	},

	_clicked: function(/*Event*/ e){
		// summary:
		//		Internal overridable function for when the button is clicked
	},

	setLabel: function(/*String*/ content){
		// summary:
		//		Deprecated.  Use set('label', ...) instead.
		dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
		this.set("label", content);
	},

	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for set('label', ...) to work.
		// description:
		//		Set the label (text) of the button; takes an HTML string.
		this._set("label", content);
		this.containerNode.innerHTML = content;
		if(this.showLabel == false && !this.params.title){
			this.titleNode.title = dojo.trim(this.containerNode.innerText || this.containerNode.textContent || '');
		}
	},

	_setIconClassAttr: function(/*String*/ val){
		// Custom method so that icon node is hidden when not in use, to avoid excess padding/margin
		// appearing around it (even if it's a 0x0 sized <img> node)

		var oldVal = this.iconClass || "dijitNoIcon",
			newVal = val || "dijitNoIcon";
		dojo.replaceClass(this.iconNode, newVal, oldVal);
		this._set("iconClass", val);
	}
});


dojo.declare("dijit.form.DropDownButton", [dijit.form.Button, dijit._Container, dijit._HasDropDown], {
	// summary:
	//		A button with a drop down
	//
	// example:
	// |	<button dojoType="dijit.form.DropDownButton" label="Hello world">
	// |		<div dojotype="dijit.Menu">...</div>
	// |	</button>
	//
	// example:
	// |	var button1 = new dijit.form.DropDownButton({ label: "hi", dropDown: new dijit.Menu(...) });
	// |	dojo.body().appendChild(button1);
	//

	baseClass : "dijitDropDownButton",

	templateString: dojo.cache("dijit.form", "templates/DropDownButton.html", "<span class=\"dijit dijitReset dijitInline\"\n\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\" dojoAttachPoint=\"_buttonNode\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"focusNode,titleNode,_arrowWrapperNode\"\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\n\t\t\t\tdojoAttachPoint=\"iconNode\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tdojoAttachPoint=\"containerNode,_popupStateNode\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),

	_fillContent: function(){
		// Overrides Button._fillContent().
		//
		// My inner HTML contains both the button contents and a drop down widget, like
		// <DropDownButton>  <span>push me</span>  <Menu> ... </Menu> </DropDownButton>
		// The first node is assumed to be the button content. The widget is the popup.

		if(this.srcNodeRef){ // programatically created buttons might not define srcNodeRef
			//FIXME: figure out how to filter out the widget and use all remaining nodes as button
			//	content, not just nodes[0]
			var nodes = dojo.query("*", this.srcNodeRef);
			dijit.form.DropDownButton.superclass._fillContent.call(this, nodes[0]);

			// save pointer to srcNode so we can grab the drop down widget after it's instantiated
			this.dropDownContainer = this.srcNodeRef;
		}
	},

	startup: function(){
		if(this._started){ return; }

		// the child widget from srcNodeRef is the dropdown widget.  Insert it in the page DOM,
		// make it invisible, and store a reference to pass to the popup code.
		if(!this.dropDown && this.dropDownContainer){
			var dropDownNode = dojo.query("[widgetId]", this.dropDownContainer)[0];
			this.dropDown = dijit.byNode(dropDownNode);
			delete this.dropDownContainer;
		}
		if(this.dropDown){
			dijit.popup.hide(this.dropDown);
		}

		this.inherited(arguments);
	},

	isLoaded: function(){
		// Returns whether or not we are loaded - if our dropdown has an href,
		// then we want to check that.
		var dropDown = this.dropDown;
		return (!!dropDown && (!dropDown.href || dropDown.isLoaded));
	},

	loadDropDown: function(){
		// Loads our dropdown
		var dropDown = this.dropDown;
		if(!dropDown){ return; }
		if(!this.isLoaded()){
			var handler = dojo.connect(dropDown, "onLoad", this, function(){
				dojo.disconnect(handler);
				this.openDropDown();
			});
			dropDown.refresh();
		}else{
			this.openDropDown();
		}
	},

	isFocusable: function(){
		// Overridden so that focus is handled by the _HasDropDown mixin, not by
		// the _FormWidget mixin.
		return this.inherited(arguments) && !this._mouseDown;
	}
});

dojo.declare("dijit.form.ComboButton", dijit.form.DropDownButton, {
	// summary:
	//		A combination button and drop-down button.
	//		Users can click one side to "press" the button, or click an arrow
	//		icon to display the drop down.
	//
	// example:
	// |	<button dojoType="dijit.form.ComboButton" onClick="...">
	// |		<span>Hello world</span>
	// |		<div dojoType="dijit.Menu">...</div>
	// |	</button>
	//
	// example:
	// |	var button1 = new dijit.form.ComboButton({label: "hello world", onClick: foo, dropDown: "myMenu"});
	// |	dojo.body().appendChild(button1.domNode);
	//

	templateString: dojo.cache("dijit.form", "templates/ComboButton.html", "<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tcellspacing='0' cellpadding='0' role=\"presentation\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonNode\" dojoAttachPoint=\"buttonNode\" dojoAttachEvent=\"ondijitclick:_onButtonClick,onkeypress:_onButtonKeyPress\"\n\t\t><div id=\"${id}_button\" class=\"dijitReset dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"titleNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><div class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" dojoAttachPoint=\"containerNode\" role=\"presentation\"></div\n\t\t></div\n\t\t></td\n\t\t><td id=\"${id}_arrow\" class='dijitReset dijitRight dijitButtonNode dijitArrowButton'\n\t\t\tdojoAttachPoint=\"_popupStateNode,focusNode,_buttonNode\"\n\t\t\tdojoAttachEvent=\"onkeypress:_onArrowKeyPress\"\n\t\t\ttitle=\"${optionsTitle}\"\n\t\t\trole=\"button\" aria-haspopup=\"true\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\n\t\t></td\n\t\t><td style=\"display:none !important;\"\n\t\t\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" dojoAttachPoint=\"valueNode\"\n\t\t/></td></tr></tbody\n></table>\n"),

	attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap), {
		id: "",
		tabIndex: ["focusNode", "titleNode"],
		title: "titleNode"
	}),

	// optionsTitle: String
	//		Text that describes the options menu (accessibility)
	optionsTitle: "",

	baseClass: "dijitComboButton",

	// Set classes like dijitButtonContentsHover or dijitArrowButtonActive depending on
	// mouse action over specified node
	cssStateNodes: {
		"buttonNode": "dijitButtonNode",
		"titleNode": "dijitButtonContents",
		"_popupStateNode": "dijitDownArrowButton"
	},

	_focusedNode: null,

	_onButtonKeyPress: function(/*Event*/ evt){
		// summary:
		//		Handler for right arrow key when focus is on left part of button
		if(evt.charOrCode == dojo.keys[this.isLeftToRight() ? "RIGHT_ARROW" : "LEFT_ARROW"]){
			dijit.focus(this._popupStateNode);
			dojo.stopEvent(evt);
		}
	},

	_onArrowKeyPress: function(/*Event*/ evt){
		// summary:
		//		Handler for left arrow key when focus is on right part of button
		if(evt.charOrCode == dojo.keys[this.isLeftToRight() ? "LEFT_ARROW" : "RIGHT_ARROW"]){
			dijit.focus(this.titleNode);
			dojo.stopEvent(evt);
		}
	},
	
	focus: function(/*String*/ position){
		// summary:
		//		Focuses this widget to according to position, if specified,
		//		otherwise on arrow node
		// position:
		//		"start" or "end"
		if(!this.disabled){
			dijit.focus(position == "start" ? this.titleNode : this._popupStateNode);
		}
	}
});

dojo.declare("dijit.form.ToggleButton", dijit.form.Button, {
	// summary:
	//		A button that can be in two states (checked or not).
	//		Can be base class for things like tabs or checkbox or radio buttons

	baseClass: "dijitToggleButton",

	// checked: Boolean
	//		Corresponds to the native HTML <input> element's attribute.
	//		In markup, specified as "checked='checked'" or just "checked".
	//		True if the button is depressed, or the checkbox is checked,
	//		or the radio button is selected, etc.
	checked: false,

	attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap), {
		checked:"focusNode"
	}),

	_clicked: function(/*Event*/ evt){
		this.set('checked', !this.checked);
	},

	_setCheckedAttr: function(/*Boolean*/ value, /*Boolean?*/ priorityChange){
		this._set("checked", value);
		dojo.attr(this.focusNode || this.domNode, "checked", value);
		dijit.setWaiState(this.focusNode || this.domNode, "pressed", value);
		this._handleOnChange(value, priorityChange);
	},

	setChecked: function(/*Boolean*/ checked){
		// summary:
		//		Deprecated.  Use set('checked', true/false) instead.
		dojo.deprecated("setChecked("+checked+") is deprecated. Use set('checked',"+checked+") instead.", "", "2.0");
		this.set('checked', checked);
	},

	reset: function(){
		// summary:
		//		Reset the widget's value to what it was at initialization time

		this._hasBeenBlurred = false;

		// set checked state to original setting
		this.set('checked', this.params.checked || false);
	}
});

}

if(!dojo._hasResource["dijit.form.ToggleButton"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.ToggleButton"] = true;
dojo.provide("dijit.form.ToggleButton");




}

if(!dojo._hasResource["dijit.layout.StackController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.StackController"] = true;
dojo.provide("dijit.layout.StackController");







dojo.declare(
		"dijit.layout.StackController",
		[dijit._Widget, dijit._Templated, dijit._Container],
		{
			// summary:
			//		Set of buttons to select a page in a page list.
			// description:
			//		Monitors the specified StackContainer, and whenever a page is
			//		added, deleted, or selected, updates itself accordingly.

			templateString: "<span role='tablist' dojoAttachEvent='onkeypress' class='dijitStackController'></span>",

			// containerId: [const] String
			//		The id of the page container that I point to
			containerId: "",

			// buttonWidget: [const] String
			//		The name of the button widget to create to correspond to each page
			buttonWidget: "dijit.layout._StackButton",

			constructor: function(){
				this.pane2button = {};		// mapping from pane id to buttons
				this.pane2connects = {};	// mapping from pane id to this.connect() handles
				this.pane2watches = {};		// mapping from pane id to watch() handles
			},

			buildRendering: function(){
				this.inherited(arguments);
				dijit.setWaiRole(this.domNode, "tablist");	// TODO: unneeded?   it's in template above.
			},

			postCreate: function(){
				this.inherited(arguments);

				// Listen to notifications from StackContainer
				this.subscribe(this.containerId+"-startup", "onStartup");
				this.subscribe(this.containerId+"-addChild", "onAddChild");
				this.subscribe(this.containerId+"-removeChild", "onRemoveChild");
				this.subscribe(this.containerId+"-selectChild", "onSelectChild");
				this.subscribe(this.containerId+"-containerKeyPress", "onContainerKeyPress");
			},

			onStartup: function(/*Object*/ info){
				// summary:
				//		Called after StackContainer has finished initializing
				// tags:
				//		private
				dojo.forEach(info.children, this.onAddChild, this);
				if(info.selected){
					// Show button corresponding to selected pane (unless selected
					// is null because there are no panes)
					this.onSelectChild(info.selected);
				}
			},

			destroy: function(){
				for(var pane in this.pane2button){
					this.onRemoveChild(dijit.byId(pane));
				}
				this.inherited(arguments);
			},

			onAddChild: function(/*dijit._Widget*/ page, /*Integer?*/ insertIndex){
				// summary:
				//		Called whenever a page is added to the container.
				//		Create button corresponding to the page.
				// tags:
				//		private

				// create an instance of the button widget
				var cls = dojo.getObject(this.buttonWidget);
				var button = new cls({
					id: this.id + "_" + page.id,
					label: page.title,
					dir: page.dir,
					lang: page.lang,
					showLabel: page.showTitle,
					iconClass: page.iconClass,
					closeButton: page.closable,
					title: page.tooltip
				});
				dijit.setWaiState(button.focusNode,"selected", "false");


				// map from page attribute to corresponding tab button attribute
				var pageAttrList = ["title", "showTitle", "iconClass", "closable", "tooltip"],
					buttonAttrList = ["label", "showLabel", "iconClass", "closeButton", "title"];

				// watch() so events like page title changes are reflected in tab button
				this.pane2watches[page.id] = dojo.map(pageAttrList, function(pageAttr, idx){
					return page.watch(pageAttr, function(name, oldVal, newVal){
						button.set(buttonAttrList[idx], newVal);
					});
				});
					
				// connections so that clicking a tab button selects the corresponding page
				this.pane2connects[page.id] = [
					this.connect(button, 'onClick', dojo.hitch(this,"onButtonClick", page)),
					this.connect(button, 'onClickCloseButton', dojo.hitch(this,"onCloseButtonClick", page))
				];

				this.addChild(button, insertIndex);
				this.pane2button[page.id] = button;
				page.controlButton = button;	// this value might be overwritten if two tabs point to same container
				if(!this._currentChild){ // put the first child into the tab order
					button.focusNode.setAttribute("tabIndex", "0");
					dijit.setWaiState(button.focusNode, "selected", "true");
					this._currentChild = page;
				}
				// make sure all tabs have the same length
				if(!this.isLeftToRight() && dojo.isIE && this._rectifyRtlTabList){
					this._rectifyRtlTabList();
				}
			},

			onRemoveChild: function(/*dijit._Widget*/ page){
				// summary:
				//		Called whenever a page is removed from the container.
				//		Remove the button corresponding to the page.
				// tags:
				//		private

				if(this._currentChild === page){ this._currentChild = null; }

				// disconnect/unwatch connections/watches related to page being removed
				dojo.forEach(this.pane2connects[page.id], dojo.hitch(this, "disconnect"));
				delete this.pane2connects[page.id];
				dojo.forEach(this.pane2watches[page.id], function(w){ w.unwatch(); });
				delete this.pane2watches[page.id];

				var button = this.pane2button[page.id];
				if(button){
					this.removeChild(button);
					delete this.pane2button[page.id];
					button.destroy();
				}
				delete page.controlButton;
			},

			onSelectChild: function(/*dijit._Widget*/ page){
				// summary:
				//		Called when a page has been selected in the StackContainer, either by me or by another StackController
				// tags:
				//		private

				if(!page){ return; }

				if(this._currentChild){
					var oldButton=this.pane2button[this._currentChild.id];
					oldButton.set('checked', false);
					dijit.setWaiState(oldButton.focusNode, "selected", "false");
					oldButton.focusNode.setAttribute("tabIndex", "-1");
				}

				var newButton=this.pane2button[page.id];
				newButton.set('checked', true);
				dijit.setWaiState(newButton.focusNode, "selected", "true");
				this._currentChild = page;
				newButton.focusNode.setAttribute("tabIndex", "0");
				var container = dijit.byId(this.containerId);
				dijit.setWaiState(container.containerNode, "labelledby", newButton.id);
			},

			onButtonClick: function(/*dijit._Widget*/ page){
				// summary:
				//		Called whenever one of my child buttons is pressed in an attempt to select a page
				// tags:
				//		private

				var container = dijit.byId(this.containerId);
				container.selectChild(page);
			},

			onCloseButtonClick: function(/*dijit._Widget*/ page){
				// summary:
				//		Called whenever one of my child buttons [X] is pressed in an attempt to close a page
				// tags:
				//		private

				var container = dijit.byId(this.containerId);
				container.closeChild(page);
				if(this._currentChild){
					var b = this.pane2button[this._currentChild.id];
					if(b){
						dijit.focus(b.focusNode || b.domNode);
					}
				}
			},

			// TODO: this is a bit redundant with forward, back api in StackContainer
			adjacent: function(/*Boolean*/ forward){
				// summary:
				//		Helper for onkeypress to find next/previous button
				// tags:
				//		private

				if(!this.isLeftToRight() && (!this.tabPosition || /top|bottom/.test(this.tabPosition))){ forward = !forward; }
				// find currently focused button in children array
				var children = this.getChildren();
				var current = dojo.indexOf(children, this.pane2button[this._currentChild.id]);
				// pick next button to focus on
				var offset = forward ? 1 : children.length - 1;
				return children[ (current + offset) % children.length ]; // dijit._Widget
			},

			onkeypress: function(/*Event*/ e){
				// summary:
				//		Handle keystrokes on the page list, for advancing to next/previous button
				//		and closing the current page if the page is closable.
				// tags:
				//		private

				if(this.disabled || e.altKey ){ return; }
				var forward = null;
				if(e.ctrlKey || !e._djpage){
					var k = dojo.keys;
					switch(e.charOrCode){
						case k.LEFT_ARROW:
						case k.UP_ARROW:
							if(!e._djpage){ forward = false; }
							break;
						case k.PAGE_UP:
							if(e.ctrlKey){ forward = false; }
							break;
						case k.RIGHT_ARROW:
						case k.DOWN_ARROW:
							if(!e._djpage){ forward = true; }
							break;
						case k.PAGE_DOWN:
							if(e.ctrlKey){ forward = true; }
							break;
						case k.HOME:
						case k.END:
							var children = this.getChildren();
							if(children && children.length){
								children[e.charOrCode == k.HOME ? 0 : children.length-1].onClick();
							}
							dojo.stopEvent(e);
							break;
						case k.DELETE:
							if(this._currentChild.closable){
								this.onCloseButtonClick(this._currentChild);
							}
							dojo.stopEvent(e);
							break;
						default:
							if(e.ctrlKey){
								if(e.charOrCode === k.TAB){
									this.adjacent(!e.shiftKey).onClick();
									dojo.stopEvent(e);
								}else if(e.charOrCode == "w"){
									if(this._currentChild.closable){
										this.onCloseButtonClick(this._currentChild);
									}
									dojo.stopEvent(e); // avoid browser tab closing.
								}
							}
					}
					// handle next/previous page navigation (left/right arrow, etc.)
					if(forward !== null){
						this.adjacent(forward).onClick();
						dojo.stopEvent(e);
					}
				}
			},

			onContainerKeyPress: function(/*Object*/ info){
				// summary:
				//		Called when there was a keypress on the container
				// tags:
				//		private
				info.e._djpage = info.page;
				this.onkeypress(info.e);
			}
	});


dojo.declare("dijit.layout._StackButton",
		dijit.form.ToggleButton,
		{
		// summary:
		//		Internal widget used by StackContainer.
		// description:
		//		The button-like or tab-like object you click to select or delete a page
		// tags:
		//		private

		// Override _FormWidget.tabIndex.
		// StackContainer buttons are not in the tab order by default.
		// Probably we should be calling this.startupKeyNavChildren() instead.
		tabIndex: "-1",

		buildRendering: function(/*Event*/ evt){
			this.inherited(arguments);
			dijit.setWaiRole((this.focusNode || this.domNode), "tab");
		},

		onClick: function(/*Event*/ evt){
			// summary:
			//		This is for TabContainer where the tabs are <span> rather than button,
			//		so need to set focus explicitly (on some browsers)
			//		Note that you shouldn't override this method, but you can connect to it.
			dijit.focus(this.focusNode);

			// ... now let StackController catch the event and tell me what to do
		},

		onClickCloseButton: function(/*Event*/ evt){
			// summary:
			//		StackContainer connects to this function; if your widget contains a close button
			//		then clicking it should call this function.
			//		Note that you shouldn't override this method, but you can connect to it.
			evt.stopPropagation();
		}
	});

}

if(!dojo._hasResource["dijit.layout.StackContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.StackContainer"] = true;
dojo.provide("dijit.layout.StackContainer");







dojo.declare(
	"dijit.layout.StackContainer",
	dijit.layout._LayoutWidget,
	{
	// summary:
	//		A container that has multiple children, but shows only
	//		one child at a time
	//
	// description:
	//		A container for widgets (ContentPanes, for example) That displays
	//		only one Widget at a time.
	//
	//		Publishes topics [widgetId]-addChild, [widgetId]-removeChild, and [widgetId]-selectChild
	//
	//		Can be base class for container, Wizard, Show, etc.

	// doLayout: Boolean
	//		If true, change the size of my currently displayed child to match my size
	doLayout: true,

	// persist: Boolean
	//		Remembers the selected child across sessions
	persist: false,

	baseClass: "dijitStackContainer",

/*=====
	// selectedChildWidget: [readonly] dijit._Widget
	//		References the currently selected child widget, if any.
	//		Adjust selected child with selectChild() method.
	selectedChildWidget: null,
=====*/

	buildRendering: function(){
		this.inherited(arguments);
		dojo.addClass(this.domNode, "dijitLayoutContainer");
		dijit.setWaiRole(this.containerNode, "tabpanel");
	},

	postCreate: function(){
		this.inherited(arguments);
		this.connect(this.domNode, "onkeypress", this._onKeyPress);
	},

	startup: function(){
		if(this._started){ return; }

		var children = this.getChildren();

		// Setup each page panel to be initially hidden
		dojo.forEach(children, this._setupChild, this);

		// Figure out which child to initially display, defaulting to first one
		if(this.persist){
			this.selectedChildWidget = dijit.byId(dojo.cookie(this.id + "_selectedChild"));
		}else{
			dojo.some(children, function(child){
				if(child.selected){
					this.selectedChildWidget = child;
				}
				return child.selected;
			}, this);
		}
		var selected = this.selectedChildWidget;
		if(!selected && children[0]){
			selected = this.selectedChildWidget = children[0];
			selected.selected = true;
		}

		// Publish information about myself so any StackControllers can initialize.
		// This needs to happen before this.inherited(arguments) so that for
		// TabContainer, this._contentBox doesn't include the space for the tab labels.
		dojo.publish(this.id+"-startup", [{children: children, selected: selected}]);

		// Startup each child widget, and do initial layout like setting this._contentBox,
		// then calls this.resize() which does the initial sizing on the selected child.
		this.inherited(arguments);
	},

	resize: function(){
		// Resize is called when we are first made visible (it's called from startup()
		// if we are initially visible).   If this is the first time we've been made
		// visible then show our first child.
		var selected = this.selectedChildWidget;
		if(selected && !this._hasBeenShown){
			this._hasBeenShown = true;
			this._showChild(selected);
		}
		this.inherited(arguments);
	},

	_setupChild: function(/*dijit._Widget*/ child){
		// Overrides _LayoutWidget._setupChild()

		this.inherited(arguments);

		dojo.replaceClass(child.domNode, "dijitHidden", "dijitVisible");

		// remove the title attribute so it doesn't show up when i hover
		// over a node
		child.domNode.title = "";
	},

	addChild: function(/*dijit._Widget*/ child, /*Integer?*/ insertIndex){
		// Overrides _Container.addChild() to do layout and publish events

		this.inherited(arguments);

		if(this._started){
			dojo.publish(this.id+"-addChild", [child, insertIndex]);

			// in case the tab titles have overflowed from one line to two lines
			// (or, if this if first child, from zero lines to one line)
			// TODO: w/ScrollingTabController this is no longer necessary, although
			// ScrollTabController.resize() does need to get called to show/hide
			// the navigation buttons as appropriate, but that's handled in ScrollingTabController.onAddChild()
			this.layout();

			// if this is the first child, then select it
			if(!this.selectedChildWidget){
				this.selectChild(child);
			}
		}
	},

	removeChild: function(/*dijit._Widget*/ page){
		// Overrides _Container.removeChild() to do layout and publish events

		this.inherited(arguments);

		if(this._started){
			// this will notify any tablists to remove a button; do this first because it may affect sizing
			dojo.publish(this.id + "-removeChild", [page]);
		}

		// If we are being destroyed than don't run the code below (to select another page), because we are deleting
		// every page one by one
		if(this._beingDestroyed){ return; }

		// Select new page to display, also updating TabController to show the respective tab.
		// Do this before layout call because it can affect the height of the TabController.
		if(this.selectedChildWidget === page){
			this.selectedChildWidget = undefined;
			if(this._started){
				var children = this.getChildren();
				if(children.length){
					this.selectChild(children[0]);
				}
			}
		}

		if(this._started){
			// In case the tab titles now take up one line instead of two lines
			// (note though that ScrollingTabController never overflows to multiple lines),
			// or the height has changed slightly because of addition/removal of tab which close icon
			this.layout();
		}
	},

	selectChild: function(/*dijit._Widget|String*/ page, /*Boolean*/ animate){
		// summary:
		//		Show the given widget (which must be one of my children)
		// page:
		//		Reference to child widget or id of child widget

		page = dijit.byId(page);

		if(this.selectedChildWidget != page){
			// Deselect old page and select new one
			var d = this._transition(page, this.selectedChildWidget, animate);
			this._set("selectedChildWidget", page);
			dojo.publish(this.id+"-selectChild", [page]);

			if(this.persist){
				dojo.cookie(this.id + "_selectedChild", this.selectedChildWidget.id);
			}
		}

		return d;		// If child has an href, promise that fires when the child's href finishes loading
	},

	_transition: function(/*dijit._Widget*/ newWidget, /*dijit._Widget*/ oldWidget, /*Boolean*/ animate){
		// summary:
		//		Hide the old widget and display the new widget.
		//		Subclasses should override this.
		// tags:
		//		protected extension
		if(oldWidget){
			this._hideChild(oldWidget);
		}
		var d = this._showChild(newWidget);

		// Size the new widget, in case this is the first time it's being shown,
		// or I have been resized since the last time it was shown.
		// Note that page must be visible for resizing to work.
		if(newWidget.resize){
			if(this.doLayout){
				newWidget.resize(this._containerContentBox || this._contentBox);
			}else{
				// the child should pick it's own size but we still need to call resize()
				// (with no arguments) to let the widget lay itself out
				newWidget.resize();
			}
		}

		return d;	// If child has an href, promise that fires when the child's href finishes loading
	},

	_adjacent: function(/*Boolean*/ forward){
		// summary:
		//		Gets the next/previous child widget in this container from the current selection.
		var children = this.getChildren();
		var index = dojo.indexOf(children, this.selectedChildWidget);
		index += forward ? 1 : children.length - 1;
		return children[ index % children.length ]; // dijit._Widget
	},

	forward: function(){
		// summary:
		//		Advance to next page.
		return this.selectChild(this._adjacent(true), true);
	},

	back: function(){
		// summary:
		//		Go back to previous page.
		return this.selectChild(this._adjacent(false), true);
	},

	_onKeyPress: function(e){
		dojo.publish(this.id+"-containerKeyPress", [{ e: e, page: this}]);
	},

	layout: function(){
		// Implement _LayoutWidget.layout() virtual method.
		if(this.doLayout && this.selectedChildWidget && this.selectedChildWidget.resize){
			this.selectedChildWidget.resize(this._containerContentBox || this._contentBox);
		}
	},

	_showChild: function(/*dijit._Widget*/ page){
		// summary:
		//		Show the specified child by changing it's CSS, and call _onShow()/onShow() so
		//		it can do any updates it needs regarding loading href's etc.
		// returns:
		//		Promise that fires when page has finished showing, or true if there's no href
		var children = this.getChildren();
		page.isFirstChild = (page == children[0]);
		page.isLastChild = (page == children[children.length-1]);
		page._set("selected", true);

		dojo.replaceClass(page.domNode, "dijitVisible", "dijitHidden");

		return page._onShow() || true;
	},

	_hideChild: function(/*dijit._Widget*/ page){
		// summary:
		//		Hide the specified child by changing it's CSS, and call _onHide() so
		//		it's notified.
		page._set("selected", false);
		dojo.replaceClass(page.domNode, "dijitHidden", "dijitVisible");

		page.onHide();
	},

	closeChild: function(/*dijit._Widget*/ page){
		// summary:
		//		Callback when user clicks the [X] to remove a page.
		//		If onClose() returns true then remove and destroy the child.
		// tags:
		//		private
		var remove = page.onClose(this, page);
		if(remove){
			this.removeChild(page);
			// makes sure we can clean up executeScripts in ContentPane onUnLoad
			page.destroyRecursive();
		}
	},

	destroyDescendants: function(/*Boolean*/ preserveDom){
		dojo.forEach(this.getChildren(), function(child){
			this.removeChild(child);
			child.destroyRecursive(preserveDom);
		}, this);
	}
});

// For back-compat, remove for 2.0


// These arguments can be specified for the children of a StackContainer.
// Since any widget can be specified as a StackContainer child, mix them
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget, {
	// selected: Boolean
	//		Parameter for children of `dijit.layout.StackContainer` or subclasses.
	//		Specifies that this widget should be the initially displayed pane.
	//		Note: to change the selected child use `dijit.layout.StackContainer.selectChild`
	selected: false,

	// closable: Boolean
	//		Parameter for children of `dijit.layout.StackContainer` or subclasses.
	//		True if user can close (destroy) this child, such as (for example) clicking the X on the tab.
	closable: false,

	// iconClass: String
	//		Parameter for children of `dijit.layout.StackContainer` or subclasses.
	//		CSS Class specifying icon to use in label associated with this pane.
	iconClass: "",

	// showTitle: Boolean
	//		Parameter for children of `dijit.layout.StackContainer` or subclasses.
	//		When true, display title of this widget as tab label etc., rather than just using
	//		icon specified in iconClass
	showTitle: true
});

}

if(!dojo._hasResource["dijit.layout._TabContainerBase"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout._TabContainerBase"] = true;
dojo.provide("dijit.layout._TabContainerBase");




dojo.declare("dijit.layout._TabContainerBase",
	[dijit.layout.StackContainer, dijit._Templated],
	{
	// summary:
	//		Abstract base class for TabContainer.   Must define _makeController() to instantiate
	//		and return the widget that displays the tab labels
	// description:
	//		A TabContainer is a container that has multiple panes, but shows only
	//		one pane at a time.  There are a set of tabs corresponding to each pane,
	//		where each tab has the name (aka title) of the pane, and optionally a close button.

	// tabPosition: String
	//		Defines where tabs go relative to tab content.
	//		"top", "bottom", "left-h", "right-h"
	tabPosition: "top",

	baseClass: "dijitTabContainer",

	// tabStrip: [const] Boolean
	//		Defines whether the tablist gets an extra class for layouting, putting a border/shading
	//		around the set of tabs.   Not supported by claro theme.
	tabStrip: false,

	// nested: [const] Boolean
	//		If true, use styling for a TabContainer nested inside another TabContainer.
	//		For tundra etc., makes tabs look like links, and hides the outer
	//		border since the outer TabContainer already has a border.
	nested: false,

	templateString: dojo.cache("dijit.layout", "templates/TabContainer.html", "<div class=\"dijitTabContainer\">\n\t<div class=\"dijitTabListWrapper\" dojoAttachPoint=\"tablistNode\"></div>\n\t<div dojoAttachPoint=\"tablistSpacer\" class=\"dijitTabSpacer ${baseClass}-spacer\"></div>\n\t<div class=\"dijitTabPaneWrapper ${baseClass}-container\" dojoAttachPoint=\"containerNode\"></div>\n</div>\n"),

	postMixInProperties: function(){
		// set class name according to tab position, ex: dijitTabContainerTop
		this.baseClass += this.tabPosition.charAt(0).toUpperCase() + this.tabPosition.substr(1).replace(/-.*/, "");

		this.srcNodeRef && dojo.style(this.srcNodeRef, "visibility", "hidden");

		this.inherited(arguments);
	},

	buildRendering: function(){
		this.inherited(arguments);

		// Create the tab list that will have a tab (a.k.a. tab button) for each tab panel
		this.tablist = this._makeController(this.tablistNode);

		if(!this.doLayout){ dojo.addClass(this.domNode, "dijitTabContainerNoLayout"); }

		if(this.nested){
			/* workaround IE's lack of support for "a > b" selectors by
			 * tagging each node in the template.
			 */
			dojo.addClass(this.domNode, "dijitTabContainerNested");
			dojo.addClass(this.tablist.containerNode, "dijitTabContainerTabListNested");
			dojo.addClass(this.tablistSpacer, "dijitTabContainerSpacerNested");
			dojo.addClass(this.containerNode, "dijitTabPaneWrapperNested");
		}else{
			dojo.addClass(this.domNode, "tabStrip-" + (this.tabStrip ? "enabled" : "disabled"));
		}
	},

	_setupChild: function(/*dijit._Widget*/ tab){
		// Overrides StackContainer._setupChild().
		dojo.addClass(tab.domNode, "dijitTabPane");
		this.inherited(arguments);
	},

	startup: function(){
		if(this._started){ return; }

		// wire up the tablist and its tabs
		this.tablist.startup();

		this.inherited(arguments);
	},

	layout: function(){
		// Overrides StackContainer.layout().
		// Configure the content pane to take up all the space except for where the tabs are

		if(!this._contentBox || typeof(this._contentBox.l) == "undefined"){return;}

		var sc = this.selectedChildWidget;

		if(this.doLayout){
			// position and size the titles and the container node
			var titleAlign = this.tabPosition.replace(/-h/, "");
			this.tablist.layoutAlign = titleAlign;
			var children = [this.tablist, {
				domNode: this.tablistSpacer,
				layoutAlign: titleAlign
			}, {
				domNode: this.containerNode,
				layoutAlign: "client"
			}];
			dijit.layout.layoutChildren(this.domNode, this._contentBox, children);

			// Compute size to make each of my children.
			// children[2] is the margin-box size of this.containerNode, set by layoutChildren() call above
			this._containerContentBox = dijit.layout.marginBox2contentBox(this.containerNode, children[2]);

			if(sc && sc.resize){
				sc.resize(this._containerContentBox);
			}
		}else{
			// just layout the tab controller, so it can position left/right buttons etc.
			if(this.tablist.resize){
				//make the tabs zero width so that they don't interfere with width calc, then reset
				var s = this.tablist.domNode.style;
				s.width="0";
				var width = dojo.contentBox(this.domNode).w;
				s.width="";
				this.tablist.resize({w: width});
			}

			// and call resize() on the selected pane just to tell it that it's been made visible
			if(sc && sc.resize){
				sc.resize();
			}
		}
	},

	destroy: function(){
		if(this.tablist){
			this.tablist.destroy();
		}
		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dijit._KeyNavContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._KeyNavContainer"] = true;
dojo.provide("dijit._KeyNavContainer");



dojo.declare("dijit._KeyNavContainer",
	dijit._Container,
	{

		// summary:
		//		A _Container with keyboard navigation of its children.
		// description:
		//		To use this mixin, call connectKeyNavHandlers() in
		//		postCreate() and call startupKeyNavChildren() in startup().
		//		It provides normalized keyboard and focusing code for Container
		//		widgets.
/*=====
		// focusedChild: [protected] Widget
		//		The currently focused child widget, or null if there isn't one
		focusedChild: null,
=====*/

		// tabIndex: Integer
		//		Tab index of the container; same as HTML tabIndex attribute.
		//		Note then when user tabs into the container, focus is immediately
		//		moved to the first item in the container.
		tabIndex: "0",

		_keyNavCodes: {},

		connectKeyNavHandlers: function(/*dojo.keys[]*/ prevKeyCodes, /*dojo.keys[]*/ nextKeyCodes){
			// summary:
			//		Call in postCreate() to attach the keyboard handlers
			//		to the container.
			// preKeyCodes: dojo.keys[]
			//		Key codes for navigating to the previous child.
			// nextKeyCodes: dojo.keys[]
			//		Key codes for navigating to the next child.
			// tags:
			//		protected

			var keyCodes = (this._keyNavCodes = {});
			var prev = dojo.hitch(this, this.focusPrev);
			var next = dojo.hitch(this, this.focusNext);
			dojo.forEach(prevKeyCodes, function(code){ keyCodes[code] = prev; });
			dojo.forEach(nextKeyCodes, function(code){ keyCodes[code] = next; });
			keyCodes[dojo.keys.HOME] = dojo.hitch(this, "focusFirstChild");
			keyCodes[dojo.keys.END] = dojo.hitch(this, "focusLastChild");
			this.connect(this.domNode, "onkeypress", "_onContainerKeypress");
			this.connect(this.domNode, "onfocus", "_onContainerFocus");
		},

		startupKeyNavChildren: function(){
			// summary:
			//		Call in startup() to set child tabindexes to -1
			// tags:
			//		protected
			dojo.forEach(this.getChildren(), dojo.hitch(this, "_startupChild"));
		},

		addChild: function(/*dijit._Widget*/ widget, /*int?*/ insertIndex){
			// summary:
			//		Add a child to our _Container
			dijit._KeyNavContainer.superclass.addChild.apply(this, arguments);
			this._startupChild(widget);
		},

		focus: function(){
			// summary:
			//		Default focus() implementation: focus the first child.
			this.focusFirstChild();
		},

		focusFirstChild: function(){
			// summary:
			//		Focus the first focusable child in the container.
			// tags:
			//		protected
			var child = this._getFirstFocusableChild();
			if(child){ // edge case: Menu could be empty or hidden
				this.focusChild(child);
			}
		},

		focusLastChild: function(){
			// summary:
			//		Focus the last focusable child in the container.
			// tags:
			//		protected
			var child = this._getLastFocusableChild();
			if(child){ // edge case: Menu could be empty or hidden
				this.focusChild(child);
			}
		},

		focusNext: function(){
			// summary:
			//		Focus the next widget
			// tags:
			//		protected
			var child = this._getNextFocusableChild(this.focusedChild, 1);
			this.focusChild(child);
		},

		focusPrev: function(){
			// summary:
			//		Focus the last focusable node in the previous widget
			//		(ex: go to the ComboButton icon section rather than button section)
			// tags:
			//		protected
			var child = this._getNextFocusableChild(this.focusedChild, -1);
			this.focusChild(child, true);
		},

		focusChild: function(/*dijit._Widget*/ widget, /*Boolean*/ last){
			// summary:
			//		Focus widget.
			// widget:
			//		Reference to container's child widget
			// last:
			//		If true and if widget has multiple focusable nodes, focus the
			//		last one instead of the first one
			// tags:
			//		protected
			
			if(this.focusedChild && widget !== this.focusedChild){
				this._onChildBlur(this.focusedChild);
			}
			widget.focus(last ? "end" : "start");
			this._set("focusedChild", widget);
		},

		_startupChild: function(/*dijit._Widget*/ widget){
			// summary:
			//		Setup for each child widget
			// description:
			//		Sets tabIndex=-1 on each child, so that the tab key will
			//		leave the container rather than visiting each child.
			// tags:
			//		private
			
			widget.set("tabIndex", "-1");
			
			this.connect(widget, "_onFocus", function(){
				// Set valid tabIndex so tabbing away from widget goes to right place, see #10272
				widget.set("tabIndex", this.tabIndex);
			});
			this.connect(widget, "_onBlur", function(){
				widget.set("tabIndex", "-1");
			});
		},

		_onContainerFocus: function(evt){
			// summary:
			//		Handler for when the container gets focus
			// description:
			//		Initially the container itself has a tabIndex, but when it gets
			//		focus, switch focus to first child...
			// tags:
			//		private

			// Note that we can't use _onFocus() because switching focus from the
			// _onFocus() handler confuses the focus.js code
			// (because it causes _onFocusNode() to be called recursively)

			// focus bubbles on Firefox,
			// so just make sure that focus has really gone to the container
			if(evt.target !== this.domNode){ return; }

			this.focusFirstChild();

			// and then set the container's tabIndex to -1,
			// (don't remove as that breaks Safari 4)
			// so that tab or shift-tab will go to the fields after/before
			// the container, rather than the container itself
			dojo.attr(this.domNode, "tabIndex", "-1");
		},

		_onBlur: function(evt){
			// When focus is moved away the container, and its descendant (popup) widgets,
			// then restore the container's tabIndex so that user can tab to it again.
			// Note that using _onBlur() so that this doesn't happen when focus is shifted
			// to one of my child widgets (typically a popup)
			if(this.tabIndex){
				dojo.attr(this.domNode, "tabIndex", this.tabIndex);
			}
			this.inherited(arguments);
		},

		_onContainerKeypress: function(evt){
			// summary:
			//		When a key is pressed, if it's an arrow key etc. then
			//		it's handled here.
			// tags:
			//		private
			if(evt.ctrlKey || evt.altKey){ return; }
			var func = this._keyNavCodes[evt.charOrCode];
			if(func){
				func();
				dojo.stopEvent(evt);
			}
		},

		_onChildBlur: function(/*dijit._Widget*/ widget){
			// summary:
			//		Called when focus leaves a child widget to go
			//		to a sibling widget.
			// tags:
			//		protected
		},

		_getFirstFocusableChild: function(){
			// summary:
			//		Returns first child that can be focused
			return this._getNextFocusableChild(null, 1);	// dijit._Widget
		},

		_getLastFocusableChild: function(){
			// summary:
			//		Returns last child that can be focused
			return this._getNextFocusableChild(null, -1);	// dijit._Widget
		},

		_getNextFocusableChild: function(child, dir){
			// summary:
			//		Returns the next or previous focusable child, compared
			//		to "child"
			// child: Widget
			//		The current widget
			// dir: Integer
			//		* 1 = after
			//		* -1 = before
			if(child){
				child = this._getSiblingOfChild(child, dir);
			}
			var children = this.getChildren();
			for(var i=0; i < children.length; i++){
				if(!child){
					child = children[(dir>0) ? 0 : (children.length-1)];
				}
				if(child.isFocusable()){
					return child;	// dijit._Widget
				}
				child = this._getSiblingOfChild(child, dir);
			}
			// no focusable child found
			return null;	// dijit._Widget
		}
	}
);

}

if(!dojo._hasResource["dijit.MenuItem"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.MenuItem"] = true;
dojo.provide("dijit.MenuItem");






dojo.declare("dijit.MenuItem",
		[dijit._Widget, dijit._Templated, dijit._Contained, dijit._CssStateMixin],
		{
		// summary:
		//		A line item in a Menu Widget

		// Make 3 columns
		// icon, label, and expand arrow (BiDi-dependent) indicating sub-menu
		templateString: dojo.cache("dijit", "templates/MenuItem.html", "<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n"),

		attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
			label: { node: "containerNode", type: "innerHTML" },
			iconClass: { node: "iconNode", type: "class" }
		}),

		baseClass: "dijitMenuItem",

		// label: String
		//		Menu text
		label: '',

		// iconClass: String
		//		Class to apply to DOMNode to make it display an icon.
		iconClass: "",

		// accelKey: String
		//		Text for the accelerator (shortcut) key combination.
		//		Note that although Menu can display accelerator keys there
		//		is no infrastructure to actually catch and execute these
		//		accelerators.
		accelKey: "",

		// disabled: Boolean
		//		If true, the menu item is disabled.
		//		If false, the menu item is enabled.
		disabled: false,

		_fillContent: function(/*DomNode*/ source){
			// If button label is specified as srcNodeRef.innerHTML rather than
			// this.params.label, handle it here.
			if(source && !("label" in this.params)){
				this.set('label', source.innerHTML);
			}
		},

		buildRendering: function(){
			this.inherited(arguments);
			var label = this.id+"_text";
			dojo.attr(this.containerNode, "id", label);
			if(this.accelKeyNode){
				dojo.attr(this.accelKeyNode, "id", this.id + "_accel");
				label += " " + this.id + "_accel";
			}
			dijit.setWaiState(this.domNode, "labelledby", label);
			dojo.setSelectable(this.domNode, false);
		},

		_onHover: function(){
			// summary:
			//		Handler when mouse is moved onto menu item
			// tags:
			//		protected
			this.getParent().onItemHover(this);
		},

		_onUnhover: function(){
			// summary:
			//		Handler when mouse is moved off of menu item,
			//		possibly to a child menu, or maybe to a sibling
			//		menuitem or somewhere else entirely.
			// tags:
			//		protected

			// if we are unhovering the currently selected item
			// then unselect it
			this.getParent().onItemUnhover(this);

			// When menu is hidden (collapsed) due to clicking a MenuItem and having it execute,
			// FF and IE don't generate an onmouseout event for the MenuItem.
			// So, help out _CssStateMixin in this case.
			this._set("hovering", false);
		},

		_onClick: function(evt){
			// summary:
			//		Internal handler for click events on MenuItem.
			// tags:
			//		private
			this.getParent().onItemClick(this, evt);
			dojo.stopEvent(evt);
		},

		onClick: function(/*Event*/ evt){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		focus: function(){
			// summary:
			//		Focus on this MenuItem
			try{
				if(dojo.isIE == 8){
					// needed for IE8 which won't scroll TR tags into view on focus yet calling scrollIntoView creates flicker (#10275)
					this.containerNode.focus();
				}
				dijit.focus(this.focusNode);
			}catch(e){
				// this throws on IE (at least) in some scenarios
			}
		},

		_onFocus: function(){
			// summary:
			//		This is called by the focus manager when focus
			//		goes to this MenuItem or a child menu.
			// tags:
			//		protected
			this._setSelected(true);
			this.getParent()._onItemFocus(this);

			this.inherited(arguments);
		},

		_setSelected: function(selected){
			// summary:
			//		Indicate that this node is the currently selected one
			// tags:
			//		private

			/***
			 * TODO: remove this method and calls to it, when _onBlur() is working for MenuItem.
			 * Currently _onBlur() gets called when focus is moved from the MenuItem to a child menu.
			 * That's not supposed to happen, but the problem is:
			 * In order to allow dijit.popup's getTopPopup() to work,a sub menu's popupParent
			 * points to the parent Menu, bypassing the parent MenuItem... thus the
			 * MenuItem is not in the chain of active widgets and gets a premature call to
			 * _onBlur()
			 */

			dojo.toggleClass(this.domNode, "dijitMenuItemSelected", selected);
		},

		setLabel: function(/*String*/ content){
			// summary:
			//		Deprecated.   Use set('label', ...) instead.
			// tags:
			//		deprecated
			dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
			this.set("label", content);
		},

		setDisabled: function(/*Boolean*/ disabled){
			// summary:
			//		Deprecated.   Use set('disabled', bool) instead.
			// tags:
			//		deprecated
			dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.", "", "2.0");
			this.set('disabled', disabled);
		},
		_setDisabledAttr: function(/*Boolean*/ value){
			// summary:
			//		Hook for attr('disabled', ...) to work.
			//		Enable or disable this menu item.

			dijit.setWaiState(this.focusNode, 'disabled', value ? 'true' : 'false');
			this._set("disabled", value);
		},
		_setAccelKeyAttr: function(/*String*/ value){
			// summary:
			//		Hook for attr('accelKey', ...) to work.
			//		Set accelKey on this menu item.

			this.accelKeyNode.style.display=value?"":"none";
			this.accelKeyNode.innerHTML=value;
			//have to use colSpan to make it work in IE
			dojo.attr(this.containerNode,'colSpan',value?"1":"2");
			
			this._set("accelKey", value);
		}
	});

}

if(!dojo._hasResource["dijit.PopupMenuItem"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.PopupMenuItem"] = true;
dojo.provide("dijit.PopupMenuItem");



dojo.declare("dijit.PopupMenuItem",
		dijit.MenuItem,
		{
		_fillContent: function(){
			// summary:
			//		When Menu is declared in markup, this code gets the menu label and
			//		the popup widget from the srcNodeRef.
			// description:
			//		srcNodeRefinnerHTML contains both the menu item text and a popup widget
			//		The first part holds the menu item text and the second part is the popup
			// example:
			// |	<div dojoType="dijit.PopupMenuItem">
			// |		<span>pick me</span>
			// |		<popup> ... </popup>
			// |	</div>
			// tags:
			//		protected

			if(this.srcNodeRef){
				var nodes = dojo.query("*", this.srcNodeRef);
				dijit.PopupMenuItem.superclass._fillContent.call(this, nodes[0]);

				// save pointer to srcNode so we can grab the drop down widget after it's instantiated
				this.dropDownContainer = this.srcNodeRef;
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);

			// we didn't copy the dropdown widget from the this.srcNodeRef, so it's in no-man's
			// land now.  move it to dojo.doc.body.
			if(!this.popup){
				var node = dojo.query("[widgetId]", this.dropDownContainer)[0];
				this.popup = dijit.byNode(node);
			}
			dojo.body().appendChild(this.popup.domNode);
			this.popup.startup();

			this.popup.domNode.style.display="none";
			if(this.arrowWrapper){
				dojo.style(this.arrowWrapper, "visibility", "");
			}
			dijit.setWaiState(this.focusNode, "haspopup", "true");
		},

		destroyDescendants: function(){
			if(this.popup){
				// Destroy the popup, unless it's already been destroyed.  This can happen because
				// the popup is a direct child of <body> even though it's logically my child.
				if(!this.popup._destroyed){
					this.popup.destroyRecursive();
				}
				delete this.popup;
			}
			this.inherited(arguments);
		}
	});

}

if(!dojo._hasResource["dijit.CheckedMenuItem"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.CheckedMenuItem"] = true;
dojo.provide("dijit.CheckedMenuItem");



dojo.declare("dijit.CheckedMenuItem",
		dijit.MenuItem,
		{
		// summary:
		//		A checkbox-like menu item for toggling on and off

		templateString: dojo.cache("dijit", "templates/CheckedMenuItem.html", "<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\n</tr>\n"),

		// checked: Boolean
		//		Our checked state
		checked: false,
		_setCheckedAttr: function(/*Boolean*/ checked){
			// summary:
			//		Hook so attr('checked', bool) works.
			//		Sets the class and state for the check box.
			dojo.toggleClass(this.domNode, "dijitCheckedMenuItemChecked", checked);
			dijit.setWaiState(this.domNode, "checked", checked);
			this._set("checked", checked);
		},

		onChange: function(/*Boolean*/ checked){
			// summary:
			//		User defined function to handle check/uncheck events
			// tags:
			//		callback
		},

		_onClick: function(/*Event*/ e){
			// summary:
			//		Clicking this item just toggles its state
			// tags:
			//		private
			if(!this.disabled){
				this.set("checked", !this.checked);
				this.onChange(this.checked);
			}
			this.inherited(arguments);
		}
	});

}

if(!dojo._hasResource["dijit.MenuSeparator"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.MenuSeparator"] = true;
dojo.provide("dijit.MenuSeparator");





dojo.declare("dijit.MenuSeparator",
		[dijit._Widget, dijit._Templated, dijit._Contained],
		{
		// summary:
		//		A line between two menu items

		templateString: dojo.cache("dijit", "templates/MenuSeparator.html", "<tr class=\"dijitMenuSeparator\">\n\t<td class=\"dijitMenuSeparatorIconCell\">\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n</tr>\n"),

		buildRendering: function(){
			this.inherited(arguments);
			dojo.setSelectable(this.domNode, false);
		},

		isFocusable: function(){
			// summary:
			//		Override to always return false
			// tags:
			//		protected

			return false; // Boolean
		}
	});

}

if(!dojo._hasResource["dijit.Menu"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Menu"] = true;
dojo.provide("dijit.Menu");










// "dijit/MenuItem", "dijit/PopupMenuItem", "dijit/CheckedMenuItem", "dijit/MenuSeparator" for Back-compat (TODO: remove in 2.0)

dojo.declare("dijit._MenuBase",
	[dijit._Widget, dijit._Templated, dijit._KeyNavContainer],
{
	// summary:
	//		Base class for Menu and MenuBar

	// parentMenu: [readonly] Widget
	//		pointer to menu that displayed me
	parentMenu: null,

	// popupDelay: Integer
	//		number of milliseconds before hovering (without clicking) causes the popup to automatically open.
	popupDelay: 500,

	startup: function(){
		if(this._started){ return; }

		dojo.forEach(this.getChildren(), function(child){ child.startup(); });
		this.startupKeyNavChildren();

		this.inherited(arguments);
	},

	onExecute: function(){
		// summary:
		//		Attach point for notification about when a menu item has been executed.
		//		This is an internal mechanism used for Menus to signal to their parent to
		//		close them, because they are about to execute the onClick handler.   In
		//		general developers should not attach to or override this method.
		// tags:
		//		protected
	},

	onCancel: function(/*Boolean*/ closeAll){
		// summary:
		//		Attach point for notification about when the user cancels the current menu
		//		This is an internal mechanism used for Menus to signal to their parent to
		//		close them.  In general developers should not attach to or override this method.
		// tags:
		//		protected
	},

	_moveToPopup: function(/*Event*/ evt){
		// summary:
		//		This handles the right arrow key (left arrow key on RTL systems),
		//		which will either open a submenu, or move to the next item in the
		//		ancestor MenuBar
		// tags:
		//		private

		if(this.focusedChild && this.focusedChild.popup && !this.focusedChild.disabled){
			this.focusedChild._onClick(evt);
		}else{
			var topMenu = this._getTopMenu();
			if(topMenu && topMenu._isMenuBar){
				topMenu.focusNext();
			}
		}
	},

	_onPopupHover: function(/*Event*/ evt){
		// summary:
		//		This handler is called when the mouse moves over the popup.
		// tags:
		//		private

		// if the mouse hovers over a menu popup that is in pending-close state,
		// then stop the close operation.
		// This can't be done in onItemHover since some popup targets don't have MenuItems (e.g. ColorPicker)
		if(this.currentPopup && this.currentPopup._pendingClose_timer){
			var parentMenu = this.currentPopup.parentMenu;
			// highlight the parent menu item pointing to this popup
			if(parentMenu.focusedChild){
				parentMenu.focusedChild._setSelected(false);
			}
			parentMenu.focusedChild = this.currentPopup.from_item;
			parentMenu.focusedChild._setSelected(true);
			// cancel the pending close
			this._stopPendingCloseTimer(this.currentPopup);
		}
	},

	onItemHover: function(/*MenuItem*/ item){
		// summary:
		//		Called when cursor is over a MenuItem.
		// tags:
		//		protected

		// Don't do anything unless user has "activated" the menu by:
		//		1) clicking it
		//		2) opening it from a parent menu (which automatically focuses it)
		if(this.isActive){
			this.focusChild(item);
			if(this.focusedChild.popup && !this.focusedChild.disabled && !this.hover_timer){
				this.hover_timer = setTimeout(dojo.hitch(this, "_openPopup"), this.popupDelay);
			}
		}
		// if the user is mixing mouse and keyboard navigation,
		// then the menu may not be active but a menu item has focus,
		// but it's not the item that the mouse just hovered over.
		// To avoid both keyboard and mouse selections, use the latest.
		if(this.focusedChild){
			this.focusChild(item);
		}
		this._hoveredChild = item;
	},

	_onChildBlur: function(item){
		// summary:
		//		Called when a child MenuItem becomes inactive because focus
		//		has been removed from the MenuItem *and* it's descendant menus.
		// tags:
		//		private
		this._stopPopupTimer();
		item._setSelected(false);
		// Close all popups that are open and descendants of this menu
		var itemPopup = item.popup;
		if(itemPopup){
			this._stopPendingCloseTimer(itemPopup);
			itemPopup._pendingClose_timer = setTimeout(function(){
				itemPopup._pendingClose_timer = null;
				if(itemPopup.parentMenu){
					itemPopup.parentMenu.currentPopup = null;
				}
				dijit.popup.close(itemPopup); // this calls onClose
			}, this.popupDelay);
		}
	},

	onItemUnhover: function(/*MenuItem*/ item){
		// summary:
		//		Callback fires when mouse exits a MenuItem
		// tags:
		//		protected

		if(this.isActive){
			this._stopPopupTimer();
		}
		if(this._hoveredChild == item){ this._hoveredChild = null; }
	},

	_stopPopupTimer: function(){
		// summary:
		//		Cancels the popup timer because the user has stop hovering
		//		on the MenuItem, etc.
		// tags:
		//		private
		if(this.hover_timer){
			clearTimeout(this.hover_timer);
			this.hover_timer = null;
		}
	},

	_stopPendingCloseTimer: function(/*dijit._Widget*/ popup){
		// summary:
		//		Cancels the pending-close timer because the close has been preempted
		// tags:
		//		private
		if(popup._pendingClose_timer){
			clearTimeout(popup._pendingClose_timer);
			popup._pendingClose_timer = null;
		}
	},

	_stopFocusTimer: function(){
		// summary:
		//		Cancels the pending-focus timer because the menu was closed before focus occured
		// tags:
		//		private
		if(this._focus_timer){
			clearTimeout(this._focus_timer);
			this._focus_timer = null;
		}
	},

	_getTopMenu: function(){
		// summary:
		//		Returns the top menu in this chain of Menus
		// tags:
		//		private
		for(var top=this; top.parentMenu; top=top.parentMenu);
		return top;
	},

	onItemClick: function(/*dijit._Widget*/ item, /*Event*/ evt){
		// summary:
		//		Handle clicks on an item.
		// tags:
		//		private

		// this can't be done in _onFocus since the _onFocus events occurs asynchronously
		if(typeof this.isShowingNow == 'undefined'){ // non-popup menu
			this._markActive();
		}

		this.focusChild(item);

		if(item.disabled){ return false; }

		if(item.popup){
			this._openPopup();
		}else{
			// before calling user defined handler, close hierarchy of menus
			// and restore focus to place it was when menu was opened
			this.onExecute();

			// user defined handler for click
			item.onClick(evt);
		}
	},

	_openPopup: function(){
		// summary:
		//		Open the popup to the side of/underneath the current menu item
		// tags:
		//		protected

		this._stopPopupTimer();
		var from_item = this.focusedChild;
		if(!from_item){ return; } // the focused child lost focus since the timer was started
		var popup = from_item.popup;
		if(popup.isShowingNow){ return; }
		if(this.currentPopup){
			this._stopPendingCloseTimer(this.currentPopup);
			dijit.popup.close(this.currentPopup);
		}
		popup.parentMenu = this;
		popup.from_item = from_item; // helps finding the parent item that should be focused for this popup
		var self = this;
		dijit.popup.open({
			parent: this,
			popup: popup,
			around: from_item.domNode,
			orient: this._orient || (this.isLeftToRight() ?
									{'TR': 'TL', 'TL': 'TR', 'BR': 'BL', 'BL': 'BR'} :
									{'TL': 'TR', 'TR': 'TL', 'BL': 'BR', 'BR': 'BL'}),
			onCancel: function(){ // called when the child menu is canceled
				// set isActive=false (_closeChild vs _cleanUp) so that subsequent hovering will NOT open child menus
				// which seems aligned with the UX of most applications (e.g. notepad, wordpad, paint shop pro)
				self.focusChild(from_item);	// put focus back on my node
				self._cleanUp();			// close the submenu (be sure this is done _after_ focus is moved)
				from_item._setSelected(true); // oops, _cleanUp() deselected the item
				self.focusedChild = from_item;	// and unset focusedChild
			},
			onExecute: dojo.hitch(this, "_cleanUp")
		});

		this.currentPopup = popup;
		// detect mouseovers to handle lazy mouse movements that temporarily focus other menu items
		popup.connect(popup.domNode, "onmouseenter", dojo.hitch(self, "_onPopupHover")); // cleaned up when the popped-up widget is destroyed on close

		if(popup.focus){
			// If user is opening the popup via keyboard (right arrow, or down arrow for MenuBar),
			// if the cursor happens to collide with the popup, it will generate an onmouseover event
			// even though the mouse wasn't moved.   Use a setTimeout() to call popup.focus so that
			// our focus() call overrides the onmouseover event, rather than vice-versa.  (#8742)
			popup._focus_timer = setTimeout(dojo.hitch(popup, function(){
				this._focus_timer = null;
				this.focus();
			}), 0);
		}
	},

	_markActive: function(){
		// summary:
		//              Mark this menu's state as active.
		//		Called when this Menu gets focus from:
		//			1) clicking it (mouse or via space/arrow key)
		//			2) being opened by a parent menu.
		//		This is not called just from mouse hover.
		//		Focusing a menu via TAB does NOT automatically set isActive
		//		since TAB is a navigation operation and not a selection one.
		//		For Windows apps, pressing the ALT key focuses the menubar
		//		menus (similar to TAB navigation) but the menu is not active
		//		(ie no dropdown) until an item is clicked.
		this.isActive = true;
		dojo.replaceClass(this.domNode, "dijitMenuActive", "dijitMenuPassive");
	},

	onOpen: function(/*Event*/ e){
		// summary:
		//		Callback when this menu is opened.
		//		This is called by the popup manager as notification that the menu
		//		was opened.
		// tags:
		//		private

		this.isShowingNow = true;
		this._markActive();
	},

	_markInactive: function(){
		// summary:
		//		Mark this menu's state as inactive.
		this.isActive = false; // don't do this in _onBlur since the state is pending-close until we get here
		dojo.replaceClass(this.domNode, "dijitMenuPassive", "dijitMenuActive");
	},

	onClose: function(){
		// summary:
		//		Callback when this menu is closed.
		//		This is called by the popup manager as notification that the menu
		//		was closed.
		// tags:
		//		private

		this._stopFocusTimer();
		this._markInactive();
		this.isShowingNow = false;
		this.parentMenu = null;
	},

	_closeChild: function(){
		// summary:
		//		Called when submenu is clicked or focus is lost.  Close hierarchy of menus.
		// tags:
		//		private
		this._stopPopupTimer();

		var fromItem = this.focusedChild && this.focusedChild.from_item;

		if(this.currentPopup){
			// If focus is on my child menu then move focus to me,
			// because IE doesn't like it when you display:none a node with focus
			if(dijit._curFocus && dojo.isDescendant(dijit._curFocus, this.currentPopup.domNode)){
				this.focusedChild.focusNode.focus();
			}
			// Close all popups that are open and descendants of this menu
			dijit.popup.close(this.currentPopup);
			this.currentPopup = null;
		}

		if(this.focusedChild){ // unhighlight the focused item
			this.focusedChild._setSelected(false);
			this.focusedChild._onUnhover();
			this.focusedChild = null;
		}
	},

	_onItemFocus: function(/*MenuItem*/ item){
		// summary:
		//		Called when child of this Menu gets focus from:
		//			1) clicking it
		//			2) tabbing into it
		//			3) being opened by a parent menu.
		//		This is not called just from mouse hover.
		if(this._hoveredChild && this._hoveredChild != item){
			this._hoveredChild._onUnhover(); // any previous mouse movement is trumped by focus selection
		}
	},

	_onBlur: function(){
		// summary:
		//		Called when focus is moved away from this Menu and it's submenus.
		// tags:
		//		protected
		this._cleanUp();
		this.inherited(arguments);
	},

	_cleanUp: function(){
		// summary:
		//		Called when the user is done with this menu.  Closes hierarchy of menus.
		// tags:
		//		private

		this._closeChild(); // don't call this.onClose since that's incorrect for MenuBar's that never close
		if(typeof this.isShowingNow == 'undefined'){ // non-popup menu doesn't call onClose
			this._markInactive();
		}
	}
});

dojo.declare("dijit.Menu",
	dijit._MenuBase,
	{
	// summary
	//		A context menu you can assign to multiple elements

	// TODO: most of the code in here is just for context menu (right-click menu)
	// support.  In retrospect that should have been a separate class (dijit.ContextMenu).
	// Split them for 2.0

	constructor: function(){
		this._bindings = [];
	},

	templateString: dojo.cache("dijit", "templates/Menu.html", "<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\" dojoAttachEvent=\"onkeypress:_onKeyPress\" cellspacing=\"0\">\n\t<tbody class=\"dijitReset\" dojoAttachPoint=\"containerNode\"></tbody>\n</table>\n"),

	baseClass: "dijitMenu",

	// targetNodeIds: [const] String[]
	//		Array of dom node ids of nodes to attach to.
	//		Fill this with nodeIds upon widget creation and it becomes context menu for those nodes.
	targetNodeIds: [],

	// contextMenuForWindow: [const] Boolean
	//		If true, right clicking anywhere on the window will cause this context menu to open.
	//		If false, must specify targetNodeIds.
	contextMenuForWindow: false,

	// leftClickToOpen: [const] Boolean
	//		If true, menu will open on left click instead of right click, similiar to a file menu.
	leftClickToOpen: false,

	// refocus: Boolean
	// 		When this menu closes, re-focus the element which had focus before it was opened.
	refocus: true,

	postCreate: function(){
		if(this.contextMenuForWindow){
			this.bindDomNode(dojo.body());
		}else{
			// TODO: should have _setTargetNodeIds() method to handle initialization and a possible
			// later set('targetNodeIds', ...) call.   There's also a problem that targetNodeIds[]
			// gets stale after calls to bindDomNode()/unBindDomNode() as it still is just the original list (see #9610)
			dojo.forEach(this.targetNodeIds, this.bindDomNode, this);
		}
		var k = dojo.keys, l = this.isLeftToRight();
		this._openSubMenuKey = l ? k.RIGHT_ARROW : k.LEFT_ARROW;
		this._closeSubMenuKey = l ? k.LEFT_ARROW : k.RIGHT_ARROW;
		this.connectKeyNavHandlers([k.UP_ARROW], [k.DOWN_ARROW]);
	},

	_onKeyPress: function(/*Event*/ evt){
		// summary:
		//		Handle keyboard based menu navigation.
		// tags:
		//		protected

		if(evt.ctrlKey || evt.altKey){ return; }

		switch(evt.charOrCode){
			case this._openSubMenuKey:
				this._moveToPopup(evt);
				dojo.stopEvent(evt);
				break;
			case this._closeSubMenuKey:
				if(this.parentMenu){
					if(this.parentMenu._isMenuBar){
						this.parentMenu.focusPrev();
					}else{
						this.onCancel(false);
					}
				}else{
					dojo.stopEvent(evt);
				}
				break;
		}
	},

	// thanks burstlib!
	_iframeContentWindow: function(/* HTMLIFrameElement */iframe_el){
		// summary:
		//		Returns the window reference of the passed iframe
		// tags:
		//		private
		var win = dojo.window.get(this._iframeContentDocument(iframe_el)) ||
			// Moz. TODO: is this available when defaultView isn't?
			this._iframeContentDocument(iframe_el)['__parent__'] ||
			(iframe_el.name && dojo.doc.frames[iframe_el.name]) || null;
		return win;	//	Window
	},

	_iframeContentDocument: function(/* HTMLIFrameElement */iframe_el){
		// summary:
		//		Returns a reference to the document object inside iframe_el
		// tags:
		//		protected
		var doc = iframe_el.contentDocument // W3
			|| (iframe_el.contentWindow && iframe_el.contentWindow.document) // IE
			|| (iframe_el.name && dojo.doc.frames[iframe_el.name] && dojo.doc.frames[iframe_el.name].document)
			|| null;
		return doc;	//	HTMLDocument
	},

	bindDomNode: function(/*String|DomNode*/ node){
		// summary:
		//		Attach menu to given node
		node = dojo.byId(node);

		var cn;	// Connect node

		// Support context menus on iframes.   Rather than binding to the iframe itself we need
		// to bind to the <body> node inside the iframe.
		if(node.tagName.toLowerCase() == "iframe"){
			var iframe = node,
				win = this._iframeContentWindow(iframe);
			cn = dojo.withGlobal(win, dojo.body);
		}else{
			
			// To capture these events at the top level, attach to <html>, not <body>.
			// Otherwise right-click context menu just doesn't work.
			cn = (node == dojo.body() ? dojo.doc.documentElement : node);
		}


		// "binding" is the object to track our connection to the node (ie, the parameter to bindDomNode())
		var binding = {
			node: node,
			iframe: iframe
		};

		// Save info about binding in _bindings[], and make node itself record index(+1) into
		// _bindings[] array.   Prefix w/_dijitMenu to avoid setting an attribute that may
		// start with a number, which fails on FF/safari.
		dojo.attr(node, "_dijitMenu" + this.id, this._bindings.push(binding));

		// Setup the connections to monitor click etc., unless we are connecting to an iframe which hasn't finished
		// loading yet, in which case we need to wait for the onload event first, and then connect
		// On linux Shift-F10 produces the oncontextmenu event, but on Windows it doesn't, so
		// we need to monitor keyboard events in addition to the oncontextmenu event.
		var doConnects = dojo.hitch(this, function(cn){
			return [
				// TODO: when leftClickToOpen is true then shouldn't space/enter key trigger the menu,
				// rather than shift-F10?
				dojo.connect(cn, this.leftClickToOpen ? "onclick" : "oncontextmenu", this, function(evt){
					// Schedule context menu to be opened unless it's already been scheduled from onkeydown handler
					dojo.stopEvent(evt);
					this._scheduleOpen(evt.target, iframe, {x: evt.pageX, y: evt.pageY});
				}),
				dojo.connect(cn, "onkeydown", this, function(evt){
					if(evt.shiftKey && evt.keyCode == dojo.keys.F10){
						dojo.stopEvent(evt);
						this._scheduleOpen(evt.target, iframe);	// no coords - open near target node
					}
				})
			];
		});
		binding.connects = cn ? doConnects(cn) : [];

		if(iframe){
			// Setup handler to [re]bind to the iframe when the contents are initially loaded,
			// and every time the contents change.
			// Need to do this b/c we are actually binding to the iframe's <body> node.
			// Note: can't use dojo.connect(), see #9609.

			binding.onloadHandler = dojo.hitch(this, function(){
				// want to remove old connections, but IE throws exceptions when trying to
				// access the <body> node because it's already gone, or at least in a state of limbo

				var win = this._iframeContentWindow(iframe);
					cn = dojo.withGlobal(win, dojo.body);
				binding.connects = doConnects(cn);
			});
			if(iframe.addEventListener){
				iframe.addEventListener("load", binding.onloadHandler, false);
			}else{
				iframe.attachEvent("onload", binding.onloadHandler);
			}
		}
	},

	unBindDomNode: function(/*String|DomNode*/ nodeName){
		// summary:
		//		Detach menu from given node

		var node;
		try{
			node = dojo.byId(nodeName);
		}catch(e){
			// On IE the dojo.byId() call will get an exception if the attach point was
			// the <body> node of an <iframe> that has since been reloaded (and thus the
			// <body> node is in a limbo state of destruction.
			return;
		}

		// node["_dijitMenu" + this.id] contains index(+1) into my _bindings[] array
		var attrName = "_dijitMenu" + this.id;
		if(node && dojo.hasAttr(node, attrName)){
			var bid = dojo.attr(node, attrName)-1, b = this._bindings[bid];
			dojo.forEach(b.connects, dojo.disconnect);

			// Remove listener for iframe onload events
			var iframe = b.iframe;
			if(iframe){
				if(iframe.removeEventListener){
					iframe.removeEventListener("load", b.onloadHandler, false);
				}else{
					iframe.detachEvent("onload", b.onloadHandler);
				}
			}

			dojo.removeAttr(node, attrName);
			delete this._bindings[bid];
		}
	},

	_scheduleOpen: function(/*DomNode?*/ target, /*DomNode?*/ iframe, /*Object?*/ coords){
		// summary:
		//		Set timer to display myself.  Using a timer rather than displaying immediately solves
		//		two problems:
		//
		//		1. IE: without the delay, focus work in "open" causes the system
		//		context menu to appear in spite of stopEvent.
		//
		//		2. Avoid double-shows on linux, where shift-F10 generates an oncontextmenu event
		//		even after a dojo.stopEvent(e).  (Shift-F10 on windows doesn't generate the
		//		oncontextmenu event.)

		if(!this._openTimer){
			this._openTimer = setTimeout(dojo.hitch(this, function(){
				delete this._openTimer;
				this._openMyself({
					target: target,
					iframe: iframe,
					coords: coords
				});
			}), 1);
		}
	},

	_openMyself: function(args){
		// summary:
		//		Internal function for opening myself when the user does a right-click or something similar.
		// args:
		//		This is an Object containing:
		//		* target:
		//			The node that is being clicked
		//		* iframe:
		//			If an <iframe> is being clicked, iframe points to that iframe
		//		* coords:
		//			Put menu at specified x/y position in viewport, or if iframe is
		//			specified, then relative to iframe.
		//
		//		_openMyself() formerly took the event object, and since various code references
		//		evt.target (after connecting to _openMyself()), using an Object for parameters
		//		(so that old code still works).

		var target = args.target,
			iframe = args.iframe,
			coords = args.coords;

		// Get coordinates to open menu, either at specified (mouse) position or (if triggered via keyboard)
		// then near the node the menu is assigned to.
		if(coords){
			if(iframe){
				// Specified coordinates are on <body> node of an <iframe>, convert to match main document
				var od = target.ownerDocument,
					ifc = dojo.position(iframe, true),
					win = this._iframeContentWindow(iframe),
					scroll = dojo.withGlobal(win, "_docScroll", dojo);
	
				var cs = dojo.getComputedStyle(iframe),
					tp = dojo._toPixelValue,
					left = (dojo.isIE && dojo.isQuirks ? 0 : tp(iframe, cs.paddingLeft)) + (dojo.isIE && dojo.isQuirks ? tp(iframe, cs.borderLeftWidth) : 0),
					top = (dojo.isIE && dojo.isQuirks ? 0 : tp(iframe, cs.paddingTop)) + (dojo.isIE && dojo.isQuirks ? tp(iframe, cs.borderTopWidth) : 0);

				coords.x += ifc.x + left - scroll.x;
				coords.y += ifc.y + top - scroll.y;
			}
		}else{
			coords = dojo.position(target, true);
			coords.x += 10;
			coords.y += 10;
		}

		var self=this;
		var savedFocus = dijit.getFocus(this);
		function closeAndRestoreFocus(){
			// user has clicked on a menu or popup
			if(self.refocus){
				dijit.focus(savedFocus);
			}
			dijit.popup.close(self);
		}
		dijit.popup.open({
			popup: this,
			x: coords.x,
			y: coords.y,
			onExecute: closeAndRestoreFocus,
			onCancel: closeAndRestoreFocus,
			orient: this.isLeftToRight() ? 'L' : 'R'
		});
		this.focus();

		this._onBlur = function(){
			this.inherited('_onBlur', arguments);
			// Usually the parent closes the child widget but if this is a context
			// menu then there is no parent
			dijit.popup.close(this);
			// don't try to restore focus; user has clicked another part of the screen
			// and set focus there
		};
	},

	uninitialize: function(){
 		dojo.forEach(this._bindings, function(b){ if(b){ this.unBindDomNode(b.node); } }, this);
 		this.inherited(arguments);
	}
}
);

}

if(!dojo._hasResource["dijit.layout.TabController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.TabController"] = true;
dojo.provide("dijit.layout.TabController");






// Menu is used for an accessible close button, would be nice to have a lighter-weight solution


dojo.declare("dijit.layout.TabController",
	dijit.layout.StackController,
{
	// summary:
	// 		Set of tabs (the things with titles and a close button, that you click to show a tab panel).
	//		Used internally by `dijit.layout.TabContainer`.
	// description:
	//		Lets the user select the currently shown pane in a TabContainer or StackContainer.
	//		TabController also monitors the TabContainer, and whenever a pane is
	//		added or deleted updates itself accordingly.
	// tags:
	//		private

	templateString: "<div role='tablist' dojoAttachEvent='onkeypress:onkeypress'></div>",

	// tabPosition: String
	//		Defines where tabs go relative to the content.
	//		"top", "bottom", "left-h", "right-h"
	tabPosition: "top",

	// buttonWidget: String
	//		The name of the tab widget to create to correspond to each page
	buttonWidget: "dijit.layout._TabButton",

	_rectifyRtlTabList: function(){
		// summary:
		//		For left/right TabContainer when page is RTL mode, rectify the width of all tabs to be equal, otherwise the tab widths are different in IE

		if(0 >= this.tabPosition.indexOf('-h')){ return; }
		if(!this.pane2button){ return; }

		var maxWidth = 0;
		for(var pane in this.pane2button){
			var ow = this.pane2button[pane].innerDiv.scrollWidth;
			maxWidth = Math.max(maxWidth, ow);
		}
		//unify the length of all the tabs
		for(pane in this.pane2button){
			this.pane2button[pane].innerDiv.style.width = maxWidth + 'px';
		}
	}
});

dojo.declare("dijit.layout._TabButton",
	dijit.layout._StackButton,
	{
	// summary:
	//		A tab (the thing you click to select a pane).
	// description:
	//		Contains the title of the pane, and optionally a close-button to destroy the pane.
	//		This is an internal widget and should not be instantiated directly.
	// tags:
	//		private

	// baseClass: String
	//		The CSS class applied to the domNode.
	baseClass: "dijitTab",

	// Apply dijitTabCloseButtonHover when close button is hovered
	cssStateNodes: {
		closeNode: "dijitTabCloseButton"
	},

	templateString: dojo.cache("dijit.layout", "templates/_TabButton.html", "<div role=\"presentation\" dojoAttachPoint=\"titleNode\" dojoAttachEvent='onclick:onClick'>\n    <div role=\"presentation\" class='dijitTabInnerDiv' dojoAttachPoint='innerDiv'>\n        <div role=\"presentation\" class='dijitTabContent' dojoAttachPoint='tabContent'>\n        \t<div role=\"presentation\" dojoAttachPoint='focusNode'>\n\t\t        <img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitTabButtonIcon\" dojoAttachPoint='iconNode' />\n\t\t        <span dojoAttachPoint='containerNode' class='tabLabel'></span>\n\t\t        <span class=\"dijitInline dijitTabCloseButton dijitTabCloseIcon\" dojoAttachPoint='closeNode'\n\t\t        \t\tdojoAttachEvent='onclick: onClickCloseButton' role=\"presentation\">\n\t\t            <span dojoAttachPoint='closeText' class='dijitTabCloseText'>[x]</span\n\t\t        ></span>\n\t\t\t</div>\n        </div>\n    </div>\n</div>\n"),

	// Override _FormWidget.scrollOnFocus.
	// Don't scroll the whole tab container into view when the button is focused.
	scrollOnFocus: false,

	buildRendering: function(){
		this.inherited(arguments);

		dojo.setSelectable(this.containerNode, false);
	},

	startup: function(){
		this.inherited(arguments);
		var n = this.domNode;

		// Required to give IE6 a kick, as it initially hides the
		// tabs until they are focused on.
		setTimeout(function(){
			n.className = n.className;
		}, 1);
	},

	_setCloseButtonAttr: function(/*Boolean*/ disp){
		// summary:
		//		Hide/show close button
		this._set("closeButton", disp);
		dojo.toggleClass(this.innerDiv, "dijitClosable", disp);
		this.closeNode.style.display = disp ? "" : "none";
		if(disp){
			var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
			if(this.closeNode){
				dojo.attr(this.closeNode,"title", _nlsResources.itemClose);
			}
			// add context menu onto title button
			var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
			this._closeMenu = new dijit.Menu({
				id: this.id+"_Menu",
				dir: this.dir,
				lang: this.lang,
				targetNodeIds: [this.domNode]
			});

			this._closeMenu.addChild(new dijit.MenuItem({
				label: _nlsResources.itemClose,
				dir: this.dir,
				lang: this.lang,
				onClick: dojo.hitch(this, "onClickCloseButton")
			}));
		}else{
			if(this._closeMenu){
				this._closeMenu.destroyRecursive();
				delete this._closeMenu;
			}
		}
	},
	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for set('label', ...) to work.
		// description:
		//		takes an HTML string.
		//		Inherited ToggleButton implementation will Set the label (text) of the button;
		//		Need to set the alt attribute of icon on tab buttons if no label displayed
		this.inherited(arguments);
		if(this.showLabel == false && !this.params.title){
			this.iconNode.alt = dojo.trim(this.containerNode.innerText || this.containerNode.textContent || '');
		}
	},

	destroy: function(){
		if(this._closeMenu){
			this._closeMenu.destroyRecursive();
			delete this._closeMenu;
		}
		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dijit.layout.ScrollingTabController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.ScrollingTabController"] = true;
dojo.provide("dijit.layout.ScrollingTabController");






dojo.declare("dijit.layout.ScrollingTabController",
	dijit.layout.TabController,
	{
	// summary:
	//		Set of tabs with left/right arrow keys and a menu to switch between tabs not
	//		all fitting on a single row.
	//		Works only for horizontal tabs (either above or below the content, not to the left
	//		or right).
	// tags:
	//		private

	templateString: dojo.cache("dijit.layout", "templates/ScrollingTabController.html", "<div class=\"dijitTabListContainer-${tabPosition}\" style=\"visibility:hidden\">\n\t<div dojoType=\"dijit.layout._ScrollingTabControllerMenuButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_menuBtn\" containerId=\"${containerId}\" iconClass=\"dijitTabStripMenuIcon\"\n\t\t\tdropDownPosition=\"below-alt, above-alt\"\n\t\t\tdojoAttachPoint=\"_menuBtn\" showLabel=false>&#9660;</div>\n\t<div dojoType=\"dijit.layout._ScrollingTabControllerButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_leftBtn\" iconClass=\"dijitTabStripSlideLeftIcon\"\n\t\t\tdojoAttachPoint=\"_leftBtn\" dojoAttachEvent=\"onClick: doSlideLeft\" showLabel=false>&#9664;</div>\n\t<div dojoType=\"dijit.layout._ScrollingTabControllerButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_rightBtn\" iconClass=\"dijitTabStripSlideRightIcon\"\n\t\t\tdojoAttachPoint=\"_rightBtn\" dojoAttachEvent=\"onClick: doSlideRight\" showLabel=false>&#9654;</div>\n\t<div class='dijitTabListWrapper' dojoAttachPoint='tablistWrapper'>\n\t\t<div role='tablist' dojoAttachEvent='onkeypress:onkeypress'\n\t\t\t\tdojoAttachPoint='containerNode' class='nowrapTabStrip'></div>\n\t</div>\n</div>\n"),

	// useMenu: [const] Boolean
	//		True if a menu should be used to select tabs when they are too
	//		wide to fit the TabContainer, false otherwise.
	useMenu: true,

	// useSlider: [const] Boolean
	//		True if a slider should be used to select tabs when they are too
	//		wide to fit the TabContainer, false otherwise.
	useSlider: true,

	// tabStripClass: [const] String
	//		The css class to apply to the tab strip, if it is visible.
	tabStripClass: "",

	widgetsInTemplate: true,

	// _minScroll: Number
	//		The distance in pixels from the edge of the tab strip which,
	//		if a scroll animation is less than, forces the scroll to
	//		go all the way to the left/right.
	_minScroll: 5,

	attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		"class": "containerNode"
	}),

	buildRendering: function(){
		this.inherited(arguments);
		var n = this.domNode;

		this.scrollNode = this.tablistWrapper;
		this._initButtons();

		if(!this.tabStripClass){
			this.tabStripClass = "dijitTabContainer" +
				this.tabPosition.charAt(0).toUpperCase() +
				this.tabPosition.substr(1).replace(/-.*/, "") +
				"None";
			dojo.addClass(n, "tabStrip-disabled")
		}

		dojo.addClass(this.tablistWrapper, this.tabStripClass);
	},

	onStartup: function(){
		this.inherited(arguments);

		// Do not show the TabController until the related
		// StackController has added it's children.  This gives
		// a less visually jumpy instantiation.
		dojo.style(this.domNode, "visibility", "visible");
		this._postStartup = true;
	},

	onAddChild: function(page, insertIndex){
		this.inherited(arguments);

		// changes to the tab button label or iconClass will have changed the width of the
		// buttons, so do a resize
		dojo.forEach(["label", "iconClass"], function(attr){
			this.pane2watches[page.id].push(
				this.pane2button[page.id].watch(attr, dojo.hitch(this, function(name, oldValue, newValue){
					if(this._postStartup && this._dim){
						this.resize(this._dim);
					}
				}))
			);
		}, this);

		// Increment the width of the wrapper when a tab is added
		// This makes sure that the buttons never wrap.
		// The value 200 is chosen as it should be bigger than most
		// Tab button widths.
		dojo.style(this.containerNode, "width",
			(dojo.style(this.containerNode, "width") + 200) + "px");
	},

	onRemoveChild: function(page, insertIndex){
		// null out _selectedTab because we are about to delete that dom node
		var button = this.pane2button[page.id];
		if(this._selectedTab === button.domNode){
			this._selectedTab = null;
		}

		this.inherited(arguments);
	},

	_initButtons: function(){
		// summary:
		//		Creates the buttons used to scroll to view tabs that
		//		may not be visible if the TabContainer is too narrow.

		// Make a list of the buttons to display when the tab labels become
		// wider than the TabContainer, and hide the other buttons.
		// Also gets the total width of the displayed buttons.
		this._btnWidth = 0;
		this._buttons = dojo.query("> .tabStripButton", this.domNode).filter(function(btn){
			if((this.useMenu && btn == this._menuBtn.domNode) ||
				(this.useSlider && (btn == this._rightBtn.domNode || btn == this._leftBtn.domNode))){
				this._btnWidth += dojo._getMarginSize(btn).w;
				return true;
			}else{
				dojo.style(btn, "display", "none");
				return false;
			}
		}, this);
	},

	_getTabsWidth: function(){
		var children = this.getChildren();
		if(children.length){
			var leftTab = children[this.isLeftToRight() ? 0 : children.length - 1].domNode,
				rightTab = children[this.isLeftToRight() ? children.length - 1 : 0].domNode;
			return rightTab.offsetLeft + dojo.style(rightTab, "width") - leftTab.offsetLeft;
		}else{
			return 0;
		}
	},

	_enableBtn: function(width){
		// summary:
		//		Determines if the tabs are wider than the width of the TabContainer, and
		//		thus that we need to display left/right/menu navigation buttons.
		var tabsWidth = this._getTabsWidth();
		width = width || dojo.style(this.scrollNode, "width");
		return tabsWidth > 0 && width < tabsWidth;
	},

	resize: function(dim){
		// summary:
		//		Hides or displays the buttons used to scroll the tab list and launch the menu
		//		that selects tabs.

		if(this.domNode.offsetWidth == 0){
			return;
		}

		// Save the dimensions to be used when a child is renamed.
		this._dim = dim;

		// Set my height to be my natural height (tall enough for one row of tab labels),
		// and my content-box width based on margin-box width specified in dim parameter.
		// But first reset scrollNode.height in case it was set by layoutChildren() call
		// in a previous run of this method.
		this.scrollNode.style.height = "auto";
		this._contentBox = dijit.layout.marginBox2contentBox(this.domNode, {h: 0, w: dim.w});
		this._contentBox.h = this.scrollNode.offsetHeight;
		dojo.contentBox(this.domNode, this._contentBox);

		// Show/hide the left/right/menu navigation buttons depending on whether or not they
		// are needed.
		var enable = this._enableBtn(this._contentBox.w);
		this._buttons.style("display", enable ? "" : "none");

		// Position and size the navigation buttons and the tablist
		this._leftBtn.layoutAlign = "left";
		this._rightBtn.layoutAlign = "right";
		this._menuBtn.layoutAlign = this.isLeftToRight() ? "right" : "left";
		dijit.layout.layoutChildren(this.domNode, this._contentBox,
			[this._menuBtn, this._leftBtn, this._rightBtn, {domNode: this.scrollNode, layoutAlign: "client"}]);

		// set proper scroll so that selected tab is visible
		if(this._selectedTab){
			if(this._anim && this._anim.status() == "playing"){
				this._anim.stop();
			}
			var w = this.scrollNode,
				sl = this._convertToScrollLeft(this._getScrollForSelectedTab());
			w.scrollLeft = sl;
		}

		// Enable/disabled left right buttons depending on whether or not user can scroll to left or right
		this._setButtonClass(this._getScroll());
		
		this._postResize = true;
	},

	_getScroll: function(){
		// summary:
		//		Returns the current scroll of the tabs where 0 means
		//		"scrolled all the way to the left" and some positive number, based on #
		//		of pixels of possible scroll (ex: 1000) means "scrolled all the way to the right"
		var sl = (this.isLeftToRight() || dojo.isIE < 8 || (dojo.isIE && dojo.isQuirks) || dojo.isWebKit) ? this.scrollNode.scrollLeft :
				dojo.style(this.containerNode, "width") - dojo.style(this.scrollNode, "width")
					 + (dojo.isIE == 8 ? -1 : 1) * this.scrollNode.scrollLeft;
		return sl;
	},

	_convertToScrollLeft: function(val){
		// summary:
		//		Given a scroll value where 0 means "scrolled all the way to the left"
		//		and some positive number, based on # of pixels of possible scroll (ex: 1000)
		//		means "scrolled all the way to the right", return value to set this.scrollNode.scrollLeft
		//		to achieve that scroll.
		//
		//		This method is to adjust for RTL funniness in various browsers and versions.
		if(this.isLeftToRight() || dojo.isIE < 8 || (dojo.isIE && dojo.isQuirks) || dojo.isWebKit){
			return val;
		}else{
			var maxScroll = dojo.style(this.containerNode, "width") - dojo.style(this.scrollNode, "width");
			return (dojo.isIE == 8 ? -1 : 1) * (val - maxScroll);
		}
	},

	onSelectChild: function(/*dijit._Widget*/ page){
		// summary:
		//		Smoothly scrolls to a tab when it is selected.

		var tab = this.pane2button[page.id];
		if(!tab || !page){return;}

		// Scroll to the selected tab, except on startup, when scrolling is handled in resize()
		var node = tab.domNode;
		if(this._postResize && node != this._selectedTab){
			this._selectedTab = node;

			var sl = this._getScroll();

			if(sl > node.offsetLeft ||
					sl + dojo.style(this.scrollNode, "width") <
					node.offsetLeft + dojo.style(node, "width")){
				this.createSmoothScroll().play();
			}
		}

		this.inherited(arguments);
	},

	_getScrollBounds: function(){
		// summary:
		//		Returns the minimum and maximum scroll setting to show the leftmost and rightmost
		//		tabs (respectively)
		var children = this.getChildren(),
			scrollNodeWidth = dojo.style(this.scrollNode, "width"),		// about 500px
			containerWidth = dojo.style(this.containerNode, "width"),	// 50,000px
			maxPossibleScroll = containerWidth - scrollNodeWidth,	// scrolling until right edge of containerNode visible
			tabsWidth = this._getTabsWidth();

		if(children.length && tabsWidth > scrollNodeWidth){
			// Scrolling should happen
			return {
				min: this.isLeftToRight() ? 0 : children[children.length-1].domNode.offsetLeft,
				max: this.isLeftToRight() ?
					(children[children.length-1].domNode.offsetLeft + dojo.style(children[children.length-1].domNode, "width")) - scrollNodeWidth :
					maxPossibleScroll
			};
		}else{
			// No scrolling needed, all tabs visible, we stay either scrolled to far left or far right (depending on dir)
			var onlyScrollPosition = this.isLeftToRight() ? 0 : maxPossibleScroll;
			return {
				min: onlyScrollPosition,
				max: onlyScrollPosition
			};
		}
	},

	_getScrollForSelectedTab: function(){
		// summary:
		//		Returns the scroll value setting so that the selected tab
		//		will appear in the center
		var w = this.scrollNode,
			n = this._selectedTab,
			scrollNodeWidth = dojo.style(this.scrollNode, "width"),
			scrollBounds = this._getScrollBounds();

		// TODO: scroll minimal amount (to either right or left) so that
		// selected tab is fully visible, and just return if it's already visible?
		var pos = (n.offsetLeft + dojo.style(n, "width")/2) - scrollNodeWidth/2;
		pos = Math.min(Math.max(pos, scrollBounds.min), scrollBounds.max);

		// TODO:
		// If scrolling close to the left side or right side, scroll
		// all the way to the left or right.  See this._minScroll.
		// (But need to make sure that doesn't scroll the tab out of view...)
		return pos;
	},

	createSmoothScroll: function(x){
		// summary:
		//		Creates a dojo._Animation object that smoothly scrolls the tab list
		//		either to a fixed horizontal pixel value, or to the selected tab.
		// description:
		//		If an number argument is passed to the function, that horizontal
		//		pixel position is scrolled to.  Otherwise the currently selected
		//		tab is scrolled to.
		// x: Integer?
		//		An optional pixel value to scroll to, indicating distance from left.

		// Calculate position to scroll to
		if(arguments.length > 0){
			// position specified by caller, just make sure it's within bounds
			var scrollBounds = this._getScrollBounds();
			x = Math.min(Math.max(x, scrollBounds.min), scrollBounds.max);
		}else{
			// scroll to center the current tab
			x = this._getScrollForSelectedTab();
		}

		if(this._anim && this._anim.status() == "playing"){
			this._anim.stop();
		}

		var self = this,
			w = this.scrollNode,
			anim = new dojo._Animation({
				beforeBegin: function(){
					if(this.curve){ delete this.curve; }
					var oldS = w.scrollLeft,
						newS = self._convertToScrollLeft(x);
					anim.curve = new dojo._Line(oldS, newS);
				},
				onAnimate: function(val){
					w.scrollLeft = val;
				}
			});
		this._anim = anim;

		// Disable/enable left/right buttons according to new scroll position
		this._setButtonClass(x);

		return anim; // dojo._Animation
	},

	_getBtnNode: function(/*Event*/ e){
		// summary:
		//		Gets a button DOM node from a mouse click event.
		// e:
		//		The mouse click event.
		var n = e.target;
		while(n && !dojo.hasClass(n, "tabStripButton")){
			n = n.parentNode;
		}
		return n;
	},

	doSlideRight: function(/*Event*/ e){
		// summary:
		//		Scrolls the menu to the right.
		// e:
		//		The mouse click event.
		this.doSlide(1, this._getBtnNode(e));
	},

	doSlideLeft: function(/*Event*/ e){
		// summary:
		//		Scrolls the menu to the left.
		// e:
		//		The mouse click event.
		this.doSlide(-1,this._getBtnNode(e));
	},

	doSlide: function(/*Number*/ direction, /*DomNode*/ node){
		// summary:
		//		Scrolls the tab list to the left or right by 75% of the widget width.
		// direction:
		//		If the direction is 1, the widget scrolls to the right, if it is
		//		-1, it scrolls to the left.

		if(node && dojo.hasClass(node, "dijitTabDisabled")){return;}

		var sWidth = dojo.style(this.scrollNode, "width");
		var d = (sWidth * 0.75) * direction;

		var to = this._getScroll() + d;

		this._setButtonClass(to);

		this.createSmoothScroll(to).play();
	},

	_setButtonClass: function(/*Number*/ scroll){
		// summary:
		//		Disables the left scroll button if the tabs are scrolled all the way to the left,
		//		or the right scroll button in the opposite case.
		// scroll: Integer
		//		amount of horizontal scroll

		var scrollBounds = this._getScrollBounds();
		this._leftBtn.set("disabled", scroll <= scrollBounds.min);
		this._rightBtn.set("disabled", scroll >= scrollBounds.max);
	}
});


dojo.declare("dijit.layout._ScrollingTabControllerButtonMixin", null, {
	baseClass: "dijitTab tabStripButton",

	templateString: dojo.cache("dijit.layout", "templates/_ScrollingTabControllerButton.html", "<div dojoAttachEvent=\"onclick:_onButtonClick\">\n\t<div role=\"presentation\" class=\"dijitTabInnerDiv\" dojoattachpoint=\"innerDiv,focusNode\">\n\t\t<div role=\"presentation\" class=\"dijitTabContent dijitButtonContents\" dojoattachpoint=\"tabContent\">\n\t\t\t<img role=\"presentation\" alt=\"\" src=\"${_blankGif}\" class=\"dijitTabStripIcon\" dojoAttachPoint=\"iconNode\"/>\n\t\t\t<span dojoAttachPoint=\"containerNode,titleNode\" class=\"dijitButtonText\"></span>\n\t\t</div>\n\t</div>\n</div>\n"),

		// Override inherited tabIndex: 0 from dijit.form.Button, because user shouldn't be
		// able to tab to the left/right/menu buttons
	tabIndex: "",

	// Similarly, override FormWidget.isFocusable() because clicking a button shouldn't focus it
	// either (this override avoids focus() call in FormWidget.js)
	isFocusable: function(){ return false; }
});

dojo.declare("dijit.layout._ScrollingTabControllerButton",
	[dijit.form.Button, dijit.layout._ScrollingTabControllerButtonMixin]);

dojo.declare(
	"dijit.layout._ScrollingTabControllerMenuButton",
	[dijit.form.Button, dijit._HasDropDown, dijit.layout._ScrollingTabControllerButtonMixin],
{
	// id of the TabContainer itself
	containerId: "",

	// -1 so user can't tab into the button, but so that button can still be focused programatically.
	// Because need to move focus to the button (or somewhere) before the menu is hidden or IE6 will crash.
	tabIndex: "-1",

	isLoaded: function(){
		// recreate menu every time, in case the TabContainer's list of children (or their icons/labels) have changed
		return false;
	},

	loadDropDown: function(callback){
		this.dropDown = new dijit.Menu({
			id: this.containerId + "_menu",
			dir: this.dir,
			lang: this.lang
		});
		var container = dijit.byId(this.containerId);
		dojo.forEach(container.getChildren(), function(page){
			var menuItem = new dijit.MenuItem({
				id: page.id + "_stcMi",
				label: page.title,
				iconClass: page.iconClass,
				dir: page.dir,
				lang: page.lang,
				onClick: function(){
					container.selectChild(page);
				}
			});
			this.dropDown.addChild(menuItem);
		}, this);
		callback();
	},

	closeDropDown: function(/*Boolean*/ focus){
		this.inherited(arguments);
		if(this.dropDown){
			this.dropDown.destroyRecursive();
			delete this.dropDown;
		}
	}
});

}

if(!dojo._hasResource["dijit.layout.TabContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.TabContainer"] = true;
dojo.provide("dijit.layout.TabContainer");





dojo.declare("dijit.layout.TabContainer",
	dijit.layout._TabContainerBase,
	{
		// summary:
		//		A Container with tabs to select each child (only one of which is displayed at a time).
		// description:
		//		A TabContainer is a container that has multiple panes, but shows only
		//		one pane at a time.  There are a set of tabs corresponding to each pane,
		//		where each tab has the name (aka title) of the pane, and optionally a close button.

		// useMenu: [const] Boolean
		//		True if a menu should be used to select tabs when they are too
		//		wide to fit the TabContainer, false otherwise.
		useMenu: true,

		// useSlider: [const] Boolean
		//		True if a slider should be used to select tabs when they are too
		//		wide to fit the TabContainer, false otherwise.
		useSlider: true,

		// controllerWidget: String
		//		An optional parameter to override the widget used to display the tab labels
		controllerWidget: "",

		_makeController: function(/*DomNode*/ srcNode){
			// summary:
			//		Instantiate tablist controller widget and return reference to it.
			//		Callback from _TabContainerBase.postCreate().
			// tags:
			//		protected extension

			var cls = this.baseClass + "-tabs" + (this.doLayout ? "" : " dijitTabNoLayout"),
				TabController = dojo.getObject(this.controllerWidget);

			return new TabController({
				id: this.id + "_tablist",
				dir: this.dir,
				lang: this.lang,
				tabPosition: this.tabPosition,
				doLayout: this.doLayout,
				containerId: this.id,
				"class": cls,
				nested: this.nested,
				useMenu: this.useMenu,
				useSlider: this.useSlider,
				tabStripClass: this.tabStrip ? this.baseClass + (this.tabStrip ? "":"No") + "Strip": null
			}, srcNode);
		},

		postMixInProperties: function(){
			this.inherited(arguments);

			// Scrolling controller only works for horizontal non-nested tabs
			if(!this.controllerWidget){
				this.controllerWidget = (this.tabPosition == "top" || this.tabPosition == "bottom") && !this.nested ?
							"dijit.layout.ScrollingTabController" : "dijit.layout.TabController";
			}
		}
});

}

if(!dojo._hasResource["dijit.layout.BorderContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.BorderContainer"] = true;
dojo.provide("dijit.layout.BorderContainer");





dojo.declare(
	"dijit.layout.BorderContainer",
	dijit.layout._LayoutWidget,
{
	// summary:
	//		Provides layout in up to 5 regions, a mandatory center with optional borders along its 4 sides.
	//
	// description:
	//		A BorderContainer is a box with a specified size, such as style="width: 500px; height: 500px;",
	//		that contains a child widget marked region="center" and optionally children widgets marked
	//		region equal to "top", "bottom", "leading", "trailing", "left" or "right".
	//		Children along the edges will be laid out according to width or height dimensions and may
	//		include optional splitters (splitter="true") to make them resizable by the user.  The remaining
	//		space is designated for the center region.
	//
	//		The outer size must be specified on the BorderContainer node.  Width must be specified for the sides
	//		and height for the top and bottom, respectively.  No dimensions should be specified on the center;
	//		it will fill the remaining space.  Regions named "leading" and "trailing" may be used just like
	//		"left" and "right" except that they will be reversed in right-to-left environments.
	//
	//		For complex layouts, multiple children can be specified for a single region.   In this case, the
	//		layoutPriority flag on the children determines which child is closer to the edge (low layoutPriority)
	//		and which child is closer to the center (high layoutPriority).   layoutPriority can also be used
	//		instead of the design attribute to conrol layout precedence of horizontal vs. vertical panes.
	// example:
	// |	<div dojoType="dijit.layout.BorderContainer" design="sidebar" gutters="false"
	// |            style="width: 400px; height: 300px;">
	// |		<div dojoType="dijit.layout.ContentPane" region="top">header text</div>
	// |		<div dojoType="dijit.layout.ContentPane" region="right" splitter="true" style="width: 200px;">table of contents</div>
	// |		<div dojoType="dijit.layout.ContentPane" region="center">client area</div>
	// |	</div>

	// design: String
	//		Which design is used for the layout:
	//			- "headline" (default) where the top and bottom extend
	//				the full width of the container
	//			- "sidebar" where the left and right sides extend from top to bottom.
	design: "headline",

	// gutters: [const] Boolean
	//		Give each pane a border and margin.
	//		Margin determined by domNode.paddingLeft.
	//		When false, only resizable panes have a gutter (i.e. draggable splitter) for resizing.
	gutters: true,

	// liveSplitters: [const] Boolean
	//		Specifies whether splitters resize as you drag (true) or only upon mouseup (false)
	liveSplitters: true,

	// persist: Boolean
	//		Save splitter positions in a cookie.
	persist: false,

	baseClass: "dijitBorderContainer",

	// _splitterClass: String
	// 		Optional hook to override the default Splitter widget used by BorderContainer
	_splitterClass: "dijit.layout._Splitter",

	postMixInProperties: function(){
		// change class name to indicate that BorderContainer is being used purely for
		// layout (like LayoutContainer) rather than for pretty formatting.
		if(!this.gutters){
			this.baseClass += "NoGutter";
		}
		this.inherited(arguments);
	},

	startup: function(){
		if(this._started){ return; }
		dojo.forEach(this.getChildren(), this._setupChild, this);
		this.inherited(arguments);
	},

	_setupChild: function(/*dijit._Widget*/ child){
		// Override _LayoutWidget._setupChild().

		var region = child.region;
		if(region){
			this.inherited(arguments);

			dojo.addClass(child.domNode, this.baseClass+"Pane");

			var ltr = this.isLeftToRight();
			if(region == "leading"){ region = ltr ? "left" : "right"; }
			if(region == "trailing"){ region = ltr ? "right" : "left"; }

			// Create draggable splitter for resizing pane,
			// or alternately if splitter=false but BorderContainer.gutters=true then
			// insert dummy div just for spacing
			if(region != "center" && (child.splitter || this.gutters) && !child._splitterWidget){
				var _Splitter = dojo.getObject(child.splitter ? this._splitterClass : "dijit.layout._Gutter");
				var splitter = new _Splitter({
					id: child.id + "_splitter",
					container: this,
					child: child,
					region: region,
					live: this.liveSplitters
				});
				splitter.isSplitter = true;
				child._splitterWidget = splitter;

				dojo.place(splitter.domNode, child.domNode, "after");

				// Splitters aren't added as Contained children, so we need to call startup explicitly
				splitter.startup();
			}
			child.region = region;	// TODO: technically wrong since it overwrites "trailing" with "left" etc.
		}
	},

	layout: function(){
		// Implement _LayoutWidget.layout() virtual method.
		this._layoutChildren();
	},

	addChild: function(/*dijit._Widget*/ child, /*Integer?*/ insertIndex){
		// Override _LayoutWidget.addChild().
		this.inherited(arguments);
		if(this._started){
			this.layout(); //OPT
		}
	},

	removeChild: function(/*dijit._Widget*/ child){
		// Override _LayoutWidget.removeChild().

		var region = child.region;
		var splitter = child._splitterWidget
		if(splitter){
			splitter.destroy();
			delete child._splitterWidget;
		}
		this.inherited(arguments);
		
		if(this._started){
			this._layoutChildren();
		}
		// Clean up whatever style changes we made to the child pane.
		// Unclear how height and width should be handled.
		dojo.removeClass(child.domNode, this.baseClass+"Pane");
		dojo.style(child.domNode, {
			top: "auto",
			bottom: "auto",
			left: "auto",
			right: "auto",
			position: "static"
		});
		dojo.style(child.domNode, region == "top" || region == "bottom" ? "width" : "height", "auto");
	},

	getChildren: function(){
		// Override _LayoutWidget.getChildren() to only return real children, not the splitters.
		return dojo.filter(this.inherited(arguments), function(widget){
			return !widget.isSplitter;
		});
	},

	// TODO: remove in 2.0
	getSplitter: function(/*String*/region){
		// summary:
		//		Returns the widget responsible for rendering the splitter associated with region
		// tags:
		//		deprecated
		return dojo.filter(this.getChildren(), function(child){
			return child.region == region;
		})[0]._splitterWidget;
	},

	resize: function(newSize, currentSize){
		// Overrides _LayoutWidget.resize().

		// resetting potential padding to 0px to provide support for 100% width/height + padding
		// TODO: this hack doesn't respect the box model and is a temporary fix
		if(!this.cs || !this.pe){
			var node = this.domNode;
			this.cs = dojo.getComputedStyle(node);
			this.pe = dojo._getPadExtents(node, this.cs);
			this.pe.r = dojo._toPixelValue(node, this.cs.paddingRight);
			this.pe.b = dojo._toPixelValue(node, this.cs.paddingBottom);

			dojo.style(node, "padding", "0px");
		}

		this.inherited(arguments);
	},

	_layoutChildren: function(/*String?*/ changedChildId, /*Number?*/ changedChildSize){
		// summary:
		//		This is the main routine for setting size/position of each child.
		// description:
		//		With no arguments, measures the height of top/bottom panes, the width
		//		of left/right panes, and then sizes all panes accordingly.
		//
		//		With changedRegion specified (as "left", "top", "bottom", or "right"),
		//		it changes that region's width/height to changedRegionSize and
		//		then resizes other regions that were affected.
		// changedChildId:
		//		Id of the child which should be resized because splitter was dragged.
		// changedChildSize:
		//		The new width/height (in pixels) to make specified child

		if(!this._borderBox || !this._borderBox.h){
			// We are currently hidden, or we haven't been sized by our parent yet.
			// Abort.   Someone will resize us later.
			return;
		}

		// Generate list of wrappers of my children in the order that I want layoutChildren()
		// to process them (i.e. from the outside to the inside)
		var wrappers = dojo.map(this.getChildren(), function(child, idx){
			return {
				pane: child,
				weight: [
					child.region == "center" ? Infinity : 0,
					child.layoutPriority,
					(this.design == "sidebar" ? 1 : -1) * (/top|bottom/.test(child.region) ? 1 : -1),
					idx
				]
			};
		}, this);
		wrappers.sort(function(a, b){
			var aw = a.weight, bw = b.weight;
			for(var i=0; i<aw.length; i++){
				if(aw[i] != bw[i]){
					return aw[i] - bw[i];
				}
			}
			return 0;
		});

		// Make new list, combining the externally specified children with splitters and gutters
		var childrenAndSplitters = [];
		dojo.forEach(wrappers, function(wrapper){
			var pane = wrapper.pane;
			childrenAndSplitters.push(pane);
			if(pane._splitterWidget){
				childrenAndSplitters.push(pane._splitterWidget);
			}
		});

		// Compute the box in which to lay out my children
		var dim = {
			l: this.pe.l,
			t: this.pe.t,
			w: this._borderBox.w - this.pe.w,
			h: this._borderBox.h - this.pe.h
		};

		// Layout the children, possibly changing size due to a splitter drag
		dijit.layout.layoutChildren(this.domNode, dim, childrenAndSplitters,
			changedChildId, changedChildSize);
	},

	destroyRecursive: function(){
		// Destroy splitters first, while getChildren() still works
		dojo.forEach(this.getChildren(), function(child){
			var splitter = child._splitterWidget;
			if(splitter){
				splitter.destroy();
			}
			delete child._splitterWidget;
		});

		// Then destroy the real children, and myself
		this.inherited(arguments);
	}
});

// This argument can be specified for the children of a BorderContainer.
// Since any widget can be specified as a LayoutContainer child, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget, {
	// region: [const] String
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Values: "top", "bottom", "leading", "trailing", "left", "right", "center".
	//		See the `dijit.layout.BorderContainer` description for details.
	region: '',

	// layoutPriority: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Children with a higher layoutPriority will be placed closer to the BorderContainer center,
	//		between children with a lower layoutPriority.
	layoutPriority: 0,

	// splitter: [const] Boolean
	//		Parameter for child of `dijit.layout.BorderContainer` where region != "center".
	//		If true, enables user to resize the widget by putting a draggable splitter between
	//		this widget and the region=center widget.
	splitter: false,

	// minSize: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Specifies a minimum size (in pixels) for this widget when resized by a splitter.
	minSize: 0,

	// maxSize: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Specifies a maximum size (in pixels) for this widget when resized by a splitter.
	maxSize: Infinity
});

dojo.declare("dijit.layout._Splitter", [ dijit._Widget, dijit._Templated ],
{
	// summary:
	//		A draggable spacer between two items in a `dijit.layout.BorderContainer`.
	// description:
	//		This is instantiated by `dijit.layout.BorderContainer`.  Users should not
	//		create it directly.
	// tags:
	//		private

/*=====
 	// container: [const] dijit.layout.BorderContainer
 	//		Pointer to the parent BorderContainer
	container: null,

	// child: [const] dijit.layout._LayoutWidget
	//		Pointer to the pane associated with this splitter
	child: null,

	// region: [const] String
	//		Region of pane associated with this splitter.
	//		"top", "bottom", "left", "right".
	region: null,
=====*/

	// live: [const] Boolean
	//		If true, the child's size changes and the child widget is redrawn as you drag the splitter;
	//		otherwise, the size doesn't change until you drop the splitter (by mouse-up)
	live: true,

	templateString: '<div class="dijitSplitter" dojoAttachEvent="onkeypress:_onKeyPress,onmousedown:_startDrag,onmouseenter:_onMouse,onmouseleave:_onMouse" tabIndex="0" role="separator"><div class="dijitSplitterThumb"></div></div>',

	postMixInProperties: function(){
		this.inherited(arguments);

		this.horizontal = /top|bottom/.test(this.region);
		this._factor = /top|left/.test(this.region) ? 1 : -1;
		this._cookieName = this.container.id + "_" + this.region;
	},

	buildRendering: function(){
		this.inherited(arguments);

		dojo.addClass(this.domNode, "dijitSplitter" + (this.horizontal ? "H" : "V"));

		if(this.container.persist){
			// restore old size
			var persistSize = dojo.cookie(this._cookieName);
			if(persistSize){
				this.child.domNode.style[this.horizontal ? "height" : "width"] = persistSize;
			}
		}
	},

	_computeMaxSize: function(){
		// summary:
		//		Return the maximum size that my corresponding pane can be set to

		var dim = this.horizontal ? 'h' : 'w',
			childSize = dojo.marginBox(this.child.domNode)[dim],
			center = dojo.filter(this.container.getChildren(), function(child){ return child.region == "center";})[0],
			spaceAvailable = dojo.marginBox(center.domNode)[dim];	// can expand until center is crushed to 0

		return Math.min(this.child.maxSize, childSize + spaceAvailable);
	},

	_startDrag: function(e){
		if(!this.cover){
			this.cover = dojo.doc.createElement('div');
			dojo.addClass(this.cover, "dijitSplitterCover");
			dojo.place(this.cover, this.child.domNode, "after");
		}
		dojo.addClass(this.cover, "dijitSplitterCoverActive");

		// Safeguard in case the stop event was missed.  Shouldn't be necessary if we always get the mouse up.
		if(this.fake){ dojo.destroy(this.fake); }
		if(!(this._resize = this.live)){ //TODO: disable live for IE6?
			// create fake splitter to display at old position while we drag
			(this.fake = this.domNode.cloneNode(true)).removeAttribute("id");
			dojo.addClass(this.domNode, "dijitSplitterShadow");
			dojo.place(this.fake, this.domNode, "after");
		}
		dojo.addClass(this.domNode, "dijitSplitterActive dijitSplitter" + (this.horizontal ? "H" : "V") + "Active");
		if(this.fake){
			dojo.removeClass(this.fake, "dijitSplitterHover dijitSplitter" + (this.horizontal ? "H" : "V") + "Hover");
		}

		//Performance: load data info local vars for onmousevent function closure
		var factor = this._factor,
			isHorizontal = this.horizontal,
			axis = isHorizontal ? "pageY" : "pageX",
			pageStart = e[axis],
			splitterStyle = this.domNode.style,
			dim = isHorizontal ? 'h' : 'w',
			childStart = dojo.marginBox(this.child.domNode)[dim],
			max = this._computeMaxSize(),
			min = this.child.minSize || 20,
			region = this.region,
			splitterAttr = region == "top" || region == "bottom" ? "top" : "left",	// style attribute of splitter to adjust
			splitterStart = parseInt(splitterStyle[splitterAttr], 10),
			resize = this._resize,
			layoutFunc = dojo.hitch(this.container, "_layoutChildren", this.child.id),
			de = dojo.doc;

		this._handlers = (this._handlers || []).concat([
			dojo.connect(de, "onmousemove", this._drag = function(e, forceResize){
				var delta = e[axis] - pageStart,
					childSize = factor * delta + childStart,
					boundChildSize = Math.max(Math.min(childSize, max), min);

				if(resize || forceResize){
					layoutFunc(boundChildSize);
				}
				// TODO: setting style directly (usually) sets content box size, need to set margin box size
				splitterStyle[splitterAttr] = delta + splitterStart + factor*(boundChildSize - childSize) + "px";
			}),
			dojo.connect(de, "ondragstart", dojo.stopEvent),
			dojo.connect(dojo.body(), "onselectstart", dojo.stopEvent),
			dojo.connect(de, "onmouseup", this, "_stopDrag")
		]);
		dojo.stopEvent(e);
	},

	_onMouse: function(e){
		var o = (e.type == "mouseover" || e.type == "mouseenter");
		dojo.toggleClass(this.domNode, "dijitSplitterHover", o);
		dojo.toggleClass(this.domNode, "dijitSplitter" + (this.horizontal ? "H" : "V") + "Hover", o);
	},

	_stopDrag: function(e){
		try{
			if(this.cover){
				dojo.removeClass(this.cover, "dijitSplitterCoverActive");
			}
			if(this.fake){ dojo.destroy(this.fake); }
			dojo.removeClass(this.domNode, "dijitSplitterActive dijitSplitter"
				+ (this.horizontal ? "H" : "V") + "Active dijitSplitterShadow");
			this._drag(e); //TODO: redundant with onmousemove?
			this._drag(e, true);
		}finally{
			this._cleanupHandlers();
			delete this._drag;
		}

		if(this.container.persist){
			dojo.cookie(this._cookieName, this.child.domNode.style[this.horizontal ? "height" : "width"], {expires:365});
		}
	},

	_cleanupHandlers: function(){
		dojo.forEach(this._handlers, dojo.disconnect);
		delete this._handlers;
	},

	_onKeyPress: function(/*Event*/ e){
		// should we apply typematic to this?
		this._resize = true;
		var horizontal = this.horizontal;
		var tick = 1;
		var dk = dojo.keys;
		switch(e.charOrCode){
			case horizontal ? dk.UP_ARROW : dk.LEFT_ARROW:
				tick *= -1;
//				break;
			case horizontal ? dk.DOWN_ARROW : dk.RIGHT_ARROW:
				break;
			default:
//				this.inherited(arguments);
				return;
		}
		var childSize = dojo._getMarginSize(this.child.domNode)[ horizontal ? 'h' : 'w' ] + this._factor * tick;
		this.container._layoutChildren(this.child.id, Math.max(Math.min(childSize, this._computeMaxSize()), this.child.minSize));
		dojo.stopEvent(e);
	},

	destroy: function(){
		this._cleanupHandlers();
		delete this.child;
		delete this.container;
		delete this.cover;
		delete this.fake;
		this.inherited(arguments);
	}
});

dojo.declare("dijit.layout._Gutter", [dijit._Widget, dijit._Templated],
{
	// summary:
	// 		Just a spacer div to separate side pane from center pane.
	//		Basically a trick to lookup the gutter/splitter width from the theme.
	// description:
	//		Instantiated by `dijit.layout.BorderContainer`.  Users should not
	//		create directly.
	// tags:
	//		private

	templateString: '<div class="dijitGutter" role="presentation"></div>',

	postMixInProperties: function(){
		this.inherited(arguments);
		this.horizontal = /top|bottom/.test(this.region);
	},

	buildRendering: function(){
		this.inherited(arguments);
		dojo.addClass(this.domNode, "dijitGutter" + (this.horizontal ? "H" : "V"));
	}
});

}

if(!dojo._hasResource["dijit.form.CheckBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.CheckBox"] = true;
dojo.provide("dijit.form.CheckBox");



dojo.declare(
	"dijit.form.CheckBox",
	dijit.form.ToggleButton,
	{
		// summary:
		// 		Same as an HTML checkbox, but with fancy styling.
		//
		// description:
		//		User interacts with real html inputs.
		//		On onclick (which occurs by mouse click, space-bar, or
		//		using the arrow keys to switch the selected radio button),
		//		we update the state of the checkbox/radio.
		//
		//		There are two modes:
		//			1. High contrast mode
		//			2. Normal mode
		//
		//		In case 1, the regular html inputs are shown and used by the user.
		//		In case 2, the regular html inputs are invisible but still used by
		//		the user. They are turned quasi-invisible and overlay the background-image.

		templateString: dojo.cache("dijit.form", "templates/CheckBox.html", "<div class=\"dijit dijitReset dijitInline\" role=\"presentation\"\n\t><input\n\t \t${!nameAttrSetting} type=\"${type}\" ${checkedAttrSetting}\n\t\tclass=\"dijitReset dijitCheckBoxInput\"\n\t\tdojoAttachPoint=\"focusNode\"\n\t \tdojoAttachEvent=\"onclick:_onClick\"\n/></div>\n"),

		baseClass: "dijitCheckBox",

		// type: [private] String
		//		type attribute on <input> node.
		//		Overrides `dijit.form.Button.type`.  Users should not change this value.
		type: "checkbox",

		// value: String
		//		As an initialization parameter, equivalent to value field on normal checkbox
		//		(if checked, the value is passed as the value when form is submitted).
		//
		//		However, get('value') will return either the string or false depending on
		//		whether or not the checkbox is checked.
		//
		//		set('value', string) will check the checkbox and change the value to the
		//		specified string
		//
		//		set('value', boolean) will change the checked state.
		value: "on",

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,
		
		// the attributeMap should inherit from dijit.form._FormWidget.prototype.attributeMap
		// instead of ToggleButton as the icon mapping has no meaning for a CheckBox
		attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
			readOnly: "focusNode"
		}),

		_setReadOnlyAttr: function(/*Boolean*/ value){
			this._set("readOnly", value);
			dojo.attr(this.focusNode, 'readOnly', value);
			dijit.setWaiState(this.focusNode, "readonly", value);
		},

		_setValueAttr: function(/*String|Boolean*/ newValue, /*Boolean*/ priorityChange){
			// summary:
			//		Handler for value= attribute to constructor, and also calls to
			//		set('value', val).
			// description:
			//		During initialization, just saves as attribute to the <input type=checkbox>.
			//
			//		After initialization,
			//		when passed a boolean, controls whether or not the CheckBox is checked.
			//		If passed a string, changes the value attribute of the CheckBox (the one
			//		specified as "value" when the CheckBox was constructed (ex: <input
			//		dojoType="dijit.CheckBox" value="chicken">)
			if(typeof newValue == "string"){
				this._set("value", newValue);
				dojo.attr(this.focusNode, 'value', newValue);
				newValue = true;
			}
			if(this._created){
				this.set('checked', newValue, priorityChange);
			}
		},
		_getValueAttr: function(){
			// summary:
			//		Hook so get('value') works.
			// description:
			//		If the CheckBox is checked, returns the value attribute.
			//		Otherwise returns false.
			return (this.checked ? this.value : false);
		},

		// Override dijit.form.Button._setLabelAttr() since we don't even have a containerNode.
		// Normally users won't try to set label, except when CheckBox or RadioButton is the child of a dojox.layout.TabContainer
		_setLabelAttr: undefined,

		postMixInProperties: function(){
			if(this.value == ""){
				this.value = "on";
			}

			// Need to set initial checked state as part of template, so that form submit works.
			// dojo.attr(node, "checked", bool) doesn't work on IEuntil node has been attached
			// to <body>, see #8666
			this.checkedAttrSetting = this.checked ? "checked" : "";

			this.inherited(arguments);
		},

		 _fillContent: function(/*DomNode*/ source){
			// Override Button::_fillContent() since it doesn't make sense for CheckBox,
			// since CheckBox doesn't even have a container
		},

		reset: function(){
			// Override ToggleButton.reset()

			this._hasBeenBlurred = false;

			this.set('checked', this.params.checked || false);

			// Handle unlikely event that the <input type=checkbox> value attribute has changed
			this._set("value", this.params.value || "on");
			dojo.attr(this.focusNode, 'value', this.value);
		},

		_onFocus: function(){
			if(this.id){
				dojo.query("label[for='"+this.id+"']").addClass("dijitFocusedLabel");
			}
			this.inherited(arguments);
		},

		_onBlur: function(){
			if(this.id){
				dojo.query("label[for='"+this.id+"']").removeClass("dijitFocusedLabel");
			}
			this.inherited(arguments);
		},

		_onClick: function(/*Event*/ e){
			// summary:
			//		Internal function to handle click actions - need to check
			//		readOnly, since button no longer does that check.
			if(this.readOnly){
				dojo.stopEvent(e);
				return false;
			}
			return this.inherited(arguments);
		}
	}
);

dojo.declare(
	"dijit.form.RadioButton",
	dijit.form.CheckBox,
	{
		// summary:
		// 		Same as an HTML radio, but with fancy styling.

		type: "radio",
		baseClass: "dijitRadio",

		_setCheckedAttr: function(/*Boolean*/ value){
			// If I am being checked then have to deselect currently checked radio button
			this.inherited(arguments);
			if(!this._created){ return; }
			if(value){
				var _this = this;
				// search for radio buttons with the same name that need to be unchecked
				dojo.query("INPUT[type=radio]", this.focusNode.form || dojo.doc).forEach( // can't use name= since dojo.query doesn't support [] in the name
					function(inputNode){
						if(inputNode.name == _this.name && inputNode != _this.focusNode && inputNode.form == _this.focusNode.form){
							var widget = dijit.getEnclosingWidget(inputNode);
							if(widget && widget.checked){
								widget.set('checked', false);
							}
						}
					}
				);
			}
		},

		_clicked: function(/*Event*/ e){
			if(!this.checked){
				this.set('checked', true);
			}
		}
	}
);

}

if(!dojo._hasResource["dojo.cldr.supplemental"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cldr.supplemental"] = true;
dojo.provide("dojo.cldr.supplemental");


dojo.getObject("cldr.supplemental", true, dojo);

dojo.cldr.supplemental.getFirstDayOfWeek = function(/*String?*/locale){
// summary: Returns a zero-based index for first day of the week
// description:
//		Returns a zero-based index for first day of the week, as used by the local (Gregorian) calendar.
//		e.g. Sunday (returns 0), or Monday (returns 1)

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/firstDay
	var firstDay = {/*default is 1=Monday*/
		mv:5,
		ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,
		ly:6,ma:6,om:6,qa:6,sa:6,sd:6,so:6,sy:6,tn:6,ye:6,
		ar:0,as:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,
		il:0,'in':0,jm:0,jp:0,kg:0,kr:0,la:0,mh:0,mn:0,mo:0,mp:0,
		mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,
		vi:0,zw:0
// variant. do not use?		gb:0,
	};

	var country = dojo.cldr.supplemental._region(locale);
	var dow = firstDay[country];
	return (dow === undefined) ? 1 : dow; /*Number*/
};

dojo.cldr.supplemental._region = function(/*String?*/locale){
	locale = dojo.i18n.normalizeLocale(locale);
	var tags = locale.split('-');
	var region = tags[1];
	if(!region){
		// IE often gives language only (#2269)
		// Arbitrary mappings of language-only locales to a country:
		region = {de:"de", en:"us", es:"es", fi:"fi", fr:"fr", he:"il", hu:"hu", it:"it",
			ja:"jp", ko:"kr", nl:"nl", pt:"br", sv:"se", zh:"cn"}[tags[0]];
	}else if(region.length == 4){
		// The ISO 3166 country code is usually in the second position, unless a
		// 4-letter script is given. See http://www.ietf.org/rfc/rfc4646.txt
		region = tags[2];
	}
	return region;
};

dojo.cldr.supplemental.getWeekend = function(/*String?*/locale){
// summary: Returns a hash containing the start and end days of the weekend
// description:
//		Returns a hash containing the start and end days of the weekend according to local custom using locale,
//		or by default in the user's locale.
//		e.g. {start:6, end:0}

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/weekend{Start,End}
	var weekendStart = {/*default is 6=Saturday*/
		'in':0,
		af:4,dz:4,ir:4,om:4,sa:4,ye:4,
		ae:5,bh:5,eg:5,il:5,iq:5,jo:5,kw:5,ly:5,ma:5,qa:5,sd:5,sy:5,tn:5
	};

	var weekendEnd = {/*default is 0=Sunday*/
		af:5,dz:5,ir:5,om:5,sa:5,ye:5,
		ae:6,bh:5,eg:6,il:6,iq:6,jo:6,kw:6,ly:6,ma:6,qa:6,sd:6,sy:6,tn:6
	};

	var country = dojo.cldr.supplemental._region(locale);
	var start = weekendStart[country];
	var end = weekendEnd[country];
	if(start === undefined){start=6;}
	if(end === undefined){end=0;}
	return {start:start, end:end}; /*Object {start,end}*/
};

}

if(!dojo._hasResource["dojo.date"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date"] = true;
dojo.provide("dojo.date");

dojo.getObject("date", true, dojo);

/*=====
dojo.date = {
	// summary: Date manipulation utilities
}
=====*/

dojo.date.getDaysInMonth = function(/*Date*/dateObject){
	//	summary:
	//		Returns the number of days in the month used by dateObject
	var month = dateObject.getMonth();
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(month == 1 && dojo.date.isLeapYear(dateObject)){ return 29; } // Number
	return days[month]; // Number
};

dojo.date.isLeapYear = function(/*Date*/dateObject){
	//	summary:
	//		Determines if the year of the dateObject is a leap year
	//	description:
	//		Leap years are years with an additional day YYYY-02-29, where the
	//		year number is a multiple of four with the following exception: If
	//		a year is a multiple of 100, then it is only a leap year if it is
	//		also a multiple of 400. For example, 1900 was not a leap year, but
	//		2000 is one.

	var year = dateObject.getFullYear();
	return !(year%400) || (!(year%4) && !!(year%100)); // Boolean
};

// FIXME: This is not localized
dojo.date.getTimezoneName = function(/*Date*/dateObject){
	//	summary:
	//		Get the user's time zone as provided by the browser
	// dateObject:
	//		Needed because the timezone may vary with time (daylight savings)
	//	description:
	//		Try to get time zone info from toString or toLocaleString method of
	//		the Date object -- UTC offset is not a time zone.  See
	//		http://www.twinsun.com/tz/tz-link.htm Note: results may be
	//		inconsistent across browsers.

	var str = dateObject.toString(); // Start looking in toString
	var tz = ''; // The result -- return empty string if nothing found
	var match;

	// First look for something in parentheses -- fast lookup, no regex
	var pos = str.indexOf('(');
	if(pos > -1){
		tz = str.substring(++pos, str.indexOf(')'));
	}else{
		// If at first you don't succeed ...
		// If IE knows about the TZ, it appears before the year
		// Capital letters or slash before a 4-digit year
		// at the end of string
		var pat = /([A-Z\/]+) \d{4}$/;
		if((match = str.match(pat))){
			tz = match[1];
		}else{
		// Some browsers (e.g. Safari) glue the TZ on the end
		// of toLocaleString instead of putting it in toString
			str = dateObject.toLocaleString();
			// Capital letters or slash -- end of string,
			// after space
			pat = / ([A-Z\/]+)$/;
			if((match = str.match(pat))){
				tz = match[1];
			}
		}
	}

	// Make sure it doesn't somehow end up return AM or PM
	return (tz == 'AM' || tz == 'PM') ? '' : tz; // String
};

// Utility methods to do arithmetic calculations with Dates

dojo.date.compare = function(/*Date*/date1, /*Date?*/date2, /*String?*/portion){
	//	summary:
	//		Compare two date objects by date, time, or both.
	//	description:
	//  	Returns 0 if equal, positive if a > b, else negative.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	portion:
	//		A string indicating the "date" or "time" portion of a Date object.
	//		Compares both "date" and "time" by default.  One of the following:
	//		"date", "time", "datetime"

	// Extra step required in copy for IE - see #3112
	date1 = new Date(+date1);
	date2 = new Date(+(date2 || new Date()));

	if(portion == "date"){
		// Ignore times and compare dates.
		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);
	}else if(portion == "time"){
		// Ignore dates and compare times.
		date1.setFullYear(0, 0, 0);
		date2.setFullYear(0, 0, 0);
	}
	
	if(date1 > date2){ return 1; } // int
	if(date1 < date2){ return -1; } // int
	return 0; // int
};

dojo.date.add = function(/*Date*/date, /*String*/interval, /*int*/amount){
	//	summary:
	//		Add to a Date in intervals of different size, from milliseconds to years
	//	date: Date
	//		Date object to start with
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//	amount:
	//		How much to add to the date.

	var sum = new Date(+date); // convert to Number before copying to accomodate IE (#3112)
	var fixOvershoot = false;
	var property = "Date";

	switch(interval){
		case "day":
			break;
		case "weekday":
			//i18n FIXME: assumes Saturday/Sunday weekend, but this is not always true.  see dojo.cldr.supplemental

			// Divide the increment time span into weekspans plus leftover days
			// e.g., 8 days is one 5-day weekspan / and two leftover days
			// Can't have zero leftover days, so numbers divisible by 5 get
			// a days value of 5, and the remaining days make up the number of weeks
			var days, weeks;
			var mod = amount % 5;
			if(!mod){
				days = (amount > 0) ? 5 : -5;
				weeks = (amount > 0) ? ((amount-5)/5) : ((amount+5)/5);
			}else{
				days = mod;
				weeks = parseInt(amount/5);
			}
			// Get weekday value for orig date param
			var strt = date.getDay();
			// Orig date is Sat / positive incrementer
			// Jump over Sun
			var adj = 0;
			if(strt == 6 && amount > 0){
				adj = 1;
			}else if(strt == 0 && amount < 0){
			// Orig date is Sun / negative incrementer
			// Jump back over Sat
				adj = -1;
			}
			// Get weekday val for the new date
			var trgt = strt + days;
			// New date is on Sat or Sun
			if(trgt == 0 || trgt == 6){
				adj = (amount > 0) ? 2 : -2;
			}
			// Increment by number of weeks plus leftover days plus
			// weekend adjustments
			amount = (7 * weeks) + days + adj;
			break;
		case "year":
			property = "FullYear";
			// Keep increment/decrement from 2/29 out of March
			fixOvershoot = true;
			break;
		case "week":
			amount *= 7;
			break;
		case "quarter":
			// Naive quarter is just three months
			amount *= 3;
			// fallthrough...
		case "month":
			// Reset to last day of month if you overshoot
			fixOvershoot = true;
			property = "Month";
			break;
//		case "hour":
//		case "minute":
//		case "second":
//		case "millisecond":
		default:
			property = "UTC"+interval.charAt(0).toUpperCase() + interval.substring(1) + "s";
	}

	if(property){
		sum["set"+property](sum["get"+property]()+amount);
	}

	if(fixOvershoot && (sum.getDate() < date.getDate())){
		sum.setDate(0);
	}

	return sum; // Date
};

dojo.date.difference = function(/*Date*/date1, /*Date?*/date2, /*String?*/interval){
	//	summary:
	//		Get the difference in a specific unit of time (e.g., number of
	//		months, weeks, days, etc.) between two dates, rounded to the
	//		nearest integer.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//		Defaults to "day".

	date2 = date2 || new Date();
	interval = interval || "day";
	var yearDiff = date2.getFullYear() - date1.getFullYear();
	var delta = 1; // Integer return value

	switch(interval){
		case "quarter":
			var m1 = date1.getMonth();
			var m2 = date2.getMonth();
			// Figure out which quarter the months are in
			var q1 = Math.floor(m1/3) + 1;
			var q2 = Math.floor(m2/3) + 1;
			// Add quarters for any year difference between the dates
			q2 += (yearDiff * 4);
			delta = q2 - q1;
			break;
		case "weekday":
			var days = Math.round(dojo.date.difference(date1, date2, "day"));
			var weeks = parseInt(dojo.date.difference(date1, date2, "week"));
			var mod = days % 7;

			// Even number of weeks
			if(mod == 0){
				days = weeks*5;
			}else{
				// Weeks plus spare change (< 7 days)
				var adj = 0;
				var aDay = date1.getDay();
				var bDay = date2.getDay();

				weeks = parseInt(days/7);
				mod = days % 7;
				// Mark the date advanced by the number of
				// round weeks (may be zero)
				var dtMark = new Date(date1);
				dtMark.setDate(dtMark.getDate()+(weeks*7));
				var dayMark = dtMark.getDay();

				// Spare change days -- 6 or less
				if(days > 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = -1;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 0;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = -1;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = -2;
							break;
						// Range contains weekend
						case (dayMark + mod) > 5:
							adj = -2;
					}
				}else if(days < 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = 0;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 1;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = 2;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = 1;
							break;
						// Range contains weekend
						case (dayMark + mod) < 0:
							adj = 2;
					}
				}
				days += adj;
				days -= (weeks*2);
			}
			delta = days;
			break;
		case "year":
			delta = yearDiff;
			break;
		case "month":
			delta = (date2.getMonth() - date1.getMonth()) + (yearDiff * 12);
			break;
		case "week":
			// Truncate instead of rounding
			// Don't use Math.floor -- value may be negative
			delta = parseInt(dojo.date.difference(date1, date2, "day")/7);
			break;
		case "day":
			delta /= 24;
			// fallthrough
		case "hour":
			delta /= 60;
			// fallthrough
		case "minute":
			delta /= 60;
			// fallthrough
		case "second":
			delta /= 1000;
			// fallthrough
		case "millisecond":
			delta *= date2.getTime() - date1.getTime();
	}

	// Round for fractional values and DST leaps
	return Math.round(delta); // Number (integer)
};

}

if(!dojo._hasResource["dojo.date.locale"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date.locale"] = true;
dojo.provide("dojo.date.locale");







dojo.getObject("date.locale", true, dojo);

// Localization methods for Date.   Honor local customs using locale-dependent dojo.cldr data.


// Load the bundles containing localization information for
// names and formats

//NOTE: Everything in this module assumes Gregorian calendars.
// Other calendars will be implemented in separate modules.

(function(){
	// Format a pattern without literals
	function formatPattern(dateObject, bundle, options, pattern){
		return pattern.replace(/([a-z])\1*/ig, function(match){
			var s, pad,
				c = match.charAt(0),
				l = match.length,
				widthList = ["abbr", "wide", "narrow"];
			switch(c){
				case 'G':
					s = bundle[(l < 4) ? "eraAbbr" : "eraNames"][dateObject.getFullYear() < 0 ? 0 : 1];
					break;
				case 'y':
					s = dateObject.getFullYear();
					switch(l){
						case 1:
							break;
						case 2:
							if(!options.fullYear){
								s = String(s); s = s.substr(s.length - 2);
								break;
							}
							// fallthrough
						default:
							pad = true;
					}
					break;
				case 'Q':
				case 'q':
					s = Math.ceil((dateObject.getMonth()+1)/3);
//					switch(l){
//						case 1: case 2:
							pad = true;
//							break;
//						case 3: case 4: // unimplemented
//					}
					break;
				case 'M':
					var m = dateObject.getMonth();
					if(l<3){
						s = m+1; pad = true;
					}else{
						var propM = ["months", "format", widthList[l-3]].join("-");
						s = bundle[propM][m];
					}
					break;
				case 'w':
					var firstDay = 0;
					s = dojo.date.locale._getWeekOfYear(dateObject, firstDay); pad = true;
					break;
				case 'd':
					s = dateObject.getDate(); pad = true;
					break;
				case 'D':
					s = dojo.date.locale._getDayOfYear(dateObject); pad = true;
					break;
				case 'E':
					var d = dateObject.getDay();
					if(l<3){
						s = d+1; pad = true;
					}else{
						var propD = ["days", "format", widthList[l-3]].join("-");
						s = bundle[propD][d];
					}
					break;
				case 'a':
					var timePeriod = (dateObject.getHours() < 12) ? 'am' : 'pm';
					s = options[timePeriod] || bundle['dayPeriods-format-wide-' + timePeriod];
					break;
				case 'h':
				case 'H':
				case 'K':
				case 'k':
					var h = dateObject.getHours();
					// strange choices in the date format make it impossible to write this succinctly
					switch (c){
						case 'h': // 1-12
							s = (h % 12) || 12;
							break;
						case 'H': // 0-23
							s = h;
							break;
						case 'K': // 0-11
							s = (h % 12);
							break;
						case 'k': // 1-24
							s = h || 24;
							break;
					}
					pad = true;
					break;
				case 'm':
					s = dateObject.getMinutes(); pad = true;
					break;
				case 's':
					s = dateObject.getSeconds(); pad = true;
					break;
				case 'S':
					s = Math.round(dateObject.getMilliseconds() * Math.pow(10, l-3)); pad = true;
					break;
				case 'v': // FIXME: don't know what this is. seems to be same as z?
				case 'z':
					// We only have one timezone to offer; the one from the browser
					s = dojo.date.locale._getZone(dateObject, true, options);
					if(s){break;}
					l=4;
					// fallthrough... use GMT if tz not available
				case 'Z':
					var offset = dojo.date.locale._getZone(dateObject, false, options);
					var tz = [
						(offset<=0 ? "+" : "-"),
						dojo.string.pad(Math.floor(Math.abs(offset)/60), 2),
						dojo.string.pad(Math.abs(offset)% 60, 2)
					];
					if(l==4){
						tz.splice(0, 0, "GMT");
						tz.splice(3, 0, ":");
					}
					s = tz.join("");
					break;
//				case 'Y': case 'u': case 'W': case 'F': case 'g': case 'A': case 'e':
//					console.log(match+" modifier unimplemented");
				default:
					throw new Error("dojo.date.locale.format: invalid pattern char: "+pattern);
			}
			if(pad){ s = dojo.string.pad(s, l); }
			return s;
		});
	}

/*=====
	dojo.date.locale.__FormatOptions = function(){
	//	selector: String
	//		choice of 'time','date' (default: date and time)
	//	formatLength: String
	//		choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
	//	datePattern:String
	//		override pattern with this string
	//	timePattern:String
	//		override pattern with this string
	//	am: String
	//		override strings for am in times
	//	pm: String
	//		override strings for pm in times
	//	locale: String
	//		override the locale used to determine formatting rules
	//	fullYear: Boolean
	//		(format only) use 4 digit years whenever 2 digit years are called for
	//	strict: Boolean
	//		(parse only) strict parsing, off by default
		this.selector = selector;
		this.formatLength = formatLength;
		this.datePattern = datePattern;
		this.timePattern = timePattern;
		this.am = am;
		this.pm = pm;
		this.locale = locale;
		this.fullYear = fullYear;
		this.strict = strict;
	}
=====*/

dojo.date.locale._getZone = function(/*Date*/dateObject, /*boolean*/getName, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Returns the zone (or offset) for the given date and options.  This
	//		is broken out into a separate function so that it can be overridden
	//		by timezone-aware code.
	//
	// dateObject:
	//		the date and/or time being formatted.
	//
	// getName:
	//		Whether to return the timezone string (if true), or the offset (if false)
	//
	// options:
	//		The options being used for formatting
	if(getName){
		return dojo.date.getTimezoneName(dateObject);
	}else{
		return dateObject.getTimezoneOffset();
	}
};


dojo.date.locale.format = function(/*Date*/dateObject, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Format a Date object as a String, using locale-specific settings.
	//
	// description:
	//		Create a string from a Date object using a known localized pattern.
	//		By default, this method formats both date and time from dateObject.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//
	// dateObject:
	//		the date and/or time to be formatted.  If a time only is formatted,
	//		the values in the year, month, and day fields are irrelevant.  The
	//		opposite is true when formatting only dates.

	options = options || {};

	var locale = dojo.i18n.normalizeLocale(options.locale),
		formatLength = options.formatLength || 'short',
		bundle = dojo.date.locale._getGregorianBundle(locale),
		str = [],
		sauce = dojo.hitch(this, formatPattern, dateObject, bundle, options);
	if(options.selector == "year"){
		return _processPattern(bundle["dateFormatItem-yyyy"] || "yyyy", sauce);
	}
	var pattern;
	if(options.selector != "date"){
		pattern = options.timePattern || bundle["timeFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}
	if(options.selector != "time"){
		pattern = options.datePattern || bundle["dateFormat-"+formatLength];
		if(pattern){str.push(_processPattern(pattern, sauce));}
	}

	return str.length == 1 ? str[0] : bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
		function(match, key){ return str[key]; }); // String
};

dojo.date.locale.regexp = function(/*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Builds the regular needed to parse a localized date

	return dojo.date.locale._parseInfo(options).regexp; // String
};

dojo.date.locale._parseInfo = function(/*dojo.date.locale.__FormatOptions?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale),
		bundle = dojo.date.locale._getGregorianBundle(locale),
		formatLength = options.formatLength || 'short',
		datePattern = options.datePattern || bundle["dateFormat-" + formatLength],
		timePattern = options.timePattern || bundle["timeFormat-" + formatLength],
		pattern;
	if(options.selector == 'date'){
		pattern = datePattern;
	}else if(options.selector == 'time'){
		pattern = timePattern;
	}else{
		pattern = bundle["dateTimeFormat-"+formatLength].replace(/\{(\d+)\}/g,
			function(match, key){ return [timePattern, datePattern][key]; });
	}

	var tokens = [],
		re = _processPattern(pattern, dojo.hitch(this, _buildDateTimeRE, tokens, bundle, options));
	return {regexp: re, tokens: tokens, bundle: bundle};
};

dojo.date.locale.parse = function(/*String*/value, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Date object,
	//		using locale-specific settings.
	//
	// description:
	//		Create a Date object from a string using a known localized pattern.
	//		By default, this method parses looking for both date and time in the string.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//		When two digit years are used, a century is chosen according to a sliding
	//		window of 80 years before and 20 years after present year, for both `yy` and `yyyy` patterns.
	//		year < 100CE requires strict mode.
	//
	// value:
	//		A string representation of a date

	// remove non-printing bidi control chars from input and pattern
	var controlChars = /[\u200E\u200F\u202A\u202E]/g,
		info = dojo.date.locale._parseInfo(options),
		tokens = info.tokens, bundle = info.bundle,
		re = new RegExp("^" + info.regexp.replace(controlChars, "") + "$",
			info.strict ? "" : "i"),
		match = re.exec(value && value.replace(controlChars, ""));

	if(!match){ return null; } // null

	var widthList = ['abbr', 'wide', 'narrow'],
		result = [1970,0,1,0,0,0,0], // will get converted to a Date at the end
		amPm = "",
		valid = dojo.every(match, function(v, i){
		if(!i){return true;}
		var token=tokens[i-1];
		var l=token.length;
		switch(token.charAt(0)){
			case 'y':
				if(l != 2 && options.strict){
					//interpret year literally, so '5' would be 5 A.D.
					result[0] = v;
				}else{
					if(v<100){
						v = Number(v);
						//choose century to apply, according to a sliding window
						//of 80 years before and 20 years after present year
						var year = '' + new Date().getFullYear(),
							century = year.substring(0, 2) * 100,
							cutoff = Math.min(Number(year.substring(2, 4)) + 20, 99),
							num = (v < cutoff) ? century + v : century - 100 + v;
						result[0] = num;
					}else{
						//we expected 2 digits and got more...
						if(options.strict){
							return false;
						}
						//interpret literally, so '150' would be 150 A.D.
						//also tolerate '1950', if 'yyyy' input passed to 'yy' format
						result[0] = v;
					}
				}
				break;
			case 'M':
				if(l>2){
					var months = bundle['months-format-' + widthList[l-3]].concat();
					if(!options.strict){
						//Tolerate abbreviating period in month part
						//Case-insensitive comparison
						v = v.replace(".","").toLowerCase();
						months = dojo.map(months, function(s){ return s.replace(".","").toLowerCase(); } );
					}
					v = dojo.indexOf(months, v);
					if(v == -1){
//						console.log("dojo.date.locale.parse: Could not parse month name: '" + v + "'.");
						return false;
					}
				}else{
					v--;
				}
				result[1] = v;
				break;
			case 'E':
			case 'e':
				var days = bundle['days-format-' + widthList[l-3]].concat();
				if(!options.strict){
					//Case-insensitive comparison
					v = v.toLowerCase();
					days = dojo.map(days, function(d){return d.toLowerCase();});
				}
				v = dojo.indexOf(days, v);
				if(v == -1){
//					console.log("dojo.date.locale.parse: Could not parse weekday name: '" + v + "'.");
					return false;
				}

				//TODO: not sure what to actually do with this input,
				//in terms of setting something on the Date obj...?
				//without more context, can't affect the actual date
				//TODO: just validate?
				break;
			case 'D':
				result[1] = 0;
				// fallthrough...
			case 'd':
				result[2] = v;
				break;
			case 'a': //am/pm
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
				if(!options.strict){
					var period = /\./g;
					v = v.replace(period,'').toLowerCase();
					am = am.replace(period,'').toLowerCase();
					pm = pm.replace(period,'').toLowerCase();
				}
				if(options.strict && v != am && v != pm){
//					console.log("dojo.date.locale.parse: Could not parse am/pm part.");
					return false;
				}

				// we might not have seen the hours field yet, so store the state and apply hour change later
				amPm = (v == pm) ? 'p' : (v == am) ? 'a' : '';
				break;
			case 'K': //hour (1-24)
				if(v == 24){ v = 0; }
				// fallthrough...
			case 'h': //hour (1-12)
			case 'H': //hour (0-23)
			case 'k': //hour (0-11)
				//TODO: strict bounds checking, padding
				if(v > 23){
//					console.log("dojo.date.locale.parse: Illegal hours value");
					return false;
				}

				//in the 12-hour case, adjusting for am/pm requires the 'a' part
				//which could come before or after the hour, so we will adjust later
				result[3] = v;
				break;
			case 'm': //minutes
				result[4] = v;
				break;
			case 's': //seconds
				result[5] = v;
				break;
			case 'S': //milliseconds
				result[6] = v;
//				break;
//			case 'w':
//TODO				var firstDay = 0;
//			default:
//TODO: throw?
//				console.log("dojo.date.locale.parse: unsupported pattern char=" + token.charAt(0));
		}
		return true;
	});

	var hours = +result[3];
	if(amPm === 'p' && hours < 12){
		result[3] = hours + 12; //e.g., 3pm -> 15
	}else if(amPm === 'a' && hours == 12){
		result[3] = 0; //12am -> 0
	}

	//TODO: implement a getWeekday() method in order to test
	//validity of input strings containing 'EEE' or 'EEEE'...

	var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	if(options.strict){
		dateObject.setFullYear(result[0]);
	}

	// Check for overflow.  The Date() constructor normalizes things like April 32nd...
	//TODO: why isn't this done for times as well?
	var allTokens = tokens.join(""),
		dateToken = allTokens.indexOf('d') != -1,
		monthToken = allTokens.indexOf('M') != -1;

	if(!valid ||
		(monthToken && dateObject.getMonth() > result[1]) ||
		(dateToken && dateObject.getDate() > result[2])){
		return null;
	}

	// Check for underflow, due to DST shifts.  See #9366
	// This assumes a 1 hour dst shift correction at midnight
	// We could compare the timezone offset after the shift and add the difference instead.
	if((monthToken && dateObject.getMonth() < result[1]) ||
		(dateToken && dateObject.getDate() < result[2])){
		dateObject = dojo.date.add(dateObject, "hour", 1);
	}

	return dateObject; // Date
};

function _processPattern(pattern, applyPattern, applyLiteral, applyAll){
	//summary: Process a pattern with literals in it

	// Break up on single quotes, treat every other one as a literal, except '' which becomes '
	var identity = function(x){return x;};
	applyPattern = applyPattern || identity;
	applyLiteral = applyLiteral || identity;
	applyAll = applyAll || identity;

	//split on single quotes (which escape literals in date format strings)
	//but preserve escaped single quotes (e.g., o''clock)
	var chunks = pattern.match(/(''|[^'])+/g),
		literal = pattern.charAt(0) == "'";

	dojo.forEach(chunks, function(chunk, i){
		if(!chunk){
			chunks[i]='';
		}else{
			chunks[i]=(literal ? applyLiteral : applyPattern)(chunk.replace(/''/g, "'"));
			literal = !literal;
		}
	});
	return applyAll(chunks.join(''));
}

function _buildDateTimeRE(tokens, bundle, options, pattern){
	pattern = dojo.regexp.escapeString(pattern);
	if(!options.strict){ pattern = pattern.replace(" a", " ?a"); } // kludge to tolerate no space before am/pm
	return pattern.replace(/([a-z])\1*/ig, function(match){
		// Build a simple regexp.  Avoid captures, which would ruin the tokens list
		var s,
			c = match.charAt(0),
			l = match.length,
			p2 = '', p3 = '';
		if(options.strict){
			if(l > 1){ p2 = '0' + '{'+(l-1)+'}'; }
			if(l > 2){ p3 = '0' + '{'+(l-2)+'}'; }
		}else{
			p2 = '0?'; p3 = '0{0,2}';
		}
		switch(c){
			case 'y':
				s = '\\d{2,4}';
				break;
			case 'M':
				s = (l>2) ? '\\S+?' : p2+'[1-9]|1[0-2]';
				break;
			case 'D':
				s = p2+'[1-9]|'+p3+'[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6]';
				break;
			case 'd':
				s = '3[01]|[12]\\d|'+p2+'[1-9]';
				break;
			case 'w':
				s = p2+'[1-9]|[1-4][0-9]|5[0-3]';
				break;
			case 'E':
				s = '\\S+';
				break;
			case 'h': //hour (1-12)
				s = p2+'[1-9]|1[0-2]';
				break;
			case 'k': //hour (0-11)
				s = p2+'\\d|1[01]';
				break;
			case 'H': //hour (0-23)
				s = p2+'\\d|1\\d|2[0-3]';
				break;
			case 'K': //hour (1-24)
				s = p2+'[1-9]|1\\d|2[0-4]';
				break;
			case 'm':
			case 's':
				s = '[0-5]\\d';
				break;
			case 'S':
				s = '\\d{'+l+'}';
				break;
			case 'a':
				var am = options.am || bundle['dayPeriods-format-wide-am'],
					pm = options.pm || bundle['dayPeriods-format-wide-pm'];
				if(options.strict){
					s = am + '|' + pm;
				}else{
					s = am + '|' + pm;
					if(am != am.toLowerCase()){ s += '|' + am.toLowerCase(); }
					if(pm != pm.toLowerCase()){ s += '|' + pm.toLowerCase(); }
					if(s.indexOf('.') != -1){ s += '|' + s.replace(/\./g, ""); }
				}
				s = s.replace(/\./g, "\\.");
				break;
			default:
			// case 'v':
			// case 'z':
			// case 'Z':
				s = ".*";
//				console.log("parse of date format, pattern=" + pattern);
		}

		if(tokens){ tokens.push(match); }

		return "(" + s + ")"; // add capture
	}).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
}
})();

(function(){
var _customFormats = [];
dojo.date.locale.addCustomFormats = function(/*String*/packageName, /*String*/bundleName){
	// summary:
	//		Add a reference to a bundle containing localized custom formats to be
	//		used by date/time formatting and parsing routines.
	//
	// description:
	//		The user may add custom localized formats where the bundle has properties following the
	//		same naming convention used by dojo.cldr: `dateFormat-xxxx` / `timeFormat-xxxx`
	//		The pattern string should match the format used by the CLDR.
	//		See dojo.date.locale.format() for details.
	//		The resources must be loaded by dojo.requireLocalization() prior to use

	_customFormats.push({pkg:packageName,name:bundleName});
};

dojo.date.locale._getGregorianBundle = function(/*String*/locale){
	var gregorian = {};
	dojo.forEach(_customFormats, function(desc){
		var bundle = dojo.i18n.getLocalization(desc.pkg, desc.name, locale);
		gregorian = dojo.mixin(gregorian, bundle);
	}, this);
	return gregorian; /*Object*/
};
})();

dojo.date.locale.addCustomFormats("dojo.cldr","gregorian");

dojo.date.locale.getNames = function(/*String*/item, /*String*/type, /*String?*/context, /*String?*/locale){
	// summary:
	//		Used to get localized strings from dojo.cldr for day or month names.
	//
	// item:
	//	'months' || 'days'
	// type:
	//	'wide' || 'narrow' || 'abbr' (e.g. "Monday", "Mon", or "M" respectively, in English)
	// context:
	//	'standAlone' || 'format' (default)
	// locale:
	//	override locale used to find the names

	var label,
		lookup = dojo.date.locale._getGregorianBundle(locale),
		props = [item, context, type];
	if(context == 'standAlone'){
		var key = props.join('-');
		label = lookup[key];
		// Fall back to 'format' flavor of name
		if(label[0] == 1){ label = undefined; } // kludge, in the absence of real aliasing support in dojo.cldr
	}
	props[1] = 'format';

	// return by copy so changes won't be made accidentally to the in-memory model
	return (label || lookup[props.join('-')]).concat(); /*Array*/
};

dojo.date.locale.isWeekend = function(/*Date?*/dateObject, /*String?*/locale){
	// summary:
	//	Determines if the date falls on a weekend, according to local custom.

	var weekend = dojo.cldr.supplemental.getWeekend(locale),
		day = (dateObject || new Date()).getDay();
	if(weekend.end < weekend.start){
		weekend.end += 7;
		if(day < weekend.start){ day += 7; }
	}
	return day >= weekend.start && day <= weekend.end; // Boolean
};

// These are used only by format and strftime.  Do they need to be public?  Which module should they go in?

dojo.date.locale._getDayOfYear = function(/*Date*/dateObject){
	// summary: gets the day of the year as represented by dateObject
	return dojo.date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject) + 1; // Number
};

dojo.date.locale._getWeekOfYear = function(/*Date*/dateObject, /*Number*/firstDayOfWeek){
	if(arguments.length == 1){ firstDayOfWeek = 0; } // Sunday

	var firstDayOfYear = new Date(dateObject.getFullYear(), 0, 1).getDay(),
		adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
		week = Math.floor((dojo.date.locale._getDayOfYear(dateObject) + adj - 1) / 7);

	// if year starts on the specified day, start counting weeks at 1
	if(firstDayOfYear == firstDayOfWeek){ week++; }

	return week; // Number
};

}

if(!dojo._hasResource["dijit.form.DropDownButton"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.DropDownButton"] = true;
dojo.provide("dijit.form.DropDownButton");




}

if(!dojo._hasResource["dijit.Calendar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Calendar"] = true;
dojo.provide("dijit.Calendar");









dojo.declare(
	"dijit.Calendar",
	[dijit._Widget, dijit._Templated, dijit._CssStateMixin],
	{
		// summary:
		//		A simple GUI for choosing a date in the context of a monthly calendar.
		//
		// description:
		//		A simple GUI for choosing a date in the context of a monthly calendar.
		//		This widget can't be used in a form because it doesn't serialize the date to an
		//		`<input>` field.  For a form element, use dijit.form.DateTextBox instead.
		//
		//		Note that the parser takes all dates attributes passed in the
		//		[RFC 3339 format](http://www.faqs.org/rfcs/rfc3339.html), e.g. `2005-06-30T08:05:00-07:00`
		//		so that they are serializable and locale-independent.
		//
		// example:
		//	|	var calendar = new dijit.Calendar({}, dojo.byId("calendarNode"));
		//
		// example:
		//	|	<div dojoType="dijit.Calendar"></div>

		templateString: dojo.cache("dijit", "templates/Calendar.html", "<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" dojoAttachEvent=\"onkeypress: _onKeyPress\" aria-labelledby=\"${id}_year\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\" dojoAttachPoint=\"monthDropDownButton\"\n\t\t\t\t\tid=\"${id}_mddb\" tabIndex=\"-1\">\n\t\t\t\t</div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\" role=\"gridcell\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n"),
		widgetsInTemplate: true,

		// value: Date
		//		The currently selected Date, initially set to invalid date to indicate no selection.
		value: new Date(""),
		// TODO: for 2.0 make this a string (ISO format) rather than a Date

		// datePackage: String
		//		JavaScript namespace to find Calendar routines.  Uses Gregorian Calendar routines
		//		at dojo.date by default.
		datePackage: "dojo.date",

		// dayWidth: String
		//		How to represent the days of the week in the calendar header. See dojo.date.locale
		dayWidth: "narrow",

		// tabIndex: Integer
		//		Order fields are traversed when user hits the tab key
		tabIndex: "0",
		
		// currentFocus: Date
		//		Date object containing the currently focused date, or the date which would be focused
		//		if the calendar itself was focused.   Also indicates which year and month to display,
		//		i.e. the current "page" the calendar is on.
		currentFocus: new Date(),

		baseClass:"dijitCalendar",

		// Set node classes for various mouse events, see dijit._CssStateMixin for more details
		cssStateNodes: {
			"decrementMonth": "dijitCalendarArrow",
			"incrementMonth": "dijitCalendarArrow",
			"previousYearLabelNode": "dijitCalendarPreviousYear",
			"nextYearLabelNode": "dijitCalendarNextYear"
		},

		_isValidDate: function(/*Date*/ value){
			// summary:
			//		Runs various tests on the value, checking that it's a valid date, rather
			//		than blank or NaN.
			// tags:
			//		private
			return value && !isNaN(value) && typeof value == "object" &&
				value.toString() != this.constructor.prototype.value.toString();
		},

		setValue: function(/*Date*/ value){
			// summary:
			//      Deprecated.   Use set('value', ...) instead.
			// tags:
			//      deprecated
			dojo.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.", "", "2.0");
			this.set('value', value);
		},

		_getValueAttr: function(){
			// summary:
			//		Support get('value')

			// this.value is set to 1AM, but return midnight, local time for back-compat
			var value = new this.dateClassObj(this.value);
			value.setHours(0, 0, 0, 0);

			// If daylight savings pushes midnight to the previous date, fix the Date
			// object to point at 1am so it will represent the correct day. See #9366
			if(value.getDate() < this.value.getDate()){
				value = this.dateFuncObj.add(value, "hour", 1);
			}
			return value;
		},

		_setValueAttr: function(/*Date|Number*/ value, /*Boolean*/ priorityChange){
			// summary:
			//		Support set("value", ...)
			// description:
			// 		Set the current date and update the UI.  If the date is disabled, the value will
			//		not change, but the display will change to the corresponding month.
			// value:
			//		Either a Date or the number of seconds since 1970.
			// tags:
			//      protected
			if(value){
				// convert from Number to Date, or make copy of Date object so that setHours() call below
				// doesn't affect original value
				value = new this.dateClassObj(value);
			}
			if(this._isValidDate(value)){
				if(!this._isValidDate(this.value) || this.dateFuncObj.compare(value, this.value)){
					value.setHours(1, 0, 0, 0); // round to nearest day (1am to avoid issues when DST shift occurs at midnight, see #8521, #9366)
	
					if(!this.isDisabledDate(value, this.lang)){
						this._set("value", value);
		
						// Set focus cell to the new value.   Arguably this should only happen when there isn't a current
						// focus point.   This will also repopulate the grid, showing the new selected value (and possibly
						// new month/year).
						this.set("currentFocus", value);
	
						if(priorityChange || typeof priorityChange == "undefined"){
							this.onChange(this.get('value'));
							this.onValueSelected(this.get('value'));	// remove in 2.0
						}
					}
				}
			}else{
				// clear value, and repopulate grid (to deselect the previously selected day) without changing currentFocus
				this._set("value", null);
				this.set("currentFocus", this.currentFocus);
			}
		},

		_setText: function(node, text){
			// summary:
			//		This just sets the content of node to the specified text.
			//		Can't do "node.innerHTML=text" because of an IE bug w/tables, see #3434.
			// tags:
			//      private
			while(node.firstChild){
				node.removeChild(node.firstChild);
			}
			node.appendChild(dojo.doc.createTextNode(text));
		},

		_populateGrid: function(){
			// summary:
			//      Fills in the calendar grid with each day (1-31)
			// tags:
			//      private

			var month = new this.dateClassObj(this.currentFocus);
			month.setDate(1);

			var firstDay = month.getDay(),
				daysInMonth = this.dateFuncObj.getDaysInMonth(month),
				daysInPreviousMonth = this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(month, "month", -1)),
				today = new this.dateClassObj(),
				dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			if(dayOffset > firstDay){ dayOffset -= 7; }

			// Iterate through dates in the calendar and fill in date numbers and style info
			dojo.query(".dijitCalendarDateTemplate", this.domNode).forEach(function(template, i){
				i += dayOffset;
				var date = new this.dateClassObj(month),
					number, clazz = "dijitCalendar", adj = 0;

				if(i < firstDay){
					number = daysInPreviousMonth - firstDay + i + 1;
					adj = -1;
					clazz += "Previous";
				}else if(i >= (firstDay + daysInMonth)){
					number = i - firstDay - daysInMonth + 1;
					adj = 1;
					clazz += "Next";
				}else{
					number = i - firstDay + 1;
					clazz += "Current";
				}

				if(adj){
					date = this.dateFuncObj.add(date, "month", adj);
				}
				date.setDate(number);

				if(!this.dateFuncObj.compare(date, today, "date")){
					clazz = "dijitCalendarCurrentDate " + clazz;
				}

				if(this._isSelectedDate(date, this.lang)){
					clazz = "dijitCalendarSelectedDate " + clazz;
				}

				if(this.isDisabledDate(date, this.lang)){
					clazz = "dijitCalendarDisabledDate " + clazz;
				}

				var clazz2 = this.getClassForDate(date, this.lang);
				if(clazz2){
					clazz = clazz2 + " " + clazz;
				}

				template.className = clazz + "Month dijitCalendarDateTemplate";
				template.dijitDateValue = date.valueOf();				// original code
				dojo.attr(template, "dijitDateValue", date.valueOf());	// so I can dojo.query() it
				var label = dojo.query(".dijitCalendarDateLabel", template)[0],
					text = date.getDateLocalized ? date.getDateLocalized(this.lang) : date.getDate();
				this._setText(label, text);
			}, this);

			// Repopulate month drop down list based on current year.
			// Need to do this to hide leap months in Hebrew calendar.
			var monthNames = this.dateLocaleModule.getNames('months', 'wide', 'standAlone', this.lang, month);
			this.monthDropDownButton.dropDown.set("months", monthNames);

			// Set name of current month and also fill in spacer element with all the month names
			// (invisible) so that the maximum width will affect layout.   But not on IE6 because then
			// the center <TH> overlaps the right <TH> (due to a browser bug).
			this.monthDropDownButton.containerNode.innerHTML =
				(dojo.isIE == 6 ? "" : "<div class='dijitSpacer'>" + this.monthDropDownButton.dropDown.domNode.innerHTML + "</div>") +
				"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>" +  monthNames[month.getMonth()] + "</div>";

			// Fill in localized prev/current/next years
			var y = month.getFullYear() - 1;
			var d = new this.dateClassObj();
			dojo.forEach(["previous", "current", "next"], function(name){
				d.setFullYear(y++);
				this._setText(this[name+"YearLabelNode"],
					this.dateLocaleModule.format(d, {selector:'year', locale:this.lang}));
			}, this);
		},

		goToToday: function(){
			// summary:
			//      Sets calendar's value to today's date
			this.set('value', new this.dateClassObj());
		},

		constructor: function(/*Object*/args){
			var dateClass = (args.datePackage && (args.datePackage != "dojo.date"))? args.datePackage + ".Date" : "Date";
			this.dateClassObj = dojo.getObject(dateClass, false);
			this.datePackage = args.datePackage || this.datePackage;
			this.dateFuncObj = dojo.getObject(this.datePackage, false);
			this.dateLocaleModule = dojo.getObject(this.datePackage + ".locale", false);
		},

		postMixInProperties: function(){
			// Parser.instantiate sometimes passes in NaN for IE.  Use default value in prototype instead.
			// TODO: remove this for 2.0 (thanks to #11511)
			if(isNaN(this.value)){ delete this.value; }

			this.inherited(arguments);
		},

		buildRendering: function(){
			this.inherited(arguments);
			dojo.setSelectable(this.domNode, false);

			var cloneClass = dojo.hitch(this, function(clazz, n){
				var template = dojo.query(clazz, this.domNode)[0];
	 			for(var i=0; i<n; i++){
					template.parentNode.appendChild(template.cloneNode(true));
				}
			});

			// clone the day label and calendar day templates 6 times to make 7 columns
			cloneClass(".dijitCalendarDayLabelTemplate", 6);
			cloneClass(".dijitCalendarDateTemplate", 6);

			// now make 6 week rows
			cloneClass(".dijitCalendarWeekTemplate", 5);

			// insert localized day names in the header
			var dayNames = this.dateLocaleModule.getNames('days', this.dayWidth, 'standAlone', this.lang);
			var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			dojo.query(".dijitCalendarDayLabel", this.domNode).forEach(function(label, i){
				this._setText(label, dayNames[(i + dayOffset) % 7]);
			}, this);

			var dateObj = new this.dateClassObj(this.currentFocus);

			this.monthDropDownButton.dropDown = new dijit.Calendar._MonthDropDown({
				id: this.id + "_mdd",
				onChange: dojo.hitch(this, "_onMonthSelect")
			});

			this.set('currentFocus', dateObj, false);	// draw the grid to the month specified by currentFocus

			// Set up repeating mouse behavior for increment/decrement of months/years
			var _this = this;
			var typematic = function(nodeProp, dateProp, adj){
				_this._connects.push(
					dijit.typematic.addMouseListener(_this[nodeProp], _this, function(count){
						if(count >= 0){ _this._adjustDisplay(dateProp, adj); }
					}, 0.8, 500)
				);
			};
			typematic("incrementMonth", "month", 1);
			typematic("decrementMonth", "month", -1);
			typematic("nextYearLabelNode", "year", 1);
			typematic("previousYearLabelNode", "year", -1);
		},

		_adjustDisplay: function(/*String*/ part, /*int*/ amount){
			// summary:
			//      Moves calendar forwards or backwards by months or years
			// part:
			//      "month" or "year"
			// amount:
			//      Number of months or years
			// tags:
			//      private
			this._setCurrentFocusAttr(this.dateFuncObj.add(this.currentFocus, part, amount));
		},

		_setCurrentFocusAttr: function(/*Date*/ date, /*Boolean*/ forceFocus){
			// summary:
			//		If the calendar currently has focus, then focuses specified date,
			//		changing the currently displayed month/year if necessary.
			//		If the calendar doesn't have focus, updates currently
			//		displayed month/year, and sets the cell that will get focus.
			// forceFocus:
			//		If true, will focus() the cell even if calendar itself doesn't have focus

			var oldFocus = this.currentFocus,
				oldCell = oldFocus ? dojo.query("[dijitDateValue=" + oldFocus.valueOf() + "]", this.domNode)[0] : null;

			// round specified value to nearest day (1am to avoid issues when DST shift occurs at midnight, see #8521, #9366)
			date = new this.dateClassObj(date);
			date.setHours(1, 0, 0, 0);

			this._set("currentFocus", date);

			// TODO: only re-populate grid when month/year has changed
			this._populateGrid();

			// set tabIndex=0 on new cell, and focus it (but only if Calendar itself is focused)
			var newCell = dojo.query("[dijitDateValue=" + date.valueOf() + "]", this.domNode)[0];
			newCell.setAttribute("tabIndex", this.tabIndex);
			if(this._focused || forceFocus){
				newCell.focus();
			}

			// set tabIndex=-1 on old focusable cell
			if(oldCell && oldCell != newCell){
				if(dojo.isWebKit){	// see #11064 about webkit bug
					oldCell.setAttribute("tabIndex", "-1");
				}else{
						oldCell.removeAttribute("tabIndex");
				}
			}
		},

		focus: function(){
			// summary:
			//		Focus the calendar by focusing one of the calendar cells
			this._setCurrentFocusAttr(this.currentFocus, true);
		},

		_onMonthSelect: function(/*Number*/ newMonth){
			// summary:
			//      Handler for when user selects a month from the drop down list
			// tags:
			//      protected

			// move to selected month, bounding by the number of days in the month
			// (ex: dec 31 --> jan 28, not jan 31)
			this.currentFocus = this.dateFuncObj.add(this.currentFocus, "month",
				newMonth - this.currentFocus.getMonth());
			this._populateGrid();
		},

		_onDayClick: function(/*Event*/ evt){
			// summary:
			//      Handler for day clicks, selects the date if appropriate
			// tags:
			//      protected
			dojo.stopEvent(evt);
			for(var node = evt.target; node && !node.dijitDateValue; node = node.parentNode);
			if(node && !dojo.hasClass(node, "dijitCalendarDisabledDate")){
				this.set('value', node.dijitDateValue);
			}
		},

		_onDayMouseOver: function(/*Event*/ evt){
			// summary:
			//      Handler for mouse over events on days, sets hovered style
			// tags:
			//      protected

			// event can occur on <td> or the <span> inside the td,
			// set node to the <td>.
			var node =
				dojo.hasClass(evt.target, "dijitCalendarDateLabel") ?
				evt.target.parentNode :
				evt.target;

			if(node && (node.dijitDateValue || node == this.previousYearLabelNode || node == this.nextYearLabelNode) ){
				dojo.addClass(node, "dijitCalendarHoveredDate");
				this._currentNode = node;
			}
		},

		_onDayMouseOut: function(/*Event*/ evt){
			// summary:
			//      Handler for mouse out events on days, clears hovered style
			// tags:
			//      protected
	
			if(!this._currentNode){ return; }
			
			// if mouse out occurs moving from <td> to <span> inside <td>, ignore it
			if(evt.relatedTarget && evt.relatedTarget.parentNode == this._currentNode){ return; }
			var cls = "dijitCalendarHoveredDate";
			if(dojo.hasClass(this._currentNode, "dijitCalendarActiveDate")) {
				cls += " dijitCalendarActiveDate";
			}
			dojo.removeClass(this._currentNode, cls);
			this._currentNode = null;
		},
		
		_onDayMouseDown: function(/*Event*/ evt){
			var node = evt.target.parentNode;
			if(node && node.dijitDateValue){
				dojo.addClass(node, "dijitCalendarActiveDate");
				this._currentNode = node;
			}
		},
		
		_onDayMouseUp: function(/*Event*/ evt){
			var node = evt.target.parentNode;
			if(node && node.dijitDateValue){
				dojo.removeClass(node, "dijitCalendarActiveDate");
			}
		},

//TODO: use typematic
		handleKey: function(/*Event*/ evt){
			// summary:
			//		Provides keyboard navigation of calendar.
			// description:
			//		Called from _onKeyPress() to handle keypress on a stand alone Calendar,
			//		and also from `dijit.form._DateTimeTextBox` to pass a keypress event
			//		from the `dijit.form.DateTextBox` to be handled in this widget
			// returns:
			//		False if the key was recognized as a navigation key,
			//		to indicate that the event was handled by Calendar and shouldn't be propogated
			// tags:
			//		protected
			var dk = dojo.keys,
				increment = -1,
				interval,
				newValue = this.currentFocus;
			switch(evt.keyCode){
				case dk.RIGHT_ARROW:
					increment = 1;
					//fallthrough...
				case dk.LEFT_ARROW:
					interval = "day";
					if(!this.isLeftToRight()){ increment *= -1; }
					break;
				case dk.DOWN_ARROW:
					increment = 1;
					//fallthrough...
				case dk.UP_ARROW:
					interval = "week";
					break;
				case dk.PAGE_DOWN:
					increment = 1;
					//fallthrough...
				case dk.PAGE_UP:
					interval = evt.ctrlKey || evt.altKey ? "year" : "month";
					break;
				case dk.END:
					// go to the next month
					newValue = this.dateFuncObj.add(newValue, "month", 1);
					// subtract a day from the result when we're done
					interval = "day";
					//fallthrough...
				case dk.HOME:
					newValue = new this.dateClassObj(newValue);
					newValue.setDate(1);
					break;
				case dk.ENTER:
				case dk.SPACE:
					this.set("value", this.currentFocus);
					break;
				default:
					return true;
			}

			if(interval){
				newValue = this.dateFuncObj.add(newValue, interval, increment);
			}

			this._setCurrentFocusAttr(newValue);

			return false;
		},

		_onKeyPress: function(/*Event*/ evt){
			// summary:
			//		For handling keypress events on a stand alone calendar
			if(!this.handleKey(evt)){
				dojo.stopEvent(evt);
			}
		},

		onValueSelected: function(/*Date*/ date){
			// summary:
			//		Notification that a date cell was selected.  It may be the same as the previous value.
			// description:
			//      Formerly used by `dijit.form._DateTimeTextBox` (and thus `dijit.form.DateTextBox`)
			//      to get notification when the user has clicked a date.  Now onExecute() (above) is used.
			// tags:
			//      protected
		},

		onChange: function(/*Date*/ date){
			// summary:
			//		Called only when the selected date has changed
		},

		_isSelectedDate: function(/*Date*/ dateObject, /*String?*/ locale){
			// summary:
			//		Extension point so developers can subclass Calendar to
			//		support multiple (concurrently) selected dates
			// tags:
			//		protected extension
			return this._isValidDate(this.value) && !this.dateFuncObj.compare(dateObject, this.value, "date")
		},

		isDisabledDate: function(/*Date*/ dateObject, /*String?*/ locale){
			// summary:
			//		May be overridden to disable certain dates in the calendar e.g. `isDisabledDate=dojo.date.locale.isWeekend`
			// tags:
			//      extension
/*=====
			return false; // Boolean
=====*/
		},

		getClassForDate: function(/*Date*/ dateObject, /*String?*/ locale){
			// summary:
			//		May be overridden to return CSS classes to associate with the date entry for the given dateObject,
			//		for example to indicate a holiday in specified locale.
			// tags:
			//      extension

/*=====
			return ""; // String
=====*/
		}
	}
);

dojo.declare("dijit.Calendar._MonthDropDown", [dijit._Widget, dijit._Templated], {
	// summary:
	//		The month drop down

	// months: String[]
	//		List of names of months, possibly w/some undefined entries for Hebrew leap months
	//		(ex: ["January", "February", undefined, "April", ...])
	months: [],

	templateString: "<div class='dijitCalendarMonthMenu dijitMenu' " +
		"dojoAttachEvent='onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'></div>",

	_setMonthsAttr: function(/*String[]*/ months){
		this.domNode.innerHTML = dojo.map(months, function(month, idx){
				return month ? "<div class='dijitCalendarMonthLabel' month='" + idx +"'>" + month + "</div>" : "";
			}).join("");
	},

	_onClick: function(/*Event*/ evt){
		this.onChange(dojo.attr(evt.target, "month"));
	},

	onChange: function(/*Number*/ month){
		// summary:
		//		Callback when month is selected from drop down
	},

	_onMenuHover: function(evt){
		dojo.toggleClass(evt.target, "dijitCalendarMonthLabelHover", evt.type == "mouseover");
	}
});

}

if(!dojo._hasResource["dijit.form.TextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.TextBox"] = true;
dojo.provide("dijit.form.TextBox");



dojo.declare(
	"dijit.form.TextBox",
	dijit.form._FormValueWidget,
	{
		// summary:
		//		A base class for textbox form inputs

		// trim: Boolean
		//		Removes leading and trailing whitespace if true.  Default is false.
		trim: false,

		// uppercase: Boolean
		//		Converts all characters to uppercase if true.  Default is false.
		uppercase: false,

		// lowercase: Boolean
		//		Converts all characters to lowercase if true.  Default is false.
		lowercase: false,

		// propercase: Boolean
		//		Converts the first character of each word to uppercase if true.
		propercase: false,

		// maxLength: String
		//		HTML INPUT tag maxLength declaration.
		maxLength: "",

		// selectOnClick: [const] Boolean
		//		If true, all text will be selected when focused with mouse
		selectOnClick: false,

		// placeHolder: String
		//		Defines a hint to help users fill out the input field (as defined in HTML 5).
		//		This should only contain plain text (no html markup).
		placeHolder: "",
		
		templateString: dojo.cache("dijit.form", "templates/TextBox.html", "<div class=\"dijit dijitReset dijitInline dijitLeft\" id=\"widget_${id}\" role=\"presentation\"\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class=\"dijitReset dijitInputInner\" dojoAttachPoint='textbox,focusNode' autocomplete=\"off\"\n\t\t\t${!nameAttrSetting} type='${type}'\n\t/></div\n></div>\n"),
		_singleNodeTemplate: '<input class="dijit dijitReset dijitLeft dijitInputField" dojoAttachPoint="textbox,focusNode" autocomplete="off" type="${type}" ${!nameAttrSetting} />',

		_buttonInputDisabled: dojo.isIE ? "disabled" : "", // allows IE to disallow focus, but Firefox cannot be disabled for mousedown events

		baseClass: "dijitTextBox",

		attributeMap: dojo.delegate(dijit.form._FormValueWidget.prototype.attributeMap, {
			maxLength: "focusNode"
		}),
		
		postMixInProperties: function(){
			var type = this.type.toLowerCase();
			if(this.templateString && this.templateString.toLowerCase() == "input" || ((type == "hidden" || type == "file") && this.templateString == dijit.form.TextBox.prototype.templateString)){
				this.templateString = this._singleNodeTemplate;
			}
			this.inherited(arguments);
		},

		_setPlaceHolderAttr: function(v){
			this._set("placeHolder", v);
			if(!this._phspan){
				this._attachPoints.push('_phspan');
				/* dijitInputField class gives placeHolder same padding as the input field
				 * parent node already has dijitInputField class but it doesn't affect this <span>
				 * since it's position: absolute.
				 */
				this._phspan = dojo.create('span',{className:'dijitPlaceHolder dijitInputField'},this.textbox,'after');
			}
			this._phspan.innerHTML="";
			this._phspan.appendChild(document.createTextNode(v));
			
			this._updatePlaceHolder();
		},
		
		_updatePlaceHolder: function(){
			if(this._phspan){
				this._phspan.style.display=(this.placeHolder&&!this._focused&&!this.textbox.value)?"":"none";
			}
		},

		_getValueAttr: function(){
			// summary:
			//		Hook so get('value') works as we like.
			// description:
			//		For `dijit.form.TextBox` this basically returns the value of the <input>.
			//
			//		For `dijit.form.MappedTextBox` subclasses, which have both
			//		a "displayed value" and a separate "submit value",
			//		This treats the "displayed value" as the master value, computing the
			//		submit value from it via this.parse().
			return this.parse(this.get('displayedValue'), this.constraints);
		},

		_setValueAttr: function(value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			// summary:
			//		Hook so set('value', ...) works.
			//
			// description:
			//		Sets the value of the widget to "value" which can be of
			//		any type as determined by the widget.
			//
			// value:
			//		The visual element value is also set to a corresponding,
			//		but not necessarily the same, value.
			//
			// formattedValue:
			//		If specified, used to set the visual element value,
			//		otherwise a computed visual value is used.
			//
			// priorityChange:
			//		If true, an onChange event is fired immediately instead of
			//		waiting for the next blur event.

			var filteredValue;
			if(value !== undefined){
				// TODO: this is calling filter() on both the display value and the actual value.
				// I added a comment to the filter() definition about this, but it should be changed.
				filteredValue = this.filter(value);
				if(typeof formattedValue != "string"){
					if(filteredValue !== null && ((typeof filteredValue != "number") || !isNaN(filteredValue))){
						formattedValue = this.filter(this.format(filteredValue, this.constraints));
					}else{ formattedValue = ''; }
				}
			}
			if(formattedValue != null && formattedValue != undefined && ((typeof formattedValue) != "number" || !isNaN(formattedValue)) && this.textbox.value != formattedValue){
				this.textbox.value = formattedValue;
				this._set("displayedValue", this.get("displayedValue"));
			}

			this._updatePlaceHolder();

			this.inherited(arguments, [filteredValue, priorityChange]);
		},

		// displayedValue: String
		//		For subclasses like ComboBox where the displayed value
		//		(ex: Kentucky) and the serialized value (ex: KY) are different,
		//		this represents the displayed value.
		//
		//		Setting 'displayedValue' through set('displayedValue', ...)
		//		updates 'value', and vice-versa.  Otherwise 'value' is updated
		//		from 'displayedValue' periodically, like onBlur etc.
		//
		//		TODO: move declaration to MappedTextBox?
		//		Problem is that ComboBox references displayedValue,
		//		for benefit of FilteringSelect.
		displayedValue: "",

		getDisplayedValue: function(){
			// summary:
			//		Deprecated.  Use get('displayedValue') instead.
			// tags:
			//		deprecated
			dojo.deprecated(this.declaredClass+"::getDisplayedValue() is deprecated. Use set('displayedValue') instead.", "", "2.0");
			return this.get('displayedValue');
		},

		_getDisplayedValueAttr: function(){
			// summary:
			//		Hook so get('displayedValue') works.
			// description:
			//		Returns the displayed value (what the user sees on the screen),
			// 		after filtering (ie, trimming spaces etc.).
			//
			//		For some subclasses of TextBox (like ComboBox), the displayed value
			//		is different from the serialized value that's actually
			//		sent to the server (see dijit.form.ValidationTextBox.serialize)

			// TODO: maybe we should update this.displayedValue on every keystroke so that we don't need
			// this method
			// TODO: this isn't really the displayed value when the user is typing
			return this.filter(this.textbox.value);
		},

		setDisplayedValue: function(/*String*/ value){
			// summary:
			//		Deprecated.  Use set('displayedValue', ...) instead.
			// tags:
			//		deprecated
			dojo.deprecated(this.declaredClass+"::setDisplayedValue() is deprecated. Use set('displayedValue', ...) instead.", "", "2.0");
			this.set('displayedValue', value);
		},

		_setDisplayedValueAttr: function(/*String*/ value){
			// summary:
			//		Hook so set('displayedValue', ...) works.
			// description:
			//		Sets the value of the visual element to the string "value".
			//		The widget value is also set to a corresponding,
			//		but not necessarily the same, value.

			if(value === null || value === undefined){ value = '' }
			else if(typeof value != "string"){ value = String(value) }

			this.textbox.value = value;

			// sets the serialized value to something corresponding to specified displayedValue
			// (if possible), and also updates the textbox.value, for example converting "123"
			// to "123.00"
			this._setValueAttr(this.get('value'), undefined);

			this._set("displayedValue", this.get('displayedValue'));
		},

		format: function(/*String*/ value, /*Object*/ constraints){
			// summary:
			//		Replacable function to convert a value to a properly formatted string.
			// tags:
			//		protected extension
			return ((value == null || value == undefined) ? "" : (value.toString ? value.toString() : value));
		},

		parse: function(/*String*/ value, /*Object*/ constraints){
			// summary:
			//		Replacable function to convert a formatted string to a value
			// tags:
			//		protected extension

			return value;	// String
		},

		_refreshState: function(){
			// summary:
			//		After the user types some characters, etc., this method is
			//		called to check the field for validity etc.  The base method
			//		in `dijit.form.TextBox` does nothing, but subclasses override.
			// tags:
			//		protected
		},

		_onInput: function(e){
			if(e && e.type && /key/i.test(e.type) && e.keyCode){
				switch(e.keyCode){
					case dojo.keys.SHIFT:
					case dojo.keys.ALT:
					case dojo.keys.CTRL:
					case dojo.keys.TAB:
						return;
				}
			}
			if(this.intermediateChanges){
				var _this = this;
				// the setTimeout allows the key to post to the widget input box
				setTimeout(function(){ _this._handleOnChange(_this.get('value'), false); }, 0);
			}
			this._refreshState();

			// In case someone is watch()'ing for changes to displayedValue
			this._set("displayedValue", this.get("displayedValue"));
		},

		postCreate: function(){
			if(dojo.isIE){ // IE INPUT tag fontFamily has to be set directly using STYLE
				// the setTimeout gives IE a chance to render the TextBox and to deal with font inheritance
				setTimeout(dojo.hitch(this, function(){
				var s = dojo.getComputedStyle(this.domNode);
				if(s){
					var ff = s.fontFamily;
					if(ff){
						var inputs = this.domNode.getElementsByTagName("INPUT");
						if(inputs){
							for(var i=0; i < inputs.length; i++){
								inputs[i].style.fontFamily = ff;
							}
						}
					}
				}
				}), 0);
			}

			// setting the value here is needed since value="" in the template causes "undefined"
			// and setting in the DOM (instead of the JS object) helps with form reset actions
			this.textbox.setAttribute("value", this.textbox.value); // DOM and JS values should be the same

			this.inherited(arguments);

			if(dojo.isMoz || dojo.isOpera){
				this.connect(this.textbox, "oninput", "_onInput");
			}else{
				this.connect(this.textbox, "onkeydown", "_onInput");
				this.connect(this.textbox, "onkeyup", "_onInput");
				this.connect(this.textbox, "onpaste", "_onInput");
				this.connect(this.textbox, "oncut", "_onInput");
			}
		},

		_blankValue: '', // if the textbox is blank, what value should be reported
		filter: function(val){
			// summary:
			//		Auto-corrections (such as trimming) that are applied to textbox
			//		value on blur or form submit.
			// description:
			//		For MappedTextBox subclasses, this is called twice
			// 			- once with the display value
			//			- once the value as set/returned by set('value', ...)
			//		and get('value'), ex: a Number for NumberTextBox.
			//
			//		In the latter case it does corrections like converting null to NaN.  In
			//		the former case the NumberTextBox.filter() method calls this.inherited()
			//		to execute standard trimming code in TextBox.filter().
			//
			//		TODO: break this into two methods in 2.0
			//
			// tags:
			//		protected extension
			if(val === null){ return this._blankValue; }
			if(typeof val != "string"){ return val; }
			if(this.trim){
				val = dojo.trim(val);
			}
			if(this.uppercase){
				val = val.toUpperCase();
			}
			if(this.lowercase){
				val = val.toLowerCase();
			}
			if(this.propercase){
				val = val.replace(/[^\s]+/g, function(word){
					return word.substring(0,1).toUpperCase() + word.substring(1);
				});
			}
			return val;
		},

		_setBlurValue: function(){
			this._setValueAttr(this.get('value'), true);
		},

		_onBlur: function(e){
			if(this.disabled){ return; }
			this._setBlurValue();
			this.inherited(arguments);

			if(this._selectOnClickHandle){
				this.disconnect(this._selectOnClickHandle);
			}
			if(this.selectOnClick && dojo.isMoz){
				this.textbox.selectionStart = this.textbox.selectionEnd = undefined; // clear selection so that the next mouse click doesn't reselect
			}
			
			this._updatePlaceHolder();
		},

		_onFocus: function(/*String*/ by){
			if(this.disabled || this.readOnly){ return; }

			// Select all text on focus via click if nothing already selected.
			// Since mouse-up will clear the selection need to defer selection until after mouse-up.
			// Don't do anything on focus by tabbing into the widget since there's no associated mouse-up event.
			if(this.selectOnClick && by == "mouse"){
				this._selectOnClickHandle = this.connect(this.domNode, "onmouseup", function(){
					// Only select all text on first click; otherwise users would have no way to clear
					// the selection.
					this.disconnect(this._selectOnClickHandle);

					// Check if the user selected some text manually (mouse-down, mouse-move, mouse-up)
					// and if not, then select all the text
					var textIsNotSelected;
					if(dojo.isIE){
						var range = dojo.doc.selection.createRange();
						var parent = range.parentElement();
						textIsNotSelected = parent == this.textbox && range.text.length == 0;
					}else{
						textIsNotSelected = this.textbox.selectionStart == this.textbox.selectionEnd;
					}
					if(textIsNotSelected){
						dijit.selectInputText(this.textbox);
					}
				});
			}

			this._updatePlaceHolder();
			
			// call this.inherited() before refreshState(), since this.inherited() will possibly scroll the viewport
			// (to scroll the TextBox into view), which will affect how _refreshState() positions the tooltip
			this.inherited(arguments);

			this._refreshState();
		},

		reset: function(){
			// Overrides dijit._FormWidget.reset().
			// Additionally resets the displayed textbox value to ''
			this.textbox.value = '';
			this.inherited(arguments);
		}
	}
);

dijit.selectInputText = function(/*DomNode*/ element, /*Number?*/ start, /*Number?*/ stop){
	// summary:
	//		Select text in the input element argument, from start (default 0), to stop (default end).

	// TODO: use functions in _editor/selection.js?
	var _window = dojo.global;
	var _document = dojo.doc;
	element = dojo.byId(element);
	if(isNaN(start)){ start = 0; }
	if(isNaN(stop)){ stop = element.value ? element.value.length : 0; }
	dijit.focus(element);
	if(_document["selection"] && dojo.body()["createTextRange"]){ // IE
		if(element.createTextRange){
			var r = element.createTextRange();
			r.collapse(true);
			r.moveStart("character", -99999); // move to 0
			r.moveStart("character", start); // delta from 0 is the correct position
			r.moveEnd("character", stop-start);
			r.select();
		}
	}else if(_window["getSelection"]){
		if(element.setSelectionRange){
			element.setSelectionRange(start, stop);
		}
	}
};

}

if(!dojo._hasResource["dijit.Tooltip"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Tooltip"] = true;
dojo.provide("dijit.Tooltip");




dojo.declare(
	"dijit._MasterTooltip",
	[dijit._Widget, dijit._Templated],
	{
		// summary:
		//		Internal widget that holds the actual tooltip markup,
		//		which occurs once per page.
		//		Called by Tooltip widgets which are just containers to hold
		//		the markup
		// tags:
		//		protected

		// duration: Integer
		//		Milliseconds to fade in/fade out
		duration: dijit.defaultDuration,

		templateString: dojo.cache("dijit", "templates/Tooltip.html", "<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\"\n\t><div class=\"dijitTooltipContainer dijitTooltipContents\" dojoAttachPoint=\"containerNode\" role='alert'></div\n\t><div class=\"dijitTooltipConnector\" dojoAttachPoint=\"connectorNode\"></div\n></div>\n"),

		postCreate: function(){
			dojo.body().appendChild(this.domNode);

			this.bgIframe = new dijit.BackgroundIframe(this.domNode);

			// Setup fade-in and fade-out functions.
			this.fadeIn = dojo.fadeIn({ node: this.domNode, duration: this.duration, onEnd: dojo.hitch(this, "_onShow") });
			this.fadeOut = dojo.fadeOut({ node: this.domNode, duration: this.duration, onEnd: dojo.hitch(this, "_onHide") });
		},

		show: function(/*String*/ innerHTML, /*DomNode*/ aroundNode, /*String[]?*/ position, /*Boolean*/ rtl){
			// summary:
			//		Display tooltip w/specified contents to right of specified node
			//		(To left if there's no space on the right, or if rtl == true)

			if(this.aroundNode && this.aroundNode === aroundNode){
				return;
			}

			// reset width; it may have been set by orient() on a previous tooltip show()
			this.domNode.width = "auto";

			if(this.fadeOut.status() == "playing"){
				// previous tooltip is being hidden; wait until the hide completes then show new one
				this._onDeck=arguments;
				return;
			}
			this.containerNode.innerHTML=innerHTML;

			var pos = dijit.placeOnScreenAroundElement(this.domNode, aroundNode, dijit.getPopupAroundAlignment((position && position.length) ? position : dijit.Tooltip.defaultPosition, !rtl), dojo.hitch(this, "orient"));

			// show it
			dojo.style(this.domNode, "opacity", 0);
			this.fadeIn.play();
			this.isShowingNow = true;
			this.aroundNode = aroundNode;
		},

		orient: function(/*DomNode*/ node, /*String*/ aroundCorner, /*String*/ tooltipCorner, /*Object*/ spaceAvailable, /*Object*/ aroundNodeCoords){
			// summary:
			//		Private function to set CSS for tooltip node based on which position it's in.
			//		This is called by the dijit popup code.   It will also reduce the tooltip's
			//		width to whatever width is available
			// tags:
			//		protected
			this.connectorNode.style.top = ""; //reset to default
			
			//Adjust the spaceAvailable width, without changing the spaceAvailable object
			var tooltipSpaceAvaliableWidth = spaceAvailable.w - this.connectorNode.offsetWidth;

			node.className = "dijitTooltip " +
				{
					"BL-TL": "dijitTooltipBelow dijitTooltipABLeft",
					"TL-BL": "dijitTooltipAbove dijitTooltipABLeft",
					"BR-TR": "dijitTooltipBelow dijitTooltipABRight",
					"TR-BR": "dijitTooltipAbove dijitTooltipABRight",
					"BR-BL": "dijitTooltipRight",
					"BL-BR": "dijitTooltipLeft"
				}[aroundCorner + "-" + tooltipCorner];
				
			// reduce tooltip's width to the amount of width available, so that it doesn't overflow screen
			this.domNode.style.width = "auto";
			var size = dojo.contentBox(this.domNode);
			
			var width = Math.min((Math.max(tooltipSpaceAvaliableWidth,1)), size.w);
			var widthWasReduced = width < size.w;
			
			this.domNode.style.width = width+"px";
						
			//Adjust width for tooltips that have a really long word or a nowrap setting
			if(widthWasReduced){
				this.containerNode.style.overflow = "auto"; //temp change to overflow to detect if our tooltip needs to be wider to support the content
				var scrollWidth = this.containerNode.scrollWidth;
				this.containerNode.style.overflow = "visible"; //change it back
				if(scrollWidth > width){
					scrollWidth = scrollWidth + dojo.style(this.domNode,"paddingLeft") + dojo.style(this.domNode,"paddingRight");
					this.domNode.style.width = scrollWidth + "px";
				}
			}
			
			// Reposition the tooltip connector.
			if(tooltipCorner.charAt(0) == 'B' && aroundCorner.charAt(0) == 'B'){
				var mb = dojo.marginBox(node);
				var tooltipConnectorHeight = this.connectorNode.offsetHeight;
				if(mb.h > spaceAvailable.h){
					// The tooltip starts at the top of the page and will extend past the aroundNode
					var aroundNodePlacement = spaceAvailable.h - (aroundNodeCoords.h / 2) - (tooltipConnectorHeight / 2);
					this.connectorNode.style.top = aroundNodePlacement + "px";
					this.connectorNode.style.bottom = "";
				}else{
					// Align center of connector with center of aroundNode, except don't let bottom
					// of connector extend below bottom of tooltip content, or top of connector
					// extend past top of tooltip content
					this.connectorNode.style.bottom = Math.min(
						Math.max(aroundNodeCoords.h/2 - tooltipConnectorHeight/2, 0),
						mb.h - tooltipConnectorHeight) + "px";
					this.connectorNode.style.top = "";
				}
			}else{
				// reset the tooltip back to the defaults
				this.connectorNode.style.top = "";
				this.connectorNode.style.bottom = "";
			}
			
			return Math.max(0, size.w - tooltipSpaceAvaliableWidth);
		},

		_onShow: function(){
			// summary:
			//		Called at end of fade-in operation
			// tags:
			//		protected
			if(dojo.isIE){
				// the arrow won't show up on a node w/an opacity filter
				this.domNode.style.filter="";
			}
		},

		hide: function(aroundNode){
			// summary:
			//		Hide the tooltip

			if(this._onDeck && this._onDeck[1] == aroundNode){
				// this hide request is for a show() that hasn't even started yet;
				// just cancel the pending show()
				this._onDeck=null;
			}else if(this.aroundNode === aroundNode){
				// this hide request is for the currently displayed tooltip
				this.fadeIn.stop();
				this.isShowingNow = false;
				this.aroundNode = null;
				this.fadeOut.play();
			}else{
				// just ignore the call, it's for a tooltip that has already been erased
			}
		},

		_onHide: function(){
			// summary:
			//		Called at end of fade-out operation
			// tags:
			//		protected

			this.domNode.style.cssText="";	// to position offscreen again
			this.containerNode.innerHTML="";
			if(this._onDeck){
				// a show request has been queued up; do it now
				this.show.apply(this, this._onDeck);
				this._onDeck=null;
			}
		}

	}
);

dijit.showTooltip = function(/*String*/ innerHTML, /*DomNode*/ aroundNode, /*String[]?*/ position, /*Boolean*/ rtl){
	// summary:
	//		Display tooltip w/specified contents in specified position.
	//		See description of dijit.Tooltip.defaultPosition for details on position parameter.
	//		If position is not specified then dijit.Tooltip.defaultPosition is used.
	if(!dijit._masterTT){ dijit._masterTT = new dijit._MasterTooltip(); }
	return dijit._masterTT.show(innerHTML, aroundNode, position, rtl);
};

dijit.hideTooltip = function(aroundNode){
	// summary:
	//		Hide the tooltip
	if(!dijit._masterTT){ dijit._masterTT = new dijit._MasterTooltip(); }
	return dijit._masterTT.hide(aroundNode);
};

dojo.declare(
	"dijit.Tooltip",
	dijit._Widget,
	{
		// summary:
		//		Pops up a tooltip (a help message) when you hover over a node.

		// label: String
		//		Text to display in the tooltip.
		//		Specified as innerHTML when creating the widget from markup.
		label: "",

		// showDelay: Integer
		//		Number of milliseconds to wait after hovering over/focusing on the object, before
		//		the tooltip is displayed.
		showDelay: 400,

		// connectId: String|String[]
		//		Id of domNode(s) to attach the tooltip to.
		//		When user hovers over specified dom node, the tooltip will appear.
		connectId: [],

		// position: String[]
		//		See description of `dijit.Tooltip.defaultPosition` for details on position parameter.
		position: [],

		_setConnectIdAttr: function(/*String*/ newId){
			// summary:
			//		Connect to node(s) (specified by id)

			// Remove connections to old nodes (if there are any)
			dojo.forEach(this._connections || [], function(nested){
				dojo.forEach(nested, dojo.hitch(this, "disconnect"));
			}, this);

			// Make connections to nodes in newIds.
			var ary = dojo.isArrayLike(newId) ? newId : (newId ? [newId] : []);
			this._connections = dojo.map(ary, function(id){
				var node = dojo.byId(id);
				return node ? [
					this.connect(node, "onmouseenter", "_onTargetMouseEnter"),
					this.connect(node, "onmouseleave", "_onTargetMouseLeave"),
					this.connect(node, "onfocus", "_onTargetFocus"),
					this.connect(node, "onblur", "_onTargetBlur")
				] : [];
			}, this);
	
			this._set("connectId", newId);

			this._connectIds = ary;	// save as array
		},

		addTarget: function(/*DOMNODE || String*/ node){
			// summary:
			//		Attach tooltip to specified node if it's not already connected

			// TODO: remove in 2.0 and just use set("connectId", ...) interface

			var id = node.id || node;
			if(dojo.indexOf(this._connectIds, id) == -1){
				this.set("connectId", this._connectIds.concat(id));
			}
		},

		removeTarget: function(/*DOMNODE || String*/ node){
			// summary:
			//		Detach tooltip from specified node

			// TODO: remove in 2.0 and just use set("connectId", ...) interface
			
			var id = node.id || node,	// map from DOMNode back to plain id string
				idx = dojo.indexOf(this._connectIds, id);
			if(idx >= 0){
				// remove id (modifies original this._connectIds but that's OK in this case)
				this._connectIds.splice(idx, 1);
				this.set("connectId", this._connectIds);
			}
		},

		buildRendering: function(){
			this.inherited(arguments);
			dojo.addClass(this.domNode,"dijitTooltipData");
		},

		startup: function(){
			this.inherited(arguments);

			// If this tooltip was created in a template, or for some other reason the specified connectId[s]
			// didn't exist during the widget's initialization, then connect now.
			var ids = this.connectId;
			dojo.forEach(dojo.isArrayLike(ids) ? ids : [ids], this.addTarget, this);
		},

		_onTargetMouseEnter: function(/*Event*/ e){
			// summary:
			//		Handler for mouseenter event on the target node
			// tags:
			//		private
			this._onHover(e);
		},

		_onTargetMouseLeave: function(/*Event*/ e){
			// summary:
			//		Handler for mouseleave event on the target node
			// tags:
			//		private
			this._onUnHover(e);
		},

		_onTargetFocus: function(/*Event*/ e){
			// summary:
			//		Handler for focus event on the target node
			// tags:
			//		private

			this._focus = true;
			this._onHover(e);
		},

		_onTargetBlur: function(/*Event*/ e){
			// summary:
			//		Handler for blur event on the target node
			// tags:
			//		private

			this._focus = false;
			this._onUnHover(e);
		},

		_onHover: function(/*Event*/ e){
			// summary:
			//		Despite the name of this method, it actually handles both hover and focus
			//		events on the target node, setting a timer to show the tooltip.
			// tags:
			//		private
			if(!this._showTimer){
				var target = e.target;
				this._showTimer = setTimeout(dojo.hitch(this, function(){this.open(target)}), this.showDelay);
			}
		},

		_onUnHover: function(/*Event*/ e){
			// summary:
			//		Despite the name of this method, it actually handles both mouseleave and blur
			//		events on the target node, hiding the tooltip.
			// tags:
			//		private

			// keep a tooltip open if the associated element still has focus (even though the
			// mouse moved away)
			if(this._focus){ return; }

			if(this._showTimer){
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
			this.close();
		},

		open: function(/*DomNode*/ target){
 			// summary:
			//		Display the tooltip; usually not called directly.
			// tags:
			//		private

			if(this._showTimer){
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
			dijit.showTooltip(this.label || this.domNode.innerHTML, target, this.position, !this.isLeftToRight());

			this._connectNode = target;
			this.onShow(target, this.position);
		},

		close: function(){
			// summary:
			//		Hide the tooltip or cancel timer for show of tooltip
			// tags:
			//		private

			if(this._connectNode){
				// if tooltip is currently shown
				dijit.hideTooltip(this._connectNode);
				delete this._connectNode;
				this.onHide();
			}
			if(this._showTimer){
				// if tooltip is scheduled to be shown (after a brief delay)
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
		},

		onShow: function(target, position){
			// summary:
			//		Called when the tooltip is shown
			// tags:
			//		callback
		},

		onHide: function(){
			// summary:
			//		Called when the tooltip is hidden
			// tags:
			//		callback
		},

		uninitialize: function(){
			this.close();
			this.inherited(arguments);
		}
	}
);

// dijit.Tooltip.defaultPosition: String[]
//		This variable controls the position of tooltips, if the position is not specified to
//		the Tooltip widget or *TextBox widget itself.  It's an array of strings with the following values:
//
//			* before: places tooltip to the left of the target node/widget, or to the right in
//			  the case of RTL scripts like Hebrew and Arabic
//			* after: places tooltip to the right of the target node/widget, or to the left in
//			  the case of RTL scripts like Hebrew and Arabic
//			* above: tooltip goes above target node
//			* below: tooltip goes below target node
//
//		The list is positions is tried, in order, until a position is found where the tooltip fits
//		within the viewport.
//
//		Be careful setting this parameter.  A value of "above" may work fine until the user scrolls
//		the screen so that there's no room above the target node.   Nodes with drop downs, like
//		DropDownButton or FilteringSelect, are especially problematic, in that you need to be sure
//		that the drop down and tooltip don't overlap, even when the viewport is scrolled so that there
//		is only room below (or above) the target node, but not both.
dijit.Tooltip.defaultPosition = ["after", "before"];

}

if(!dojo._hasResource["dijit.form.ValidationTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.ValidationTextBox"] = true;
dojo.provide("dijit.form.ValidationTextBox");






/*=====
	dijit.form.ValidationTextBox.__Constraints = function(){
		// locale: String
		//		locale used for validation, picks up value from this widget's lang attribute
		// _flags_: anything
		//		various flags passed to regExpGen function
		this.locale = "";
		this._flags_ = "";
	}
=====*/

dojo.declare(
	"dijit.form.ValidationTextBox",
	dijit.form.TextBox,
	{
		// summary:
		//		Base class for textbox widgets with the ability to validate content of various types and provide user feedback.
		// tags:
		//		protected

		templateString: dojo.cache("dijit.form", "templates/ValidationTextBox.html", "<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\" role=\"presentation\"\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class=\"dijitReset dijitInputInner\" dojoAttachPoint='textbox,focusNode' autocomplete=\"off\"\n\t\t\t${!nameAttrSetting} type='${type}'\n\t/></div\n></div>\n"),
		baseClass: "dijitTextBox dijitValidationTextBox",

		// required: Boolean
		//		User is required to enter data into this field.
		required: false,

		// promptMessage: String
		//		If defined, display this hint string immediately on focus to the textbox, if empty.
		//		Also displays if the textbox value is Incomplete (not yet valid but will be with additional input).
		//		Think of this like a tooltip that tells the user what to do, not an error message
		//		that tells the user what they've done wrong.
		//
		//		Message disappears when user starts typing.
		promptMessage: "",

		// invalidMessage: String
		// 		The message to display if value is invalid.
		//		The translated string value is read from the message file by default.
		// 		Set to "" to use the promptMessage instead.
		invalidMessage: "$_unset_$",

		// missingMessage: String
		// 		The message to display if value is empty and the field is required.
		//		The translated string value is read from the message file by default.
		// 		Set to "" to use the invalidMessage instead.
		missingMessage: "$_unset_$",

		// message: String
		//		Currently error/prompt message.
		//		When using the default tooltip implementation, this will only be
		//		displayed when the field is focused.
		message: "",

		// constraints: dijit.form.ValidationTextBox.__Constraints
		//		user-defined object needed to pass parameters to the validator functions
		constraints: {},

		// regExp: [extension protected] String
		//		regular expression string used to validate the input
		//		Do not specify both regExp and regExpGen
		regExp: ".*",

		regExpGen: function(/*dijit.form.ValidationTextBox.__Constraints*/ constraints){
			// summary:
			//		Overridable function used to generate regExp when dependent on constraints.
			//		Do not specify both regExp and regExpGen.
			// tags:
			//		extension protected
			return this.regExp; // String
		},

		// state: [readonly] String
		//		Shows current state (ie, validation result) of input (""=Normal, Incomplete, or Error)
		state: "",

		// tooltipPosition: String[]
		//		See description of `dijit.Tooltip.defaultPosition` for details on this parameter.
		tooltipPosition: [],

		_setValueAttr: function(){
			// summary:
			//		Hook so set('value', ...) works.
			this.inherited(arguments);
			this.validate(this._focused);
		},

		validator: function(/*anything*/ value, /*dijit.form.ValidationTextBox.__Constraints*/ constraints){
			// summary:
			//		Overridable function used to validate the text input against the regular expression.
			// tags:
			//		protected
			return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(value) &&
				(!this.required || !this._isEmpty(value)) &&
				(this._isEmpty(value) || this.parse(value, constraints) !== undefined); // Boolean
		},

		_isValidSubset: function(){
			// summary:
			//		Returns true if the value is either already valid or could be made valid by appending characters.
			//		This is used for validation while the user [may be] still typing.
			return this.textbox.value.search(this._partialre) == 0;
		},

		isValid: function(/*Boolean*/ isFocused){
			// summary:
			//		Tests if value is valid.
			//		Can override with your own routine in a subclass.
			// tags:
			//		protected
			return this.validator(this.textbox.value, this.constraints);
		},

		_isEmpty: function(value){
			// summary:
			//		Checks for whitespace
			return (this.trim ? /^\s*$/ : /^$/).test(value); // Boolean
		},

		getErrorMessage: function(/*Boolean*/ isFocused){
			// summary:
			//		Return an error message to show if appropriate
			// tags:
			//		protected
			return (this.required && this._isEmpty(this.textbox.value)) ? this.missingMessage : this.invalidMessage; // String
		},

		getPromptMessage: function(/*Boolean*/ isFocused){
			// summary:
			//		Return a hint message to show when widget is first focused
			// tags:
			//		protected
			return this.promptMessage; // String
		},

		_maskValidSubsetError: true,
		validate: function(/*Boolean*/ isFocused){
			// summary:
			//		Called by oninit, onblur, and onkeypress.
			// description:
			//		Show missing or invalid messages if appropriate, and highlight textbox field.
			// tags:
			//		protected
			var message = "";
			var isValid = this.disabled || this.isValid(isFocused);
			if(isValid){ this._maskValidSubsetError = true; }
			var isEmpty = this._isEmpty(this.textbox.value);
			var isValidSubset = !isValid && isFocused && this._isValidSubset();
			this._set("state", isValid ? "" : (((((!this._hasBeenBlurred || isFocused) && isEmpty) || isValidSubset) && this._maskValidSubsetError) ? "Incomplete" : "Error"));
			dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");

			if(this.state == "Error"){
				this._maskValidSubsetError = isFocused && isValidSubset; // we want the error to show up after a blur and refocus
				message = this.getErrorMessage(isFocused);
			}else if(this.state == "Incomplete"){
				message = this.getPromptMessage(isFocused); // show the prompt whenever the value is not yet complete
				this._maskValidSubsetError = !this._hasBeenBlurred || isFocused; // no Incomplete warnings while focused
			}else if(isEmpty){
				message = this.getPromptMessage(isFocused); // show the prompt whenever there's no error and no text
			}
			this.set("message", message);

			return isValid;
		},

		displayMessage: function(/*String*/ message){
			// summary:
			//		Overridable method to display validation errors/hints.
			//		By default uses a tooltip.
			// tags:
			//		extension
			dijit.hideTooltip(this.domNode);
			if(message && this._focused){
				dijit.showTooltip(message, this.domNode, this.tooltipPosition, !this.isLeftToRight());
			}
		},

		_refreshState: function(){
			// Overrides TextBox._refreshState()
			this.validate(this._focused);
			this.inherited(arguments);
		},

		//////////// INITIALIZATION METHODS ///////////////////////////////////////

		constructor: function(){
			this.constraints = {};
		},

		_setConstraintsAttr: function(/*Object*/ constraints){
			if(!constraints.locale && this.lang){
				constraints.locale = this.lang;
			}
			this._set("constraints", constraints);
			this._computePartialRE();
		},

		_computePartialRE: function(){
			var p = this.regExpGen(this.constraints);
			this.regExp = p;
			var partialre = "";
			// parse the regexp and produce a new regexp that matches valid subsets
			// if the regexp is .* then there's no use in matching subsets since everything is valid
			if(p != ".*"){ this.regExp.replace(/\\.|\[\]|\[.*?[^\\]{1}\]|\{.*?\}|\(\?[=:!]|./g,
				function (re){
					switch(re.charAt(0)){
						case '{':
						case '+':
						case '?':
						case '*':
						case '^':
						case '$':
						case '|':
						case '(':
							partialre += re;
							break;
						case ")":
							partialre += "|$)";
							break;
						 default:
							partialre += "(?:"+re+"|$)";
							break;
					}
				}
			);}
			try{ // this is needed for now since the above regexp parsing needs more test verification
				"".search(partialre);
			}catch(e){ // should never be here unless the original RE is bad or the parsing is bad
				partialre = this.regExp;
				console.warn('RegExp error in ' + this.declaredClass + ': ' + this.regExp);
			} // should never be here unless the original RE is bad or the parsing is bad
			this._partialre = "^(?:" + partialre + ")$";
		},

		postMixInProperties: function(){
			this.inherited(arguments);
			this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
			if(this.invalidMessage == "$_unset_$"){ this.invalidMessage = this.messages.invalidMessage; }
			if(!this.invalidMessage){ this.invalidMessage = this.promptMessage; }
			if(this.missingMessage == "$_unset_$"){ this.missingMessage = this.messages.missingMessage; }
			if(!this.missingMessage){ this.missingMessage = this.invalidMessage; }
			this._setConstraintsAttr(this.constraints); // this needs to happen now (and later) due to codependency on _set*Attr calls attachPoints
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			this.inherited(arguments);	// call FormValueWidget._setDisabledAttr()
			this._refreshState();
		},

		_setRequiredAttr: function(/*Boolean*/ value){
			this._set("required", value);
			dijit.setWaiState(this.focusNode, "required", value);
			this._refreshState();
		},

		_setMessageAttr: function(/*String*/ message){
			this._set("message", message);
			this.displayMessage(message);
		},

		reset:function(){
			// Overrides dijit.form.TextBox.reset() by also
			// hiding errors about partial matches
			this._maskValidSubsetError = true;
			this.inherited(arguments);
		},

		_onBlur: function(){
			// the message still exists but for back-compat, and to erase the tooltip
			// (if the message is being displayed as a tooltip), call displayMessage('')
			this.displayMessage('');

			this.inherited(arguments);
		}
	}
);

dojo.declare(
	"dijit.form.MappedTextBox",
	dijit.form.ValidationTextBox,
	{
		// summary:
		//		A dijit.form.ValidationTextBox subclass which provides a base class for widgets that have
		//		a visible formatted display value, and a serializable
		//		value in a hidden input field which is actually sent to the server.
		// description:
		//		The visible display may
		//		be locale-dependent and interactive.  The value sent to the server is stored in a hidden
		//		input field which uses the `name` attribute declared by the original widget.  That value sent
		//		to the server is defined by the dijit.form.MappedTextBox.serialize method and is typically
		//		locale-neutral.
		// tags:
		//		protected

		postMixInProperties: function(){
			this.inherited(arguments);

			// we want the name attribute to go to the hidden <input>, not the displayed <input>,
			// so override _FormWidget.postMixInProperties() setting of nameAttrSetting
			this.nameAttrSetting = "";
		},

		serialize: function(/*anything*/ val, /*Object?*/ options){
			// summary:
			//		Overridable function used to convert the get('value') result to a canonical
			//		(non-localized) string.  For example, will print dates in ISO format, and
			//		numbers the same way as they are represented in javascript.
			// tags:
			//		protected extension
			return val.toString ? val.toString() : ""; // String
		},

		toString: function(){
			// summary:
			//		Returns widget as a printable string using the widget's value
			// tags:
			//		protected
			var val = this.filter(this.get('value')); // call filter in case value is nonstring and filter has been customized
			return val != null ? (typeof val == "string" ? val : this.serialize(val, this.constraints)) : ""; // String
		},

		validate: function(){
			// Overrides `dijit.form.TextBox.validate`
			this.valueNode.value = this.toString();
			return this.inherited(arguments);
		},

		buildRendering: function(){
			// Overrides `dijit._Templated.buildRendering`

			this.inherited(arguments);

			// Create a hidden <input> node with the serialized value used for submit
			// (as opposed to the displayed value).
			// Passing in name as markup rather than calling dojo.create() with an attrs argument
			// to make dojo.query(input[name=...]) work on IE. (see #8660)
			this.valueNode = dojo.place("<input type='hidden'" + (this.name ? " name='" + this.name.replace(/'/g, "&quot;") + "'" : "") + "/>", this.textbox, "after");
		},

		reset: function(){
			// Overrides `dijit.form.ValidationTextBox.reset` to
			// reset the hidden textbox value to ''
			this.valueNode.value = '';
			this.inherited(arguments);
		}
	}
);

/*=====
	dijit.form.RangeBoundTextBox.__Constraints = function(){
		// min: Number
		//		Minimum signed value.  Default is -Infinity
		// max: Number
		//		Maximum signed value.  Default is +Infinity
		this.min = min;
		this.max = max;
	}
=====*/

dojo.declare(
	"dijit.form.RangeBoundTextBox",
	dijit.form.MappedTextBox,
	{
		// summary:
		//		Base class for textbox form widgets which defines a range of valid values.

		// rangeMessage: String
		//		The message to display if value is out-of-range
		rangeMessage: "",

		/*=====
		// constraints: dijit.form.RangeBoundTextBox.__Constraints
		constraints: {},
		======*/

		rangeCheck: function(/*Number*/ primitive, /*dijit.form.RangeBoundTextBox.__Constraints*/ constraints){
			// summary:
			//		Overridable function used to validate the range of the numeric input value.
			// tags:
			//		protected
			return	("min" in constraints? (this.compare(primitive,constraints.min) >= 0) : true) &&
				("max" in constraints? (this.compare(primitive,constraints.max) <= 0) : true); // Boolean
		},

		isInRange: function(/*Boolean*/ isFocused){
			// summary:
			//		Tests if the value is in the min/max range specified in constraints
			// tags:
			//		protected
			return this.rangeCheck(this.get('value'), this.constraints);
		},

		_isDefinitelyOutOfRange: function(){
			// summary:
			//		Returns true if the value is out of range and will remain
			//		out of range even if the user types more characters
			var val = this.get('value');
			var isTooLittle = false;
			var isTooMuch = false;
			if("min" in this.constraints){
				var min = this.constraints.min;
				min = this.compare(val, ((typeof min == "number") && min >= 0 && val !=0) ? 0 : min);
				isTooLittle = (typeof min == "number") && min < 0;
			}
			if("max" in this.constraints){
				var max = this.constraints.max;
				max = this.compare(val, ((typeof max != "number") || max > 0) ? max : 0);
				isTooMuch = (typeof max == "number") && max > 0;
			}
			return isTooLittle || isTooMuch;
		},

		_isValidSubset: function(){
			// summary:
			//		Overrides `dijit.form.ValidationTextBox._isValidSubset`.
			//		Returns true if the input is syntactically valid, and either within
			//		range or could be made in range by more typing.
			return this.inherited(arguments) && !this._isDefinitelyOutOfRange();
		},

		isValid: function(/*Boolean*/ isFocused){
			// Overrides dijit.form.ValidationTextBox.isValid to check that the value is also in range.
			return this.inherited(arguments) &&
				((this._isEmpty(this.textbox.value) && !this.required) || this.isInRange(isFocused)); // Boolean
		},

		getErrorMessage: function(/*Boolean*/ isFocused){
			// Overrides dijit.form.ValidationTextBox.getErrorMessage to print "out of range" message if appropriate
			var v = this.get('value');
			if(v !== null && v !== '' && v !== undefined && (typeof v != "number" || !isNaN(v)) && !this.isInRange(isFocused)){ // don't check isInRange w/o a real value
				return this.rangeMessage; // String
			}
			return this.inherited(arguments);
		},

		postMixInProperties: function(){
			this.inherited(arguments);
			if(!this.rangeMessage){
				this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
				this.rangeMessage = this.messages.rangeMessage;
			}
		},

		_setConstraintsAttr: function(/*Object*/ constraints){
			this.inherited(arguments);
			if(this.focusNode){ // not set when called from postMixInProperties
				if(this.constraints.min !== undefined){
					dijit.setWaiState(this.focusNode, "valuemin", this.constraints.min);
				}else{
					dijit.removeWaiState(this.focusNode, "valuemin");
				}
				if(this.constraints.max !== undefined){
					dijit.setWaiState(this.focusNode, "valuemax", this.constraints.max);
				}else{
					dijit.removeWaiState(this.focusNode, "valuemax");
				}
			}
		},

		_setValueAttr: function(/*Number*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so set('value', ...) works.

			dijit.setWaiState(this.focusNode, "valuenow", value);
			this.inherited(arguments);
		}
	}
);

}

if(!dojo._hasResource["dijit.form._DateTimeTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._DateTimeTextBox"] = true;
dojo.provide("dijit.form._DateTimeTextBox");







new Date("X"); // workaround for #11279, new Date("") == NaN

/*=====
dojo.declare(
	"dijit.form._DateTimeTextBox.__Constraints",
	[dijit.form.RangeBoundTextBox.__Constraints, dojo.date.locale.__FormatOptions], {
	// summary:
	//		Specifies both the rules on valid/invalid values (first/last date/time allowed),
	//		and also formatting options for how the date/time is displayed.
	// example:
	//		To restrict to dates within 2004, displayed in a long format like "December 25, 2005":
	//	|		{min:'2004-01-01',max:'2004-12-31', formatLength:'long'}
});
=====*/

dojo.declare(
	"dijit.form._DateTimeTextBox",
	[ dijit.form.RangeBoundTextBox, dijit._HasDropDown ],
	{
		// summary:
		//		Base class for validating, serializable, range-bound date or time text box.

		templateString: dojo.cache("dijit.form", "templates/DropDownBox.html", "<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),

		// hasDownArrow: [const] Boolean
		//		Set this textbox to display a down arrow button, to open the drop down list.
		hasDownArrow: true,

		// openOnClick: [const] Boolean
		//		Set to true to open drop down upon clicking anywhere on the textbox.
		openOnClick: true,

		/*=====
		// constraints: dijit.form._DateTimeTextBox.__Constraints
		//		Despite the name, this parameter specifies both constraints on the input
		//		(including starting/ending dates/times allowed) as well as
		//		formatting options like whether the date is displayed in long (ex: December 25, 2005)
		//		or short (ex: 12/25/2005) format.  See `dijit.form._DateTimeTextBox.__Constraints` for details.
		constraints: {},
		======*/

		// Override ValidationTextBox.regExpGen().... we use a reg-ex generating function rather
		// than a straight regexp to deal with locale  (plus formatting options too?)
		regExpGen: dojo.date.locale.regexp,

		// datePackage: String
		//		JavaScript namespace to find calendar routines.	 Uses Gregorian calendar routines
		//		at dojo.date, by default.
		datePackage: "dojo.date",

		// Override _FormWidget.compare() to work for dates/times
		compare: function(/*Date*/ val1, /*Date*/ val2){
			return dojo.date.compare(val1, val2, this._selector);
		},

		// flag to _HasDropDown to make drop down Calendar width == <input> width
		forceWidth: true,

		format: function(/*Date*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			// summary:
			//		Formats the value as a Date, according to specified locale (second argument)
			// tags:
			//		protected
			if(!value){ return ''; }
			return this.dateLocaleModule.format(value, constraints);
		},

		"parse": function(/*String*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			// summary:
			//		Parses as string as a Date, according to constraints
			// tags:
			//		protected

			return this.dateLocaleModule.parse(value, constraints) || (this._isEmpty(value) ? null : undefined);	 // Date
		},

		// Overrides ValidationTextBox.serialize() to serialize a date in canonical ISO format.
		serialize: function(/*anything*/ val, /*Object?*/ options){
			if(val.toGregorian){
				val = val.toGregorian();
			}
			return dojo.date.stamp.toISOString(val, options);
		},

		// dropDownDefaultValue: Date
		//		The default value to focus in the popupClass widget when the textbox value is empty.
		dropDownDefaultValue : new Date(),

		// value: Date
		//		The value of this widget as a JavaScript Date object.  Use get("value") / set("value", val) to manipulate.
		//		When passed to the parser in markup, must be specified according to `dojo.date.stamp.fromISOString`
		value: new Date(""),	// value.toString()="NaN"

		_blankValue: null,	// used by filter() when the textbox is blank

		// popupClass: [protected extension] String
		//		Name of the popup widget class used to select a date/time.
		//		Subclasses should specify this.
		popupClass: "", // default is no popup = text only


		// _selector: [protected extension] String
		//		Specifies constraints.selector passed to dojo.date functions, should be either
		//		"date" or "time".
		//		Subclass must specify this.
		_selector: "",

		constructor: function(/*Object*/ args){
			var dateClass = args.datePackage ? args.datePackage + ".Date" : "Date";
			this.dateClassObj = dojo.getObject(dateClass, false);
			this.value = new this.dateClassObj("");

			this.datePackage = args.datePackage || this.datePackage;
			this.dateLocaleModule = dojo.getObject(this.datePackage + ".locale", false);
			this.regExpGen = this.dateLocaleModule.regexp;
			this._invalidDate = dijit.form._DateTimeTextBox.prototype.value.toString();
		},

		buildRendering: function(){
			this.inherited(arguments);

			if(!this.hasDownArrow){
				this._buttonNode.style.display = "none";
			}

			// If openOnClick is true, we basically just want to treat the whole widget as the
			// button.  We need to do that also if the actual drop down button will be hidden,
			// so that there's a mouse method for opening the drop down.
			if(this.openOnClick || !this.hasDownArrow){
				this._buttonNode = this.domNode;
				this.baseClass += " dijitComboBoxOpenOnClick";
			}
		},

		_setConstraintsAttr: function(/*Object*/ constraints){
			constraints.selector = this._selector;
			constraints.fullYear = true; // see #5465 - always format with 4-digit years
			var fromISO = dojo.date.stamp.fromISOString;
			if(typeof constraints.min == "string"){ constraints.min = fromISO(constraints.min); }
 			if(typeof constraints.max == "string"){ constraints.max = fromISO(constraints.max); }
			this.inherited(arguments, [constraints]);
		},

		_isInvalidDate: function(/*Date*/ value){
			// summary:
			//		Runs various tests on the value, checking for invalid conditions
			// tags:
			//		private
			return !value || isNaN(value) || typeof value != "object" || value.toString() == this._invalidDate;
		},

		_setValueAttr: function(/*Date|String*/ value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			// summary:
			//		Sets the date on this textbox. Note: value can be a JavaScript Date literal or a string to be parsed.
			if(value !== undefined){
				if(typeof value == "string"){
					value = dojo.date.stamp.fromISOString(value);
				}
				if(this._isInvalidDate(value)){
					value = null;
				}
				if(value instanceof Date && !(this.dateClassObj instanceof Date)){
					value = new this.dateClassObj(value);
				}
			}
			this.inherited(arguments, [value, priorityChange, formattedValue]);
			if(this.dropDown){
				this.dropDown.set('value', value, false);
			}
		},

		_set: function(attr, value){
			// Avoid spurious watch() notifications when value is changed to new Date object w/the same value
			if(attr == "value"
				&& this.value instanceof Date
				&& ((this._isInvalidDate(this.value) && this._isInvalidDate(value))
				  	|| this.compare(value, this.value) == 0)){
				return;
			}
			this.inherited(arguments);
		},

		_setDropDownDefaultValueAttr: function(/*Date*/ val){
			if(this._isInvalidDate(val)){
				// convert null setting into today's date, since there needs to be *some* default at all times.
				 val = new this.dateClassObj()
						}
			this.dropDownDefaultValue = val;
		},

		openDropDown: function(/*Function*/ callback){
			// rebuild drop down every time, so that constraints get copied (#6002)
			if(this.dropDown){
				this.dropDown.destroy();
			}
			var PopupProto = dojo.getObject(this.popupClass, false),
				textBox = this,
				value = this.get("value");
			this.dropDown = new PopupProto({
				onChange: function(value){
						// this will cause InlineEditBox and other handlers to do stuff so make sure it's last
						dijit.form._DateTimeTextBox.superclass._setValueAttr.call(textBox, value, true);
					},
					id: this.id + "_popup",
					dir: textBox.dir,
					lang: textBox.lang,
				value: value,
				currentFocus: !this._isInvalidDate(value) ? value : this.dropDownDefaultValue,
					constraints: textBox.constraints,
				filterString: textBox.filterString, // for TimeTextBox, to filter times shown

					datePackage: textBox.datePackage,

					isDisabledDate: function(/*Date*/ date){
						// summary:
						// 	disables dates outside of the min/max of the _DateTimeTextBox
						return !textBox.rangeCheck(date, textBox.constraints);
					}
				});

			this.inherited(arguments);
		},

		_getDisplayedValueAttr: function(){
			return this.textbox.value;
		},

		_setDisplayedValueAttr: function(/*String*/ value, /*Boolean?*/ priorityChange){
			this._setValueAttr(this.parse(value, this.constraints), priorityChange, value);
		}
	}
);

}

if(!dojo._hasResource["dijit.form.DateTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.DateTextBox"] = true;
dojo.provide("dijit.form.DateTextBox");




dojo.declare(
	"dijit.form.DateTextBox",
	dijit.form._DateTimeTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound date text box with a drop down calendar
		//
		//		Example:
		// |	new dijit.form.DateTextBox({value: new Date(2009, 0, 20)})
		//
		//		Example:
		// |	<input dojotype='dijit.form.DateTextBox' value='2009-01-20'>

		baseClass: "dijitTextBox dijitComboBox dijitDateTextBox",
		popupClass: "dijit.Calendar",
		_selector: "date",

		// value: Date
		//		The value of this widget as a JavaScript Date object, with only year/month/day specified.
		//		If specified in markup, use the format specified in `dojo.date.stamp.fromISOString`.
		//		set("value", ...) accepts either a Date object or a string.
		value: new Date("")	// value.toString()="NaN"
	}
);

}

if(!dojo._hasResource["dojo.number"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.number"] = true;
dojo.provide("dojo.number");





dojo.getObject("number", true, dojo);

/*=====
dojo.number = {
	// summary: localized formatting and parsing routines for Number
}

dojo.number.__FormatOptions = function(){
	//	pattern: String?
	//		override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	//		with this string.  Default value is based on locale.  Overriding this property will defeat
	//		localization.  Literal characters in patterns are not supported.
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific (not yet supported), percent, currency. decimal by default.
	//	places: Number?
	//		fixed number of decimal places to show.  This overrides any
	//		information in the provided pattern.
	//	round: Number?
	//		5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
	//		means do not round.
	//	locale: String?
	//		override the locale used to determine formatting rules
	//	fractional: Boolean?
	//		If false, show no decimal places, overriding places and pattern settings.
	this.pattern = pattern;
	this.type = type;
	this.places = places;
	this.round = round;
	this.locale = locale;
	this.fractional = fractional;
}
=====*/

dojo.number.format = function(/*Number*/value, /*dojo.number.__FormatOptions?*/options){
	// summary:
	//		Format a Number as a String, using locale-specific settings
	// description:
	//		Create a string from a Number using a known localized pattern.
	//		Formatting patterns appropriate to the locale are chosen from the
	//		[Common Locale Data Repository](http://unicode.org/cldr) as well as the appropriate symbols and
	//		delimiters.
	//		If value is Infinity, -Infinity, or is not a valid JavaScript number, return null.
	// value:
	//		the number to be formatted

	options = dojo.mixin({}, options || {});
	var locale = dojo.i18n.normalizeLocale(options.locale),
		bundle = dojo.i18n.getLocalization("dojo.cldr", "number", locale);
	options.customs = bundle;
	var pattern = options.pattern || bundle[(options.type || "decimal") + "Format"];
	if(isNaN(value) || Math.abs(value) == Infinity){ return null; } // null
	return dojo.number._applyPattern(value, pattern, options); // String
};

//dojo.number._numberPatternRE = /(?:[#0]*,?)*[#0](?:\.0*#*)?/; // not precise, but good enough
dojo.number._numberPatternRE = /[#0,]*[#0](?:\.0*#*)?/; // not precise, but good enough

dojo.number._applyPattern = function(/*Number*/value, /*String*/pattern, /*dojo.number.__FormatOptions?*/options){
	// summary:
	//		Apply pattern to format value as a string using options. Gives no
	//		consideration to local customs.
	// value:
	//		the number to be formatted.
	// pattern:
	//		a pattern string as described by
	//		[unicode.org TR35](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	// options: dojo.number.__FormatOptions?
	//		_applyPattern is usually called via `dojo.number.format()` which
	//		populates an extra property in the options parameter, "customs".
	//		The customs object specifies group and decimal parameters if set.

	//TODO: support escapes
	options = options || {};
	var group = options.customs.group,
		decimal = options.customs.decimal,
		patternList = pattern.split(';'),
		positivePattern = patternList[0];
	pattern = patternList[(value < 0) ? 1 : 0] || ("-" + positivePattern);

	//TODO: only test against unescaped
	if(pattern.indexOf('%') != -1){
		value *= 100;
	}else if(pattern.indexOf('\u2030') != -1){
		value *= 1000; // per mille
	}else if(pattern.indexOf('\u00a4') != -1){
		group = options.customs.currencyGroup || group;//mixins instead?
		decimal = options.customs.currencyDecimal || decimal;// Should these be mixins instead?
		pattern = pattern.replace(/\u00a4{1,3}/, function(match){
			var prop = ["symbol", "currency", "displayName"][match.length-1];
			return options[prop] || options.currency || "";
		});
	}else if(pattern.indexOf('E') != -1){
		throw new Error("exponential notation not supported");
	}
	
	//TODO: support @ sig figs?
	var numberPatternRE = dojo.number._numberPatternRE;
	var numberPattern = positivePattern.match(numberPatternRE);
	if(!numberPattern){
		throw new Error("unable to find a number expression in pattern: "+pattern);
	}
	if(options.fractional === false){ options.places = 0; }
	return pattern.replace(numberPatternRE,
		dojo.number._formatAbsolute(value, numberPattern[0], {decimal: decimal, group: group, places: options.places, round: options.round}));
};

dojo.number.round = function(/*Number*/value, /*Number?*/places, /*Number?*/increment){
	//	summary:
	//		Rounds to the nearest value with the given number of decimal places, away from zero
	//	description:
	//		Rounds to the nearest value with the given number of decimal places, away from zero if equal.
	//		Similar to Number.toFixed(), but compensates for browser quirks. Rounding can be done by
	//		fractional increments also, such as the nearest quarter.
	//		NOTE: Subject to floating point errors.  See dojox.math.round for experimental workaround.
	//	value:
	//		The number to round
	//	places:
	//		The number of decimal places where rounding takes place.  Defaults to 0 for whole rounding.
	//		Must be non-negative.
	//	increment:
	//		Rounds next place to nearest value of increment/10.  10 by default.
	//	example:
	//		>>> dojo.number.round(-0.5)
	//		-1
	//		>>> dojo.number.round(162.295, 2)
	//		162.29  // note floating point error.  Should be 162.3
	//		>>> dojo.number.round(10.71, 0, 2.5)
	//		10.75
	var factor = 10 / (increment || 10);
	return (factor * +value).toFixed(places) / factor; // Number
};

if((0.9).toFixed() == 0){
	// (isIE) toFixed() bug workaround: Rounding fails on IE when most significant digit
	// is just after the rounding place and is >=5
	(function(){
		var round = dojo.number.round;
		dojo.number.round = function(v, p, m){
			var d = Math.pow(10, -p || 0), a = Math.abs(v);
			if(!v || a >= d || a * Math.pow(10, p + 1) < 5){
				d = 0;
			}
			return round(v, p, m) + (v > 0 ? d : -d);
		};
	})();
}

/*=====
dojo.number.__FormatAbsoluteOptions = function(){
	//	decimal: String?
	//		the decimal separator
	//	group: String?
	//		the group separator
	//	places: Number?|String?
	//		number of decimal places.  the range "n,m" will format to m places.
	//	round: Number?
	//		5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
	//		means don't round.
	this.decimal = decimal;
	this.group = group;
	this.places = places;
	this.round = round;
}
=====*/

dojo.number._formatAbsolute = function(/*Number*/value, /*String*/pattern, /*dojo.number.__FormatAbsoluteOptions?*/options){
	// summary:
	//		Apply numeric pattern to absolute value using options. Gives no
	//		consideration to local customs.
	// value:
	//		the number to be formatted, ignores sign
	// pattern:
	//		the number portion of a pattern (e.g. `#,##0.00`)
	options = options || {};
	if(options.places === true){options.places=0;}
	if(options.places === Infinity){options.places=6;} // avoid a loop; pick a limit

	var patternParts = pattern.split("."),
		comma = typeof options.places == "string" && options.places.indexOf(","),
		maxPlaces = options.places;
	if(comma){
		maxPlaces = options.places.substring(comma + 1);
	}else if(!(maxPlaces >= 0)){
		maxPlaces = (patternParts[1] || []).length;
	}
	if(!(options.round < 0)){
		value = dojo.number.round(value, maxPlaces, options.round);
	}

	var valueParts = String(Math.abs(value)).split("."),
		fractional = valueParts[1] || "";
	if(patternParts[1] || options.places){
		if(comma){
			options.places = options.places.substring(0, comma);
		}
		// Pad fractional with trailing zeros
		var pad = options.places !== undefined ? options.places : (patternParts[1] && patternParts[1].lastIndexOf("0") + 1);
		if(pad > fractional.length){
			valueParts[1] = dojo.string.pad(fractional, pad, '0', true);
		}

		// Truncate fractional
		if(maxPlaces < fractional.length){
			valueParts[1] = fractional.substr(0, maxPlaces);
		}
	}else{
		if(valueParts[1]){ valueParts.pop(); }
	}

	// Pad whole with leading zeros
	var patternDigits = patternParts[0].replace(',', '');
	pad = patternDigits.indexOf("0");
	if(pad != -1){
		pad = patternDigits.length - pad;
		if(pad > valueParts[0].length){
			valueParts[0] = dojo.string.pad(valueParts[0], pad);
		}

		// Truncate whole
		if(patternDigits.indexOf("#") == -1){
			valueParts[0] = valueParts[0].substr(valueParts[0].length - pad);
		}
	}

	// Add group separators
	var index = patternParts[0].lastIndexOf(','),
		groupSize, groupSize2;
	if(index != -1){
		groupSize = patternParts[0].length - index - 1;
		var remainder = patternParts[0].substr(0, index);
		index = remainder.lastIndexOf(',');
		if(index != -1){
			groupSize2 = remainder.length - index - 1;
		}
	}
	var pieces = [];
	for(var whole = valueParts[0]; whole;){
		var off = whole.length - groupSize;
		pieces.push((off > 0) ? whole.substr(off) : whole);
		whole = (off > 0) ? whole.slice(0, off) : "";
		if(groupSize2){
			groupSize = groupSize2;
			delete groupSize2;
		}
	}
	valueParts[0] = pieces.reverse().join(options.group || ",");

	return valueParts.join(options.decimal || ".");
};

/*=====
dojo.number.__RegexpOptions = function(){
	//	pattern: String?
	//		override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	//		with this string.  Default value is based on locale.  Overriding this property will defeat
	//		localization.
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific (not yet supported), percent, currency. decimal by default.
	//	locale: String?
	//		override the locale used to determine formatting rules
	//	strict: Boolean?
	//		strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
	//		Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
	//	places: Number|String?
	//		number of decimal places to accept: Infinity, a positive number, or
	//		a range "n,m".  Defined by pattern or Infinity if pattern not provided.
	this.pattern = pattern;
	this.type = type;
	this.locale = locale;
	this.strict = strict;
	this.places = places;
}
=====*/
dojo.number.regexp = function(/*dojo.number.__RegexpOptions?*/options){
	//	summary:
	//		Builds the regular needed to parse a number
	//	description:
	//		Returns regular expression with positive and negative match, group
	//		and decimal separators
	return dojo.number._parseInfo(options).regexp; // String
};

dojo.number._parseInfo = function(/*Object?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale),
		bundle = dojo.i18n.getLocalization("dojo.cldr", "number", locale),
		pattern = options.pattern || bundle[(options.type || "decimal") + "Format"],
//TODO: memoize?
		group = bundle.group,
		decimal = bundle.decimal,
		factor = 1;

	if(pattern.indexOf('%') != -1){
		factor /= 100;
	}else if(pattern.indexOf('\u2030') != -1){
		factor /= 1000; // per mille
	}else{
		var isCurrency = pattern.indexOf('\u00a4') != -1;
		if(isCurrency){
			group = bundle.currencyGroup || group;
			decimal = bundle.currencyDecimal || decimal;
		}
	}

	//TODO: handle quoted escapes
	var patternList = pattern.split(';');
	if(patternList.length == 1){
		patternList.push("-" + patternList[0]);
	}

	var re = dojo.regexp.buildGroupRE(patternList, function(pattern){
		pattern = "(?:"+dojo.regexp.escapeString(pattern, '.')+")";
		return pattern.replace(dojo.number._numberPatternRE, function(format){
			var flags = {
				signed: false,
				separator: options.strict ? group : [group,""],
				fractional: options.fractional,
				decimal: decimal,
				exponent: false
				},

				parts = format.split('.'),
				places = options.places;

			// special condition for percent (factor != 1)
			// allow decimal places even if not specified in pattern
			if(parts.length == 1 && factor != 1){
			    parts[1] = "###";
			}
			if(parts.length == 1 || places === 0){
				flags.fractional = false;
			}else{
				if(places === undefined){ places = options.pattern ? parts[1].lastIndexOf('0') + 1 : Infinity; }
				if(places && options.fractional == undefined){flags.fractional = true;} // required fractional, unless otherwise specified
				if(!options.places && (places < parts[1].length)){ places += "," + parts[1].length; }
				flags.places = places;
			}
			var groups = parts[0].split(',');
			if(groups.length > 1){
				flags.groupSize = groups.pop().length;
				if(groups.length > 1){
					flags.groupSize2 = groups.pop().length;
				}
			}
			return "("+dojo.number._realNumberRegexp(flags)+")";
		});
	}, true);

	if(isCurrency){
		// substitute the currency symbol for the placeholder in the pattern
		re = re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g, function(match, before, target, after){
			var prop = ["symbol", "currency", "displayName"][target.length-1],
				symbol = dojo.regexp.escapeString(options[prop] || options.currency || "");
			before = before ? "[\\s\\xa0]" : "";
			after = after ? "[\\s\\xa0]" : "";
			if(!options.strict){
				if(before){before += "*";}
				if(after){after += "*";}
				return "(?:"+before+symbol+after+")?";
			}
			return before+symbol+after;
		});
	}

//TODO: substitute localized sign/percent/permille/etc.?

	// normalize whitespace and return
	return {regexp: re.replace(/[\xa0 ]/g, "[\\s\\xa0]"), group: group, decimal: decimal, factor: factor}; // Object
};

/*=====
dojo.number.__ParseOptions = function(){
	//	pattern: String?
	//		override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	//		with this string.  Default value is based on locale.  Overriding this property will defeat
	//		localization.  Literal characters in patterns are not supported.
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific (not yet supported), percent, currency. decimal by default.
	//	locale: String?
	//		override the locale used to determine formatting rules
	//	strict: Boolean?
	//		strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
	//		Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
	//	fractional: Boolean?|Array?
	//		Whether to include the fractional portion, where the number of decimal places are implied by pattern
	//		or explicit 'places' parameter.  The value [true,false] makes the fractional portion optional.
	this.pattern = pattern;
	this.type = type;
	this.locale = locale;
	this.strict = strict;
	this.fractional = fractional;
}
=====*/
dojo.number.parse = function(/*String*/expression, /*dojo.number.__ParseOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Number, using
	//		locale-specific settings.
	// description:
	//		Create a Number from a string using a known localized pattern.
	//		Formatting patterns are chosen appropriate to the locale
	//		and follow the syntax described by
	//		[unicode.org TR35](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
    	//		Note that literal characters in patterns are not supported.
	// expression:
	//		A string representation of a Number
	var info = dojo.number._parseInfo(options),
		results = (new RegExp("^"+info.regexp+"$")).exec(expression);
	if(!results){
		return NaN; //NaN
	}
	var absoluteMatch = results[1]; // match for the positive expression
	if(!results[1]){
		if(!results[2]){
			return NaN; //NaN
		}
		// matched the negative pattern
		absoluteMatch =results[2];
		info.factor *= -1;
	}

	// Transform it to something Javascript can parse as a number.  Normalize
	// decimal point and strip out group separators or alternate forms of whitespace
	absoluteMatch = absoluteMatch.
		replace(new RegExp("["+info.group + "\\s\\xa0"+"]", "g"), "").
		replace(info.decimal, ".");
	// Adjust for negative sign, percent, etc. as necessary
	return absoluteMatch * info.factor; //Number
};

/*=====
dojo.number.__RealNumberRegexpFlags = function(){
	//	places: Number?
	//		The integer number of decimal places or a range given as "n,m".  If
	//		not given, the decimal part is optional and the number of places is
	//		unlimited.
	//	decimal: String?
	//		A string for the character used as the decimal point.  Default
	//		is ".".
	//	fractional: Boolean?|Array?
	//		Whether decimal places are used.  Can be true, false, or [true,
	//		false].  Default is [true, false] which means optional.
	//	exponent: Boolean?|Array?
	//		Express in exponential notation.  Can be true, false, or [true,
	//		false]. Default is [true, false], (i.e. will match if the
	//		exponential part is present are not).
	//	eSigned: Boolean?|Array?
	//		The leading plus-or-minus sign on the exponent.  Can be true,
	//		false, or [true, false].  Default is [true, false], (i.e. will
	//		match if it is signed or unsigned).  flags in regexp.integer can be
	//		applied.
	this.places = places;
	this.decimal = decimal;
	this.fractional = fractional;
	this.exponent = exponent;
	this.eSigned = eSigned;
}
=====*/

dojo.number._realNumberRegexp = function(/*dojo.number.__RealNumberRegexpFlags?*/flags){
	// summary:
	//		Builds a regular expression to match a real number in exponential
	//		notation

	// assign default values to missing parameters
	flags = flags || {};
	//TODO: use mixin instead?
	if(!("places" in flags)){ flags.places = Infinity; }
	if(typeof flags.decimal != "string"){ flags.decimal = "."; }
	if(!("fractional" in flags) || /^0/.test(flags.places)){ flags.fractional = [true, false]; }
	if(!("exponent" in flags)){ flags.exponent = [true, false]; }
	if(!("eSigned" in flags)){ flags.eSigned = [true, false]; }

	var integerRE = dojo.number._integerRegexp(flags),
		decimalRE = dojo.regexp.buildGroupRE(flags.fractional,
		function(q){
			var re = "";
			if(q && (flags.places!==0)){
				re = "\\" + flags.decimal;
				if(flags.places == Infinity){
					re = "(?:" + re + "\\d+)?";
				}else{
					re += "\\d{" + flags.places + "}";
				}
			}
			return re;
		},
		true
	);

	var exponentRE = dojo.regexp.buildGroupRE(flags.exponent,
		function(q){
			if(q){ return "([eE]" + dojo.number._integerRegexp({ signed: flags.eSigned}) + ")"; }
			return "";
		}
	);

	var realRE = integerRE + decimalRE;
	// allow for decimals without integers, e.g. .25
	if(decimalRE){realRE = "(?:(?:"+ realRE + ")|(?:" + decimalRE + "))";}
	return realRE + exponentRE; // String
};

/*=====
dojo.number.__IntegerRegexpFlags = function(){
	//	signed: Boolean?
	//		The leading plus-or-minus sign. Can be true, false, or `[true,false]`.
	//		Default is `[true, false]`, (i.e. will match if it is signed
	//		or unsigned).
	//	separator: String?
	//		The character used as the thousands separator. Default is no
	//		separator. For more than one symbol use an array, e.g. `[",", ""]`,
	//		makes ',' optional.
	//	groupSize: Number?
	//		group size between separators
	//	groupSize2: Number?
	//		second grouping, where separators 2..n have a different interval than the first separator (for India)
	this.signed = signed;
	this.separator = separator;
	this.groupSize = groupSize;
	this.groupSize2 = groupSize2;
}
=====*/

dojo.number._integerRegexp = function(/*dojo.number.__IntegerRegexpFlags?*/flags){
	// summary:
	//		Builds a regular expression that matches an integer

	// assign default values to missing parameters
	flags = flags || {};
	if(!("signed" in flags)){ flags.signed = [true, false]; }
	if(!("separator" in flags)){
		flags.separator = "";
	}else if(!("groupSize" in flags)){
		flags.groupSize = 3;
	}

	var signRE = dojo.regexp.buildGroupRE(flags.signed,
		function(q){ return q ? "[-+]" : ""; },
		true
	);

	var numberRE = dojo.regexp.buildGroupRE(flags.separator,
		function(sep){
			if(!sep){
				return "(?:\\d+)";
			}

			sep = dojo.regexp.escapeString(sep);
			if(sep == " "){ sep = "\\s"; }
			else if(sep == "\xa0"){ sep = "\\s\\xa0"; }

			var grp = flags.groupSize, grp2 = flags.groupSize2;
			//TODO: should we continue to enforce that numbers with separators begin with 1-9?  See #6933
			if(grp2){
				var grp2RE = "(?:0|[1-9]\\d{0," + (grp2-1) + "}(?:[" + sep + "]\\d{" + grp2 + "})*[" + sep + "]\\d{" + grp + "})";
				return ((grp-grp2) > 0) ? "(?:" + grp2RE + "|(?:0|[1-9]\\d{0," + (grp-1) + "}))" : grp2RE;
			}
			return "(?:0|[1-9]\\d{0," + (grp-1) + "}(?:[" + sep + "]\\d{" + grp + "})*)";
		},
		true
	);

	return signRE + numberRE; // String
};

}

if(!dojo._hasResource["dijit.form.NumberTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.NumberTextBox"] = true;
dojo.provide("dijit.form.NumberTextBox");




/*=====
dojo.declare(
	"dijit.form.NumberTextBox.__Constraints",
	[dijit.form.RangeBoundTextBox.__Constraints, dojo.number.__FormatOptions, dojo.number.__ParseOptions], {
	// summary:
	//		Specifies both the rules on valid/invalid values (minimum, maximum,
	//		number of required decimal places), and also formatting options for
	//		displaying the value when the field is not focused.
	// example:
	//		Minimum/maximum:
	//		To specify a field between 0 and 120:
	//	|		{min:0,max:120}
	//		To specify a field that must be an integer:
	//	|		{fractional:false}
	//		To specify a field where 0 to 3 decimal places are allowed on input:
	//	|		{places:'0,3'}
});
=====*/

dojo.declare("dijit.form.NumberTextBoxMixin",
	null,
	{
		// summary:
		//		A mixin for all number textboxes
		// tags:
		//		protected

		// Override ValidationTextBox.regExpGen().... we use a reg-ex generating function rather
		// than a straight regexp to deal with locale (plus formatting options too?)
		regExpGen: dojo.number.regexp,

		/*=====
		// constraints: dijit.form.NumberTextBox.__Constraints
		//		Despite the name, this parameter specifies both constraints on the input
		//		(including minimum/maximum allowed values) as well as
		//		formatting options like places (the number of digits to display after
		//		the decimal point).  See `dijit.form.NumberTextBox.__Constraints` for details.
		constraints: {},
		======*/

		// value: Number
		//		The value of this NumberTextBox as a Javascript Number (i.e., not a String).
		//		If the displayed value is blank, the value is NaN, and if the user types in
		//		an gibberish value (like "hello world"), the value is undefined
		//		(i.e. get('value') returns undefined).
		//
		//		Symmetrically, set('value', NaN) will clear the displayed value,
		//		whereas set('value', undefined) will have no effect.
		value: NaN,

		// editOptions: [protected] Object
		//		Properties to mix into constraints when the value is being edited.
		//		This is here because we edit the number in the format "12345", which is
		//		different than the display value (ex: "12,345")
		editOptions: { pattern: '#.######' },

		/*=====
		_formatter: function(value, options){
			// summary:
			//		_formatter() is called by format().  It's the base routine for formatting a number,
			//		as a string, for example converting 12345 into "12,345".
			// value: Number
			//		The number to be converted into a string.
			// options: dojo.number.__FormatOptions?
			//		Formatting options
			// tags:
			//		protected extension

			return "12345";		// String
		},
		 =====*/
		_formatter: dojo.number.format,

		_setConstraintsAttr: function(/*Object*/ constraints){
			var places = typeof constraints.places == "number"? constraints.places : 0;
			if(places){ places++; } // decimal rounding errors take away another digit of precision
			if(typeof constraints.max != "number"){
				constraints.max = 9 * Math.pow(10, 15-places);
			}
			if(typeof constraints.min != "number"){
				constraints.min = -9 * Math.pow(10, 15-places);
			}
			this.inherited(arguments, [ constraints ]);
			if(this.focusNode && this.focusNode.value && !isNaN(this.value)){
				this.set('value', this.value);
			}
		},

		_onFocus: function(){
			if(this.disabled){ return; }
			var val = this.get('value');
			if(typeof val == "number" && !isNaN(val)){
				var formattedValue = this.format(val, this.constraints);
				if(formattedValue !== undefined){
					this.textbox.value = formattedValue;
				}
			}
			this.inherited(arguments);
		},

		format: function(/*Number*/ value, /*dojo.number.__FormatOptions*/ constraints){
			// summary:
			//		Formats the value as a Number, according to constraints.
			// tags:
			//		protected

			var formattedValue = String(value);
			if(typeof value != "number"){ return formattedValue; }
			if(isNaN(value)){ return ""; }
			// check for exponential notation that dojo.number.format chokes on
			if(!("rangeCheck" in this && this.rangeCheck(value, constraints)) && constraints.exponent !== false && /\de[-+]?\d/i.test(formattedValue)){
				return formattedValue;
			}
			if(this.editOptions && this._focused){
				constraints = dojo.mixin({}, constraints, this.editOptions);
			}
			return this._formatter(value, constraints);
		},

		/*=====
		_parser: function(value, constraints){
			// summary:
			//		Parses the string value as a Number, according to constraints.
			// value: String
			//		String representing a number
			// constraints: dojo.number.__ParseOptions
			//		Formatting options
			// tags:
			//		protected

			return 123.45;		// Number
		},
		=====*/
		_parser: dojo.number.parse,

		parse: function(/*String*/ value, /*dojo.number.__FormatOptions*/ constraints){
			// summary:
			//		Replacable function to convert a formatted string to a number value
			// tags:
			//		protected extension

			var v = this._parser(value, dojo.mixin({}, constraints, (this.editOptions && this._focused) ? this.editOptions : {}));
			if(this.editOptions && this._focused && isNaN(v)){
				v = this._parser(value, constraints); // parse w/o editOptions: not technically needed but is nice for the user
			}
			return v;
		},

		_getDisplayedValueAttr: function(){
			var v = this.inherited(arguments);
			return isNaN(v) ? this.textbox.value : v;
		},

		filter: function(/*Number*/ value){
			// summary:
			//		This is called with both the display value (string), and the actual value (a number).
			//		When called with the actual value it does corrections so that '' etc. are represented as NaN.
			//		Otherwise it dispatches to the superclass's filter() method.
			//
			//		See `dijit.form.TextBox.filter` for more details.
			return (value === null || value === '' || value === undefined) ? NaN : this.inherited(arguments); // set('value', null||''||undefined) should fire onChange(NaN)
		},

		serialize: function(/*Number*/ value, /*Object?*/ options){
			// summary:
			//		Convert value (a Number) into a canonical string (ie, how the number literal is written in javascript/java/C/etc.)
			// tags:
			//		protected
			return (typeof value != "number" || isNaN(value)) ? '' : this.inherited(arguments);
		},

		_setBlurValue: function(){
			var val = dojo.hitch(dojo.mixin({}, this, { _focused: true }), "get")('value'); // parse with editOptions
			this._setValueAttr(val, true);
		},

		_setValueAttr: function(/*Number*/ value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			// summary:
			//		Hook so set('value', ...) works.
			if(value !== undefined && formattedValue === undefined){
				formattedValue = String(value);
				if(typeof value == "number"){
					if(isNaN(value)){ formattedValue = '' }
					// check for exponential notation that dojo.number.format chokes on
					else if(("rangeCheck" in this && this.rangeCheck(value, this.constraints)) || this.constraints.exponent === false || !/\de[-+]?\d/i.test(formattedValue)){
						formattedValue = undefined; // lets format comnpute a real string value
					}
				}else if(!value){ // 0 processed in if branch above, ''|null|undefined flow thru here
					formattedValue = '';
					value = NaN;
				}else{ // non-numeric values
					value = undefined;
				}
			}
			this.inherited(arguments, [value, priorityChange, formattedValue]);
		},

		_getValueAttr: function(){
			// summary:
			//		Hook so get('value') works.
			//		Returns Number, NaN for '', or undefined for unparsable text
			var v = this.inherited(arguments); // returns Number for all values accepted by parse() or NaN for all other displayed values

			// If the displayed value of the textbox is gibberish (ex: "hello world"), this.inherited() above
			// returns NaN; this if() branch converts the return value to undefined.
			// Returning undefined prevents user text from being overwritten when doing _setValueAttr(_getValueAttr()).
			// A blank displayed value is still returned as NaN.
			if(isNaN(v) && this.textbox.value !== ''){
				if(this.constraints.exponent !== false && /\de[-+]?\d/i.test(this.textbox.value) && (new RegExp("^"+dojo.number._realNumberRegexp(dojo.mixin({}, this.constraints))+"$").test(this.textbox.value))){	// check for exponential notation that parse() rejected (erroneously?)
					var n = Number(this.textbox.value);
					return isNaN(n) ? undefined : n; // return exponential Number or undefined for random text (may not be possible to do with the above RegExp check)
				}else{
					return undefined; // gibberish
				}
			}else{
				return v; // Number or NaN for ''
			}
		},

		isValid: function(/*Boolean*/ isFocused){
			// Overrides dijit.form.RangeBoundTextBox.isValid to check that the editing-mode value is valid since
			// it may not be formatted according to the regExp vaidation rules
			if(!this._focused || this._isEmpty(this.textbox.value)){
				return this.inherited(arguments);
			}else{
				var v = this.get('value');
				if(!isNaN(v) && this.rangeCheck(v, this.constraints)){
					if(this.constraints.exponent !== false && /\de[-+]?\d/i.test(this.textbox.value)){ // exponential, parse doesn't like it
						return true; // valid exponential number in range
					}else{
						return this.inherited(arguments);
					}
				}else{
					return false;
				}
			}
		}
	}
);

dojo.declare("dijit.form.NumberTextBox",
	[dijit.form.RangeBoundTextBox,dijit.form.NumberTextBoxMixin],
	{
		// summary:
		//		A TextBox for entering numbers, with formatting and range checking
		// description:
		//		NumberTextBox is a textbox for entering and displaying numbers, supporting
		//		the following main features:
		//
		//			1. Enforce minimum/maximum allowed values (as well as enforcing that the user types
		//				a number rather than a random string)
		//			2. NLS support (altering roles of comma and dot as "thousands-separator" and "decimal-point"
		//				depending on locale).
		//			3. Separate modes for editing the value and displaying it, specifically that
		//				the thousands separator character (typically comma) disappears when editing
		//				but reappears after the field is blurred.
		//			4. Formatting and constraints regarding the number of places (digits after the decimal point)
		//				allowed on input, and number of places displayed when blurred (see `constraints` parameter).

		baseClass: "dijitTextBox dijitNumberTextBox"
	}
);

}

if(!dojo._hasResource["dojo.data.util.sorter"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.data.util.sorter"] = true;
dojo.provide("dojo.data.util.sorter");

dojo.getObject("data.util.sorter", true, dojo);

dojo.data.util.sorter.basicComparator = function(	/*anything*/ a,
													/*anything*/ b){
	//	summary:
	//		Basic comparision function that compares if an item is greater or less than another item
	//	description:
	//		returns 1 if a > b, -1 if a < b, 0 if equal.
	//		'null' values (null, undefined) are treated as larger values so that they're pushed to the end of the list.
	//		And compared to each other, null is equivalent to undefined.
	
	//null is a problematic compare, so if null, we set to undefined.
	//Makes the check logic simple, compact, and consistent
	//And (null == undefined) === true, so the check later against null
	//works for undefined and is less bytes.
	var r = -1;
	if(a === null){
		a = undefined;
	}
	if(b === null){
		b = undefined;
	}
	if(a == b){
		r = 0;
	}else if(a > b || a == null){
		r = 1;
	}
	return r; //int {-1,0,1}
};

dojo.data.util.sorter.createSortFunction = function(	/* attributes array */sortSpec,
														/*dojo.data.core.Read*/ store){
	//	summary:
	//		Helper function to generate the sorting function based off the list of sort attributes.
	//	description:
	//		The sort function creation will look for a property on the store called 'comparatorMap'.  If it exists
	//		it will look in the mapping for comparisons function for the attributes.  If one is found, it will
	//		use it instead of the basic comparator, which is typically used for strings, ints, booleans, and dates.
	//		Returns the sorting function for this particular list of attributes and sorting directions.
	//
	//	sortSpec: array
	//		A JS object that array that defines out what attribute names to sort on and whether it should be descenting or asending.
	//		The objects should be formatted as follows:
	//		{
	//			attribute: "attributeName-string" || attribute,
	//			descending: true|false;   // Default is false.
	//		}
	//	store: object
	//		The datastore object to look up item values from.
	//
	var sortFunctions=[];

	function createSortFunction(attr, dir, comp, s){
		//Passing in comp and s (comparator and store), makes this
		//function much faster.
		return function(itemA, itemB){
			var a = s.getValue(itemA, attr);
			var b = s.getValue(itemB, attr);
			return dir * comp(a,b); //int
		};
	}
	var sortAttribute;
	var map = store.comparatorMap;
	var bc = dojo.data.util.sorter.basicComparator;
	for(var i = 0; i < sortSpec.length; i++){
		sortAttribute = sortSpec[i];
		var attr = sortAttribute.attribute;
		if(attr){
			var dir = (sortAttribute.descending) ? -1 : 1;
			var comp = bc;
			if(map){
				if(typeof attr !== "string" && ("toString" in attr)){
					 attr = attr.toString();
				}
				comp = map[attr] || bc;
			}
			sortFunctions.push(createSortFunction(attr,
				dir, comp, store));
		}
	}
	return function(rowA, rowB){
		var i=0;
		while(i < sortFunctions.length){
			var ret = sortFunctions[i++](rowA, rowB);
			if(ret !== 0){
				return ret;//int
			}
		}
		return 0; //int
	}; // Function
};

}

if(!dojo._hasResource["dijit.form._FormSelectWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._FormSelectWidget"] = true;
dojo.provide("dijit.form._FormSelectWidget");




/*=====
dijit.form.__SelectOption = function(){
	// value: String
	//		The value of the option.  Setting to empty (or missing) will
	//		place a separator at that location
	// label: String
	//		The label for our option.  It can contain html tags.
	// selected: Boolean
	//		Whether or not we are a selected option
	// disabled: Boolean
	//		Whether or not this specific option is disabled
	this.value = value;
	this.label = label;
	this.selected = selected;
	this.disabled = disabled;
}
=====*/

dojo.declare("dijit.form._FormSelectWidget", dijit.form._FormValueWidget, {
	// summary:
	//		Extends _FormValueWidget in order to provide "select-specific"
	//		values - i.e., those values that are unique to <select> elements.
	//		This also provides the mechanism for reading the elements from
	//		a store, if desired.

	// multiple: [const] Boolean
	//		Whether or not we are multi-valued
	multiple: false,

	// options: dijit.form.__SelectOption[]
	//		The set of options for our select item.  Roughly corresponds to
	//		the html <option> tag.
	options: null,

	// store: dojo.data.api.Identity
	//		A store which, at the very least impelements dojo.data.api.Identity
	//		to use for getting our list of options - rather than reading them
	//		from the <option> html tags.
	store: null,

	// query: object
	//		A query to use when fetching items from our store
	query: null,

	// queryOptions: object
	//		Query options to use when fetching from the store
	queryOptions: null,

	// onFetch: Function
	//		A callback to do with an onFetch - but before any items are actually
	//		iterated over (i.e. to filter even futher what you want to add)
	onFetch: null,

	// sortByLabel: Boolean
	//		Flag to sort the options returned from a store by the label of
	//		the store.
	sortByLabel: true,


	// loadChildrenOnOpen: Boolean
	//		By default loadChildren is called when the items are fetched from the
	//		store.  This property allows delaying loadChildren (and the creation
	//		of the options/menuitems) until the user clicks the button to open the
	//		dropdown.
	loadChildrenOnOpen: false,

	getOptions: function(/*anything*/ valueOrIdx){
		// summary:
		//		Returns a given option (or options).
		// valueOrIdx:
		//		If passed in as a string, that string is used to look up the option
		//		in the array of options - based on the value property.
		//		(See dijit.form.__SelectOption).
		//
		//		If passed in a number, then the option with the given index (0-based)
		//		within this select will be returned.
		//
		//		If passed in a dijit.form.__SelectOption, the same option will be
		//		returned if and only if it exists within this select.
		//
		//		If passed an array, then an array will be returned with each element
		//		in the array being looked up.
		//
		//		If not passed a value, then all options will be returned
		//
		// returns:
		//		The option corresponding with the given value or index.  null
		//		is returned if any of the following are true:
		//			- A string value is passed in which doesn't exist
		//			- An index is passed in which is outside the bounds of the array of options
		//			- A dijit.form.__SelectOption is passed in which is not a part of the select

		// NOTE: the compare for passing in a dijit.form.__SelectOption checks
		//		if the value property matches - NOT if the exact option exists
		// NOTE: if passing in an array, null elements will be placed in the returned
		//		array when a value is not found.
		var lookupValue = valueOrIdx, opts = this.options || [], l = opts.length;

		if(lookupValue === undefined){
			return opts; // dijit.form.__SelectOption[]
		}
		if(dojo.isArray(lookupValue)){
			return dojo.map(lookupValue, "return this.getOptions(item);", this); // dijit.form.__SelectOption[]
		}
		if(dojo.isObject(valueOrIdx)){
			// We were passed an option - so see if it's in our array (directly),
			// and if it's not, try and find it by value.
			if(!dojo.some(this.options, function(o, idx){
				if(o === lookupValue ||
					(o.value && o.value === lookupValue.value)){
					lookupValue = idx;
					return true;
				}
				return false;
			})){
				lookupValue = -1;
			}
		}
		if(typeof lookupValue == "string"){
			for(var i=0; i<l; i++){
				if(opts[i].value === lookupValue){
					lookupValue = i;
					break;
				}
			}
		}
		if(typeof lookupValue == "number" && lookupValue >= 0 && lookupValue < l){
			return this.options[lookupValue] // dijit.form.__SelectOption
		}
		return null; // null
	},

	addOption: function(/*dijit.form.__SelectOption|dijit.form.__SelectOption[]*/ option){
		// summary:
		//		Adds an option or options to the end of the select.  If value
		//		of the option is empty or missing, a separator is created instead.
		//		Passing in an array of options will yield slightly better performance
		//		since the children are only loaded once.
		if(!dojo.isArray(option)){ option = [option]; }
		dojo.forEach(option, function(i){
			if(i && dojo.isObject(i)){
				this.options.push(i);
			}
		}, this);
		this._loadChildren();
	},

	removeOption: function(/*String|dijit.form.__SelectOption|Number|Array*/ valueOrIdx){
		// summary:
		//		Removes the given option or options.  You can remove by string
		//		(in which case the value is removed), number (in which case the
		//		index in the options array is removed), or select option (in
		//		which case, the select option with a matching value is removed).
		//		You can also pass in an array of those values for a slightly
		//		better performance since the children are only loaded once.
		if(!dojo.isArray(valueOrIdx)){ valueOrIdx = [valueOrIdx]; }
		var oldOpts = this.getOptions(valueOrIdx);
		dojo.forEach(oldOpts, function(i){
			// We can get null back in our array - if our option was not found.  In
			// that case, we don't want to blow up...
			if(i){
				this.options = dojo.filter(this.options, function(node, idx){
					return (node.value !== i.value || node.label !== i.label);
				});
				this._removeOptionItem(i);
			}
		}, this);
		this._loadChildren();
	},

	updateOption: function(/*dijit.form.__SelectOption|dijit.form.__SelectOption[]*/ newOption){
		// summary:
		//		Updates the values of the given option.  The option to update
		//		is matched based on the value of the entered option.  Passing
		//		in an array of new options will yeild better performance since
		//		the children will only be loaded once.
		if(!dojo.isArray(newOption)){ newOption = [newOption]; }
		dojo.forEach(newOption, function(i){
			var oldOpt = this.getOptions(i), k;
			if(oldOpt){
				for(k in i){ oldOpt[k] = i[k]; }
			}
		}, this);
		this._loadChildren();
	},

	setStore: function(/*dojo.data.api.Identity*/ store,
						/*anything?*/ selectedValue,
						/*Object?*/ fetchArgs){
		// summary:
		//		Sets the store you would like to use with this select widget.
		//		The selected value is the value of the new store to set.  This
		//		function returns the original store, in case you want to reuse
		//		it or something.
		// store: dojo.data.api.Identity
		//		The store you would like to use - it MUST implement Identity,
		//		and MAY implement Notification.
		// selectedValue: anything?
		//		The value that this widget should set itself to *after* the store
		//		has been loaded
		// fetchArgs: Object?
		//		The arguments that will be passed to the store's fetch() function
		var oStore = this.store;
		fetchArgs = fetchArgs || {};
		if(oStore !== store){
			// Our store has changed, so update our notifications
			dojo.forEach(this._notifyConnections || [], dojo.disconnect);
			delete this._notifyConnections;
			if(store && store.getFeatures()["dojo.data.api.Notification"]){
				this._notifyConnections = [
					dojo.connect(store, "onNew", this, "_onNewItem"),
					dojo.connect(store, "onDelete", this, "_onDeleteItem"),
					dojo.connect(store, "onSet", this, "_onSetItem")
				];
			}
			this._set("store", store);
		}

		// Turn off change notifications while we make all these changes
		this._onChangeActive = false;

		// Remove existing options (if there are any)
		if(this.options && this.options.length){
			this.removeOption(this.options);
		}

		// Add our new options
		if(store){
			this._loadingStore = true;
			store.fetch(dojo.delegate(fetchArgs, {
				onComplete: function(items, opts){
					if(this.sortByLabel && !fetchArgs.sort && items.length){
						items.sort(dojo.data.util.sorter.createSortFunction([{
							attribute: store.getLabelAttributes(items[0])[0]
						}], store));
					}
	
					if(fetchArgs.onFetch){
							items = fetchArgs.onFetch.call(this, items, opts);
					}
					// TODO: Add these guys as a batch, instead of separately
					dojo.forEach(items, function(i){
						this._addOptionForItem(i);
					}, this);
	
					// Set our value (which might be undefined), and then tweak
					// it to send a change event with the real value
					this._loadingStore = false;
						this.set("value", "_pendingValue" in this ? this._pendingValue : selectedValue);
					delete this._pendingValue;
	
					if(!this.loadChildrenOnOpen){
						this._loadChildren();
					}else{
						this._pseudoLoadChildren(items);
					}
					this._fetchedWith = opts;
					this._lastValueReported = this.multiple ? [] : null;
					this._onChangeActive = true;
					this.onSetStore();
					this._handleOnChange(this.value);
				},
				scope: this
			}));
		}else{
			delete this._fetchedWith;
		}
		return oStore;	// dojo.data.api.Identity
	},

	// TODO: implement set() and watch() for store and query, although not sure how to handle
	// setting them individually rather than together (as in setStore() above)

	_setValueAttr: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		set the value of the widget.
		//		If a string is passed, then we set our value from looking it up.
		if(this._loadingStore){
			// Our store is loading - so save our value, and we'll set it when
			// we're done
			this._pendingValue = newValue;
			return;
		}
		var opts = this.getOptions() || [];
		if(!dojo.isArray(newValue)){
			newValue = [newValue];
		}
		dojo.forEach(newValue, function(i, idx){
			if(!dojo.isObject(i)){
				i = i + "";
			}
			if(typeof i === "string"){
				newValue[idx] = dojo.filter(opts, function(node){
					return node.value === i;
				})[0] || {value: "", label: ""};
			}
		}, this);

		// Make sure some sane default is set
		newValue = dojo.filter(newValue, function(i){ return i && i.value; });
		if(!this.multiple && (!newValue[0] || !newValue[0].value) && opts.length){
			newValue[0] = opts[0];
		}
		dojo.forEach(opts, function(i){
			i.selected = dojo.some(newValue, function(v){ return v.value === i.value; });
		});
		var val = dojo.map(newValue, function(i){ return i.value; }),
			disp = dojo.map(newValue, function(i){ return i.label; });

		this._set("value", this.multiple ? val : val[0]);
		this._setDisplay(this.multiple ? disp : disp[0]);
		this._updateSelection();
		this._handleOnChange(this.value, priorityChange);
	},

	_getDisplayedValueAttr: function(){
		// summary:
		//		returns the displayed value of the widget
		var val = this.get("value");
		if(!dojo.isArray(val)){
			val = [val];
		}
		var ret = dojo.map(this.getOptions(val), function(v){
			if(v && "label" in v){
				return v.label;
			}else if(v){
				return v.value;
			}
			return null;
		}, this);
		return this.multiple ? ret : ret[0];
	},

	_loadChildren: function(){
		// summary:
		//		Loads the children represented by this widget's options.
		//		reset the menu to make it populatable on the next click
		if(this._loadingStore){ return; }
		dojo.forEach(this._getChildren(), function(child){
			child.destroyRecursive();
		});
		// Add each menu item
		dojo.forEach(this.options, this._addOptionItem, this);

		// Update states
		this._updateSelection();
	},

	_updateSelection: function(){
		// summary:
		//		Sets the "selected" class on the item for styling purposes
		this._set("value", this._getValueFromOpts());
		var val = this.value;
		if(!dojo.isArray(val)){
			val = [val];
		}
		if(val && val[0]){
			dojo.forEach(this._getChildren(), function(child){
				var isSelected = dojo.some(val, function(v){
					return child.option && (v === child.option.value);
				});
				dojo.toggleClass(child.domNode, this.baseClass + "SelectedOption", isSelected);
				dijit.setWaiState(child.domNode, "selected", isSelected);
			}, this);
		}
	},

	_getValueFromOpts: function(){
		// summary:
		//		Returns the value of the widget by reading the options for
		//		the selected flag
		var opts = this.getOptions() || [];
		if(!this.multiple && opts.length){
			// Mirror what a select does - choose the first one
			var opt = dojo.filter(opts, function(i){
				return i.selected;
			})[0];
			if(opt && opt.value){
				return opt.value
			}else{
				opts[0].selected = true;
				return opts[0].value;
			}
		}else if(this.multiple){
			// Set value to be the sum of all selected
			return dojo.map(dojo.filter(opts, function(i){
				return i.selected;
			}), function(i){
				return i.value;
			}) || [];
		}
		return "";
	},

	// Internal functions to call when we have store notifications come in
	_onNewItem: function(/*item*/ item, /*Object?*/ parentInfo){
		if(!parentInfo || !parentInfo.parent){
			// Only add it if we are top-level
			this._addOptionForItem(item);
		}
	},
	_onDeleteItem: function(/*item*/ item){
		var store = this.store;
		this.removeOption(store.getIdentity(item));
	},
	_onSetItem: function(/*item*/ item){
		this.updateOption(this._getOptionObjForItem(item));
	},

	_getOptionObjForItem: function(item){
		// summary:
		//		Returns an option object based off the given item.  The "value"
		//		of the option item will be the identity of the item, the "label"
		//		of the option will be the label of the item.  If the item contains
		//		children, the children value of the item will be set
		var store = this.store, label = store.getLabel(item),
			value = (label ? store.getIdentity(item) : null);
		return {value: value, label: label, item:item}; // dijit.form.__SelectOption
	},

	_addOptionForItem: function(/*item*/ item){
		// summary:
		//		Creates (and adds) the option for the given item
		var store = this.store;
		if(!store.isItemLoaded(item)){
			// We are not loaded - so let's load it and add later
			store.loadItem({item: item, onComplete: function(i){
				this._addOptionForItem(item);
			},
			scope: this});
			return;
		}
		var newOpt = this._getOptionObjForItem(item);
		this.addOption(newOpt);
	},

	constructor: function(/*Object*/ keywordArgs){
		// summary:
		//		Saves off our value, if we have an initial one set so we
		//		can use it if we have a store as well (see startup())
		this._oValue = (keywordArgs || {}).value || null;
	},

	buildRendering: function(){
		this.inherited(arguments);
		dojo.setSelectable(this.focusNode, false);
	},

	_fillContent: function(){
		// summary:
		//		Loads our options and sets up our dropdown correctly.  We
		//		don't want any content, so we don't call any inherit chain
		//		function.
		var opts = this.options;
		if(!opts){
			opts = this.options = this.srcNodeRef ? dojo.query(">",
						this.srcNodeRef).map(function(node){
							if(node.getAttribute("type") === "separator"){
								return { value: "", label: "", selected: false, disabled: false };
							}
							return {
								value: (node.getAttribute("data-" + dojo._scopeName + "-value") || node.getAttribute("value")),
										label: String(node.innerHTML),
								// FIXME: disabled and selected are not valid on complex markup children (which is why we're
								// looking for data-dojo-value above.  perhaps we should data-dojo-props="" this whole thing?)
								// decide before 1.6
										selected: node.getAttribute("selected") || false,
								disabled: node.getAttribute("disabled") || false
							};
						}, this) : [];
		}
		if(!this.value){
			this._set("value", this._getValueFromOpts());
		}else if(this.multiple && typeof this.value == "string"){
			this_set("value", this.value.split(","));
		}
	},

	postCreate: function(){
		// summary:
		//		sets up our event handling that we need for functioning
		//		as a select
		this.inherited(arguments);

		// Make our event connections for updating state
		this.connect(this, "onChange", "_updateSelection");
		this.connect(this, "startup", "_loadChildren");

		this._setValueAttr(this.value, null);
	},

	startup: function(){
		// summary:
		//		Connects in our store, if we have one defined
		this.inherited(arguments);
		var store = this.store, fetchArgs = {};
		dojo.forEach(["query", "queryOptions", "onFetch"], function(i){
			if(this[i]){
				fetchArgs[i] = this[i];
			}
			delete this[i];
		}, this);
		if(store && store.getFeatures()["dojo.data.api.Identity"]){
			// Temporarily set our store to null so that it will get set
			// and connected appropriately
			this.store = null;
			this.setStore(store, this._oValue, fetchArgs);
		}
	},

	destroy: function(){
		// summary:
		//		Clean up our connections
		dojo.forEach(this._notifyConnections || [], dojo.disconnect);
		this.inherited(arguments);
	},

	_addOptionItem: function(/*dijit.form.__SelectOption*/ option){
		// summary:
		//		User-overridable function which, for the given option, adds an
		//		item to the select.  If the option doesn't have a value, then a
		//		separator is added in that place.  Make sure to store the option
		//		in the created option widget.
	},

	_removeOptionItem: function(/*dijit.form.__SelectOption*/ option){
		// summary:
		//		User-overridable function which, for the given option, removes
		//		its item from the select.
	},

	_setDisplay: function(/*String or String[]*/ newDisplay){
		// summary:
		//		Overridable function which will set the display for the
		//		widget.  newDisplay is either a string (in the case of
		//		single selects) or array of strings (in the case of multi-selects)
	},

	_getChildren: function(){
		// summary:
		//		Overridable function to return the children that this widget contains.
		return [];
	},

	_getSelectedOptionsAttr: function(){
		// summary:
		//		hooks into this.attr to provide a mechanism for getting the
		//		option items for the current value of the widget.
		return this.getOptions(this.get("value"));
	},

	_pseudoLoadChildren: function(/*item[]*/ items){
		// summary:
		//		a function that will "fake" loading children, if needed, and
		//		if we have set to not load children until the widget opens.
		// items:
		//		An array of items that will be loaded, when needed
	},

	onSetStore: function(){
		// summary:
		//		a function that can be connected to in order to receive a
		//		notification that the store has finished loading and all options
		//		from that store are available
	}
});

}

if(!dojo._hasResource["dijit.form.Select"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.Select"] = true;
dojo.provide("dijit.form.Select");







dojo.declare("dijit.form._SelectMenu", dijit.Menu, {
	// summary:
	//		An internally-used menu for dropdown that allows us a vertical scrollbar
	buildRendering: function(){
		// summary:
		//		Stub in our own changes, so that our domNode is not a table
		//		otherwise, we won't respond correctly to heights/overflows
		this.inherited(arguments);
		var o = (this.menuTableNode = this.domNode);
		var n = (this.domNode = dojo.create("div", {style: {overflowX: "hidden", overflowY: "scroll"}}));
		if(o.parentNode){
			o.parentNode.replaceChild(n, o);
		}
		dojo.removeClass(o, "dijitMenuTable");
		n.className = o.className + " dijitSelectMenu";
		o.className = "dijitReset dijitMenuTable";
		dijit.setWaiRole(o,"listbox");
		dijit.setWaiRole(n,"presentation");
		n.appendChild(o);
	},

	postCreate: function(){
		// summary:
		//              stop mousemove from selecting text on IE to be consistent with other browsers

		this.inherited(arguments);

		this.connect(this.domNode, "onmousemove", dojo.stopEvent);
	},

	resize: function(/*Object*/ mb){
		// summary:
		//		Overridden so that we are able to handle resizing our
		//		internal widget.  Note that this is not a "full" resize
		//		implementation - it only works correctly if you pass it a
		//		marginBox.
		//
		// mb: Object
		//		The margin box to set this dropdown to.
		if(mb){
			dojo.marginBox(this.domNode, mb);
			if("w" in mb){
				// We've explicitly set the wrapper <div>'s width, so set <table> width to match.
				// 100% is safer than a pixel value because there may be a scroll bar with
				// browser/OS specific width.
				this.menuTableNode.style.width = "100%";
			}
		}
	}
});

dojo.declare("dijit.form.Select", [dijit.form._FormSelectWidget, dijit._HasDropDown], {
	// summary:
	//		This is a "styleable" select box - it is basically a DropDownButton which
	//		can take a <select> as its input.

	baseClass: "dijitSelect",

	templateString: dojo.cache("dijit.form", "templates/Select.html", "<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tdojoAttachPoint=\"_buttonNode,tableNode,focusNode\" cellspacing='0' cellpadding='0'\n\trole=\"combobox\" aria-haspopup=\"true\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonContents dijitButtonNode\" role=\"presentation\"\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"  dojoAttachPoint=\"containerNode,_popupStateNode\"></span\n\t\t\t><input type=\"hidden\" ${!nameAttrSetting} dojoAttachPoint=\"valueNode\" value=\"${value}\" aria-hidden=\"true\"\n\t\t/></td><td class=\"dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\t\tdojoAttachPoint=\"titleNode\" role=\"presentation\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\n\t\t></td\n\t></tr></tbody\n></table>\n"),

	// attributeMap: Object
	//		Add in our style to be applied to the focus node
	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormSelectWidget.prototype.attributeMap),{style:"tableNode"}),

	// required: Boolean
	//		Can be true or false, default is false.
	required: false,

	// state: String
	//		Shows current state (ie, validation result) of input (Normal, Warning, or Error)
	state: "",

	// message: String
	//		Currently displayed error/prompt message
	message: "",

	//	tooltipPosition: String[]
	//		See description of dijit.Tooltip.defaultPosition for details on this parameter.
	tooltipPosition: [],

	// emptyLabel: string
	//		What to display in an "empty" dropdown
	emptyLabel: "&nbsp;",

	// _isLoaded: Boolean
	//		Whether or not we have been loaded
	_isLoaded: false,

	// _childrenLoaded: Boolean
	//		Whether or not our children have been loaded
	_childrenLoaded: false,

	_fillContent: function(){
		// summary:
		//		Set the value to be the first, or the selected index
		this.inherited(arguments);
		// set value from selected option
		if(this.options.length && !this.value && this.srcNodeRef){
			var si = this.srcNodeRef.selectedIndex || 0; // || 0 needed for when srcNodeRef is not a SELECT
			this.value = this.options[si >= 0 ? si : 0].value;
		}
		// Create the dropDown widget
		this.dropDown = new dijit.form._SelectMenu({id: this.id + "_menu"});
		dojo.addClass(this.dropDown.domNode, this.baseClass + "Menu");
	},

	_getMenuItemForOption: function(/*dijit.form.__SelectOption*/ option){
		// summary:
		//		For the given option, return the menu item that should be
		//		used to display it.  This can be overridden as needed
		if(!option.value && !option.label){
			// We are a separator (no label set for it)
			return new dijit.MenuSeparator();
		}else{
			// Just a regular menu option
			var click = dojo.hitch(this, "_setValueAttr", option);
			var item = new dijit.MenuItem({
				option: option,
				label: option.label || this.emptyLabel,
				onClick: click,
				disabled: option.disabled || false
			});
			dijit.setWaiRole(item.focusNode, "listitem");
			return item;
		}
	},

	_addOptionItem: function(/*dijit.form.__SelectOption*/ option){
		// summary:
		//		For the given option, add an option to our dropdown.
		//		If the option doesn't have a value, then a separator is added
		//		in that place.
		if(this.dropDown){
			this.dropDown.addChild(this._getMenuItemForOption(option));
		}
	},

	_getChildren: function(){
		if(!this.dropDown){
			return [];
		}
		return this.dropDown.getChildren();
	},

	_loadChildren: function(/*Boolean*/ loadMenuItems){
		// summary:
		//		Resets the menu and the length attribute of the button - and
		//		ensures that the label is appropriately set.
		//	loadMenuItems: Boolean
		//		actually loads the child menu items - we only do this when we are
		//		populating for showing the dropdown.

		if(loadMenuItems === true){
			// this.inherited destroys this.dropDown's child widgets (MenuItems).
			// Avoid this.dropDown (Menu widget) having a pointer to a destroyed widget (which will cause
			// issues later in _setSelected). (see #10296)
			if(this.dropDown){
				delete this.dropDown.focusedChild;
			}
			if(this.options.length){
				this.inherited(arguments);
			}else{
				// Drop down menu is blank but add one blank entry just so something appears on the screen
				// to let users know that they are no choices (mimicing native select behavior)
				dojo.forEach(this._getChildren(), function(child){ child.destroyRecursive(); });
				var item = new dijit.MenuItem({label: "&nbsp;"});
				this.dropDown.addChild(item);
			}
		}else{
			this._updateSelection();
		}

		this._isLoaded = false;
		this._childrenLoaded = true;

		if(!this._loadingStore){
			// Don't call this if we are loading - since we will handle it later
			this._setValueAttr(this.value);
		}
	},

	_setValueAttr: function(value){
		this.inherited(arguments);
		dojo.attr(this.valueNode, "value", this.get("value"));
	},

	_setDisplay: function(/*String*/ newDisplay){
		// summary:
		//		sets the display for the given value (or values)
		var lbl = newDisplay || this.emptyLabel;
		this.containerNode.innerHTML = '<span class="dijitReset dijitInline ' + this.baseClass + 'Label">' + lbl + '</span>';
		dijit.setWaiState(this.focusNode, "valuetext", lbl);
	},

	validate: function(/*Boolean*/ isFocused){
		// summary:
		//		Called by oninit, onblur, and onkeypress.
		// description:
		//		Show missing or invalid messages if appropriate, and highlight textbox field.
		//		Used when a select is initially set to no value and the user is required to
		//		set the value.
		
		var isValid = this.isValid(isFocused);
		this._set("state", isValid ? "" : "Error");
		dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
		var message = isValid ? "" : this._missingMsg;
		if(this.message !== message){
			this._set("message", message);
			dijit.hideTooltip(this.domNode);
			if(message){
				dijit.showTooltip(message, this.domNode, this.tooltipPosition, !this.isLeftToRight());
			}
		}
		return isValid;
	},

	isValid: function(/*Boolean*/ isFocused){
		// summary:
		//		Whether or not this is a valid value.  The only way a Select
		//		can be invalid is when it's required but nothing is selected.
		return (!this.required || this.value === 0 || !(/^\s*$/.test(this.value || ""))); // handle value is null or undefined
	},

	reset: function(){
		// summary:
		//		Overridden so that the state will be cleared.
		this.inherited(arguments);
		dijit.hideTooltip(this.domNode);
		this._set("state", "");
		this._set("message", "")
	},

	postMixInProperties: function(){
		// summary:
		//		set the missing message
		this.inherited(arguments);
		this._missingMsg = dojo.i18n.getLocalization("dijit.form", "validate",
									this.lang).missingMessage;
	},

	postCreate: function(){
		// summary:
		//		stop mousemove from selecting text on IE to be consistent with other browsers

		this.inherited(arguments);

		this.connect(this.domNode, "onmousemove", dojo.stopEvent);
	},

	_setStyleAttr: function(/*String||Object*/ value){
		this.inherited(arguments);
		dojo.toggleClass(this.domNode, this.baseClass + "FixedWidth", !!this.tableNode.style.width);
	},

	isLoaded: function(){
		return this._isLoaded;
	},

	loadDropDown: function(/*Function*/ loadCallback){
		// summary:
		//		populates the menu
		this._loadChildren(true);
		this._isLoaded = true;
		loadCallback();
	},

	closeDropDown: function(){
		// overriding _HasDropDown.closeDropDown()
		this.inherited(arguments);

		if(this.dropDown && this.dropDown.menuTableNode){
			// Erase possible width: 100% setting from _SelectMenu.resize().
			// Leaving it would interfere with the next openDropDown() call, which
			// queries the natural size of the drop down.
			this.dropDown.menuTableNode.style.width = "";
		}
	},

	uninitialize: function(preserveDom){
		if(this.dropDown && !this.dropDown._destroyed){
			this.dropDown.destroyRecursive(preserveDom);
			delete this.dropDown;
		}
		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dijit.form.MultiSelect"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.MultiSelect"] = true;
dojo.provide("dijit.form.MultiSelect");



dojo.declare("dijit.form.MultiSelect", dijit.form._FormValueWidget, {
	// summary:
	//		Widget version of a <select multiple=true> element,
	//		for selecting multiple options.

	// size: Number
	//		Number of elements to display on a page
	//		NOTE: may be removed in version 2.0, since elements may have variable height;
	//		set the size via style="..." or CSS class names instead.
	size: 7,

	templateString: "<select multiple='true' ${!nameAttrSetting} dojoAttachPoint='containerNode,focusNode' dojoAttachEvent='onchange: _onChange'></select>",

	attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
		size: "focusNode"
	}),

	reset: function(){
		// summary:
		//		Reset the widget's value to what it was at initialization time

		// TODO: once we inherit from FormValueWidget this won't be needed
		this._hasBeenBlurred = false;
		this._setValueAttr(this._resetValue, true);
	},

	addSelected: function(/*dijit.form.MultiSelect*/ select){
		// summary:
		//		Move the selected nodes of a passed Select widget
		//		instance to this Select widget.
		//
		// example:
		// |	// move all the selected values from "bar" to "foo"
		// | 	dijit.byId("foo").addSelected(dijit.byId("bar"));

		select.getSelected().forEach(function(n){
			this.containerNode.appendChild(n);
			// scroll to bottom to see item
			// cannot use scrollIntoView since <option> tags don't support all attributes
			// does not work on IE due to a bug where <select> always shows scrollTop = 0
			this.domNode.scrollTop = this.domNode.offsetHeight; // overshoot will be ignored
			// scrolling the source select is trickier esp. on safari who forgets to change the scrollbar size
			var oldscroll = select.domNode.scrollTop;
			select.domNode.scrollTop = 0;
			select.domNode.scrollTop = oldscroll;
		},this);
	},

	getSelected: function(){
		// summary:
		//		Access the NodeList of the selected options directly
		return dojo.query("option",this.containerNode).filter(function(n){
			return n.selected; // Boolean
		}); // dojo.NodeList
	},

	_getValueAttr: function(){
		// summary:
		//		Hook so get('value') works.
		// description:
		//		Returns an array of the selected options' values.
		return this.getSelected().map(function(n){
			return n.value;
		});
	},

	multiple: true, // for Form

	_setValueAttr: function(/*Array*/ values){
		// summary:
		//		Hook so set('value', values) works.
		// description:
		//		Set the value(s) of this Select based on passed values
		dojo.query("option",this.containerNode).forEach(function(n){
			n.selected = (dojo.indexOf(values,n.value) != -1);
		});
	},

	invertSelection: function(onChange){
		// summary:
		//		Invert the selection
		// onChange: Boolean
		//		If null, onChange is not fired.
		dojo.query("option",this.containerNode).forEach(function(n){
			n.selected = !n.selected;
		});
		this._handleOnChange(this.get('value'), onChange == true);
	},

	_onChange: function(/*Event*/ e){
		this._handleOnChange(this.get('value'), true);
	},

	// for layout widgets:
	resize: function(/*Object*/ size){
		if(size){
			dojo.marginBox(this.domNode, size);
		}
	},

	postCreate: function(){
		this._onChange();
	}
});

}

if(!dojo._hasResource["dijit.ToolbarSeparator"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.ToolbarSeparator"] = true;
dojo.provide("dijit.ToolbarSeparator");




dojo.declare("dijit.ToolbarSeparator",
		[ dijit._Widget, dijit._Templated ],
		{
		// summary:
		//		A spacer between two `dijit.Toolbar` items
		templateString: '<div class="dijitToolbarSeparator dijitInline" role="presentation"></div>',
		buildRendering: function(){
			this.inherited(arguments);
			dojo.setSelectable(this.domNode, false);
		},
		isFocusable: function(){
			// summary:
			//		This widget isn't focusable, so pass along that fact.
			// tags:
			//		protected
			return false;
		}

	});

}

if(!dojo._hasResource["dijit.Toolbar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Toolbar"] = true;
dojo.provide("dijit.Toolbar");






// Note: require of ToolbarSeparator is for back-compat, remove for 2.0

dojo.declare("dijit.Toolbar",
	[dijit._Widget, dijit._Templated, dijit._KeyNavContainer],
	{
	// summary:
	//		A Toolbar widget, used to hold things like `dijit.Editor` buttons

	templateString:
		'<div class="dijit" role="toolbar" tabIndex="${tabIndex}" dojoAttachPoint="containerNode">' +
		//	'<table style="table-layout: fixed" class="dijitReset dijitToolbarTable">' + // factor out style
		//		'<tr class="dijitReset" dojoAttachPoint="containerNode"></tr>'+
		//	'</table>' +
		'</div>',

	baseClass: "dijitToolbar",

	postCreate: function(){
		this.inherited(arguments);

		this.connectKeyNavHandlers(
			this.isLeftToRight() ? [dojo.keys.LEFT_ARROW] : [dojo.keys.RIGHT_ARROW],
			this.isLeftToRight() ? [dojo.keys.RIGHT_ARROW] : [dojo.keys.LEFT_ARROW]
		);
	},

	startup: function(){
		if(this._started){ return; }

		this.startupKeyNavChildren();

		this.inherited(arguments);
	}
}
);

}

if(!dojo._hasResource["dijit._editor.selection"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor.selection"] = true;
dojo.provide("dijit._editor.selection");


dojo.getObject("_editor.selection", true, dijit);

// FIXME:
//		all of these methods branch internally for IE. This is probably
//		sub-optimal in terms of runtime performance. We should investigate the
//		size difference for differentiating at definition time.

dojo.mixin(dijit._editor.selection, {
	getType: function(){
		// summary:
		//		Get the selection type (like dojo.doc.select.type in IE).
		if(dojo.isIE){
			return dojo.doc.selection.type.toLowerCase();
		}else{
			var stype = "text";

			// Check if the actual selection is a CONTROL (IMG, TABLE, HR, etc...).
			var oSel;
			try{
				oSel = dojo.global.getSelection();
			}catch(e){ /*squelch*/ }

			if(oSel && oSel.rangeCount == 1){
				var oRange = oSel.getRangeAt(0);
				if(	(oRange.startContainer == oRange.endContainer) &&
					((oRange.endOffset - oRange.startOffset) == 1) &&
					(oRange.startContainer.nodeType != 3 /* text node*/)
				){
					stype = "control";
				}
			}
			return stype; //String
		}
	},

	getSelectedText: function(){
		// summary:
		//		Return the text (no html tags) included in the current selection or null if no text is selected
		if(dojo.isIE){
			if(dijit._editor.selection.getType() == 'control'){
				return null;
			}
			return dojo.doc.selection.createRange().text;
		}else{
			var selection = dojo.global.getSelection();
			if(selection){
				return selection.toString(); //String
			}
		}
		return '';
	},

	getSelectedHtml: function(){
		// summary:
		//		Return the html text of the current selection or null if unavailable
		if(dojo.isIE){
			if(dijit._editor.selection.getType() == 'control'){
				return null;
			}
			return dojo.doc.selection.createRange().htmlText;
		}else{
			var selection = dojo.global.getSelection();
			if(selection && selection.rangeCount){
				var i;
				var html = "";
				for(i = 0; i < selection.rangeCount; i++){
					//Handle selections spanning ranges, such as Opera
					var frag = selection.getRangeAt(i).cloneContents();
					var div = dojo.doc.createElement("div");
					div.appendChild(frag);
					html += div.innerHTML;
				}
				return html; //String
			}
			return null;
		}
	},

	getSelectedElement: function(){
		// summary:
		//		Retrieves the selected element (if any), just in the case that
		//		a single element (object like and image or a table) is
		//		selected.
		if(dijit._editor.selection.getType() == "control"){
			if(dojo.isIE){
				var range = dojo.doc.selection.createRange();
				if(range && range.item){
					return dojo.doc.selection.createRange().item(0);
				}
			}else{
				var selection = dojo.global.getSelection();
				return selection.anchorNode.childNodes[ selection.anchorOffset ];
			}
		}
		return null;
	},

	getParentElement: function(){
		// summary:
		//		Get the parent element of the current selection
		if(dijit._editor.selection.getType() == "control"){
			var p = this.getSelectedElement();
			if(p){ return p.parentNode; }
		}else{
			if(dojo.isIE){
				var r = dojo.doc.selection.createRange();
				r.collapse(true);
				return r.parentElement();
			}else{
				var selection = dojo.global.getSelection();
				if(selection){
					var node = selection.anchorNode;
					while(node && (node.nodeType != 1)){ // not an element
						node = node.parentNode;
					}
					return node;
				}
			}
		}
		return null;
	},

	hasAncestorElement: function(/*String*/tagName /* ... */){
		// summary:
		// 		Check whether current selection has a  parent element which is
		// 		of type tagName (or one of the other specified tagName)
		// tagName: String
		//		The tag name to determine if it has an ancestor of.
		return this.getAncestorElement.apply(this, arguments) != null; //Boolean
	},

	getAncestorElement: function(/*String*/tagName /* ... */){
		// summary:
		//		Return the parent element of the current selection which is of
		//		type tagName (or one of the other specified tagName)
		// tagName: String
		//		The tag name to determine if it has an ancestor of.
		var node = this.getSelectedElement() || this.getParentElement();
		return this.getParentOfType(node, arguments); //DOMNode
	},

	isTag: function(/*DomNode*/ node, /*String[]*/ tags){
		// summary:
		//		Function to determine if a node is one of an array of tags.
		// node:
		//		The node to inspect.
		// tags:
		//		An array of tag name strings to check to see if the node matches.
		if(node && node.tagName){
			var _nlc = node.tagName.toLowerCase();
			for(var i=0; i<tags.length; i++){
				var _tlc = String(tags[i]).toLowerCase();
				if(_nlc == _tlc){
					return _tlc; // String
				}
			}
		}
		return "";
	},

	getParentOfType: function(/*DomNode*/ node, /*String[]*/ tags){
		// summary:
		//		Function to locate a parent node that matches one of a set of tags
		// node:
		//		The node to inspect.
		// tags:
		//		An array of tag name strings to check to see if the node matches.
		while(node){
			if(this.isTag(node, tags).length){
				return node; // DOMNode
			}
			node = node.parentNode;
		}
		return null;
	},

	collapse: function(/*Boolean*/beginning){
		// summary:
		//		Function to collapse (clear), the current selection
		// beginning: Boolean
		//		Boolean to indicate whether to collapse the cursor to the beginning of the selection or end.
		if(window.getSelection){
			var selection = dojo.global.getSelection();
			if(selection.removeAllRanges){ // Mozilla
				if(beginning){
					selection.collapseToStart();
				}else{
					selection.collapseToEnd();
				}
			}else{ // Safari
				// pulled from WebCore/ecma/kjs_window.cpp, line 2536
				selection.collapse(beginning);
			}
		}else if(dojo.isIE){ // IE
			var range = dojo.doc.selection.createRange();
			range.collapse(beginning);
			range.select();
		}
	},

	remove: function(){
		// summary:
		//		Function to delete the currently selected content from the document.
		var sel = dojo.doc.selection;
		if(dojo.isIE){
			if(sel.type.toLowerCase() != "none"){
				sel.clear();
			}
			return sel; //Selection
		}else{
			sel = dojo.global.getSelection();
			sel.deleteFromDocument();
			return sel; //Selection
		}
	},

	selectElementChildren: function(/*DomNode*/element,/*Boolean?*/nochangefocus){
		// summary:
		//		clear previous selection and select the content of the node
		//		(excluding the node itself)
		// element: DOMNode
		//		The element you wish to select the children content of.
		// nochangefocus: Boolean
		//		Boolean to indicate if the foxus should change or not.
		var win = dojo.global;
		var doc = dojo.doc;
		var range;
		element = dojo.byId(element);
		if(doc.selection && dojo.isIE && dojo.body().createTextRange){ // IE
			range = element.ownerDocument.body.createTextRange();
			range.moveToElementText(element);
			if(!nochangefocus){
				try{
					range.select(); // IE throws an exception here if the widget is hidden.  See #5439
				}catch(e){ /* squelch */}
			}
		}else if(win.getSelection){
			var selection = dojo.global.getSelection();
			if(dojo.isOpera){
				//Opera's selectAllChildren doesn't seem to work right
				//against <body> nodes and possibly others ... so
				//we use the W3C range API
				if(selection.rangeCount){
					range = selection.getRangeAt(0);
				}else{
					range = doc.createRange();
				}
				range.setStart(element, 0);
				range.setEnd(element,(element.nodeType == 3)?element.length:element.childNodes.length);
				selection.addRange(range);
			}else{
				selection.selectAllChildren(element);
			}
		}
	},

	selectElement: function(/*DomNode*/element,/*Boolean?*/nochangefocus){
		// summary:
		//		clear previous selection and select element (including all its children)
		// element:  DOMNode
		//		The element to select.
		// nochangefocus: Boolean
		//		Boolean indicating if the focus should be changed.  IE only.
		var range;
		var doc = dojo.doc;
		var win = dojo.global;
		element = dojo.byId(element);
		if(dojo.isIE && dojo.body().createTextRange){
			try{
				range = dojo.body().createControlRange();
				range.addElement(element);
				if(!nochangefocus){
					range.select();
				}
			}catch(e){
				this.selectElementChildren(element,nochangefocus);
			}
		}else if(dojo.global.getSelection){
			var selection = win.getSelection();
			range = doc.createRange();
			if(selection.removeAllRanges){ // Mozilla
				// FIXME: does this work on Safari?
				if(dojo.isOpera){
					//Opera works if you use the current range on
					//the selection if present.
					if(selection.getRangeAt(0)){
						range = selection.getRangeAt(0);
					}
				}
				range.selectNode(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	},

	inSelection: function(node){
		// summary:
		//		This function determines if 'node' is
		//		in the current selection.
		// tags:
		//		public
		if(node){
			var newRange;
			var doc = dojo.doc;
			var range;

			if(dojo.global.getSelection){
				//WC3
				var sel = dojo.global.getSelection();
				if(sel && sel.rangeCount > 0){
					range = sel.getRangeAt(0);
				}
				if(range && range.compareBoundaryPoints && doc.createRange){
					try{
						newRange = doc.createRange();
						newRange.setStart(node, 0);
						if(range.compareBoundaryPoints(range.START_TO_END, newRange) === 1){
							return true;
						}
					}catch(e){ /* squelch */}
				}
			}else if(doc.selection){
				// Probably IE, so we can't use the range object as the pseudo
				// range doesn't implement the boundry checking, we have to
				// use IE specific crud.
				range = doc.selection.createRange();
				try{
					newRange = node.ownerDocument.body.createControlRange();
					if(newRange){
						newRange.addElement(node);
					}
				}catch(e1){
					try{
						newRange = node.ownerDocument.body.createTextRange();
						newRange.moveToElementText(node);
					}catch(e2){/* squelch */}
				}
				if(range && newRange){
					// We can finally compare similar to W3C
					if(range.compareEndPoints("EndToStart", newRange) === 1){
						return true;
					}
				}
			}
		}
		return false; // boolean
	}

});

}

if(!dojo._hasResource["dijit._editor.range"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor.range"] = true;
dojo.provide("dijit._editor.range");


dijit.range={};

dijit.range.getIndex=function(/*DomNode*/node, /*DomNode*/parent){
//	dojo.profile.start("dijit.range.getIndex");
	var ret=[], retR=[];
	var stop = parent;
	var onode = node;

	var pnode, n;
	while(node != stop){
		var i = 0;
		pnode = node.parentNode;
		while((n=pnode.childNodes[i++])){
			if(n === node){
				--i;
				break;
			}
		}
		//if(i>=pnode.childNodes.length){
			//dojo.debug("Error finding index of a node in dijit.range.getIndex");
		//}
		ret.unshift(i);
		retR.unshift(i-pnode.childNodes.length);
		node = pnode;
	}

	//normalized() can not be called so often to prevent
	//invalidating selection/range, so we have to detect
	//here that any text nodes in a row
	if(ret.length > 0 && onode.nodeType == 3){
		n = onode.previousSibling;
		while(n && n.nodeType == 3){
			ret[ret.length-1]--;
			n = n.previousSibling;
		}
		n = onode.nextSibling;
		while(n && n.nodeType == 3){
			retR[retR.length-1]++;
			n = n.nextSibling;
		}
	}
//	dojo.profile.end("dijit.range.getIndex");
	return {o: ret, r:retR};
}

dijit.range.getNode = function(/*Array*/index, /*DomNode*/parent){
	if(!dojo.isArray(index) || index.length == 0){
		return parent;
	}
	var node = parent;
//	if(!node)debugger
	dojo.every(index, function(i){
		if(i >= 0 && i < node.childNodes.length){
			node = node.childNodes[i];
		}else{
			node = null;
			//console.debug('Error: can not find node with index',index,'under parent node',parent );
			return false; //terminate dojo.every
		}
		return true; //carry on the every loop
	});

	return node;
}

dijit.range.getCommonAncestor = function(n1,n2,root){
	root = root||n1.ownerDocument.body;
	var getAncestors = function(n){
		var as=[];
		while(n){
			as.unshift(n);
			if(n !== root){
				n = n.parentNode;
			}else{
				break;
			}
		}
		return as;
	};
	var n1as = getAncestors(n1);
	var n2as = getAncestors(n2);

	var m = Math.min(n1as.length,n2as.length);
	var com = n1as[0]; //at least, one element should be in the array: the root (BODY by default)
	for(var i=1;i<m;i++){
		if(n1as[i] === n2as[i]){
			com = n1as[i]
		}else{
			break;
		}
	}
	return com;
}

dijit.range.getAncestor = function(/*DomNode*/node, /*RegEx?*/regex, /*DomNode?*/root){
	root = root || node.ownerDocument.body;
	while(node && node !== root){
		var name = node.nodeName.toUpperCase() ;
		if(regex.test(name)){
			return node;
		}

		node = node.parentNode;
	}
	return null;
}

dijit.range.BlockTagNames = /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/;
dijit.range.getBlockAncestor = function(/*DomNode*/node, /*RegEx?*/regex, /*DomNode?*/root){
	root = root || node.ownerDocument.body;
	regex = regex || dijit.range.BlockTagNames;
	var block=null, blockContainer;
	while(node && node !== root){
		var name = node.nodeName.toUpperCase() ;
		if(!block && regex.test(name)){
			block = node;
		}
		if(!blockContainer && (/^(?:BODY|TD|TH|CAPTION)$/).test(name)){
			blockContainer = node;
		}

		node = node.parentNode;
	}
	return {blockNode:block, blockContainer:blockContainer || node.ownerDocument.body};
}

dijit.range.atBeginningOfContainer = function(/*DomNode*/container, /*DomNode*/node, /*Int*/offset){
	var atBeginning = false;
	var offsetAtBeginning = (offset == 0);
	if(!offsetAtBeginning && node.nodeType == 3){ //if this is a text node, check whether the left part is all space
		if(/^[\s\xA0]+$/.test(node.nodeValue.substr(0,offset))){
			offsetAtBeginning = true;
		}
	}
	if(offsetAtBeginning){
		var cnode = node;
		atBeginning = true;
		while(cnode && cnode !== container){
			if(cnode.previousSibling){
				atBeginning = false;
				break;
			}
			cnode = cnode.parentNode;
		}
	}
	return atBeginning;
}

dijit.range.atEndOfContainer = function(/*DomNode*/container, /*DomNode*/node, /*Int*/offset){
	var atEnd = false;
	var offsetAtEnd = (offset == (node.length || node.childNodes.length));
	if(!offsetAtEnd && node.nodeType == 3){ //if this is a text node, check whether the right part is all space
		if(/^[\s\xA0]+$/.test(node.nodeValue.substr(offset))){
			offsetAtEnd = true;
		}
	}
	if(offsetAtEnd){
		var cnode = node;
		atEnd = true;
		while(cnode && cnode !== container){
			if(cnode.nextSibling){
				atEnd = false;
				break;
			}
			cnode = cnode.parentNode;
		}
	}
	return atEnd;
}

dijit.range.adjacentNoneTextNode=function(startnode, next){
	var node = startnode;
	var len = (0-startnode.length) || 0;
	var prop = next?'nextSibling':'previousSibling';
	while(node){
		if(node.nodeType!=3){
			break;
		}
		len += node.length
		node = node[prop];
	}
	return [node,len];
}

dijit.range._w3c = Boolean(window['getSelection']);
dijit.range.create = function(/*Window?*/win){
	if(dijit.range._w3c){
		return (win || dojo.global).document.createRange();
	}else{//IE
		return new dijit.range.W3CRange;
	}
}

dijit.range.getSelection = function(/*Window*/win, /*Boolean?*/ignoreUpdate){
	if(dijit.range._w3c){
		return win.getSelection();
	}else{//IE
		var s = new dijit.range.ie.selection(win);
		if(!ignoreUpdate){
			s._getCurrentSelection();
		}
		return s;
	}
}

if(!dijit.range._w3c){
	dijit.range.ie={
		cachedSelection: {},
		selection: function(win){
			this._ranges = [];
			this.addRange = function(r, /*boolean*/internal){
				this._ranges.push(r);
				if(!internal){
					r._select();
				}
				this.rangeCount = this._ranges.length;
			};
			this.removeAllRanges = function(){
				//don't detach, the range may be used later
//				for(var i=0;i<this._ranges.length;i++){
//					this._ranges[i].detach();
//				}
				this._ranges = [];
				this.rangeCount = 0;
			};
			var _initCurrentRange = function(){
				var r = win.document.selection.createRange();
				var type=win.document.selection.type.toUpperCase();
				if(type == "CONTROL"){
					//TODO: multiple range selection(?)
					return new dijit.range.W3CRange(dijit.range.ie.decomposeControlRange(r));
				}else{
					return new dijit.range.W3CRange(dijit.range.ie.decomposeTextRange(r));
				}
			};
			this.getRangeAt = function(i){
				return this._ranges[i];
			};
			this._getCurrentSelection = function(){
				this.removeAllRanges();
				var r=_initCurrentRange();
				if(r){
					this.addRange(r, true);
				}
			};
		},
		decomposeControlRange: function(range){
			var firstnode = range.item(0), lastnode = range.item(range.length-1);
			var startContainer = firstnode.parentNode, endContainer = lastnode.parentNode;
			var startOffset = dijit.range.getIndex(firstnode, startContainer).o;
			var endOffset = dijit.range.getIndex(lastnode, endContainer).o+1;
			return [startContainer, startOffset,endContainer, endOffset];
		},
		getEndPoint: function(range, end){
			var atmrange = range.duplicate();
			atmrange.collapse(!end);
			var cmpstr = 'EndTo' + (end?'End':'Start');
			var parentNode = atmrange.parentElement();

			var startnode, startOffset, lastNode;
			if(parentNode.childNodes.length>0){
				dojo.every(parentNode.childNodes, function(node,i){
					var calOffset;
					if(node.nodeType != 3){
						atmrange.moveToElementText(node);

						if(atmrange.compareEndPoints(cmpstr,range) > 0){
							//startnode = node.previousSibling;
							if(lastNode && lastNode.nodeType == 3){
								//where shall we put the start? in the text node or after?
								startnode = lastNode;
								calOffset = true;
							}else{
								startnode = parentNode;
								startOffset = i;
								return false;
							}
						}else{
							if(i == parentNode.childNodes.length-1){
								startnode = parentNode;
								startOffset = parentNode.childNodes.length;
								return false;
							}
						}
					}else{
						if(i == parentNode.childNodes.length-1){//at the end of this node
							startnode = node;
							calOffset = true;
						}
					}
		//			try{
						if(calOffset && startnode){
							var prevnode = dijit.range.adjacentNoneTextNode(startnode)[0];
							if(prevnode){
								startnode = prevnode.nextSibling;
							}else{
								startnode = parentNode.firstChild; //firstChild must be a text node
							}
							var prevnodeobj = dijit.range.adjacentNoneTextNode(startnode);
							prevnode = prevnodeobj[0];
							var lenoffset = prevnodeobj[1];
							if(prevnode){
								atmrange.moveToElementText(prevnode);
								atmrange.collapse(false);
							}else{
								atmrange.moveToElementText(parentNode);
							}
							atmrange.setEndPoint(cmpstr, range);
							startOffset = atmrange.text.length-lenoffset;

							return false;
						}
		//			}catch(e){ debugger }
					lastNode = node;
					return true;
				});
			}else{
				startnode = parentNode;
				startOffset = 0;
			}

			//if at the end of startnode and we are dealing with start container, then
			//move the startnode to nextSibling if it is a text node
			//TODO: do this for end container?
			if(!end && startnode.nodeType == 1 && startOffset == startnode.childNodes.length){
				var nextnode=startnode.nextSibling;
				if(nextnode && nextnode.nodeType == 3){
					startnode = nextnode;
					startOffset = 0;
				}
			}
			return [startnode, startOffset];
		},
		setEndPoint: function(range, container, offset){
			//text node
			var atmrange = range.duplicate(), node, len;
			if(container.nodeType!=3){ //normal node
				if(offset > 0){
					node = container.childNodes[offset-1];
					if(node){
						if(node.nodeType == 3){
							container = node;
							offset = node.length;
							//pass through
						}else{
							if(node.nextSibling && node.nextSibling.nodeType == 3){
								container=node.nextSibling;
								offset=0;
								//pass through
							}else{
								atmrange.moveToElementText(node.nextSibling?node:container);
								var parent = node.parentNode;
								var tempNode = parent.insertBefore(node.ownerDocument.createTextNode(' '), node.nextSibling);
								atmrange.collapse(false);
								parent.removeChild(tempNode);
							}
						}
					}
				}else{
					atmrange.moveToElementText(container);
					atmrange.collapse(true);
				}
			}
			if(container.nodeType == 3){
				var prevnodeobj = dijit.range.adjacentNoneTextNode(container);
				var prevnode = prevnodeobj[0];
				len = prevnodeobj[1];
				if(prevnode){
					atmrange.moveToElementText(prevnode);
					atmrange.collapse(false);
					//if contentEditable is not inherit, the above collapse won't make the end point
					//in the correctly position: it always has a -1 offset, so compensate it
					if(prevnode.contentEditable!='inherit'){
						len++;
					}
				}else{
					atmrange.moveToElementText(container.parentNode);
					atmrange.collapse(true);
				}

				offset += len;
				if(offset>0){
					if(atmrange.move('character',offset) != offset){
						console.error('Error when moving!');
					}
				}
			}

			return atmrange;
		},
		decomposeTextRange: function(range){
			var tmpary = dijit.range.ie.getEndPoint(range);
			var startContainer = tmpary[0], startOffset = tmpary[1];
			var endContainer = tmpary[0], endOffset = tmpary[1];

			if(range.htmlText.length){
				if(range.htmlText == range.text){ //in the same text node
					endOffset = startOffset+range.text.length;
				}else{
					tmpary = dijit.range.ie.getEndPoint(range,true);
					endContainer = tmpary[0], endOffset = tmpary[1];
//					if(startContainer.tagName == "BODY"){
//						startContainer = startContainer.firstChild;
//					}
				}
			}
			return [startContainer, startOffset, endContainer, endOffset];
		},
		setRange: function(range, startContainer,
			startOffset, endContainer, endOffset, collapsed){
			var start=dijit.range.ie.setEndPoint(range, startContainer, startOffset);

			range.setEndPoint('StartToStart',start);
			if(!collapsed){
				var end=dijit.range.ie.setEndPoint(range, endContainer, endOffset);
			}
			range.setEndPoint('EndToEnd',end || start);

			return range;
		}
	}

dojo.declare("dijit.range.W3CRange",null, {
	constructor: function(){
		if(arguments.length>0){
			this.setStart(arguments[0][0],arguments[0][1]);
			this.setEnd(arguments[0][2],arguments[0][3]);
		}else{
			this.commonAncestorContainer = null;
			this.startContainer = null;
			this.startOffset = 0;
			this.endContainer = null;
			this.endOffset = 0;
			this.collapsed = true;
		}
	},
	_updateInternal: function(){
		if(this.startContainer !== this.endContainer){
			this.commonAncestorContainer = dijit.range.getCommonAncestor(this.startContainer, this.endContainer);
		}else{
			this.commonAncestorContainer = this.startContainer;
		}
		this.collapsed = (this.startContainer === this.endContainer) && (this.startOffset == this.endOffset);
	},
	setStart: function(node, offset){
		offset=parseInt(offset);
		if(this.startContainer === node && this.startOffset == offset){
			return;
		}
		delete this._cachedBookmark;

		this.startContainer = node;
		this.startOffset = offset;
		if(!this.endContainer){
			this.setEnd(node, offset);
		}else{
			this._updateInternal();
		}
	},
	setEnd: function(node, offset){
		offset=parseInt(offset);
		if(this.endContainer === node && this.endOffset == offset){
			return;
		}
		delete this._cachedBookmark;

		this.endContainer = node;
		this.endOffset = offset;
		if(!this.startContainer){
			this.setStart(node, offset);
		}else{
			this._updateInternal();
		}
	},
	setStartAfter: function(node, offset){
		this._setPoint('setStart', node, offset, 1);
	},
	setStartBefore: function(node, offset){
		this._setPoint('setStart', node, offset, 0);
	},
	setEndAfter: function(node, offset){
		this._setPoint('setEnd', node, offset, 1);
	},
	setEndBefore: function(node, offset){
		this._setPoint('setEnd', node, offset, 0);
	},
	_setPoint: function(what, node, offset, ext){
		var index = dijit.range.getIndex(node, node.parentNode).o;
		this[what](node.parentNode, index.pop()+ext);
	},
	_getIERange: function(){
		var r = (this._body || this.endContainer.ownerDocument.body).createTextRange();
		dijit.range.ie.setRange(r, this.startContainer, this.startOffset, this.endContainer, this.endOffset, this.collapsed);
		return r;
	},
	getBookmark: function(body){
		this._getIERange();
		return this._cachedBookmark;
	},
	_select: function(){
		var r = this._getIERange();
		r.select();
	},
	deleteContents: function(){
		var r = this._getIERange();
		r.pasteHTML('');
		this.endContainer = this.startContainer;
		this.endOffset = this.startOffset;
		this.collapsed = true;
	},
	cloneRange: function(){
		var r = new dijit.range.W3CRange([this.startContainer,this.startOffset,
			this.endContainer,this.endOffset]);
		r._body = this._body;
		return r;
	},
	detach: function(){
		this._body = null;
		this.commonAncestorContainer = null;
		this.startContainer = null;
		this.startOffset = 0;
		this.endContainer = null;
		this.endOffset = 0;
		this.collapsed = true;
}
});
} //if(!dijit.range._w3c)

}

if(!dojo._hasResource["dijit._editor.html"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor.html"] = true;
dojo.provide("dijit._editor.html");

dojo.getObject("_editor", true, dijit);

dijit._editor.escapeXml=function(/*String*/str, /*Boolean?*/noSingleQuotes){
	// summary:
	//		Adds escape sequences for special characters in XML: &<>"'
	//		Optionally skips escapes for single quotes
	str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	if(!noSingleQuotes){
		str = str.replace(/'/gm, "&#39;");
	}
	return str; // string
};

dijit._editor.getNodeHtml=function(/* DomNode */node){
	var output;
	switch(node.nodeType){
		case 1: //element node
			var lName = node.nodeName.toLowerCase();
			if(!lName || lName.charAt(0) == "/"){
				// IE does some strange things with malformed HTML input, like
				// treating a close tag </span> without an open tag <span>, as
				// a new tag with tagName of /span.  Corrupts output HTML, remove
				// them.  Other browsers don't prefix tags that way, so will
				// never show up.
				return "";
			}
			output = '<' + lName;

			//store the list of attributes and sort it to have the
			//attributes appear in the dictionary order
			var attrarray = [];
			var attr;
			if(dojo.isIE && node.outerHTML){
				var s = node.outerHTML;
				s = s.substr(0, s.indexOf('>'))
					.replace(/(['"])[^"']*\1/g, ''); //to make the following regexp safe
				var reg = /(\b\w+)\s?=/g;
				var m, key;
				while((m = reg.exec(s))){
					key = m[1];
					if(key.substr(0,3) != '_dj'){
						if(key == 'src' || key == 'href'){
							if(node.getAttribute('_djrealurl')){
								attrarray.push([key,node.getAttribute('_djrealurl')]);
								continue;
							}
						}
						var val, match;
						switch(key){
							case 'style':
								val = node.style.cssText.toLowerCase();
								break;
							case 'class':
								val = node.className;
								break;
							case 'width':
								if(lName === "img"){
									// This somehow gets lost on IE for IMG tags and the like
									// and we have to find it in outerHTML, known IE oddity.
									match=/width=(\S+)/i.exec(s);
									if(match){
										val = match[1];
									}
									break;
								}
							case 'height':
								if(lName === "img"){
									// This somehow gets lost on IE for IMG tags and the like
									// and we have to find it in outerHTML, known IE oddity.
									match=/height=(\S+)/i.exec(s);
									if(match){
										val = match[1];
									}
									break;
								}
							default:
								val = node.getAttribute(key);
						}
						if(val != null){
							attrarray.push([key, val.toString()]);
						}
					}
				}
			}else{
				var i = 0;
				while((attr = node.attributes[i++])){
					//ignore all attributes starting with _dj which are
					//internal temporary attributes used by the editor
					var n = attr.name;
					if(n.substr(0,3) != '_dj' /*&&
						(attr.specified == undefined || attr.specified)*/){
						var v = attr.value;
						if(n == 'src' || n == 'href'){
							if(node.getAttribute('_djrealurl')){
								v = node.getAttribute('_djrealurl');
							}
						}
						attrarray.push([n,v]);
					}
				}
			}
			attrarray.sort(function(a,b){
				return a[0] < b[0] ? -1 : (a[0] == b[0] ? 0 : 1);
			});
			var j = 0;
			while((attr = attrarray[j++])){
				output += ' ' + attr[0] + '="' +
					(dojo.isString(attr[1]) ? dijit._editor.escapeXml(attr[1], true) : attr[1]) + '"';
			}
			if(lName === "script"){
				// Browsers handle script tags differently in how you get content,
				// but innerHTML always seems to work, so insert its content that way
				// Yes, it's bad to allow script tags in the editor code, but some people
				// seem to want to do it, so we need to at least return them right.
				// other plugins/filters can strip them.
				output += '>' + node.innerHTML +'</' + lName + '>';
			}else{
				if(node.childNodes.length){
					output += '>' + dijit._editor.getChildrenHtml(node)+'</' + lName +'>';
				}else{
					switch(lName){
						case 'br':
						case 'hr':
						case 'img':
						case 'input':
						case 'base':
						case 'meta':
						case 'area':
						case 'basefont':
							// These should all be singly closed
							output += ' />';
							break;
						default:
							// Assume XML style separate closure for everything else.
							output += '></' + lName + '>';
					}
				}
			}
			break;
		case 4: // cdata
		case 3: // text
			// FIXME:
			output = dijit._editor.escapeXml(node.nodeValue, true);
			break;
		case 8: //comment
			// FIXME:
			output = '<!--' + dijit._editor.escapeXml(node.nodeValue, true) + '-->';
			break;
		default:
			output = "<!-- Element not recognized - Type: " + node.nodeType + " Name: " + node.nodeName + "-->";
	}
	return output;
};

dijit._editor.getChildrenHtml = function(/* DomNode */dom){
	// summary:
	//		Returns the html content of a DomNode and children
	var out = "";
	if(!dom){ return out; }
	var nodes = dom["childNodes"] || dom;

	//IE issue.
	//If we have an actual node we can check parent relationships on for IE,
	//We should check, as IE sometimes builds invalid DOMS.  If no parent, we can't check
	//And should just process it and hope for the best.
	var checkParent = !dojo.isIE || nodes !== dom;

	var node, i = 0;
	while((node = nodes[i++])){
		//IE is broken.  DOMs are supposed to be a tree.  But in the case of malformed HTML, IE generates a graph
		//meaning one node ends up with multiple references (multiple parents).  This is totally wrong and invalid, but
		//such is what it is.  We have to keep track and check for this because otherise the source output HTML will have dups.
		//No other browser generates a graph.  Leave it to IE to break a fundamental DOM rule.  So, we check the parent if we can
		//If we can't, nothing more we can do other than walk it.
		if(!checkParent || node.parentNode == dom){
			out += dijit._editor.getNodeHtml(node);
		}
	}
	return out; // String
};

}

if(!dojo._hasResource["dijit._editor.RichText"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor.RichText"] = true;
dojo.provide("dijit._editor.RichText");







// used to restore content when user leaves this page then comes back
// but do not try doing dojo.doc.write if we are using xd loading.
// dojo.doc.write will only work if RichText.js is included in the dojo.js
// file. If it is included in dojo.js and you want to allow rich text saving
// for back/forward actions, then set dojo.config.allowXdRichTextSave = true.
if(!dojo.config["useXDomain"] || dojo.config["allowXdRichTextSave"]){
	if(dojo._postLoad){
		(function(){
			var savetextarea = dojo.doc.createElement('textarea');
			savetextarea.id = dijit._scopeName + "._editor.RichText.value";
			dojo.style(savetextarea, {
				display:'none',
				position:'absolute',
				top:"-100px",
				height:"3px",
				width:"3px"
			});
			dojo.body().appendChild(savetextarea);
		})();
	}else{
		//dojo.body() is not available before onLoad is fired
		try{
			dojo.doc.write('<textarea id="' + dijit._scopeName + '._editor.RichText.value" ' +
				'style="display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;"></textarea>');
		}catch(e){ }
	}
}

dojo.declare("dijit._editor.RichText", [dijit._Widget, dijit._CssStateMixin], {
	constructor: function(params){
		// summary:
		//		dijit._editor.RichText is the core of dijit.Editor, which provides basic
		//		WYSIWYG editing features.
		//
		// description:
		//		dijit._editor.RichText is the core of dijit.Editor, which provides basic
		//		WYSIWYG editing features. It also encapsulates the differences
		//		of different js engines for various browsers.  Do not use this widget
		//		with an HTML &lt;TEXTAREA&gt; tag, since the browser unescapes XML escape characters,
		//		like &lt;.  This can have unexpected behavior and lead to security issues
		//		such as scripting attacks.
		//
		// tags:
		//		private

		// contentPreFilters: Function(String)[]
		//		Pre content filter function register array.
		//		these filters will be executed before the actual
		//		editing area gets the html content.
		this.contentPreFilters = [];

		// contentPostFilters: Function(String)[]
		//		post content filter function register array.
		//		These will be used on the resulting html
		//		from contentDomPostFilters. The resulting
		//		content is the final html (returned by getValue()).
		this.contentPostFilters = [];

		// contentDomPreFilters: Function(DomNode)[]
		//		Pre content dom filter function register array.
		//		These filters are applied after the result from
		//		contentPreFilters are set to the editing area.
		this.contentDomPreFilters = [];

		// contentDomPostFilters: Function(DomNode)[]
		//		Post content dom filter function register array.
		//		These filters are executed on the editing area dom.
		//		The result from these will be passed to contentPostFilters.
		this.contentDomPostFilters = [];

		// editingAreaStyleSheets: dojo._URL[]
		//		array to store all the stylesheets applied to the editing area
		this.editingAreaStyleSheets = [];

		// Make a copy of this.events before we start writing into it, otherwise we
		// will modify the prototype which leads to bad things on pages w/multiple editors
		this.events = [].concat(this.events);

		this._keyHandlers = {};

		if(params && dojo.isString(params.value)){
			this.value = params.value;
		}

		this.onLoadDeferred = new dojo.Deferred();
	},

	baseClass: "dijitEditor",

	// inheritWidth: Boolean
	//		whether to inherit the parent's width or simply use 100%
	inheritWidth: false,

	// focusOnLoad: [deprecated] Boolean
	//		Focus into this widget when the page is loaded
	focusOnLoad: false,

	// name: String?
	//		Specifies the name of a (hidden) <textarea> node on the page that's used to save
	//		the editor content on page leave.   Used to restore editor contents after navigating
	//		to a new page and then hitting the back button.
	name: "",

	// styleSheets: [const] String
	//		semicolon (";") separated list of css files for the editing area
	styleSheets: "",

	// height: String
	//		Set height to fix the editor at a specific height, with scrolling.
	//		By default, this is 300px.  If you want to have the editor always
	//		resizes to accommodate the content, use AlwaysShowToolbar plugin
	//		and set height="".  If this editor is used within a layout widget,
	//		set height="100%".
	height: "300px",

	// minHeight: String
	//		The minimum height that the editor should have.
	minHeight: "1em",

	// isClosed: [private] Boolean
	isClosed: true,

	// isLoaded: [private] Boolean
	isLoaded: false,

	// _SEPARATOR: [private] String
	//		Used to concat contents from multiple editors into a single string,
	//		so they can be saved into a single <textarea> node.  See "name" attribute.
	_SEPARATOR: "@@**%%__RICHTEXTBOUNDRY__%%**@@",

	// _NAME_CONTENT_SEP: [private] String
	//		USed to separate name from content.  Just a colon isn't safe.
	_NAME_CONTENT_SEP: "@@**%%:%%**@@",

	// onLoadDeferred: [readonly] dojo.Deferred
	//		Deferred which is fired when the editor finishes loading.
	//		Call myEditor.onLoadDeferred.then(callback) it to be informed
	//		when the rich-text area initialization is finalized.
	onLoadDeferred: null,

	// isTabIndent: Boolean
	//		Make tab key and shift-tab indent and outdent rather than navigating.
	//		Caution: sing this makes web pages inaccessible to users unable to use a mouse.
	isTabIndent: false,

	// disableSpellCheck: [const] Boolean
	//		When true, disables the browser's native spell checking, if supported.
	//		Works only in Firefox.
	disableSpellCheck: false,

	postCreate: function(){
		if("textarea" == this.domNode.tagName.toLowerCase()){
			console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
		}

		// Push in the builtin filters now, making them the first executed, but not over-riding anything
		// users passed in.  See: #6062
		this.contentPreFilters = [dojo.hitch(this, "_preFixUrlAttributes")].concat(this.contentPreFilters);
		if(dojo.isMoz){
			this.contentPreFilters = [this._normalizeFontStyle].concat(this.contentPreFilters);
			this.contentPostFilters = [this._removeMozBogus].concat(this.contentPostFilters);
		}
		if(dojo.isWebKit){
			// Try to clean up WebKit bogus artifacts.  The inserted classes
			// made by WebKit sometimes messes things up.
			this.contentPreFilters = [this._removeWebkitBogus].concat(this.contentPreFilters);
			this.contentPostFilters = [this._removeWebkitBogus].concat(this.contentPostFilters);
		}
		if(dojo.isIE){
			// IE generates <strong> and <em> but we want to normalize to <b> and <i>
			this.contentPostFilters = [this._normalizeFontStyle].concat(this.contentPostFilters);
		}
		this.inherited(arguments);

		dojo.publish(dijit._scopeName + "._editor.RichText::init", [this]);
		this.open();
		this.setupDefaultShortcuts();
	},

	setupDefaultShortcuts: function(){
		// summary:
		//		Add some default key handlers
		// description:
		// 		Overwrite this to setup your own handlers. The default
		// 		implementation does not use Editor commands, but directly
		//		executes the builtin commands within the underlying browser
		//		support.
		// tags:
		//		protected
		var exec = dojo.hitch(this, function(cmd, arg){
			return function(){
				return !this.execCommand(cmd,arg);
			};
		});

		var ctrlKeyHandlers = {
			b: exec("bold"),
			i: exec("italic"),
			u: exec("underline"),
			a: exec("selectall"),
			s: function(){ this.save(true); },
			m: function(){ this.isTabIndent = !this.isTabIndent; },

			"1": exec("formatblock", "h1"),
			"2": exec("formatblock", "h2"),
			"3": exec("formatblock", "h3"),
			"4": exec("formatblock", "h4"),

			"\\": exec("insertunorderedlist")
		};

		if(!dojo.isIE){
			ctrlKeyHandlers.Z = exec("redo"); //FIXME: undo?
		}

		for(var key in ctrlKeyHandlers){
			this.addKeyHandler(key, true, false, ctrlKeyHandlers[key]);
		}
	},

	// events: [private] String[]
	//		 events which should be connected to the underlying editing area
	events: ["onKeyPress", "onKeyDown", "onKeyUp"], // onClick handled specially

	// captureEvents: [deprecated] String[]
	//		 Events which should be connected to the underlying editing
	//		 area, events in this array will be addListener with
	//		 capture=true.
	// TODO: looking at the code I don't see any distinction between events and captureEvents,
	// so get rid of this for 2.0 if not sooner
	captureEvents: [],

	_editorCommandsLocalized: false,
	_localizeEditorCommands: function(){
		// summary:
		//		When IE is running in a non-English locale, the API actually changes,
		//		so that we have to say (for example) danraku instead of p (for paragraph).
		//		Handle that here.
		// tags:
		//		private
		if(this._editorCommandsLocalized){
			return;
		}
		this._editorCommandsLocalized = true;

		//in IE, names for blockformat is locale dependent, so we cache the values here

		//if the normal way fails, we try the hard way to get the list

		//do not use _cacheLocalBlockFormatNames here, as it will
		//trigger security warning in IE7

		//put p after div, so if IE returns Normal, we show it as paragraph
		//We can distinguish p and div if IE returns Normal, however, in order to detect that,
		//we have to call this.document.selection.createRange().parentElement() or such, which
		//could slow things down. Leave it as it is for now
		var formats = ['div', 'p', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'address'];
		var localhtml = "", format, i=0;
		while((format=formats[i++])){
			//append a <br> after each element to separate the elements more reliably
			if(format.charAt(1) != 'l'){
				localhtml += "<"+format+"><span>content</span></"+format+"><br/>";
			}else{
				localhtml += "<"+format+"><li>content</li></"+format+"><br/>";
			}
		}
		//queryCommandValue returns empty if we hide editNode, so move it out of screen temporary
		var div = dojo.doc.createElement('div');
		dojo.style(div, {
			position: "absolute",
			top: "-2000px"
		});
		dojo.doc.body.appendChild(div);
		div.innerHTML = localhtml;
		var node = div.firstChild;
		while(node){
			dijit._editor.selection.selectElement(node.firstChild);
			dojo.withGlobal(this.window, "selectElement", dijit._editor.selection, [node.firstChild]);
			var nativename = node.tagName.toLowerCase();
			this._local2NativeFormatNames[nativename] = document.queryCommandValue("formatblock");
			//this.queryCommandValue("formatblock");
			this._native2LocalFormatNames[this._local2NativeFormatNames[nativename]] = nativename;
			node = node.nextSibling.nextSibling;
		}
		dojo.body().removeChild(div);
	},

	open: function(/*DomNode?*/ element){
		// summary:
		//		Transforms the node referenced in this.domNode into a rich text editing
		//		node.
		// description:
		//		Sets up the editing area asynchronously. This will result in
		//		the creation and replacement with an iframe.
		// tags:
		//		private

		if(!this.onLoadDeferred || this.onLoadDeferred.fired >= 0){
			this.onLoadDeferred = new dojo.Deferred();
		}

		if(!this.isClosed){ this.close(); }
		dojo.publish(dijit._scopeName + "._editor.RichText::open", [ this ]);

		if(arguments.length == 1 && element.nodeName){ // else unchanged
			this.domNode = element;
		}

		var dn = this.domNode;

		// "html" will hold the innerHTML of the srcNodeRef and will be used to
		// initialize the editor.
		var html;

		if(dojo.isString(this.value)){
			// Allow setting the editor content programmatically instead of
			// relying on the initial content being contained within the target
			// domNode.
			html = this.value;
			delete this.value;
			dn.innerHTML = "";
		}else if(dn.nodeName && dn.nodeName.toLowerCase() == "textarea"){
			// if we were created from a textarea, then we need to create a
			// new editing harness node.
			var ta = (this.textarea = dn);
			this.name = ta.name;
			html = ta.value;
			dn = this.domNode = dojo.doc.createElement("div");
			dn.setAttribute('widgetId', this.id);
			ta.removeAttribute('widgetId');
			dn.cssText = ta.cssText;
			dn.className += " " + ta.className;
			dojo.place(dn, ta, "before");
			var tmpFunc = dojo.hitch(this, function(){
				//some browsers refuse to submit display=none textarea, so
				//move the textarea off screen instead
				dojo.style(ta, {
					display: "block",
					position: "absolute",
					top: "-1000px"
				});

				if(dojo.isIE){ //nasty IE bug: abnormal formatting if overflow is not hidden
					var s = ta.style;
					this.__overflow = s.overflow;
					s.overflow = "hidden";
				}
			});
			if(dojo.isIE){
				setTimeout(tmpFunc, 10);
			}else{
				tmpFunc();
			}

			if(ta.form){
				var resetValue = ta.value;
				this.reset = function(){
					var current = this.getValue();
					if(current != resetValue){
						this.replaceValue(resetValue);
					}
				};
				dojo.connect(ta.form, "onsubmit", this, function(){
					// Copy value to the <textarea> so it gets submitted along with form.
					// FIXME: should we be calling close() here instead?
					dojo.attr(ta, 'disabled', this.disabled); // don't submit the value if disabled
					ta.value = this.getValue();
				});
			}
		}else{
			html = dijit._editor.getChildrenHtml(dn);
			dn.innerHTML = "";
		}

		var content = dojo.contentBox(dn);
		this._oldHeight = content.h;
		this._oldWidth = content.w;

		this.value = html;

		// If we're a list item we have to put in a blank line to force the
		// bullet to nicely align at the top of text
		if(dn.nodeName && dn.nodeName == "LI"){
			dn.innerHTML = " <br>";
		}
	
		// Construct the editor div structure.
		this.header = dn.ownerDocument.createElement("div");
		dn.appendChild(this.header);
		this.editingArea = dn.ownerDocument.createElement("div");
		dn.appendChild(this.editingArea);
		this.footer = dn.ownerDocument.createElement("div");
		dn.appendChild(this.footer);

		if(!this.name){
			this.name = this.id + "_AUTOGEN";
		}

		// User has pressed back/forward button so we lost the text in the editor, but it's saved
		// in a hidden <textarea> (which contains the data for all the editors on this page),
		// so get editor value from there
		if(this.name !== "" && (!dojo.config["useXDomain"] || dojo.config["allowXdRichTextSave"])){
			var saveTextarea = dojo.byId(dijit._scopeName + "._editor.RichText.value");
			if(saveTextarea && saveTextarea.value !== ""){
				var datas = saveTextarea.value.split(this._SEPARATOR), i=0, dat;
				while((dat=datas[i++])){
					var data = dat.split(this._NAME_CONTENT_SEP);
					if(data[0] == this.name){
						html = data[1];
						datas = datas.splice(i, 1);
						saveTextarea.value = datas.join(this._SEPARATOR);
						break;
					}
				}
			}

			if(!dijit._editor._globalSaveHandler){
				dijit._editor._globalSaveHandler = {};
				dojo.addOnUnload(function() {
					var id;
					for(id in dijit._editor._globalSaveHandler){
						var f = dijit._editor._globalSaveHandler[id];
						if(dojo.isFunction(f)){
							f();
						}
					}
				});
			}
			dijit._editor._globalSaveHandler[this.id] = dojo.hitch(this, "_saveContent");
		}

		this.isClosed = false;

		var ifr = (this.editorObject = this.iframe = dojo.doc.createElement('iframe'));
		ifr.id = this.id+"_iframe";
		this._iframeSrc = this._getIframeDocTxt();
		ifr.style.border = "none";
		ifr.style.width = "100%";
		if(this._layoutMode){
			// iframe should be 100% height, thus getting it's height from surrounding
			// <div> (which has the correct height set by Editor)
			ifr.style.height = "100%";
		}else{
			if(dojo.isIE >= 7){
				if(this.height){
					ifr.style.height = this.height;
				}
				if(this.minHeight){
					ifr.style.minHeight = this.minHeight;
				}
			}else{
				ifr.style.height = this.height ? this.height : this.minHeight;
			}
		}
		ifr.frameBorder = 0;
		ifr._loadFunc = dojo.hitch( this, function(win){
			this.window = win;
			this.document = this.window.document;

			if(dojo.isIE){
				this._localizeEditorCommands();
			}
			
			// Do final setup and set initial contents of editor
			this.onLoad(html);
		});

		// Set the iframe's initial (blank) content.
		var s = 'javascript:parent.' + dijit._scopeName + '.byId("'+this.id+'")._iframeSrc';
		ifr.setAttribute('src', s);
		this.editingArea.appendChild(ifr);

		if(dojo.isSafari <= 4){
			var src = ifr.getAttribute("src");
			if(!src || src.indexOf("javascript") == -1){
				// Safari 4 and earlier sometimes act oddly
				// So we have to set it again.
				setTimeout(function(){ifr.setAttribute('src', s);},0);
			}
		}

		// TODO: this is a guess at the default line-height, kinda works
		if(dn.nodeName == "LI"){
			dn.lastChild.style.marginTop = "-1.2em";
		}

		dojo.addClass(this.domNode, this.baseClass);
	},

	//static cache variables shared among all instance of this class
	_local2NativeFormatNames: {},
	_native2LocalFormatNames: {},

	_getIframeDocTxt: function(){
		// summary:
		//		Generates the boilerplate text of the document inside the iframe (ie, <html><head>...</head><body/></html>).
		//		Editor content (if not blank) should be added afterwards.
		// tags:
		//		private
		var _cs = dojo.getComputedStyle(this.domNode);

		// The contents inside of <body>.  The real contents are set later via a call to setValue().
		var html = "";
		var setBodyId = true;
		if(dojo.isIE || dojo.isWebKit || (!this.height && !dojo.isMoz)){
			// In auto-expand mode, need a wrapper div for AlwaysShowToolbar plugin to correctly
			// expand/contract the editor as the content changes.
			html = "<div id='dijitEditorBody'></div>";
			setBodyId = false;
		}else if(dojo.isMoz){
			// workaround bug where can't select then delete text (until user types something
			// into the editor)... and/or issue where typing doesn't erase selected text
			this._cursorToStart = true;
			html = "&nbsp;";
		}

		var font = [ _cs.fontWeight, _cs.fontSize, _cs.fontFamily ].join(" ");

		// line height is tricky - applying a units value will mess things up.
		// if we can't get a non-units value, bail out.
		var lineHeight = _cs.lineHeight;
		if(lineHeight.indexOf("px") >= 0){
			lineHeight = parseFloat(lineHeight)/parseFloat(_cs.fontSize);
			// console.debug(lineHeight);
		}else if(lineHeight.indexOf("em")>=0){
			lineHeight = parseFloat(lineHeight);
		}else{
			// If we can't get a non-units value, just default
			// it to the CSS spec default of 'normal'.  Seems to
			// work better, esp on IE, than '1.0'
			lineHeight = "normal";
		}
		var userStyle = "";
		var self = this;
		this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig, function(match){
			match = match.replace(/^;/ig,"") + ';';
			var s = match.split(":")[0];
			if(s){
				s = dojo.trim(s);
				s = s.toLowerCase();
				var i;
				var sC = "";
				for(i = 0; i < s.length; i++){
					var c = s.charAt(i);
					switch(c){
						case "-":
							i++;
							c = s.charAt(i).toUpperCase();
						default:
							sC += c;
					}
				}
				dojo.style(self.domNode, sC, "");
			}
			userStyle += match + ';';
		});


		// need to find any associated label element and update iframe document title
		var label=dojo.query('label[for="'+this.id+'"]');

		return [
			this.isLeftToRight() ? "<html>\n<head>\n" : "<html dir='rtl'>\n<head>\n",
			(dojo.isMoz && label.length ? "<title>" + label[0].innerHTML + "</title>\n" : ""),
			"<meta http-equiv='Content-Type' content='text/html'>\n",
			"<style>\n",
			"\tbody,html {\n",
			"\t\tbackground:transparent;\n",
			"\t\tpadding: 1px 0 0 0;\n",
			"\t\tmargin: -1px 0 0 0;\n", // remove extraneous vertical scrollbar on safari and firefox

			// Set the html/body sizing.  Webkit always needs this, other browsers
			// only set it when height is defined (not auto-expanding), otherwise
			// scrollers do not appear.
			((dojo.isWebKit)?"\t\twidth: 100%;\n":""),
			((dojo.isWebKit)?"\t\theight: 100%;\n":""),
			"\t}\n",
			
			// TODO: left positioning will cause contents to disappear out of view
			//	   if it gets too wide for the visible area
			"\tbody{\n",
			"\t\ttop:0px;\n",
			"\t\tleft:0px;\n",
			"\t\tright:0px;\n",
			"\t\tfont:", font, ";\n",
				((this.height||dojo.isOpera) ? "" : "\t\tposition: fixed;\n"),
			// FIXME: IE 6 won't understand min-height?
			"\t\tmin-height:", this.minHeight, ";\n",
			"\t\tline-height:", lineHeight,";\n",
			"\t}\n",
			"\tp{ margin: 1em 0; }\n",
			
			// Determine how scrollers should be applied.  In autoexpand mode (height = "") no scrollers on y at all.
			// But in fixed height mode we want both x/y scrollers.  Also, if it's using wrapping div and in auto-expand
			// (Mainly IE) we need to kill the y scroller on body and html.
			(!setBodyId && !this.height ? "\tbody,html {overflow-y: hidden;}\n" : ""),
			"\t#dijitEditorBody{overflow-x: auto; overflow-y:" + (this.height ? "auto;" : "hidden;") + " outline: 0px;}\n",
			"\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",
			"\tli{ min-height:1.2em; }\n",
			"</style>\n",
			this._applyEditingAreaStyleSheets(),"\n",
			"</head>\n<body ",
			(setBodyId?"id='dijitEditorBody' ":""),
			"onload='frameElement._loadFunc(window,document)' style='"+userStyle+"'>", html, "</body>\n</html>"
		].join(""); // String
	},

	_applyEditingAreaStyleSheets: function(){
		// summary:
		//		apply the specified css files in styleSheets
		// tags:
		//		private
		var files = [];
		if(this.styleSheets){
			files = this.styleSheets.split(';');
			this.styleSheets = '';
		}

		//empty this.editingAreaStyleSheets here, as it will be filled in addStyleSheet
		files = files.concat(this.editingAreaStyleSheets);
		this.editingAreaStyleSheets = [];

		var text='', i=0, url;
		while((url=files[i++])){
			var abstring = (new dojo._Url(dojo.global.location, url)).toString();
			this.editingAreaStyleSheets.push(abstring);
			text += '<link rel="stylesheet" type="text/css" href="'+abstring+'"/>';
		}
		return text;
	},

	addStyleSheet: function(/*dojo._Url*/ uri){
		// summary:
		//		add an external stylesheet for the editing area
		// uri:
		//		A dojo.uri.Uri pointing to the url of the external css file
		var url=uri.toString();

		//if uri is relative, then convert it to absolute so that it can be resolved correctly in iframe
		if(url.charAt(0) == '.' || (url.charAt(0) != '/' && !uri.host)){
			url = (new dojo._Url(dojo.global.location, url)).toString();
		}

		if(dojo.indexOf(this.editingAreaStyleSheets, url) > -1){
//			console.debug("dijit._editor.RichText.addStyleSheet: Style sheet "+url+" is already applied");
			return;
		}

		this.editingAreaStyleSheets.push(url);
		this.onLoadDeferred.addCallback(dojo.hitch(this, function(){
			if(this.document.createStyleSheet){ //IE
				this.document.createStyleSheet(url);
			}else{ //other browser
				var head = this.document.getElementsByTagName("head")[0];
				var stylesheet = this.document.createElement("link");
				stylesheet.rel="stylesheet";
				stylesheet.type="text/css";
				stylesheet.href=url;
				head.appendChild(stylesheet);
			}
		}));
	},

	removeStyleSheet: function(/*dojo._Url*/ uri){
		// summary:
		//		remove an external stylesheet for the editing area
		var url=uri.toString();
		//if uri is relative, then convert it to absolute so that it can be resolved correctly in iframe
		if(url.charAt(0) == '.' || (url.charAt(0) != '/' && !uri.host)){
			url = (new dojo._Url(dojo.global.location, url)).toString();
		}
		var index = dojo.indexOf(this.editingAreaStyleSheets, url);
		if(index == -1){
//			console.debug("dijit._editor.RichText.removeStyleSheet: Style sheet "+url+" has not been applied");
			return;
		}
		delete this.editingAreaStyleSheets[index];
		dojo.withGlobal(this.window,'query', dojo, ['link:[href="'+url+'"]']).orphan();
	},

	// disabled: Boolean
	//		The editor is disabled; the text cannot be changed.
	disabled: false,

	_mozSettingProps: {'styleWithCSS':false},
	_setDisabledAttr: function(/*Boolean*/ value){
		value = !!value;
		this._set("disabled", value);
		if(!this.isLoaded){ return; } // this method requires init to be complete
		if(dojo.isIE || dojo.isWebKit || dojo.isOpera){
			var preventIEfocus = dojo.isIE && (this.isLoaded || !this.focusOnLoad);
			if(preventIEfocus){ this.editNode.unselectable = "on"; }
			this.editNode.contentEditable = !value;
			if(preventIEfocus){
				var _this = this;
				setTimeout(function(){ _this.editNode.unselectable = "off"; }, 0);
			}
		}else{ //moz
			try{
				this.document.designMode=(value?'off':'on');
			}catch(e){ return; } // ! _disabledOK
			if(!value && this._mozSettingProps){
				var ps = this._mozSettingProps;
				for(var n in ps){
					if(ps.hasOwnProperty(n)){
						try{
							this.document.execCommand(n,false,ps[n]);
						}catch(e2){}
					}
				}
			}
//			this.document.execCommand('contentReadOnly', false, value);
//				if(value){
//					this.blur(); //to remove the blinking caret
//				}
		}
		this._disabledOK = true;
	},

/* Event handlers
 *****************/

	onLoad: function(/*String*/ html){
		// summary:
		//		Handler after the iframe finishes loading.
		// html: String
		//		Editor contents should be set to this value
		// tags:
		//		protected

		// TODO: rename this to _onLoad, make empty public onLoad() method, deprecate/make protected onLoadDeferred handler?

		if(!this.window.__registeredWindow){
			this.window.__registeredWindow = true;
			this._iframeRegHandle = dijit.registerIframe(this.iframe);
		}
		if(!dojo.isIE && !dojo.isWebKit && (this.height || dojo.isMoz)){
			this.editNode=this.document.body;
		}else{
			// there's a wrapper div around the content, see _getIframeDocTxt().
			this.editNode=this.document.body.firstChild;
			var _this = this;
			if(dojo.isIE){ // #4996 IE wants to focus the BODY tag
				this.tabStop = dojo.create('div', { tabIndex: -1 }, this.editingArea);
				this.iframe.onfocus = function(){ _this.editNode.setActive(); };
			}
		}
		this.focusNode = this.editNode; // for InlineEditBox


		var events = this.events.concat(this.captureEvents);
		var ap = this.iframe ? this.document : this.editNode;
		dojo.forEach(events, function(item){
			this.connect(ap, item.toLowerCase(), item);
		}, this);

		this.connect(ap, "onmouseup", "onClick"); // mouseup in the margin does not generate an onclick event

		if(dojo.isIE){ // IE contentEditable
			this.connect(this.document, "onmousedown", "_onIEMouseDown"); // #4996 fix focus

			// give the node Layout on IE
			// TODO: this may no longer be needed, since we've reverted IE to using an iframe,
			// not contentEditable.   Removing it would also probably remove the need for creating
			// the extra <div> in _getIframeDocTxt()
			this.editNode.style.zoom = 1.0;
		}else{
			this.connect(this.document, "onmousedown", function(){
				// Clear the moveToStart focus, as mouse
				// down will set cursor point.  Required to properly
				// work with selection/position driven plugins and clicks in
				// the window. refs: #10678
				delete this._cursorToStart;
			});
		}
		
		if(dojo.isWebKit){
			//WebKit sometimes doesn't fire right on selections, so the toolbar
			//doesn't update right.  Therefore, help it out a bit with an additional
			//listener.  A mouse up will typically indicate a display change, so fire this
			//and get the toolbar to adapt.  Reference: #9532
			this._webkitListener = this.connect(this.document, "onmouseup", "onDisplayChanged");
			this.connect(this.document, "onmousedown", function(e){
				var t = e.target;
				if(t && (t === this.document.body || t === this.document)){
					// Since WebKit uses the inner DIV, we need to check and set position.
					// See: #12024 as to why the change was made.
					setTimeout(dojo.hitch(this, "placeCursorAtEnd"), 0);
				}
			});
		}
		
		if(dojo.isIE){
			// Try to make sure 'hidden' elements aren't visible in edit mode (like browsers other than IE
			// do).  See #9103
			try{
				this.document.execCommand('RespectVisibilityInDesign', true, null);
			}catch(e){/* squelch */}
		}

		this.isLoaded = true;

		this.set('disabled', this.disabled); // initialize content to editable (or not)

		// Note that setValue() call will only work after isLoaded is set to true (above)

		// Set up a function to allow delaying the setValue until a callback is fired
		// This ensures extensions like dijit.Editor have a way to hold the value set
		// until plugins load (and do things like register filters).
		var setContent = dojo.hitch(this, function(){
			this.setValue(html);
			if(this.onLoadDeferred){
				this.onLoadDeferred.callback(true);
			}
			this.onDisplayChanged();
			if(this.focusOnLoad){
				// after the document loads, then set focus after updateInterval expires so that
				// onNormalizedDisplayChanged has run to avoid input caret issues
				dojo.addOnLoad(dojo.hitch(this, function(){ setTimeout(dojo.hitch(this, "focus"), this.updateInterval); }));
			}
			// Save off the initial content now
			this.value = this.getValue(true);
		});
		if(this.setValueDeferred){
			this.setValueDeferred.addCallback(setContent);
		}else{
			setContent();
		}

	},

	onKeyDown: function(/* Event */ e){
		// summary:
		//		Handler for onkeydown event
		// tags:
		//		protected

		// we need this event at the moment to get the events from control keys
		// such as the backspace. It might be possible to add this to Dojo, so that
		// keyPress events can be emulated by the keyDown and keyUp detection.

		if(e.keyCode === dojo.keys.TAB && this.isTabIndent ){
			dojo.stopEvent(e); //prevent tab from moving focus out of editor

			// FIXME: this is a poor-man's indent/outdent. It would be
			// better if it added 4 "&nbsp;" chars in an undoable way.
			// Unfortunately pasteHTML does not prove to be undoable
			if(this.queryCommandEnabled((e.shiftKey ? "outdent" : "indent"))){
				this.execCommand((e.shiftKey ? "outdent" : "indent"));
			}
		}
		if(dojo.isIE){
			if(e.keyCode == dojo.keys.TAB && !this.isTabIndent){
				if(e.shiftKey && !e.ctrlKey && !e.altKey){
					// focus the BODY so the browser will tab away from it instead
					this.iframe.focus();
				}else if(!e.shiftKey && !e.ctrlKey && !e.altKey){
					// focus the BODY so the browser will tab away from it instead
					this.tabStop.focus();
				}
			}else if(e.keyCode === dojo.keys.BACKSPACE && this.document.selection.type === "Control"){
				// IE has a bug where if a non-text object is selected in the editor,
				// hitting backspace would act as if the browser's back button was
				// clicked instead of deleting the object. see #1069
				dojo.stopEvent(e);
				this.execCommand("delete");
			}else if((65 <= e.keyCode && e.keyCode <= 90) ||
				(e.keyCode>=37 && e.keyCode<=40) // FIXME: get this from connect() instead!
			){ //arrow keys
				e.charCode = e.keyCode;
				this.onKeyPress(e);
			}
		}
		return true;
	},

	onKeyUp: function(e){
		// summary:
		//		Handler for onkeyup event
		// tags:
		//      callback
		return;
	},

	setDisabled: function(/*Boolean*/ disabled){
		// summary:
		//		Deprecated, use set('disabled', ...) instead.
		// tags:
		//		deprecated
		dojo.deprecated('dijit.Editor::setDisabled is deprecated','use dijit.Editor::attr("disabled",boolean) instead', 2.0);
		this.set('disabled',disabled);
	},
	_setValueAttr: function(/*String*/ value){
		// summary:
		//      Registers that attr("value", foo) should call setValue(foo)
		this.setValue(value);
	},
	_setDisableSpellCheckAttr: function(/*Boolean*/ disabled){
		if(this.document){
			dojo.attr(this.document.body, "spellcheck", !disabled);
		}else{
			// try again after the editor is finished loading
			this.onLoadDeferred.addCallback(dojo.hitch(this, function(){
				dojo.attr(this.document.body, "spellcheck", !disabled);
			}));
		}
		this._set("disableSpellCheck", disabled);
	},

	onKeyPress: function(e){
		// summary:
		//		Handle the various key events
		// tags:
		//		protected

		var c = (e.keyChar && e.keyChar.toLowerCase()) || e.keyCode,
			handlers = this._keyHandlers[c],
			args = arguments;

		if(handlers && !e.altKey){
			dojo.some(handlers, function(h){
				// treat meta- same as ctrl-, for benefit of mac users
				if(!(h.shift ^ e.shiftKey) && !(h.ctrl ^ (e.ctrlKey||e.metaKey))){
					if(!h.handler.apply(this, args)){
						e.preventDefault();
					}
					return true;
				}
			}, this);
		}

		// function call after the character has been inserted
		if(!this._onKeyHitch){
			this._onKeyHitch = dojo.hitch(this, "onKeyPressed");
		}
		setTimeout(this._onKeyHitch, 1);
		return true;
	},

	addKeyHandler: function(/*String*/ key, /*Boolean*/ ctrl, /*Boolean*/ shift, /*Function*/ handler){
		// summary:
		//		Add a handler for a keyboard shortcut
		// description:
		//		The key argument should be in lowercase if it is a letter character
		// tags:
		//		protected
		if(!dojo.isArray(this._keyHandlers[key])){
			this._keyHandlers[key] = [];
		}
		//TODO: would be nice to make this a hash instead of an array for quick lookups
		this._keyHandlers[key].push({
			shift: shift || false,
			ctrl: ctrl || false,
			handler: handler
		});
	},

	onKeyPressed: function(){
		// summary:
		//		Handler for after the user has pressed a key, and the display has been updated.
		//		(Runs on a timer so that it runs after the display is updated)
		// tags:
		//		private
		this.onDisplayChanged(/*e*/); // can't pass in e
	},

	onClick: function(/*Event*/ e){
		// summary:
		//		Handler for when the user clicks.
		// tags:
		//		private

		// console.info('onClick',this._tryDesignModeOn);
		this.onDisplayChanged(e);
	},

	_onIEMouseDown: function(/*Event*/ e){
		// summary:
		//		IE only to prevent 2 clicks to focus
		// tags:
		//		protected

		if(!this._focused && !this.disabled){
			this.focus();
		}
	},

	_onBlur: function(e){
		// summary:
		//		Called from focus manager when focus has moved away from this editor
		// tags:
		//		protected

		// console.info('_onBlur')

		this.inherited(arguments);

		var newValue = this.getValue(true);
		if(newValue != this.value){
			this.onChange(newValue);
		}
		this._set("value", newValue);
	},

	_onFocus: function(/*Event*/ e){
		// summary:
		//		Called from focus manager when focus has moved into this editor
		// tags:
		//		protected

		// console.info('_onFocus')
		if(!this.disabled){
			if(!this._disabledOK){
				this.set('disabled', false);
			}
			this.inherited(arguments);
		}
	},

	// TODO: remove in 2.0
	blur: function(){
		// summary:
		//		Remove focus from this instance.
		// tags:
		//		deprecated
		if(!dojo.isIE && this.window.document.documentElement && this.window.document.documentElement.focus){
			this.window.document.documentElement.focus();
		}else if(dojo.doc.body.focus){
			dojo.doc.body.focus();
		}
	},

	focus: function(){
		// summary:
		//		Move focus to this editor
		if(!this.isLoaded){
			this.focusOnLoad = true;
			return;
		}
		if(this._cursorToStart){
			delete this._cursorToStart;
			if(this.editNode.childNodes){
				this.placeCursorAtStart(); // this calls focus() so return
				return;
			}
		}
		if(!dojo.isIE){
			dijit.focus(this.iframe);
		}else if(this.editNode && this.editNode.focus){
			// editNode may be hidden in display:none div, lets just punt in this case
			//this.editNode.focus(); -> causes IE to scroll always (strict and quirks mode) to the top the Iframe
			// if we fire the event manually and let the browser handle the focusing, the latest
			// cursor position is focused like in FF
			this.iframe.fireEvent('onfocus', document.createEventObject()); // createEventObject only in IE
		//	}else{
		// TODO: should we throw here?
		// console.debug("Have no idea how to focus into the editor!");
		}
	},

	// _lastUpdate: 0,
	updateInterval: 200,
	_updateTimer: null,
	onDisplayChanged: function(/*Event*/ e){
		// summary:
		//		This event will be fired everytime the display context
		//		changes and the result needs to be reflected in the UI.
		// description:
		//		If you don't want to have update too often,
		//		onNormalizedDisplayChanged should be used instead
		// tags:
		//		private

		// var _t=new Date();
		if(this._updateTimer){
			clearTimeout(this._updateTimer);
		}
		if(!this._updateHandler){
			this._updateHandler = dojo.hitch(this,"onNormalizedDisplayChanged");
		}
		this._updateTimer = setTimeout(this._updateHandler, this.updateInterval);
		
		// Technically this should trigger a call to watch("value", ...) registered handlers,
		// but getValue() is too slow to call on every keystroke so we don't.
	},
	onNormalizedDisplayChanged: function(){
		// summary:
		//		This event is fired every updateInterval ms or more
		// description:
		//		If something needs to happen immediately after a
		//		user change, please use onDisplayChanged instead.
		// tags:
		//		private
		delete this._updateTimer;
	},
	onChange: function(newContent){
		// summary:
		//		This is fired if and only if the editor loses focus and
		//		the content is changed.
	},
	_normalizeCommand: function(/*String*/ cmd, /*Anything?*/argument){
		// summary:
		//		Used as the advice function by dojo.connect to map our
		//		normalized set of commands to those supported by the target
		//		browser.
		// tags:
		//		private

		var command = cmd.toLowerCase();
		if(command == "formatblock"){
			if(dojo.isSafari && argument === undefined){ command = "heading"; }
		}else if(command == "hilitecolor" && !dojo.isMoz){
			command = "backcolor";
		}

		return command;
	},

	_qcaCache: {},
	queryCommandAvailable: function(/*String*/ command){
		// summary:
		//		Tests whether a command is supported by the host. Clients
		//		SHOULD check whether a command is supported before attempting
		//		to use it, behaviour for unsupported commands is undefined.
		// command:
		//		The command to test for
		// tags:
		//		private

		// memoizing version. See _queryCommandAvailable for computing version
		var ca = this._qcaCache[command];
		if(ca !== undefined){ return ca; }
		return (this._qcaCache[command] = this._queryCommandAvailable(command));
	},

	_queryCommandAvailable: function(/*String*/ command){
		// summary:
		//		See queryCommandAvailable().
		// tags:
		//		private

		var ie = 1;
		var mozilla = 1 << 1;
		var webkit = 1 << 2;
		var opera = 1 << 3;

		function isSupportedBy(browsers){
			return {
				ie: Boolean(browsers & ie),
				mozilla: Boolean(browsers & mozilla),
				webkit: Boolean(browsers & webkit),
				opera: Boolean(browsers & opera)
			};
		}

		var supportedBy = null;

		switch(command.toLowerCase()){
			case "bold": case "italic": case "underline":
			case "subscript": case "superscript":
			case "fontname": case "fontsize":
			case "forecolor": case "hilitecolor":
			case "justifycenter": case "justifyfull": case "justifyleft":
			case "justifyright": case "delete": case "selectall": case "toggledir":
				supportedBy = isSupportedBy(mozilla | ie | webkit | opera);
				break;

			case "createlink": case "unlink": case "removeformat":
			case "inserthorizontalrule": case "insertimage":
			case "insertorderedlist": case "insertunorderedlist":
			case "indent": case "outdent": case "formatblock":
			case "inserthtml": case "undo": case "redo": case "strikethrough": case "tabindent":
				supportedBy = isSupportedBy(mozilla | ie | opera | webkit);
				break;

			case "blockdirltr": case "blockdirrtl":
			case "dirltr": case "dirrtl":
			case "inlinedirltr": case "inlinedirrtl":
				supportedBy = isSupportedBy(ie);
				break;
			case "cut": case "copy": case "paste":
				supportedBy = isSupportedBy( ie | mozilla | webkit);
				break;

			case "inserttable":
				supportedBy = isSupportedBy(mozilla | ie);
				break;

			case "insertcell": case "insertcol": case "insertrow":
			case "deletecells": case "deletecols": case "deleterows":
			case "mergecells": case "splitcell":
				supportedBy = isSupportedBy(ie | mozilla);
				break;

			default: return false;
		}

		return (dojo.isIE && supportedBy.ie) ||
			(dojo.isMoz && supportedBy.mozilla) ||
			(dojo.isWebKit && supportedBy.webkit) ||
			(dojo.isOpera && supportedBy.opera);	// Boolean return true if the command is supported, false otherwise
	},

	execCommand: function(/*String*/ command, argument){
		// summary:
		//		Executes a command in the Rich Text area
		// command:
		//		The command to execute
		// argument:
		//		An optional argument to the command
		// tags:
		//		protected
		var returnValue;

		//focus() is required for IE to work
		//In addition, focus() makes sure after the execution of
		//the command, the editor receives the focus as expected
		this.focus();

		command = this._normalizeCommand(command, argument);

		if(argument !== undefined){
			if(command == "heading"){
				throw new Error("unimplemented");
			}else if((command == "formatblock") && dojo.isIE){
				argument = '<'+argument+'>';
			}
		}

		//Check to see if we have any over-rides for commands, they will be functions on this
		//widget of the form _commandImpl.  If we don't, fall through to the basic native
		//exec command of the browser.
		var implFunc = "_" + command + "Impl";
		if(this[implFunc]){
			returnValue = this[implFunc](argument);
		}else{
			argument = arguments.length > 1 ? argument : null;
			if(argument || command!="createlink"){
				returnValue = this.document.execCommand(command, false, argument);
			}
		}

		this.onDisplayChanged();
		return returnValue;
	},

	queryCommandEnabled: function(/*String*/ command){
		// summary:
		//		Check whether a command is enabled or not.
		// tags:
		//		protected
		if(this.disabled || !this._disabledOK){ return false; }
		command = this._normalizeCommand(command);
		if(dojo.isMoz || dojo.isWebKit){
			if(command == "unlink"){ // mozilla returns true always
				// console.debug(this._sCall("hasAncestorElement", ['a']));
				return this._sCall("hasAncestorElement", ["a"]);
			}else if(command == "inserttable"){
				return true;
			}
		}
		//see #4109
		if(dojo.isWebKit){
			if(command == "cut" || command == "copy") {
				// WebKit deems clipboard activity as a security threat and natively would return false
				var sel = this.window.getSelection();
				if(sel){ sel = sel.toString(); }
				return !!sel;
			}else if(command == "paste"){
				return true;
			}
		}

		var elem = dojo.isIE ? this.document.selection.createRange() : this.document;
		try{
			return elem.queryCommandEnabled(command);
		}catch(e){
			//Squelch, occurs if editor is hidden on FF 3 (and maybe others.)
			return false;
		}

	},

	queryCommandState: function(command){
		// summary:
		//		Check the state of a given command and returns true or false.
		// tags:
		//		protected

		if(this.disabled || !this._disabledOK){ return false; }
		command = this._normalizeCommand(command);
		try{
			return this.document.queryCommandState(command);
		}catch(e){
			//Squelch, occurs if editor is hidden on FF 3 (and maybe others.)
			return false;
		}
	},

	queryCommandValue: function(command){
		// summary:
		//		Check the value of a given command. This matters most for
		//		custom selections and complex values like font value setting.
		// tags:
		//		protected

		if(this.disabled || !this._disabledOK){ return false; }
		var r;
		command = this._normalizeCommand(command);
		if(dojo.isIE && command == "formatblock"){
			r = this._native2LocalFormatNames[this.document.queryCommandValue(command)];
		}else if(dojo.isMoz && command === "hilitecolor"){
			var oldValue;
			try{
				oldValue = this.document.queryCommandValue("styleWithCSS");
			}catch(e){
				oldValue = false;
			}
			this.document.execCommand("styleWithCSS", false, true);
			r = this.document.queryCommandValue(command);
			this.document.execCommand("styleWithCSS", false, oldValue);
		}else{
			r = this.document.queryCommandValue(command);
		}
		return r;
	},

	// Misc.

	_sCall: function(name, args){
		// summary:
		//		Run the named method of dijit._editor.selection over the
		//		current editor instance's window, with the passed args.
		// tags:
		//		private
		return dojo.withGlobal(this.window, name, dijit._editor.selection, args);
	},

	// FIXME: this is a TON of code duplication. Why?

	placeCursorAtStart: function(){
		// summary:
		//		Place the cursor at the start of the editing area.
		// tags:
		//		private

		this.focus();

		//see comments in placeCursorAtEnd
		var isvalid=false;
		if(dojo.isMoz){
			// TODO:  Is this branch even necessary?
			var first=this.editNode.firstChild;
			while(first){
				if(first.nodeType == 3){
					if(first.nodeValue.replace(/^\s+|\s+$/g, "").length>0){
						isvalid=true;
						this._sCall("selectElement", [ first ]);
						break;
					}
				}else if(first.nodeType == 1){
					isvalid=true;
					var tg = first.tagName ? first.tagName.toLowerCase() : "";
					// Collapse before childless tags.
					if(/br|input|img|base|meta|area|basefont|hr|link/.test(tg)){
						this._sCall("selectElement", [ first ]);
					}else{
						// Collapse inside tags with children.
						this._sCall("selectElementChildren", [ first ]);
					}
					break;
				}
				first = first.nextSibling;
			}
		}else{
			isvalid=true;
			this._sCall("selectElementChildren", [ this.editNode ]);
		}
		if(isvalid){
			this._sCall("collapse", [ true ]);
		}
	},

	placeCursorAtEnd: function(){
		// summary:
		//		Place the cursor at the end of the editing area.
		// tags:
		//		private

		this.focus();

		//In mozilla, if last child is not a text node, we have to use
		// selectElementChildren on this.editNode.lastChild otherwise the
		// cursor would be placed at the end of the closing tag of
		//this.editNode.lastChild
		var isvalid=false;
		if(dojo.isMoz){
			var last=this.editNode.lastChild;
			while(last){
				if(last.nodeType == 3){
					if(last.nodeValue.replace(/^\s+|\s+$/g, "").length>0){
						isvalid=true;
						this._sCall("selectElement", [ last ]);
						break;
					}
				}else if(last.nodeType == 1){
					isvalid=true;
					if(last.lastChild){
						this._sCall("selectElement", [ last.lastChild ]);
					}else{
						this._sCall("selectElement", [ last ]);
					}
					break;
				}
				last = last.previousSibling;
			}
		}else{
			isvalid=true;
			this._sCall("selectElementChildren", [ this.editNode ]);
		}
		if(isvalid){
			this._sCall("collapse", [ false ]);
		}
	},

	getValue: function(/*Boolean?*/ nonDestructive){
		// summary:
		//		Return the current content of the editing area (post filters
		//		are applied).  Users should call get('value') instead.
		//	nonDestructive:
		//		defaults to false. Should the post-filtering be run over a copy
		//		of the live DOM? Most users should pass "true" here unless they
		//		*really* know that none of the installed filters are going to
		//		mess up the editing session.
		// tags:
		//		private
		if(this.textarea){
			if(this.isClosed || !this.isLoaded){
				return this.textarea.value;
			}
		}

		return this._postFilterContent(null, nonDestructive);
	},
	_getValueAttr: function(){
		// summary:
		//		Hook to make attr("value") work
		return this.getValue(true);
	},

	setValue: function(/*String*/ html){
		// summary:
		//		This function sets the content. No undo history is preserved.
		//		Users should use set('value', ...) instead.
		// tags:
		//		deprecated

		// TODO: remove this and getValue() for 2.0, and move code to _setValueAttr()

		if(!this.isLoaded){
			// try again after the editor is finished loading
			this.onLoadDeferred.addCallback(dojo.hitch(this, function(){
				this.setValue(html);
			}));
			return;
		}
		this._cursorToStart = true;
		if(this.textarea && (this.isClosed || !this.isLoaded)){
			this.textarea.value=html;
		}else{
			html = this._preFilterContent(html);
			var node = this.isClosed ? this.domNode : this.editNode;
			if(html && dojo.isMoz && html.toLowerCase() == "<p></p>"){
				html = "<p>&nbsp;</p>";
			}

			// Use &nbsp; to avoid webkit problems where editor is disabled until the user clicks it
			if(!html && dojo.isWebKit){
				html = "&nbsp;";
			}
			node.innerHTML = html;
			this._preDomFilterContent(node);
		}

		this.onDisplayChanged();
		this._set("value", this.getValue(true));
	},

	replaceValue: function(/*String*/ html){
		// summary:
		//		This function set the content while trying to maintain the undo stack
		//		(now only works fine with Moz, this is identical to setValue in all
		//		other browsers)
		// tags:
		//		protected

		if(this.isClosed){
			this.setValue(html);
		}else if(this.window && this.window.getSelection && !dojo.isMoz){ // Safari
			// look ma! it's a totally f'd browser!
			this.setValue(html);
		}else if(this.window && this.window.getSelection){ // Moz
			html = this._preFilterContent(html);
			this.execCommand("selectall");
			if(!html){
				this._cursorToStart = true;
				html = "&nbsp;";
			}
			this.execCommand("inserthtml", html);
			this._preDomFilterContent(this.editNode);
		}else if(this.document && this.document.selection){//IE
			//In IE, when the first element is not a text node, say
			//an <a> tag, when replacing the content of the editing
			//area, the <a> tag will be around all the content
			//so for now, use setValue for IE too
			this.setValue(html);
		}

		this._set("value", this.getValue(true));
	},

	_preFilterContent: function(/*String*/ html){
		// summary:
		//		Filter the input before setting the content of the editing
		//		area. DOM pre-filtering may happen after this
		//		string-based filtering takes place but as of 1.2, this is not
		//		guaranteed for operations such as the inserthtml command.
		// tags:
		//		private

		var ec = html;
		dojo.forEach(this.contentPreFilters, function(ef){ if(ef){ ec = ef(ec); } });
		return ec;
	},
	_preDomFilterContent: function(/*DomNode*/ dom){
		// summary:
		//		filter the input's live DOM. All filter operations should be
		//		considered to be "live" and operating on the DOM that the user
		//		will be interacting with in their editing session.
		// tags:
		//		private
		dom = dom || this.editNode;
		dojo.forEach(this.contentDomPreFilters, function(ef){
			if(ef && dojo.isFunction(ef)){
				ef(dom);
			}
		}, this);
	},

	_postFilterContent: function(
		/*DomNode|DomNode[]|String?*/ dom,
		/*Boolean?*/ nonDestructive){
		// summary:
		//		filter the output after getting the content of the editing area
		//
		// description:
		//		post-filtering allows plug-ins and users to specify any number
		//		of transforms over the editor's content, enabling many common
		//		use-cases such as transforming absolute to relative URLs (and
		//		vice-versa), ensuring conformance with a particular DTD, etc.
		//		The filters are registered in the contentDomPostFilters and
		//		contentPostFilters arrays. Each item in the
		//		contentDomPostFilters array is a function which takes a DOM
		//		Node or array of nodes as its only argument and returns the
		//		same. It is then passed down the chain for further filtering.
		//		The contentPostFilters array behaves the same way, except each
		//		member operates on strings. Together, the DOM and string-based
		//		filtering allow the full range of post-processing that should
		//		be necessaray to enable even the most agressive of post-editing
		//		conversions to take place.
		//
		//		If nonDestructive is set to "true", the nodes are cloned before
		//		filtering proceeds to avoid potentially destructive transforms
		//		to the content which may still needed to be edited further.
		//		Once DOM filtering has taken place, the serialized version of
		//		the DOM which is passed is run through each of the
		//		contentPostFilters functions.
		//
		//	dom:
		//		a node, set of nodes, which to filter using each of the current
		//		members of the contentDomPostFilters and contentPostFilters arrays.
		//
		//	nonDestructive:
		//		defaults to "false". If true, ensures that filtering happens on
		//		a clone of the passed-in content and not the actual node
		//		itself.
		//
		// tags:
		//		private

		var ec;
		if(!dojo.isString(dom)){
			dom = dom || this.editNode;
			if(this.contentDomPostFilters.length){
				if(nonDestructive){
					dom = dojo.clone(dom);
				}
				dojo.forEach(this.contentDomPostFilters, function(ef){
					dom = ef(dom);
				});
			}
			ec = dijit._editor.getChildrenHtml(dom);
		}else{
			ec = dom;
		}

		if(!dojo.trim(ec.replace(/^\xA0\xA0*/, '').replace(/\xA0\xA0*$/, '')).length){
			ec = "";
		}

		//	if(dojo.isIE){
		//		//removing appended <P>&nbsp;</P> for IE
		//		ec = ec.replace(/(?:<p>&nbsp;</p>[\n\r]*)+$/i,"");
		//	}
		dojo.forEach(this.contentPostFilters, function(ef){
			ec = ef(ec);
		});

		return ec;
	},

	_saveContent: function(/*Event*/ e){
		// summary:
		//		Saves the content in an onunload event if the editor has not been closed
		// tags:
		//		private

		var saveTextarea = dojo.byId(dijit._scopeName + "._editor.RichText.value");
		if(saveTextarea.value){
			saveTextarea.value += this._SEPARATOR;
		}
		saveTextarea.value += this.name + this._NAME_CONTENT_SEP + this.getValue(true);
	},


	escapeXml: function(/*String*/ str, /*Boolean*/ noSingleQuotes){
		// summary:
		//		Adds escape sequences for special characters in XML.
		//		Optionally skips escapes for single quotes
		// tags:
		//		private

		str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
		if(!noSingleQuotes){
			str = str.replace(/'/gm, "&#39;");
		}
		return str; // string
	},

	getNodeHtml: function(/* DomNode */ node){
		// summary:
		//		Deprecated.   Use dijit._editor._getNodeHtml() instead.
		// tags:
		//		deprecated
		dojo.deprecated('dijit.Editor::getNodeHtml is deprecated','use dijit._editor.getNodeHtml instead', 2);
		return dijit._editor.getNodeHtml(node); // String
	},

	getNodeChildrenHtml: function(/* DomNode */ dom){
		// summary:
		//		Deprecated.   Use dijit._editor.getChildrenHtml() instead.
		// tags:
		//		deprecated
		dojo.deprecated('dijit.Editor::getNodeChildrenHtml is deprecated','use dijit._editor.getChildrenHtml instead', 2);
		return dijit._editor.getChildrenHtml(dom);
	},

	close: function(/*Boolean?*/ save){
		// summary:
		//		Kills the editor and optionally writes back the modified contents to the
		//		element from which it originated.
		// save:
		//		Whether or not to save the changes. If false, the changes are discarded.
		// tags:
		//		private

		if(this.isClosed){ return; }

		if(!arguments.length){ save = true; }
		if(save){
			this._set("value", this.getValue(true));
		}

		// line height is squashed for iframes
		// FIXME: why was this here? if (this.iframe){ this.domNode.style.lineHeight = null; }

		if(this.interval){ clearInterval(this.interval); }

		if(this._webkitListener){
			//Cleaup of WebKit fix: #9532
			this.disconnect(this._webkitListener);
			delete this._webkitListener;
		}

		// Guard against memory leaks on IE (see #9268)
		if(dojo.isIE){
			 this.iframe.onfocus = null;
		}
		this.iframe._loadFunc = null;

		if(this._iframeRegHandle){
			dijit.unregisterIframe(this._iframeRegHandle);
			delete this._iframeRegHandle;
		}

		if(this.textarea){
			var s = this.textarea.style;
			s.position = "";
			s.left = s.top = "";
			if(dojo.isIE){
				s.overflow = this.__overflow;
				this.__overflow = null;
			}
			this.textarea.value = this.value;
			dojo.destroy(this.domNode);
			this.domNode = this.textarea;
		}else{
			// Note that this destroys the iframe
			this.domNode.innerHTML = this.value;
		}
		delete this.iframe;

		dojo.removeClass(this.domNode, this.baseClass);
		this.isClosed = true;
		this.isLoaded = false;

		delete this.editNode;
		delete this.focusNode;

		if(this.window && this.window._frameElement){
			this.window._frameElement = null;
		}

		this.window = null;
		this.document = null;
		this.editingArea = null;
		this.editorObject = null;
	},

	destroy: function(){
		if(!this.isClosed){ this.close(false); }
		this.inherited(arguments);
		if(dijit._editor._globalSaveHandler){
			delete dijit._editor._globalSaveHandler[this.id];
		}
	},

	_removeMozBogus: function(/* String */ html){
		// summary:
		//		Post filter to remove unwanted HTML attributes generated by mozilla
		// tags:
		//		private
		return html.replace(/\stype="_moz"/gi, '').replace(/\s_moz_dirty=""/gi, '').replace(/_moz_resizing="(true|false)"/gi,''); // String
	},
	_removeWebkitBogus: function(/* String */ html){
		// summary:
		//		Post filter to remove unwanted HTML attributes generated by webkit
		// tags:
		//		private
		html = html.replace(/\sclass="webkit-block-placeholder"/gi, '');
		html = html.replace(/\sclass="apple-style-span"/gi, '');
		// For some reason copy/paste sometime adds extra meta tags for charset on
		// webkit (chrome) on mac.They need to be removed.  See: #12007"
		html = html.replace(/<meta charset=\"utf-8\" \/>/gi, '');
		return html; // String
	},
	_normalizeFontStyle: function(/* String */ html){
		// summary:
		//		Convert 'strong' and 'em' to 'b' and 'i'.
		// description:
		//		Moz can not handle strong/em tags correctly, so to help
		//		mozilla and also to normalize output, convert them to 'b' and 'i'.
		//
		//		Note the IE generates 'strong' and 'em' rather than 'b' and 'i'
		// tags:
		//		private
		return html.replace(/<(\/)?strong([ \>])/gi, '<$1b$2')
			.replace(/<(\/)?em([ \>])/gi, '<$1i$2' ); // String
	},

	_preFixUrlAttributes: function(/* String */ html){
		// summary:
		//		Pre-filter to do fixing to href attributes on <a> and <img> tags
		// tags:
		//		private
		return html.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,
				'$1$4$2$3$5$2 _djrealurl=$2$3$5$2')
			.replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,
				'$1$4$2$3$5$2 _djrealurl=$2$3$5$2'); // String
	},

	/*****************************************************************************
		The following functions implement HTML manipulation commands for various
		browser/contentEditable implementations.  The goal of them is to enforce
		standard behaviors of them.
	******************************************************************************/

	_inserthorizontalruleImpl: function(argument){
		// summary:
		//		This function implements the insertion of HTML 'HR' tags.
		//		into a point on the page.  IE doesn't to it right, so
		//		we have to use an alternate form
		// argument:
		//		arguments to the exec command, if any.
		// tags:
		//		protected
		if(dojo.isIE){
			return this._inserthtmlImpl("<hr>");
		}
		return this.document.execCommand("inserthorizontalrule", false, argument);
	},

	_unlinkImpl: function(argument){
		// summary:
		//		This function implements the unlink of an 'a' tag.
		// argument:
		//		arguments to the exec command, if any.
		// tags:
		//		protected
		if((this.queryCommandEnabled("unlink")) && (dojo.isMoz || dojo.isWebKit)){
			var a = this._sCall("getAncestorElement", [ "a" ]);
			this._sCall("selectElement", [ a ]);
			return this.document.execCommand("unlink", false, null);
		}
		return this.document.execCommand("unlink", false, argument);
	},

	_hilitecolorImpl: function(argument){
		// summary:
		//		This function implements the hilitecolor command
		// argument:
		//		arguments to the exec command, if any.
		// tags:
		//		protected
		var returnValue;
		if(dojo.isMoz){
			// mozilla doesn't support hilitecolor properly when useCSS is
			// set to false (bugzilla #279330)
			this.document.execCommand("styleWithCSS", false, true);
			returnValue = this.document.execCommand("hilitecolor", false, argument);
			this.document.execCommand("styleWithCSS", false, false);
		}else{
			returnValue = this.document.execCommand("hilitecolor", false, argument);
		}
		return returnValue;
	},

	_backcolorImpl: function(argument){
		// summary:
		//		This function implements the backcolor command
		// argument:
		//		arguments to the exec command, if any.
		// tags:
		//		protected
		if(dojo.isIE){
			// Tested under IE 6 XP2, no problem here, comment out
			// IE weirdly collapses ranges when we exec these commands, so prevent it
			//	var tr = this.document.selection.createRange();
			argument = argument ? argument : null;
		}
		return this.document.execCommand("backcolor", false, argument);
	},

	_forecolorImpl: function(argument){
		// summary:
		//		This function implements the forecolor command
		// argument:
		//		arguments to the exec command, if any.
		// tags:
		//		protected
		if(dojo.isIE){
			// Tested under IE 6 XP2, no problem here, comment out
			// IE weirdly collapses ranges when we exec these commands, so prevent it
			//	var tr = this.document.selection.createRange();
			argument = argument? argument : null;
		}
		return this.document.execCommand("forecolor", false, argument);
	},

	_inserthtmlImpl: function(argument){
		// summary:
		//		This function implements the insertion of HTML content into
		//		a point on the page.
		// argument:
		//		The content to insert, if any.
		// tags:
		//		protected
		argument = this._preFilterContent(argument);
		var rv = true;
		if(dojo.isIE){
			var insertRange = this.document.selection.createRange();
			if(this.document.selection.type.toUpperCase() == 'CONTROL'){
				var n=insertRange.item(0);
				while(insertRange.length){
					insertRange.remove(insertRange.item(0));
				}
				n.outerHTML=argument;
			}else{
				insertRange.pasteHTML(argument);
			}
			insertRange.select();
			//insertRange.collapse(true);
		}else if(dojo.isMoz && !argument.length){
			//mozilla can not inserthtml an empty html to delete current selection
			//so we delete the selection instead in this case
			this._sCall("remove"); // FIXME
		}else{
			rv = this.document.execCommand("inserthtml", false, argument);
		}
		return rv;
	},

	_boldImpl: function(argument){
		// summary:
		//		This function implements an over-ride of the bold command.
		// argument:
		//		Not used, operates by selection.
		// tags:
		//		protected
		if(dojo.isIE){
			this._adaptIESelection()
		}
		return this.document.execCommand("bold", false, argument);
	},
	
	_italicImpl: function(argument){
		// summary:
		//		This function implements an over-ride of the italic command.
		// argument:
		//		Not used, operates by selection.
		// tags:
		//		protected
		if(dojo.isIE){
			this._adaptIESelection()
		}
		return this.document.execCommand("italic", false, argument);
	},

	_underlineImpl: function(argument){
		// summary:
		//		This function implements an over-ride of the underline command.
		// argument:
		//		Not used, operates by selection.
		// tags:
		//		protected
		if(dojo.isIE){
			this._adaptIESelection()
		}
		return this.document.execCommand("underline", false, argument);
	},
	
	_strikethroughImpl: function(argument){
		// summary:
		//		This function implements an over-ride of the strikethrough command.
		// argument:
		//		Not used, operates by selection.
		// tags:
		//		protected
		if(dojo.isIE){
			this._adaptIESelection()
		}
		return this.document.execCommand("strikethrough", false, argument);
	},

	getHeaderHeight: function(){
		// summary:
		//		A function for obtaining the height of the header node
		return this._getNodeChildrenHeight(this.header); // Number
	},

	getFooterHeight: function(){
		// summary:
		//		A function for obtaining the height of the footer node
		return this._getNodeChildrenHeight(this.footer); // Number
	},

	_getNodeChildrenHeight: function(node){
		// summary:
		//		An internal function for computing the cumulative height of all child nodes of 'node'
		// node:
		//		The node to process the children of;
		var h = 0;
		if(node && node.childNodes){
			// IE didn't compute it right when position was obtained on the node directly is some cases,
			// so we have to walk over all the children manually.
			var i;
			for(i = 0; i < node.childNodes.length; i++){
				var size = dojo.position(node.childNodes[i]);
				h += size.h;
			}
		}
		return h; // Number
	},
	
	_isNodeEmpty: function(node, startOffset){
		// summary:
		//		Function to test if a node is devoid of real content.
		// node:
		//		The node to check.
		// tags:
		//		private.
		if(node.nodeType == 1/*element*/){
			if(node.childNodes.length > 0){
				return this._isNodeEmpty(node.childNodes[0], startOffset);
	}
			return true;
		}else if(node.nodeType == 3/*text*/){
			return (node.nodeValue.substring(startOffset) == "");
		}
		return false;
	},
	
	_removeStartingRangeFromRange: function(node, range){
		// summary:
		//		Function to adjust selection range by removing the current
		//		start node.
		// node:
		//		The node to remove from the starting range.
		// range:
		//		The range to adapt.
		// tags:
		//		private
		if(node.nextSibling){
			range.setStart(node.nextSibling,0);
		}else{
			var parent = node.parentNode;
			while(parent && parent.nextSibling == null){
				//move up the tree until we find a parent that has another node, that node will be the next node
				parent = parent.parentNode;
			}
			if(parent){
				range.setStart(parent.nextSibling,0);
			}
		}
		return range;
	},
	
	_adaptIESelection: function(){
		// summary:
		//		Function to adapt the IE range by removing leading 'newlines'
		//		Needed to fix issue with bold/italics/underline not working if
		//		range included leading 'newlines'.
		//		In IE, if a user starts a selection at the very end of a line,
		//		then the native browser commands will fail to execute correctly.
		//		To work around the issue,  we can remove all empty nodes from
		//		the start of the range selection.
		var selection = dijit.range.getSelection(this.window);
		if(selection && selection.rangeCount){
			var range = selection.getRangeAt(0);
			var firstNode = range.startContainer;
			var startOffset = range.startOffset;

			while(firstNode.nodeType == 3/*text*/ && startOffset >= firstNode.length && firstNode.nextSibling){
				//traverse the text nodes until we get to the one that is actually highlighted
				startOffset = startOffset - firstNode.length;
				firstNode = firstNode.nextSibling;
			}

			//Remove the starting ranges until the range does not start with an empty node.
			var lastNode=null;
			while(this._isNodeEmpty(firstNode, startOffset) && firstNode != lastNode){
				lastNode =firstNode; //this will break the loop in case we can't find the next sibling
				range = this._removeStartingRangeFromRange(firstNode, range); //move the start container to the next node in the range
				firstNode = range.startContainer;
				startOffset = 0; //start at the beginning of the new starting range
			}
			selection.removeAllRanges();// this will work as long as users cannot select multiple ranges. I have not been able to do that in the editor.
			selection.addRange(range);
		}
	}
});

}

if(!dojo._hasResource["dijit._editor._Plugin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor._Plugin"] = true;
dojo.provide("dijit._editor._Plugin");




dojo.declare("dijit._editor._Plugin", null, {
	// summary
	//		Base class for a "plugin" to the editor, which is usually
	//		a single button on the Toolbar and some associated code

	constructor: function(/*Object?*/args, /*DomNode?*/node){
		this.params = args || {};
		dojo.mixin(this, this.params);
		this._connects=[];
		this._attrPairNames = {};
	},

	// editor: [const] dijit.Editor
	//		Points to the parent editor
	editor: null,

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node is formed from `iconClassPrefix` and `command`
	iconClassPrefix: "dijitEditorIcon",

	// button: dijit._Widget?
	//		Pointer to `dijit.form.Button` or other widget (ex: `dijit.form.FilteringSelect`)
	//		that is added to the toolbar to control this plugin.
	//		If not specified, will be created on initialization according to `buttonClass`
	button: null,

	// command: String
	//		String like "insertUnorderedList", "outdent", "justifyCenter", etc. that represents an editor command.
	//		Passed to editor.execCommand() if `useDefaultCommand` is true.
	command: "",

	// useDefaultCommand: Boolean
	//		If true, this plugin executes by calling Editor.execCommand() with the argument specified in `command`.
	useDefaultCommand: true,

	// buttonClass: Widget Class
	//		Class of widget (ex: dijit.form.Button or dijit.form.FilteringSelect)
	//		that is added to the toolbar to control this plugin.
	//		This is used to instantiate the button, unless `button` itself is specified directly.
	buttonClass: dijit.form.Button,

	// disabled: Boolean
	//		Flag to indicate if this plugin has been disabled and should do nothing
	//		helps control button state, among other things.  Set via the setter api.
	disabled: false,

	getLabel: function(/*String*/key){
		// summary:
		//		Returns the label to use for the button
		// tags:
		//		private
		return this.editor.commands[key];		// String
	},

	_initButton: function(){
		// summary:
		//		Initialize the button or other widget that will control this plugin.
		//		This code only works for plugins controlling built-in commands in the editor.
		// tags:
		//		protected extension
		if(this.command.length){
			var label = this.getLabel(this.command),
				editor = this.editor,
				className = this.iconClassPrefix+" "+this.iconClassPrefix + this.command.charAt(0).toUpperCase() + this.command.substr(1);
			if(!this.button){
				var props = dojo.mixin({
					label: label,
					dir: editor.dir,
					lang: editor.lang,
					showLabel: false,
					iconClass: className,
					dropDown: this.dropDown,
					tabIndex: "-1"
				}, this.params || {});
				this.button = new this.buttonClass(props);
			}
		}
		if(this.get("disabled") && this.button){
			this.button.set("disabled", this.get("disabled"));
		}
	},

	destroy: function(){
		// summary:
		//		Destroy this plugin

		dojo.forEach(this._connects, dojo.disconnect);
		if(this.dropDown){
			this.dropDown.destroyRecursive();
		}
	},

	connect: function(o, f, tf){
		// summary:
		//		Make a dojo.connect() that is automatically disconnected when this plugin is destroyed.
		//		Similar to `dijit._Widget.connect`.
		// tags:
		//		protected
		this._connects.push(dojo.connect(o, f, this, tf));
	},

	updateState: function(){
		// summary:
		//		Change state of the plugin to respond to events in the editor.
		// description:
		//		This is called on meaningful events in the editor, such as change of selection
		//		or caret position (but not simple typing of alphanumeric keys).   It gives the
		//		plugin a chance to update the CSS of its button.
		//
		//		For example, the "bold" plugin will highlight/unhighlight the bold button depending on whether the
		//		characters next to the caret are bold or not.
		//
		//		Only makes sense when `useDefaultCommand` is true, as it calls Editor.queryCommandEnabled(`command`).
		var e = this.editor,
			c = this.command,
			checked, enabled;
		if(!e || !e.isLoaded || !c.length){ return; }
		var disabled = this.get("disabled");
		if(this.button){
			try{
				enabled = !disabled && e.queryCommandEnabled(c);
				if(this.enabled !== enabled){
					this.enabled = enabled;
					this.button.set('disabled', !enabled);
				}
				if(typeof this.button.checked == 'boolean'){
					checked = e.queryCommandState(c);
					if(this.checked !== checked){
						this.checked = checked;
						this.button.set('checked', e.queryCommandState(c));
					}
				}
			}catch(e){
				console.log(e); // FIXME: we shouldn't have debug statements in our code.  Log as an error?
			}
		}
	},

	setEditor: function(/*dijit.Editor*/ editor){
		// summary:
		//		Tell the plugin which Editor it is associated with.

		// TODO: refactor code to just pass editor to constructor.

		// FIXME: detach from previous editor!!
		this.editor = editor;

		// FIXME: prevent creating this if we don't need to (i.e., editor can't handle our command)
		this._initButton();

		// Processing for buttons that execute by calling editor.execCommand()
		if(this.button && this.useDefaultCommand){
			if(this.editor.queryCommandAvailable(this.command)){
				this.connect(this.button, "onClick",
					dojo.hitch(this.editor, "execCommand", this.command, this.commandArg)
				);
			}else{
				// hide button because editor doesn't support command (due to browser limitations)
				this.button.domNode.style.display = "none";
			}
		}

		this.connect(this.editor, "onNormalizedDisplayChanged", "updateState");
	},

	setToolbar: function(/*dijit.Toolbar*/ toolbar){
		// summary:
		//		Tell the plugin to add it's controller widget (often a button)
		//		to the toolbar.  Does nothing if there is no controller widget.

		// TODO: refactor code to just pass toolbar to constructor.

		if(this.button){
			toolbar.addChild(this.button);
		}
		// console.debug("adding", this.button, "to:", toolbar);
	},
	
	set: function(/* attribute */ name, /* anything */ value){
		// summary:
		//		Set a property on a plugin
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		// description:
		//		Sets named properties on a plugin which may potentially be handled by a
		// 		setter in the plugin.
		// 		For example, if the plugin has a properties "foo"
		//		and "bar" and a method named "_setFooAttr", calling:
		//	|	plugin.set("foo", "Howdy!");
		//		would be equivalent to writing:
		//	|	plugin._setFooAttr("Howdy!");
		//		and:
		//	|	plugin.set("bar", 3);
		//		would be equivalent to writing:
		//	|	plugin.bar = 3;
		//
		//	set() may also be called with a hash of name/value pairs, ex:
		//	|	plugin.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	})
		//	This is equivalent to calling set(foo, "Howdy") and set(bar, 3)
		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
	}
			return this;
		}
		var names = this._getAttrNames(name);
		if(this[names.s]){
			// use the explicit setter
			var result = this[names.s].apply(this, Array.prototype.slice.call(arguments, 1));
		}else{
			this._set(name, value);
		}
		return result || this;
	},

	get: function(name){
		// summary:
		//		Get a property from a plugin.
		//	name:
		//		The property to get.
		// description:
		//		Get a named property from a plugin. The property may
		//		potentially be retrieved via a getter method. If no getter is defined, this
		// 		just retrieves the object's property.
		// 		For example, if the plugin has a properties "foo"
		//		and "bar" and a method named "_getFooAttr", calling:
		//	|	plugin.get("foo");
		//		would be equivalent to writing:
		//	|	plugin._getFooAttr();
		//		and:
		//	|	plugin.get("bar");
		//		would be equivalent to writing:
		//	|	plugin.bar;
		var names = this._getAttrNames(name);
		return this[names.g] ? this[names.g]() : this[name];
	},

	_setDisabledAttr: function(disabled){
		// summary:
		//		Function to set the plugin state and call updateState to make sure the
		//		button is updated appropriately.
		this.disabled = disabled;
		this.updateState();
	},
	
	_getAttrNames: function(name){
		// summary:
		//		Helper function for get() and set().
		//		Caches attribute name values so we don't do the string ops every time.
		// tags:
		//		private

		var apn = this._attrPairNames;
		if(apn[name]){ return apn[name]; }
		var uc = name.charAt(0).toUpperCase() + name.substr(1);
		return (apn[name] = {
			s: "_set"+uc+"Attr",
			g: "_get"+uc+"Attr"
		});
	},
	
	_set: function(/*String*/ name, /*anything*/ value){
		// summary:
		//		Helper function to set new value for specified attribute
		var oldValue = this[name];
		this[name] = value;
	}
});

}

if(!dojo._hasResource["dijit._editor.plugins.EnterKeyHandling"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._editor.plugins.EnterKeyHandling"] = true;
dojo.provide("dijit._editor.plugins.EnterKeyHandling");





dojo.declare("dijit._editor.plugins.EnterKeyHandling", dijit._editor._Plugin, {
	// summary:
	//		This plugin tries to make all browsers behave consistently with regard to
	//		how ENTER behaves in the editor window.  It traps the ENTER key and alters
	//		the way DOM is constructed in certain cases to try to commonize the generated
	//		DOM and behaviors across browsers.
	//
	// description:
	//		This plugin has three modes:
	//
	//			* blockModeForEnter=BR
	//			* blockModeForEnter=DIV
	//			* blockModeForEnter=P
	//
	//		In blockModeForEnter=P, the ENTER key starts a new
	//		paragraph, and shift-ENTER starts a new line in the current paragraph.
	//		For example, the input:
	//
	//		|	first paragraph <shift-ENTER>
	//		|	second line of first paragraph <ENTER>
	//		|	second paragraph
	//
	//		will generate:
	//
	//		|	<p>
	//		|		first paragraph
	//		|		<br/>
	//		|		second line of first paragraph
	//		|	</p>
	//		|	<p>
	//		|		second paragraph
	//		|	</p>
	//
	//		In BR and DIV mode, the ENTER key conceptually goes to a new line in the
	//		current paragraph, and users conceptually create a new paragraph by pressing ENTER twice.
	//		For example, if the user enters text into an editor like this:
	//
	//		|		one <ENTER>
	//		|		two <ENTER>
	//		|		three <ENTER>
	//		|		<ENTER>
	//		|		four <ENTER>
	//		|		five <ENTER>
	//		|		six <ENTER>
	//
	//		It will appear on the screen as two 'paragraphs' of three lines each.  Markupwise, this generates:
	//
	//		BR:
	//		|		one<br/>
	//		|		two<br/>
	//		|		three<br/>
	//		|		<br/>
	//		|		four<br/>
	//		|		five<br/>
	//		|		six<br/>
	//
	//		DIV:
	//		|		<div>one</div>
	//		|		<div>two</div>
	//		|		<div>three</div>
	//		|		<div>&nbsp;</div>
	//		|		<div>four</div>
	//		|		<div>five</div>
	//		|		<div>six</div>

	// blockNodeForEnter: String
	//		This property decides the behavior of Enter key. It can be either P,
	//		DIV, BR, or empty (which means disable this feature). Anything else
	//		will trigger errors.  The default is 'BR'
	//
	//		See class description for more details.
	blockNodeForEnter: 'BR',

	constructor: function(args){
		if(args){
			if("blockNodeForEnter" in args){
				args.blockNodeForEnter = args.blockNodeForEnter.toUpperCase();
			}
			dojo.mixin(this,args);
		}
	},

	setEditor: function(editor){
		// Overrides _Plugin.setEditor().
		if(this.editor === editor) { return; }
		this.editor = editor;
		if(this.blockNodeForEnter == 'BR'){
			// While Moz has a mode tht mostly works, it's still a little different,
			// So, try to just have a common mode and be consistent.  Which means
			// we need to enable customUndo, if not already enabled.
			this.editor.customUndo = true;
				editor.onLoadDeferred.addCallback(dojo.hitch(this,function(d){
				this.connect(editor.document, "onkeypress", function(e){
					if(e.charOrCode == dojo.keys.ENTER){
						// Just do it manually.  The handleEnterKey has a shift mode that
						// Always acts like <br>, so just use it.
						var ne = dojo.mixin({},e);
						ne.shiftKey = true;
						if(!this.handleEnterKey(ne)){
							dojo.stopEvent(e);
						}
					}
				});
					return d;
				}));
		}else if(this.blockNodeForEnter){
			// add enter key handler
			// FIXME: need to port to the new event code!!
			var h = dojo.hitch(this,this.handleEnterKey);
			editor.addKeyHandler(13, 0, 0, h); //enter
			editor.addKeyHandler(13, 0, 1, h); //shift+enter
			this.connect(this.editor,'onKeyPressed','onKeyPressed');
		}
	},
	onKeyPressed: function(e){
		// summary:
		//		Handler for keypress events.
		// tags:
		//		private
		if(this._checkListLater){
			if(dojo.withGlobal(this.editor.window, 'isCollapsed', dijit)){
				var liparent=dojo.withGlobal(this.editor.window, 'getAncestorElement', dijit._editor.selection, ['LI']);
				if(!liparent){
					// circulate the undo detection code by calling RichText::execCommand directly
					dijit._editor.RichText.prototype.execCommand.call(this.editor, 'formatblock',this.blockNodeForEnter);
					// set the innerHTML of the new block node
					var block = dojo.withGlobal(this.editor.window, 'getAncestorElement', dijit._editor.selection, [this.blockNodeForEnter]);
					if(block){
						block.innerHTML=this.bogusHtmlContent;
						if(dojo.isIE){
							// move to the start by moving backwards one char
							var r = this.editor.document.selection.createRange();
							r.move('character',-1);
							r.select();
						}
					}else{
						console.error('onKeyPressed: Cannot find the new block node'); // FIXME
					}
				}else{
					if(dojo.isMoz){
						if(liparent.parentNode.parentNode.nodeName == 'LI'){
							liparent=liparent.parentNode.parentNode;
						}
					}
					var fc=liparent.firstChild;
					if(fc && fc.nodeType == 1 && (fc.nodeName == 'UL' || fc.nodeName == 'OL')){
						liparent.insertBefore(fc.ownerDocument.createTextNode('\xA0'),fc);
						var newrange = dijit.range.create(this.editor.window);
						newrange.setStart(liparent.firstChild,0);
						var selection = dijit.range.getSelection(this.editor.window, true);
						selection.removeAllRanges();
						selection.addRange(newrange);
					}
				}
			}
			this._checkListLater = false;
		}
		if(this._pressedEnterInBlock){
			// the new created is the original current P, so we have previousSibling below
			if(this._pressedEnterInBlock.previousSibling){
				this.removeTrailingBr(this._pressedEnterInBlock.previousSibling);
			}
			delete this._pressedEnterInBlock;
		}
	},

	// bogusHtmlContent: [private] String
	//		HTML to stick into a new empty block
	bogusHtmlContent: '&nbsp;',

	// blockNodes: [private] Regex
	//		Regex for testing if a given tag is a block level (display:block) tag
	blockNodes: /^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,

	handleEnterKey: function(e){
		// summary:
		//		Handler for enter key events when blockModeForEnter is DIV or P.
		// description:
		//		Manually handle enter key event to make the behavior consistent across
		//		all supported browsers. See class description for details.
		// tags:
		//		private

		var selection, range, newrange, doc=this.editor.document,br,rs,txt;
		if(e.shiftKey){		// shift+enter always generates <br>
			var parent = dojo.withGlobal(this.editor.window, "getParentElement", dijit._editor.selection);
			var header = dijit.range.getAncestor(parent,this.blockNodes);
			if(header){
				if(header.tagName == 'LI'){
					return true; // let browser handle
				}
				selection = dijit.range.getSelection(this.editor.window);
				range = selection.getRangeAt(0);
				if(!range.collapsed){
					range.deleteContents();
					selection = dijit.range.getSelection(this.editor.window);
					range = selection.getRangeAt(0);
				}
				if(dijit.range.atBeginningOfContainer(header, range.startContainer, range.startOffset)){
						br=doc.createElement('br');
						newrange = dijit.range.create(this.editor.window);
						header.insertBefore(br,header.firstChild);
						newrange.setStartBefore(br.nextSibling);
						selection.removeAllRanges();
						selection.addRange(newrange);
				}else if(dijit.range.atEndOfContainer(header, range.startContainer, range.startOffset)){
					newrange = dijit.range.create(this.editor.window);
					br=doc.createElement('br');
						header.appendChild(br);
						header.appendChild(doc.createTextNode('\xA0'));
						newrange.setStart(header.lastChild,0);
					selection.removeAllRanges();
					selection.addRange(newrange);
				}else{
					rs = range.startContainer;
					if(rs && rs.nodeType == 3){
						// Text node, we have to split it.
						txt = rs.nodeValue;
						dojo.withGlobal(this.editor.window, function(){
							var startNode = doc.createTextNode(txt.substring(0, range.startOffset));
							var endNode = doc.createTextNode(txt.substring(range.startOffset));
							var brNode = doc.createElement("br");
							
							if(endNode.nodeValue == "" && dojo.isWebKit){
								endNode = doc.createTextNode('\xA0')
							}
							dojo.place(startNode, rs, "after");
							dojo.place(brNode, startNode, "after");
							dojo.place(endNode, brNode, "after");
							dojo.destroy(rs);
							newrange = dijit.range.create(dojo.gobal);
							newrange.setStart(endNode,0);
							selection.removeAllRanges();
							selection.addRange(newrange);
						});
						return false;
					}
					return true; // let browser handle
				}
			}else{
				selection = dijit.range.getSelection(this.editor.window);
				if(selection.rangeCount){
					range = selection.getRangeAt(0);
					if(range && range.startContainer){
						if(!range.collapsed){
							range.deleteContents();
							selection = dijit.range.getSelection(this.editor.window);
							range = selection.getRangeAt(0);
						}
						rs = range.startContainer;
						var startNode, endNode, brNode;
						if(rs && rs.nodeType == 3){
							// Text node, we have to split it.
							dojo.withGlobal(this.editor.window, dojo.hitch(this, function(){
								var endEmpty = false;
							
								var offset = range.startOffset;
								if(rs.length < offset){
									//We are not splitting the right node, try to locate the correct one
									ret = this._adjustNodeAndOffset(rs, offset);
									rs = ret.node;
									offset = ret.offset;
								}
								txt = rs.nodeValue;
				
								startNode = doc.createTextNode(txt.substring(0, offset));
								endNode = doc.createTextNode(txt.substring(offset));
								brNode = doc.createElement("br");
								
								if(!endNode.length){
									endNode = doc.createTextNode('\xA0');
									endEmpty = true;
								}
								
								if(startNode.length){
									dojo.place(startNode, rs, "after");
								}else{
									startNode = rs;
								}
								dojo.place(brNode, startNode, "after");
								dojo.place(endNode, brNode, "after");
								dojo.destroy(rs);
								newrange = dijit.range.create(dojo.gobal);
								newrange.setStart(endNode,0);
								newrange.setEnd(endNode, endNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								if(endEmpty && !dojo.isWebKit){
									dijit._editor.selection.remove();
								}else{
									dijit._editor.selection.collapse(true);
								}
							}));
						}else{
							dojo.withGlobal(this.editor.window, dojo.hitch(this, function(){
								var brNode = doc.createElement("br");
								rs.appendChild(brNode);
								var endNode = doc.createTextNode('\xA0');
								rs.appendChild(endNode);
								newrange = dijit.range.create(dojo.global);
								newrange.setStart(endNode,0);
								newrange.setEnd(endNode, endNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								dijit._editor.selection.collapse(true);
							}));
						}
					}
				}else{
					// don't change this: do not call this.execCommand, as that may have other logic in subclass
					dijit._editor.RichText.prototype.execCommand.call(this.editor, 'inserthtml', '<br>');
				}
			}
			return false;
		}
		var _letBrowserHandle = true;

		// first remove selection
		selection = dijit.range.getSelection(this.editor.window);
		range = selection.getRangeAt(0);
		if(!range.collapsed){
			range.deleteContents();
			selection = dijit.range.getSelection(this.editor.window);
			range = selection.getRangeAt(0);
		}

		var block = dijit.range.getBlockAncestor(range.endContainer, null, this.editor.editNode);
		var blockNode = block.blockNode;

		// if this is under a LI or the parent of the blockNode is LI, just let browser to handle it
		if((this._checkListLater = (blockNode && (blockNode.nodeName == 'LI' || blockNode.parentNode.nodeName == 'LI')))){
			if(dojo.isMoz){
				// press enter in middle of P may leave a trailing <br/>, let's remove it later
				this._pressedEnterInBlock = blockNode;
			}
			// if this li only contains spaces, set the content to empty so the browser will outdent this item
			if(/^(\s|&nbsp;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|\xA0)<\/span>)?(<br>)?$/.test(blockNode.innerHTML)){
				// empty LI node
				blockNode.innerHTML = '';
				if(dojo.isWebKit){ // WebKit tosses the range when innerHTML is reset
					newrange = dijit.range.create(this.editor.window);
					newrange.setStart(blockNode, 0);
					selection.removeAllRanges();
					selection.addRange(newrange);
				}
				this._checkListLater = false; // nothing to check since the browser handles outdent
			}
			return true;
		}

		// text node directly under body, let's wrap them in a node
		if(!block.blockNode || block.blockNode===this.editor.editNode){
			try{
				dijit._editor.RichText.prototype.execCommand.call(this.editor, 'formatblock',this.blockNodeForEnter);
			}catch(e2){ /*squelch FF3 exception bug when editor content is a single BR*/ }
			// get the newly created block node
			// FIXME
			block = {blockNode:dojo.withGlobal(this.editor.window, "getAncestorElement", dijit._editor.selection, [this.blockNodeForEnter]),
					blockContainer: this.editor.editNode};
			if(block.blockNode){
				if(block.blockNode != this.editor.editNode &&
					(!(block.blockNode.textContent || block.blockNode.innerHTML).replace(/^\s+|\s+$/g, "").length)){
					this.removeTrailingBr(block.blockNode);
					return false;
				}
			}else{	// we shouldn't be here if formatblock worked
				block.blockNode = this.editor.editNode;
			}
			selection = dijit.range.getSelection(this.editor.window);
			range = selection.getRangeAt(0);
		}

		var newblock = doc.createElement(this.blockNodeForEnter);
		newblock.innerHTML=this.bogusHtmlContent;
		this.removeTrailingBr(block.blockNode);
		var endOffset = range.endOffset;
		var node = range.endContainer;
		if(node.length < endOffset){
			//We are not checking the right node, try to locate the correct one
			var ret = this._adjustNodeAndOffset(node, endOffset);
			node = ret.node;
			endOffset = ret.offset;
		}
		if(dijit.range.atEndOfContainer(block.blockNode, node, endOffset)){
			if(block.blockNode === block.blockContainer){
				block.blockNode.appendChild(newblock);
			}else{
				dojo.place(newblock, block.blockNode, "after");
			}
			_letBrowserHandle = false;
			// lets move caret to the newly created block
			newrange = dijit.range.create(this.editor.window);
			newrange.setStart(newblock, 0);
			selection.removeAllRanges();
			selection.addRange(newrange);
			if(this.editor.height){
				dojo.window.scrollIntoView(newblock);
			}
		}else if(dijit.range.atBeginningOfContainer(block.blockNode,
				range.startContainer, range.startOffset)){
			dojo.place(newblock, block.blockNode, block.blockNode === block.blockContainer ? "first" : "before");
			if(newblock.nextSibling && this.editor.height){
				// position input caret - mostly WebKit needs this
				newrange = dijit.range.create(this.editor.window);
				newrange.setStart(newblock.nextSibling, 0);
				selection.removeAllRanges();
				selection.addRange(newrange);
				// browser does not scroll the caret position into view, do it manually
				dojo.window.scrollIntoView(newblock.nextSibling);
			}
			_letBrowserHandle = false;
		}else{ //press enter in the middle of P/DIV/Whatever/
			if(block.blockNode === block.blockContainer){
				block.blockNode.appendChild(newblock);
			}else{
				dojo.place(newblock, block.blockNode, "after");
			}
			_letBrowserHandle = false;

			// Clone any block level styles.
			if(block.blockNode.style){
				if(newblock.style){
					if(block.blockNode.style.cssText){
						newblock.style.cssText = block.blockNode.style.cssText;
					}
				}
			}
			
			// Okay, we probably have to split.
			rs = range.startContainer;
			if(rs && rs.nodeType == 3){
				// Text node, we have to split it.
				var nodeToMove, tNode;
				endOffset = range.endOffset;
				if(rs.length < endOffset){
					//We are not splitting the right node, try to locate the correct one
					ret = this._adjustNodeAndOffset(rs, endOffset);
					rs = ret.node;
					endOffset = ret.offset;
				}
				
				txt = rs.nodeValue;
				var startNode = doc.createTextNode(txt.substring(0, endOffset));
				var endNode = doc.createTextNode(txt.substring(endOffset, txt.length));

				// Place the split, then remove original nodes.
				dojo.place(startNode, rs, "before");
				dojo.place(endNode, rs, "after");
				dojo.destroy(rs);

				// Okay, we split the text.  Now we need to see if we're
				// parented to the block element we're splitting and if
				// not, we have to split all the way up.  Ugh.
				var parentC = startNode.parentNode;
				while(parentC !== block.blockNode){
					var tg = parentC.tagName;
					var newTg = doc.createElement(tg);
					// Clone over any 'style' data.
					if(parentC.style){
						if(newTg.style){
							if(parentC.style.cssText){
								newTg.style.cssText = parentC.style.cssText;
							}
						}
					}

					nodeToMove = endNode;
					while(nodeToMove){
						tNode = nodeToMove.nextSibling;
						newTg.appendChild(nodeToMove);
						nodeToMove = tNode;
					}
					dojo.place(newTg, parentC, "after");
					startNode = parentC;
					endNode = newTg;
					parentC = parentC.parentNode;
				}

				// Lastly, move the split out tags to the new block.
				// as they should now be split properly.
				nodeToMove = endNode;
				if(nodeToMove.nodeType == 1 || (nodeToMove.nodeType == 3 && nodeToMove.nodeValue)){
					// Non-blank text and non-text nodes need to clear out that blank space
					// before moving the contents.
					newblock.innerHTML = "";
				}
				while(nodeToMove){
					tNode = nodeToMove.nextSibling;
					newblock.appendChild(nodeToMove);
					nodeToMove = tNode;
				}
			}
			
			//lets move caret to the newly created block
			newrange = dijit.range.create(this.editor.window);
			newrange.setStart(newblock, 0);
			selection.removeAllRanges();
			selection.addRange(newrange);
			if(this.editor.height){
				dijit.scrollIntoView(newblock);
			}
			if(dojo.isMoz){
				// press enter in middle of P may leave a trailing <br/>, let's remove it later
				this._pressedEnterInBlock = block.blockNode;
			}
		}
		return _letBrowserHandle;
	},
	
	_adjustNodeAndOffset: function(/*DomNode*/node, /*Int*/offset){
		// summary:
		//              In the case there are multiple text nodes in a row the offset may not be within the node.  If the offset is larger than the node length, it will attempt to find
		//              the next text sibling until it locates the text node in which the offset refers to
		// node:
		//              The node to check.
		// offset:
		//              The position to find within the text node
		// tags:
		//              private.
		while(node.length < offset && node.nextSibling && node.nextSibling.nodeType==3){
			//Adjust the offset and node in the case of multiple text nodes in a row
			offset = offset - node.length;
			node = node.nextSibling;
		}
		var ret = {"node": node, "offset": offset};
		return ret;
	},

	removeTrailingBr: function(container){
		// summary:
		//		If last child of container is a <br>, then remove it.
		// tags:
		//		private
		var para = /P|DIV|LI/i.test(container.tagName) ?
			container : dijit._editor.selection.getParentOfType(container,['P','DIV','LI']);

		if(!para){ return; }
		if(para.lastChild){
			if((para.childNodes.length > 1 && para.lastChild.nodeType == 3 && /^[\s\xAD]*$/.test(para.lastChild.nodeValue)) ||
				para.lastChild.tagName=='BR'){

				dojo.destroy(para.lastChild);
			}
		}
		if(!para.childNodes.length){
			para.innerHTML=this.bogusHtmlContent;
		}
	}
});

}

if(!dojo._hasResource["dijit.Editor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Editor"] = true;
dojo.provide("dijit.Editor");












dojo.declare(
	"dijit.Editor",
	dijit._editor.RichText,
	{
		// summary:
		//		A rich text Editing widget
		//
		// description:
		//		This widget provides basic WYSIWYG editing features, based on the browser's
		//		underlying rich text editing capability, accompanied by a toolbar (`dijit.Toolbar`).
		//		A plugin model is available to extend the editor's capabilities as well as the
		//		the options available in the toolbar.  Content generation may vary across
		//		browsers, and clipboard operations may have different results, to name
		//		a few limitations.  Note: this widget should not be used with the HTML
		//		&lt;TEXTAREA&gt; tag -- see dijit._editor.RichText for details.

		// plugins: [const] Object[]
		//		A list of plugin names (as strings) or instances (as objects)
		//		for this widget.
		//
		//		When declared in markup, it might look like:
		//	|	plugins="['bold',{name:'dijit._editor.plugins.FontChoice', command:'fontName', generic:true}]"
		plugins: null,

		// extraPlugins: [const] Object[]
		//		A list of extra plugin names which will be appended to plugins array
		extraPlugins: null,

		constructor: function(){
			// summary:
			//		Runs on widget initialization to setup arrays etc.
			// tags:
			//		private

			if(!dojo.isArray(this.plugins)){
				this.plugins=["undo","redo","|","cut","copy","paste","|","bold","italic","underline","strikethrough","|",
				"insertOrderedList","insertUnorderedList","indent","outdent","|","justifyLeft","justifyRight","justifyCenter","justifyFull",
				"dijit._editor.plugins.EnterKeyHandling" /*, "createLink"*/];
			}

			this._plugins=[];
			this._editInterval = this.editActionInterval * 1000;

			//IE will always lose focus when other element gets focus, while for FF and safari,
			//when no iframe is used, focus will be lost whenever another element gets focus.
			//For IE, we can connect to onBeforeDeactivate, which will be called right before
			//the focus is lost, so we can obtain the selected range. For other browsers,
			//no equivelent of onBeforeDeactivate, so we need to do two things to make sure
			//selection is properly saved before focus is lost: 1) when user clicks another
			//element in the page, in which case we listen to mousedown on the entire page and
			//see whether user clicks out of a focus editor, if so, save selection (focus will
			//only lost after onmousedown event is fired, so we can obtain correct caret pos.)
			//2) when user tabs away from the editor, which is handled in onKeyDown below.
			if(dojo.isIE){
				this.events.push("onBeforeDeactivate");
				this.events.push("onBeforeActivate");
			}
		},

		postMixInProperties: function() {
			// summary:
			//	Extension to make sure a deferred is in place before certain functions
			//	execute, like making sure all the plugins are properly inserted.

			// Set up a deferred so that the value isn't applied to the editor
			// until all the plugins load, needed to avoid timing condition
			// reported in #10537.
			this.setValueDeferred = new dojo.Deferred();
			this.inherited(arguments);
		},
	
		postCreate: function(){
			//for custom undo/redo, if enabled.
			this._steps=this._steps.slice(0);
			this._undoedSteps=this._undoedSteps.slice(0);

			if(dojo.isArray(this.extraPlugins)){
				this.plugins=this.plugins.concat(this.extraPlugins);
			}

			this.inherited(arguments);

			this.commands = dojo.i18n.getLocalization("dijit._editor", "commands", this.lang);

			if(!this.toolbar){
				// if we haven't been assigned a toolbar, create one
				this.toolbar = new dijit.Toolbar({
					dir: this.dir,
					lang: this.lang
				});
				this.header.appendChild(this.toolbar.domNode);
			}

			dojo.forEach(this.plugins, this.addPlugin, this);

			// Okay, denote the value can now be set.
			this.setValueDeferred.callback(true);

			dojo.addClass(this.iframe.parentNode, "dijitEditorIFrameContainer");
			dojo.addClass(this.iframe, "dijitEditorIFrame");
			dojo.attr(this.iframe, "allowTransparency", true);

			if(dojo.isWebKit){
				// Disable selecting the entire editor by inadvertant double-clicks.
				// on buttons, title bar, etc.  Otherwise clicking too fast on
				// a button such as undo/redo selects the entire editor.
				dojo.style(this.domNode, "KhtmlUserSelect", "none");
			}
			this.toolbar.startup();
			this.onNormalizedDisplayChanged(); //update toolbar button status
		},
		destroy: function(){
			dojo.forEach(this._plugins, function(p){
				if(p && p.destroy){
					p.destroy();
				}
			});
			this._plugins=[];
			this.toolbar.destroyRecursive();
			delete this.toolbar;
			this.inherited(arguments);
		},
		addPlugin: function(/*String||Object*/plugin, /*Integer?*/index){
			// summary:
			//		takes a plugin name as a string or a plugin instance and
			//		adds it to the toolbar and associates it with this editor
			//		instance. The resulting plugin is added to the Editor's
			//		plugins array. If index is passed, it's placed in the plugins
			//		array at that index. No big magic, but a nice helper for
			//		passing in plugin names via markup.
			//
			// plugin: String, args object or plugin instance
			//
			// args:
			//		This object will be passed to the plugin constructor
			//
			// index: Integer
			//		Used when creating an instance from
			//		something already in this.plugins. Ensures that the new
			//		instance is assigned to this.plugins at that index.
			var args=dojo.isString(plugin)?{name:plugin}:plugin;
			if(!args.setEditor){
				var o={"args":args,"plugin":null,"editor":this};
				dojo.publish(dijit._scopeName + ".Editor.getPlugin",[o]);
				if(!o.plugin){
					var pc = dojo.getObject(args.name);
					if(pc){
						o.plugin=new pc(args);
					}
				}
				if(!o.plugin){
					console.warn('Cannot find plugin',plugin);
					return;
				}
				plugin=o.plugin;
			}
			if(arguments.length > 1){
				this._plugins[index] = plugin;
			}else{
				this._plugins.push(plugin);
			}
			plugin.setEditor(this);
			if(dojo.isFunction(plugin.setToolbar)){
				plugin.setToolbar(this.toolbar);
			}
		},
		//the following 3 functions are required to make the editor play nice under a layout widget, see #4070
		startup: function(){
			// summary:
			//		Exists to make Editor work as a child of a layout widget.
			//		Developers don't need to call this method.
			// tags:
			//		protected
			//console.log('startup',arguments);
		},
		resize: function(size){
			// summary:
			//		Resize the editor to the specified size, see `dijit.layout._LayoutWidget.resize`
			if(size){
				// we've been given a height/width for the entire editor (toolbar + contents), calls layout()
				// to split the allocated size between the toolbar and the contents
				dijit.layout._LayoutWidget.prototype.resize.apply(this, arguments);
			}
			/*
			else{
				// do nothing, the editor is already laid out correctly.   The user has probably specified
				// the height parameter, which was used to set a size on the iframe
			}
			*/
		},
		layout: function(){
			// summary:
			//		Called from `dijit.layout._LayoutWidget.resize`.  This shouldn't be called directly
			// tags:
			//		protected

			// Converts the iframe (or rather the <div> surrounding it) to take all the available space
			// except what's needed for the header (toolbars) and footer (breadcrumbs, etc).
			// A class was added to the iframe container and some themes style it, so we have to
			// calc off the added margins and padding too. See tracker: #10662
			var areaHeight = (this._contentBox.h -
				(this.getHeaderHeight() + this.getFooterHeight() +
				 dojo._getPadBorderExtents(this.iframe.parentNode).h +
				 dojo._getMarginExtents(this.iframe.parentNode).h));
			this.editingArea.style.height = areaHeight + "px";
			if(this.iframe){
				this.iframe.style.height="100%";
			}
			this._layoutMode = true;
		},
		_onIEMouseDown: function(/*Event*/ e){
			// summary:
			//		IE only to prevent 2 clicks to focus
			// tags:
			//		private
			var outsideClientArea;
			// IE 8's componentFromPoint is broken, which is a shame since it
			// was smaller code, but oh well.  We have to do this brute force
			// to detect if the click was scroller or not.
			var b = this.document.body;
			var clientWidth = b.clientWidth;
			var clientHeight = b.clientHeight;
			var clientLeft = b.clientLeft;
			var offsetWidth = b.offsetWidth;
			var offsetHeight = b.offsetHeight;
			var offsetLeft = b.offsetLeft;

			//Check for vertical scroller click.
			bodyDir = b.dir ? b.dir.toLowerCase() : "";
			if(bodyDir != "rtl"){
				if(clientWidth < offsetWidth && e.x > clientWidth && e.x < offsetWidth){
					// Check the click was between width and offset width, if so, scroller
					outsideClientArea = true;
				}
			}else{
				// RTL mode, we have to go by the left offsets.
				if(e.x < clientLeft && e.x > offsetLeft){
					// Check the click was between width and offset width, if so, scroller
					outsideClientArea = true;
				}
			}
			if(!outsideClientArea){
				// Okay, might be horiz scroller, check that.
				if(clientHeight < offsetHeight && e.y > clientHeight && e.y < offsetHeight){
					// Horizontal scroller.
					outsideClientArea = true;
				}
			}
			if(!outsideClientArea){
				delete this._cursorToStart; // Remove the force to cursor to start position.
				delete this._savedSelection; // new mouse position overrides old selection
				if(e.target.tagName == "BODY"){
					setTimeout(dojo.hitch(this, "placeCursorAtEnd"), 0);
				}
				this.inherited(arguments);
			}
		},
		onBeforeActivate: function(e){
			this._restoreSelection();
		},
		onBeforeDeactivate: function(e){
			// summary:
			//		Called on IE right before focus is lost.   Saves the selected range.
			// tags:
			//		private
			if(this.customUndo){
				this.endEditing(true);
			}
			//in IE, the selection will be lost when other elements get focus,
			//let's save focus before the editor is deactivated
			if(e.target.tagName != "BODY"){
				this._saveSelection();
			}
			//console.log('onBeforeDeactivate',this);
		},

		/* beginning of custom undo/redo support */

		// customUndo: Boolean
		//		Whether we shall use custom undo/redo support instead of the native
		//		browser support. By default, we now use custom undo.  It works better
		//		than native browser support and provides a consistent behavior across
		//		browsers with a minimal performance hit.  We already had the hit on
		//		the slowest browser, IE, anyway.
		customUndo: true,

		// editActionInterval: Integer
		//		When using customUndo, not every keystroke will be saved as a step.
		//		Instead typing (including delete) will be grouped together: after
		//		a user stops typing for editActionInterval seconds, a step will be
		//		saved; if a user resume typing within editActionInterval seconds,
		//		the timeout will be restarted. By default, editActionInterval is 3
		//		seconds.
		editActionInterval: 3,

		beginEditing: function(cmd){
			// summary:
			//		Called to note that the user has started typing alphanumeric characters, if it's not already noted.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(!this._inEditing){
				this._inEditing=true;
				this._beginEditing(cmd);
			}
			if(this.editActionInterval>0){
				if(this._editTimer){
					clearTimeout(this._editTimer);
				}
				this._editTimer = setTimeout(dojo.hitch(this, this.endEditing), this._editInterval);
			}
		},

		// TODO: declaring these in the prototype is meaningless, just create in the constructor/postCreate
		_steps:[],
		_undoedSteps:[],

		execCommand: function(cmd){
			// summary:
			//		Main handler for executing any commands to the editor, like paste, bold, etc.
			//      Called by plugins, but not meant to be called by end users.
			// tags:
			//		protected
			if(this.customUndo && (cmd == 'undo' || cmd == 'redo')){
				return this[cmd]();
			}else{
				if(this.customUndo){
					this.endEditing();
					this._beginEditing();
				}
				var r;
				var isClipboard = /copy|cut|paste/.test(cmd);
				try{
					r = this.inherited(arguments);
					if(dojo.isWebKit && isClipboard && !r){ //see #4598: webkit does not guarantee clipboard support from js
						throw { code: 1011 }; // throw an object like Mozilla's error
					}
				}catch(e){
					//TODO: when else might we get an exception?  Do we need the Mozilla test below?
					if(e.code == 1011 /* Mozilla: service denied */ && isClipboard){
						// Warn user of platform limitation.  Cannot programmatically access clipboard. See ticket #4136
						var sub = dojo.string.substitute,
							accel = {cut:'X', copy:'C', paste:'V'};
						alert(sub(this.commands.systemShortcut,
							[this.commands[cmd], sub(this.commands[dojo.isMac ? 'appleKey' : 'ctrlKey'], [accel[cmd]])]));
					}
					r = false;
				}
				if(this.customUndo){
					this._endEditing();
				}
				return r;
			}
		},
		queryCommandEnabled: function(cmd){
			// summary:
			//		Returns true if specified editor command is enabled.
			//      Used by the plugins to know when to highlight/not highlight buttons.
			// tags:
			//		protected
			if(this.customUndo && (cmd == 'undo' || cmd == 'redo')){
				return cmd == 'undo' ? (this._steps.length > 1) : (this._undoedSteps.length > 0);
			}else{
				return this.inherited(arguments);
			}
		},
		_moveToBookmark: function(b){
			// summary:
			//		Selects the text specified in bookmark b
			// tags:
			//		private
			var bookmark = b.mark;
			var mark = b.mark;
			var col = b.isCollapsed;
			var r, sNode, eNode, sel;
			if(mark){
				if(dojo.isIE){
					if(dojo.isArray(mark)){
						//IE CONTROL, have to use the native bookmark.
						bookmark = [];
						dojo.forEach(mark,function(n){
							bookmark.push(dijit.range.getNode(n,this.editNode));
						},this);
						dojo.withGlobal(this.window,'moveToBookmark',dijit,[{mark: bookmark, isCollapsed: col}]);
					}else{
						if(mark.startContainer && mark.endContainer){
							// Use the pseudo WC3 range API.  This works better for positions
							// than the IE native bookmark code.
							sel = dijit.range.getSelection(this.window);
							if(sel && sel.removeAllRanges){
								sel.removeAllRanges();
								r = dijit.range.create(this.window);
								sNode = dijit.range.getNode(mark.startContainer,this.editNode);
								eNode = dijit.range.getNode(mark.endContainer,this.editNode);
								if(sNode && eNode){
									// Okay, we believe we found the position, so add it into the selection
									// There are cases where it may not be found, particularly in undo/redo, when
									// IE changes the underlying DOM on us (wraps text in a <p> tag or similar.
									// So, in those cases, don't bother restoring selection.
									r.setStart(sNode,mark.startOffset);
									r.setEnd(eNode,mark.endOffset);
									sel.addRange(r);
								}
							}
						}
					}
				}else{//w3c range
					sel = dijit.range.getSelection(this.window);
					if(sel && sel.removeAllRanges){
						sel.removeAllRanges();
						r = dijit.range.create(this.window);
						sNode = dijit.range.getNode(mark.startContainer,this.editNode);
						eNode = dijit.range.getNode(mark.endContainer,this.editNode);
						if(sNode && eNode){
							// Okay, we believe we found the position, so add it into the selection
							// There are cases where it may not be found, particularly in undo/redo, when
							// formatting as been done and so on, so don't restore selection then.
							r.setStart(sNode,mark.startOffset);
							r.setEnd(eNode,mark.endOffset);
							sel.addRange(r);
						}
					}
				}
			}
		},
		_changeToStep: function(from, to){
			// summary:
			//		Reverts editor to "to" setting, from the undo stack.
			// tags:
			//		private
			this.setValue(to.text);
			var b=to.bookmark;
			if(!b){ return; }
			this._moveToBookmark(b);
		},
		undo: function(){
			// summary:
			//		Handler for editor undo (ex: ctrl-z) operation
			// tags:
			//		private
			//console.log('undo');
			var ret = false;
			if(!this._undoRedoActive){
				this._undoRedoActive = true;
				this.endEditing(true);
				var s=this._steps.pop();
				if(s && this._steps.length>0){
					this.focus();
					this._changeToStep(s,this._steps[this._steps.length-1]);
					this._undoedSteps.push(s);
					this.onDisplayChanged();
					delete this._undoRedoActive;
					ret = true;
				}
				delete this._undoRedoActive;
			}
			return ret;
		},
		redo: function(){
			// summary:
			//		Handler for editor redo (ex: ctrl-y) operation
			// tags:
			//		private
			//console.log('redo');
			var ret = false;
			if(!this._undoRedoActive){
				this._undoRedoActive = true;
				this.endEditing(true);
				var s=this._undoedSteps.pop();
				if(s && this._steps.length>0){
					this.focus();
					this._changeToStep(this._steps[this._steps.length-1],s);
					this._steps.push(s);
					this.onDisplayChanged();
					ret = true;
				}
				delete this._undoRedoActive;
			}
			return ret;
		},
		endEditing: function(ignore_caret){
			// summary:
			//		Called to note that the user has stopped typing alphanumeric characters, if it's not already noted.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(this._editTimer){
				clearTimeout(this._editTimer);
			}
			if(this._inEditing){
				this._endEditing(ignore_caret);
				this._inEditing=false;
			}
		},

		_getBookmark: function(){
			// summary:
			//		Get the currently selected text
			// tags:
			//		protected
			var b=dojo.withGlobal(this.window,dijit.getBookmark);
			var tmp=[];
			if(b && b.mark){
				var mark = b.mark;
				if(dojo.isIE){
					// Try to use the pseudo range API on IE for better accuracy.
					var sel = dijit.range.getSelection(this.window);
					if(!dojo.isArray(mark)){
						if(sel){
							var range;
							if(sel.rangeCount){
								range = sel.getRangeAt(0);
							}
							if(range){
								b.mark = range.cloneRange();
							}else{
								b.mark = dojo.withGlobal(this.window,dijit.getBookmark);
							}
						}
					}else{
						// Control ranges (img, table, etc), handle differently.
						dojo.forEach(b.mark,function(n){
							tmp.push(dijit.range.getIndex(n,this.editNode).o);
						},this);
						b.mark = tmp;
					}
				}
				try{
					if(b.mark && b.mark.startContainer){
						tmp=dijit.range.getIndex(b.mark.startContainer,this.editNode).o;
						b.mark={startContainer:tmp,
							startOffset:b.mark.startOffset,
							endContainer:b.mark.endContainer===b.mark.startContainer?tmp:dijit.range.getIndex(b.mark.endContainer,this.editNode).o,
							endOffset:b.mark.endOffset};
					}
				}catch(e){
					b.mark = null;
				}
			}
			return b;
		},
		_beginEditing: function(cmd){
			// summary:
			//		Called when the user starts typing alphanumeric characters.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(this._steps.length === 0){
				// You want to use the editor content without post filtering
				// to make sure selection restores right for the 'initial' state.
				// and undo is called.  So not using this.value, as it was 'processed'
				// and the line-up for selections may have been altered.
				this._steps.push({'text':dijit._editor.getChildrenHtml(this.editNode),'bookmark':this._getBookmark()});
			}
		},
		_endEditing: function(ignore_caret){
			// summary:
			//		Called when the user stops typing alphanumeric characters.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			// Avoid filtering to make sure selections restore.
			var v = dijit._editor.getChildrenHtml(this.editNode);

			this._undoedSteps=[];//clear undoed steps
			this._steps.push({text: v, bookmark: this._getBookmark()});
		},
		onKeyDown: function(e){
			// summary:
			//		Handler for onkeydown event.
			// tags:
			//		private

			//We need to save selection if the user TAB away from this editor
			//no need to call _saveSelection for IE, as that will be taken care of in onBeforeDeactivate
			if(!dojo.isIE && !this.iframe && e.keyCode == dojo.keys.TAB && !this.tabIndent){
				this._saveSelection();
			}
			if(!this.customUndo){
				this.inherited(arguments);
				return;
			}
			var k = e.keyCode, ks = dojo.keys;
			if(e.ctrlKey && !e.altKey){//undo and redo only if the special right Alt + z/y are not pressed #5892
				if(k == 90 || k == 122){ //z
					dojo.stopEvent(e);
					this.undo();
					return;
				}else if(k == 89 || k == 121){ //y
					dojo.stopEvent(e);
					this.redo();
					return;
				}
			}
			this.inherited(arguments);

			switch(k){
					case ks.ENTER:
					case ks.BACKSPACE:
					case ks.DELETE:
						this.beginEditing();
						break;
					case 88: //x
					case 86: //v
						if(e.ctrlKey && !e.altKey && !e.metaKey){
							this.endEditing();//end current typing step if any
							if(e.keyCode == 88){
								this.beginEditing('cut');
								//use timeout to trigger after the cut is complete
								setTimeout(dojo.hitch(this, this.endEditing), 1);
							}else{
								this.beginEditing('paste');
								//use timeout to trigger after the paste is complete
								setTimeout(dojo.hitch(this, this.endEditing), 1);
							}
							break;
						}
						//pass through
					default:
						if(!e.ctrlKey && !e.altKey && !e.metaKey && (e.keyCode<dojo.keys.F1 || e.keyCode>dojo.keys.F15)){
							this.beginEditing();
							break;
						}
						//pass through
					case ks.ALT:
						this.endEditing();
						break;
					case ks.UP_ARROW:
					case ks.DOWN_ARROW:
					case ks.LEFT_ARROW:
					case ks.RIGHT_ARROW:
					case ks.HOME:
					case ks.END:
					case ks.PAGE_UP:
					case ks.PAGE_DOWN:
						this.endEditing(true);
						break;
					//maybe ctrl+backspace/delete, so don't endEditing when ctrl is pressed
					case ks.CTRL:
					case ks.SHIFT:
					case ks.TAB:
						break;
				}
		},
		_onBlur: function(){
			// summary:
			//		Called from focus manager when focus has moved away from this editor
			// tags:
			//		protected

			//this._saveSelection();
			this.inherited(arguments);
			this.endEditing(true);
		},
		_saveSelection: function(){
			// summary:
			//		Save the currently selected text in _savedSelection attribute
			// tags:
			//		private
			try{
				this._savedSelection=this._getBookmark();
			}catch(e){ /* Squelch any errors that occur if selection save occurs due to being hidden simultaniously. */}
		},
		_restoreSelection: function(){
			// summary:
			//		Re-select the text specified in _savedSelection attribute;
			//		see _saveSelection().
			// tags:
			//		private
			if(this._savedSelection){
				// Clear off cursor to start, we're deliberately going to a selection.
				delete this._cursorToStart;
				// only restore the selection if the current range is collapsed
				// if not collapsed, then it means the editor does not lose
				// selection and there is no need to restore it
				if(dojo.withGlobal(this.window,'isCollapsed',dijit)){
					this._moveToBookmark(this._savedSelection);
				}
				delete this._savedSelection;
			}
		},

		onClick: function(){
			// summary:
			//		Handler for when editor is clicked
			// tags:
			//		protected
			this.endEditing(true);
			this.inherited(arguments);
		},

		replaceValue: function(/*String*/ html){
			// summary:
			//		over-ride of replaceValue to support custom undo and stack maintainence.
			// tags:
			//		protected
			if(!this.customUndo){
				this.inherited(arguments);
			}else{
				if(this.isClosed){
					this.setValue(html);
				}else{
					this.beginEditing();
					if(!html){
						html = "&nbsp;"
					}
					this.setValue(html);
					this.endEditing();
				}
			}
		},
		
		_setDisabledAttr: function(/*Boolean*/ value){
			var disableFunc = dojo.hitch(this, function(){
				if((!this.disabled && value) || (!this._buttonEnabledPlugins && value)){
				// Disable editor: disable all enabled buttons and remember that list
					dojo.forEach(this._plugins, function(p){
						p.set("disabled", true);
				});
			}else if(this.disabled && !value){
					// Restore plugins to being active.
					dojo.forEach(this._plugins, function(p){
						p.set("disabled", false);
				});
			}
			});
			this.setValueDeferred.addCallback(disableFunc);
			this.inherited(arguments);
		},
		
		_setStateClass: function(){
			try{
				this.inherited(arguments);
			
				// Let theme set the editor's text color based on editor enabled/disabled state.
				// We need to jump through hoops because the main document (where the theme CSS is)
				// is separate from the iframe's document.
				if(this.document && this.document.body){
					dojo.style(this.document.body, "color", dojo.style(this.iframe, "color"));
				}
			}catch(e){ /* Squelch any errors caused by focus change if hidden during a state change */}
		}
	}
);

// Register the "default plugins", ie, the built-in editor commands
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var args = o.args, p;
	var _p = dijit._editor._Plugin;
	var name = args.name;
	switch(name){
		case "undo": case "redo": case "cut": case "copy": case "paste": case "insertOrderedList":
		case "insertUnorderedList": case "indent": case "outdent": case "justifyCenter":
		case "justifyFull": case "justifyLeft": case "justifyRight": case "delete":
		case "selectAll": case "removeFormat": case "unlink":
		case "insertHorizontalRule":
			p = new _p({ command: name });
			break;

		case "bold": case "italic": case "underline": case "strikethrough":
		case "subscript": case "superscript":
			p = new _p({ buttonClass: dijit.form.ToggleButton, command: name });
			break;
		case "|":
			p = new _p({ button: new dijit.ToolbarSeparator(), setEditor: function(editor) {this.editor = editor;} });
	}
//	console.log('name',name,p);
	o.plugin=p;
});

}

if(!dojo._hasResource["dojo.colors"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.colors"] = true;
dojo.provide("dojo.colors");

dojo.getObject("colors", true, dojo);

//TODO: this module appears to break naming conventions

/*=====
dojo.colors = {
	// summary: Color utilities
}
=====*/

(function(){
	// this is a standard conversion prescribed by the CSS3 Color Module
	var hue2rgb = function(m1, m2, h){
		if(h < 0){ ++h; }
		if(h > 1){ --h; }
		var h6 = 6 * h;
		if(h6 < 1){ return m1 + (m2 - m1) * h6; }
		if(2 * h < 1){ return m2; }
		if(3 * h < 2){ return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
		return m1;
	};
	
	dojo.colorFromRgb = function(/*String*/ color, /*dojo.Color?*/ obj){
		// summary:
		//		get rgb(a) array from css-style color declarations
		// description:
		//		this function can handle all 4 CSS3 Color Module formats: rgb,
		//		rgba, hsl, hsla, including rgb(a) with percentage values.
		var m = color.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
		if(m){
			var c = m[2].split(/\s*,\s*/), l = c.length, t = m[1], a;
			if((t == "rgb" && l == 3) || (t == "rgba" && l == 4)){
				var r = c[0];
				if(r.charAt(r.length - 1) == "%"){
					// 3 rgb percentage values
					a = dojo.map(c, function(x){
						return parseFloat(x) * 2.56;
					});
					if(l == 4){ a[3] = c[3]; }
					return dojo.colorFromArray(a, obj);	// dojo.Color
				}
				return dojo.colorFromArray(c, obj);	// dojo.Color
			}
			if((t == "hsl" && l == 3) || (t == "hsla" && l == 4)){
				// normalize hsl values
				var H = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
					S = parseFloat(c[1]) / 100,
					L = parseFloat(c[2]) / 100,
					// calculate rgb according to the algorithm
					// recommended by the CSS3 Color Module
					m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
					m1 = 2 * L - m2;
				a = [
					hue2rgb(m1, m2, H + 1 / 3) * 256,
					hue2rgb(m1, m2, H) * 256,
					hue2rgb(m1, m2, H - 1 / 3) * 256,
					1
				];
				if(l == 4){ a[3] = c[3]; }
				return dojo.colorFromArray(a, obj);	// dojo.Color
			}
		}
		return null;	// dojo.Color
	};
	
	var confine = function(c, low, high){
		// summary:
		//		sanitize a color component by making sure it is a number,
		//		and clamping it to valid values
		c = Number(c);
		return isNaN(c) ? high : c < low ? low : c > high ? high : c;	// Number
	};
	
	dojo.Color.prototype.sanitize = function(){
		// summary: makes sure that the object has correct attributes
		var t = this;
		t.r = Math.round(confine(t.r, 0, 255));
		t.g = Math.round(confine(t.g, 0, 255));
		t.b = Math.round(confine(t.b, 0, 255));
		t.a = confine(t.a, 0, 1);
		return this;	// dojo.Color
	};
})();


dojo.colors.makeGrey = function(/*Number*/ g, /*Number?*/ a){
	// summary: creates a greyscale color with an optional alpha
	return dojo.colorFromArray([g, g, g, a]);
};

// mixin all CSS3 named colors not already in _base, along with SVG 1.0 variant spellings
dojo.mixin(dojo.Color.named, {
	aliceblue:	[240,248,255],
	antiquewhite:	[250,235,215],
	aquamarine:	[127,255,212],
	azure:	[240,255,255],
	beige:	[245,245,220],
	bisque:	[255,228,196],
	blanchedalmond:	[255,235,205],
	blueviolet:	[138,43,226],
	brown:	[165,42,42],
	burlywood:	[222,184,135],
	cadetblue:	[95,158,160],
	chartreuse:	[127,255,0],
	chocolate:	[210,105,30],
	coral:	[255,127,80],
	cornflowerblue:	[100,149,237],
	cornsilk:	[255,248,220],
	crimson:	[220,20,60],
	cyan:	[0,255,255],
	darkblue:	[0,0,139],
	darkcyan:	[0,139,139],
	darkgoldenrod:	[184,134,11],
	darkgray:	[169,169,169],
	darkgreen:	[0,100,0],
	darkgrey:	[169,169,169],
	darkkhaki:	[189,183,107],
	darkmagenta:	[139,0,139],
	darkolivegreen:	[85,107,47],
	darkorange:	[255,140,0],
	darkorchid:	[153,50,204],
	darkred:	[139,0,0],
	darksalmon:	[233,150,122],
	darkseagreen:	[143,188,143],
	darkslateblue:	[72,61,139],
	darkslategray:	[47,79,79],
	darkslategrey:	[47,79,79],
	darkturquoise:	[0,206,209],
	darkviolet:	[148,0,211],
	deeppink:	[255,20,147],
	deepskyblue:	[0,191,255],
	dimgray:	[105,105,105],
	dimgrey:	[105,105,105],
	dodgerblue:	[30,144,255],
	firebrick:	[178,34,34],
	floralwhite:	[255,250,240],
	forestgreen:	[34,139,34],
	gainsboro:	[220,220,220],
	ghostwhite:	[248,248,255],
	gold:	[255,215,0],
	goldenrod:	[218,165,32],
	greenyellow:	[173,255,47],
	grey:	[128,128,128],
	honeydew:	[240,255,240],
	hotpink:	[255,105,180],
	indianred:	[205,92,92],
	indigo:	[75,0,130],
	ivory:	[255,255,240],
	khaki:	[240,230,140],
	lavender:	[230,230,250],
	lavenderblush:	[255,240,245],
	lawngreen:	[124,252,0],
	lemonchiffon:	[255,250,205],
	lightblue:	[173,216,230],
	lightcoral:	[240,128,128],
	lightcyan:	[224,255,255],
	lightgoldenrodyellow:	[250,250,210],
	lightgray:	[211,211,211],
	lightgreen:	[144,238,144],
	lightgrey:	[211,211,211],
	lightpink:	[255,182,193],
	lightsalmon:	[255,160,122],
	lightseagreen:	[32,178,170],
	lightskyblue:	[135,206,250],
	lightslategray:	[119,136,153],
	lightslategrey:	[119,136,153],
	lightsteelblue:	[176,196,222],
	lightyellow:	[255,255,224],
	limegreen:	[50,205,50],
	linen:	[250,240,230],
	magenta:	[255,0,255],
	mediumaquamarine:	[102,205,170],
	mediumblue:	[0,0,205],
	mediumorchid:	[186,85,211],
	mediumpurple:	[147,112,219],
	mediumseagreen:	[60,179,113],
	mediumslateblue:	[123,104,238],
	mediumspringgreen:	[0,250,154],
	mediumturquoise:	[72,209,204],
	mediumvioletred:	[199,21,133],
	midnightblue:	[25,25,112],
	mintcream:	[245,255,250],
	mistyrose:	[255,228,225],
	moccasin:	[255,228,181],
	navajowhite:	[255,222,173],
	oldlace:	[253,245,230],
	olivedrab:	[107,142,35],
	orange:	[255,165,0],
	orangered:	[255,69,0],
	orchid:	[218,112,214],
	palegoldenrod:	[238,232,170],
	palegreen:	[152,251,152],
	paleturquoise:	[175,238,238],
	palevioletred:	[219,112,147],
	papayawhip:	[255,239,213],
	peachpuff:	[255,218,185],
	peru:	[205,133,63],
	pink:	[255,192,203],
	plum:	[221,160,221],
	powderblue:	[176,224,230],
	rosybrown:	[188,143,143],
	royalblue:	[65,105,225],
	saddlebrown:	[139,69,19],
	salmon:	[250,128,114],
	sandybrown:	[244,164,96],
	seagreen:	[46,139,87],
	seashell:	[255,245,238],
	sienna:	[160,82,45],
	skyblue:	[135,206,235],
	slateblue:	[106,90,205],
	slategray:	[112,128,144],
	slategrey:	[112,128,144],
	snow:	[255,250,250],
	springgreen:	[0,255,127],
	steelblue:	[70,130,180],
	tan:	[210,180,140],
	thistle:	[216,191,216],
	tomato:	[255,99,71],
	transparent: [0, 0, 0, 0],
	turquoise:	[64,224,208],
	violet:	[238,130,238],
	wheat:	[245,222,179],
	whitesmoke:	[245,245,245],
	yellowgreen:	[154,205,50]
});

}

if(!dojo._hasResource["dijit._PaletteMixin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._PaletteMixin"] = true;
dojo.provide("dijit._PaletteMixin");



dojo.declare("dijit._PaletteMixin",
	[dijit._CssStateMixin],
	{
	// summary:
	//		A keyboard accessible palette, for picking a color/emoticon/etc.
	// description:
	//		A mixin for a grid showing various entities, so the user can pick a certain entity.

	// defaultTimeout: Number
	//		Number of milliseconds before a held key or button becomes typematic
	defaultTimeout: 500,

	// timeoutChangeRate: Number
	//		Fraction of time used to change the typematic timer between events
	//		1.0 means that each typematic event fires at defaultTimeout intervals
	//		< 1.0 means that each typematic event fires at an increasing faster rate
	timeoutChangeRate: 0.90,

	// value: String
	//		Currently selected color/emoticon/etc.
	value: null,
	
	// _selectedCell: [private] Integer
	//		Index of the currently selected cell. Initially, none selected
	_selectedCell: -1,

/*=====
	// _currentFocus: [private] DomNode
	//		The currently focused cell (if the palette itself has focus), or otherwise
	//		the cell to be focused when the palette itself gets focus.
	//		Different from value, which represents the selected (i.e. clicked) cell.
	_currentFocus: null,
=====*/

/*=====
	// _xDim: [protected] Integer
	//		This is the number of cells horizontally across.
	_xDim: null,
=====*/

/*=====
	// _yDim: [protected] Integer
	//		This is the number of cells vertically down.
	_yDim: null,
=====*/

	// tabIndex: String
	//		Widget tab index.
	tabIndex: "0",

	// cellClass: [protected] String
	//		CSS class applied to each cell in the palette
	cellClass: "dijitPaletteCell",

	// dyeClass: [protected] String
	//	 Name of javascript class for Object created for each cell of the palette.
	//	 dyeClass should implements dijit.Dye interface
	dyeClass: '',

	_preparePalette: function(choices, titles) {
		// summary:
		//		Subclass must call _preparePalette() from postCreate(), passing in the tooltip
		//		for each cell
		// choices: String[][]
		//		id's for each cell of the palette, used to create Dye JS object for each cell
		// titles: String[]
		//		Localized tooltip for each cell

		this._cells = [];
		var url = this._blankGif;
		
		var dyeClassObj = dojo.getObject(this.dyeClass);

		for(var row=0; row < choices.length; row++){
			var rowNode = dojo.create("tr", {tabIndex: "-1"}, this.gridNode);
			for(var col=0; col < choices[row].length; col++){
				var value = choices[row][col];
				if(value){
					var cellObject = new dyeClassObj(value);
					
					var cellNode = dojo.create("td", {
						"class": this.cellClass,
						tabIndex: "-1",
						title: titles[value]
					});

					// prepare cell inner structure
					cellObject.fillCell(cellNode, url);

					this.connect(cellNode, "ondijitclick", "_onCellClick");
					this._trackMouseState(cellNode, this.cellClass);

					dojo.place(cellNode, rowNode);

					cellNode.index = this._cells.length;

					// save cell info into _cells
					this._cells.push({node:cellNode, dye:cellObject});
				}
			}
		}
		this._xDim = choices[0].length;
		this._yDim = choices.length;

		// Now set all events
		// The palette itself is navigated to with the tab key on the keyboard
		// Keyboard navigation within the Palette is with the arrow keys
		// Spacebar selects the cell.
		// For the up key the index is changed by negative the x dimension.

		var keyIncrementMap = {
			UP_ARROW: -this._xDim,
			// The down key the index is increase by the x dimension.
			DOWN_ARROW: this._xDim,
			// Right and left move the index by 1.
			RIGHT_ARROW: this.isLeftToRight() ? 1 : -1,
			LEFT_ARROW: this.isLeftToRight() ? -1 : 1
		};
		for(var key in keyIncrementMap){
			this._connects.push(
				dijit.typematic.addKeyListener(
					this.domNode,
					{charOrCode:dojo.keys[key], ctrlKey:false, altKey:false, shiftKey:false},
					this,
					function(){
						var increment = keyIncrementMap[key];
						return function(count){ this._navigateByKey(increment, count); };
					}(),
					this.timeoutChangeRate,
					this.defaultTimeout
				)
			);
		}
	},

	postCreate: function(){
		this.inherited(arguments);

		// Set initial navigable node.
		this._setCurrent(this._cells[0].node);
	},

	focus: function(){
		// summary:
		//		Focus this widget.  Puts focus on the most recently focused cell.

		// The cell already has tabIndex set, just need to set CSS and focus it
		dijit.focus(this._currentFocus);
	},

	_onCellClick: function(/*Event*/ evt){
		// summary:
		//		Handler for click, enter key & space key. Selects the cell.
		// evt:
		//		The event.
		// tags:
		//		private

		var target = evt.currentTarget,
			value = this._getDye(target).getValue();

		// First focus the clicked cell, and then send onChange() notification.
		// onChange() (via _setValueAttr) must be after the focus call, because
		// it may trigger a refocus to somewhere else (like the Editor content area), and that
		// second focus should win.
		// Use setTimeout because IE doesn't like changing focus inside of an event handler.
		this._setCurrent(target);
		setTimeout(dojo.hitch(this, function(){
			dijit.focus(target);
			this._setValueAttr(value, true);
		}));

		// workaround bug where hover class is not removed on popup because the popup is
		// closed and then there's no onblur event on the cell
		dojo.removeClass(target, "dijitPaletteCellHover");

		dojo.stopEvent(evt);
	},

	_setCurrent: function(/*DomNode*/ node){
		// summary:
		//		Sets which node is the focused cell.
		// description:
   		//		At any point in time there's exactly one
		//		cell with tabIndex != -1.   If focus is inside the palette then
		// 		focus is on that cell.
		//
		//		After calling this method, arrow key handlers and mouse click handlers
		//		should focus the cell in a setTimeout().
		// tags:
		//		protected
		if("_currentFocus" in this){
			// Remove tabIndex on old cell
			dojo.attr(this._currentFocus, "tabIndex", "-1");
		}

		// Set tabIndex of new cell
		this._currentFocus = node;
		if(node){
			dojo.attr(node, "tabIndex", this.tabIndex);
		}
	},

	_setValueAttr: function(value, priorityChange){
		// summary:
		// 		This selects a cell. It triggers the onChange event.
		// value: String value of the cell to select
		// tags:
		//		protected
		// priorityChange:
		//		Optional parameter used to tell the select whether or not to fire
		//		onChange event.
		
		// clear old selected cell
		if(this._selectedCell >= 0){
			dojo.removeClass(this._cells[this._selectedCell].node, "dijitPaletteCellSelected");
		}
		this._selectedCell = -1;

		// search for cell matching specified value
		if(value){
			for(var i = 0; i < this._cells.length; i++){
				if(value == this._cells[i].dye.getValue()){
					this._selectedCell = i;

					dojo.addClass(this._cells[i].node, "dijitPaletteCellSelected");

					if(priorityChange || priorityChange === undefined){
						this.onChange(value);
					}

					break;
				}
			}
		}
		
		// record new value, or null if no matching cell
		this._set("value", this._selectedCell >= 0 ? value : null);
	},

	onChange: function(value){
		// summary:
		//		Callback when a cell is selected.
		// value: String
		//		Value corresponding to cell.
	},

	_navigateByKey: function(increment, typeCount){
		// summary:
		// 	  	This is the callback for typematic.
		// 		It changes the focus and the highlighed cell.
		// increment:
		// 		How much the key is navigated.
		// typeCount:
		//		How many times typematic has fired.
		// tags:
		//		private

		// typecount == -1 means the key is released.
		if(typeCount == -1){ return; }

		var newFocusIndex = this._currentFocus.index + increment;
		if(newFocusIndex < this._cells.length && newFocusIndex > -1){
			var focusNode = this._cells[newFocusIndex].node;
			this._setCurrent(focusNode);

			// Actually focus the node, for the benefit of screen readers.
			// Use setTimeout because IE doesn't like changing focus inside of an event handler
			setTimeout(dojo.hitch(dijit, "focus", focusNode), 0);
		}
	},

	_getDye: function(/*DomNode*/ cell){
		// summary:
		//		Get JS object for given cell DOMNode

		return this._cells[cell.index].dye;
	}
});

/*=====
dojo.declare("dijit.Dye",
	null,
	{
		// summary:
		//		Interface for the JS Object associated with a palette cell (i.e. DOMNode)

		constructor: function(alias){
			// summary:
			//		Initialize according to value or alias like "white"
			// alias: String
		},

		getValue: function(){
			// summary:
			//		Return "value" of cell; meaning of "value" varies by subclass.
			// description:
			//		For example color hex value, emoticon ascii value etc, entity hex value.
		},

		fillCell: function(cell, blankGif){
			// summary:
			//		Add cell DOMNode inner structure
			//	cell: DomNode
			//		The surrounding cell
			//	blankGif: String
			//		URL for blank cell image
		}
	}
);
=====*/

}

if(!dojo._hasResource["dijit.ColorPalette"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.ColorPalette"] = true;
dojo.provide("dijit.ColorPalette");








dojo.declare("dijit.ColorPalette",
	[dijit._Widget, dijit._Templated, dijit._PaletteMixin],
	{
	// summary:
	//		A keyboard accessible color-picking widget
	// description:
	//		Grid showing various colors, so the user can pick a certain color.
	//		Can be used standalone, or as a popup.
	//
	// example:
	// |	<div dojoType="dijit.ColorPalette"></div>
	//
	// example:
	// |	var picker = new dijit.ColorPalette({ },srcNode);
	// |	picker.startup();


	// palette: [const] String
	//		Size of grid, either "7x10" or "3x4".
	palette: "7x10",

	// _palettes: [protected] Map
	// 		This represents the value of the colors.
	//		The first level is a hashmap of the different palettes available.
	//		The next two dimensions represent the columns and rows of colors.
	_palettes: {
		"7x10":	[["white", "seashell", "cornsilk", "lemonchiffon","lightyellow", "palegreen", "paleturquoise", "lightcyan",	"lavender", "plum"],
				["lightgray", "pink", "bisque", "moccasin", "khaki", "lightgreen", "lightseagreen", "lightskyblue", "cornflowerblue", "violet"],
				["silver", "lightcoral", "sandybrown", "orange", "palegoldenrod", "chartreuse", "mediumturquoise", 	"skyblue", "mediumslateblue","orchid"],
				["gray", "red", "orangered", "darkorange", "yellow", "limegreen", 	"darkseagreen", "royalblue", "slateblue", "mediumorchid"],
				["dimgray", "crimson", 	"chocolate", "coral", "gold", "forestgreen", "seagreen", "blue", "blueviolet", "darkorchid"],
				["darkslategray","firebrick","saddlebrown", "sienna", "olive", "green", "darkcyan", "mediumblue","darkslateblue", "darkmagenta" ],
				["black", "darkred", "maroon", "brown", "darkolivegreen", "darkgreen", "midnightblue", "navy", "indigo", 	"purple"]],

		"3x4": [["white", "lime", "green", "blue"],
			["silver", "yellow", "fuchsia", "navy"],
			["gray", "red", "purple", "black"]]
	},

	// _imagePaths: [protected] Map
	//		This is stores the path to the palette images
	_imagePaths: {
		"7x10": dojo.moduleUrl("dijit.themes", "a11y/colors7x10.png"),
		"3x4": dojo.moduleUrl("dijit.themes", "a11y/colors3x4.png"),
		"7x10-rtl": dojo.moduleUrl("dijit.themes", "a11y/colors7x10-rtl.png"),
		"3x4-rtl": dojo.moduleUrl("dijit.themes", "a11y/colors3x4-rtl.png")
	},

	// templateString: String
	//		The template of this widget.
	templateString: dojo.cache("dijit", "templates/ColorPalette.html", "<div class=\"dijitInline dijitColorPalette\">\n\t<img class=\"dijitColorPaletteUnder\" dojoAttachPoint=\"imageNode\" role=\"presentation\" alt=\"\"/>\n\t<table class=\"dijitPaletteTable\" cellSpacing=\"0\" cellPadding=\"0\">\n\t\t<tbody dojoAttachPoint=\"gridNode\"></tbody>\n\t</table>\n</div>\n"),

	baseClass: "dijitColorPalette",

	dyeClass: 'dijit._Color',

	buildRendering: function(){
		// Instantiate the template, which makes a skeleton into which we'll insert a bunch of
		// <img> nodes

		this.inherited(arguments);

		this.imageNode.setAttribute("src", this._imagePaths[this.palette + (this.isLeftToRight() ? "" : "-rtl")].toString());

		var i18nColorNames = dojo.i18n.getLocalization("dojo", "colors", this.lang);
		this._preparePalette(
			this._palettes[this.palette],
			i18nColorNames
		);
	}
});

dojo.declare("dijit._Color", dojo.Color,
	// summary:
	//		Object associated with each cell in a ColorPalette palette.
	//		Implements dijit.Dye.
	{
		constructor: function(/*String*/alias){
			this._alias = alias;
			this.setColor(dojo.Color.named[alias]);
		},

		getValue: function(){
			// summary:
			//		Note that although dijit._Color is initialized with a value like "white" getValue() always
			//		returns a hex value
			return this.toHex();
		},

		fillCell: function(/*DOMNode*/ cell, /*String*/ blankGif){
			dojo.create("img", {
				src: blankGif,
				"class": "dijitPaletteImg",
				alt: this._alias
			}, cell);
		}
	}
);

}

if(!dojo._hasResource["dijit.ProgressBar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.ProgressBar"] = true;
dojo.provide("dijit.ProgressBar");






dojo.declare("dijit.ProgressBar", [dijit._Widget, dijit._Templated], {
	// summary:
	//		A progress indication widget, showing the amount completed
	//		(often the percentage completed) of a task.
	//
	// example:
	// |	<div dojoType="ProgressBar"
	// |		 places="0"
	// |		 value="..." maximum="...">
	// |	</div>

	// progress: [const] String (Percentage or Number)
	//		Number or percentage indicating amount of task completed.
	// 		Deprecated.   Use "value" instead.
	progress: "0",

	// value: String (Percentage or Number)
	//		Number or percentage indicating amount of task completed.
	// 		With "%": percentage value, 0% <= progress <= 100%, or
	// 		without "%": absolute value, 0 <= progress <= maximum.
	//		Infinity means that the progress bar is indeterminate.
	value: "",

	// maximum: [const] Float
	//		Max sample number
	maximum: 100,

	// places: [const] Number
	//		Number of places to show in values; 0 by default
	places: 0,

	// indeterminate: [const] Boolean
	// 		If false: show progress value (number or percentage).
	// 		If true: show that a process is underway but that the amount completed is unknown.
	// 		Deprecated.   Use "value" instead.
	indeterminate: false,

	// label: String?
	//		Label on progress bar.   Defaults to percentage for determinate progress bar and
	//		blank for indeterminate progress bar.
	label:"",

	// name: String
	//		this is the field name (for a form) if set. This needs to be set if you want to use
	//		this widget in a dijit.form.Form widget (such as dijit.Dialog)
	name: '',

	templateString: dojo.cache("dijit", "templates/ProgressBar.html", "<div class=\"dijitProgressBar dijitProgressBarEmpty\" role=\"progressbar\"\n\t><div  dojoAttachPoint=\"internalProgress\" class=\"dijitProgressBarFull\"\n\t\t><div class=\"dijitProgressBarTile\" role=\"presentation\"></div\n\t\t><span style=\"visibility:hidden\">&nbsp;</span\n\t></div\n\t><div dojoAttachPoint=\"labelNode\" class=\"dijitProgressBarLabel\" id=\"${id}_label\"></div\n\t><img dojoAttachPoint=\"indeterminateHighContrastImage\" class=\"dijitProgressBarIndeterminateHighContrastImage\" alt=\"\"\n/></div>\n"),

	// _indeterminateHighContrastImagePath: [private] dojo._URL
	//		URL to image to use for indeterminate progress bar when display is in high contrast mode
	_indeterminateHighContrastImagePath:
		dojo.moduleUrl("dijit", "themes/a11y/indeterminate_progress.gif"),

	postMixInProperties: function(){
		this.inherited(arguments);
		if(!("value" in this.params)){
			this.value = this.indeterminate ? Infinity : this.progress;
		}
	},

	buildRendering: function(){
		this.inherited(arguments);
		this.indeterminateHighContrastImage.setAttribute("src",
			this._indeterminateHighContrastImagePath.toString());
		this.update();
	},

	update: function(/*Object?*/attributes){
		// summary:
		//		Internal method to change attributes of ProgressBar, similar to set(hash).  Users should call
		//		set("value", ...) rather than calling this method directly.
		// attributes:
		//		May provide progress and/or maximum properties on this parameter;
		//		see attribute specs for details.
		// example:
		//	|	myProgressBar.update({'indeterminate': true});
		//	|	myProgressBar.update({'progress': 80});
		//	|	myProgressBar.update({'indeterminate': true, label:"Loading ..." })
		// tags:
		//		private

		// TODO: deprecate this method and use set() instead

		dojo.mixin(this, attributes || {});
		var tip = this.internalProgress, ap = this.domNode;
		var percent = 1;
		if(this.indeterminate){
			dijit.removeWaiState(ap, "valuenow");
			dijit.removeWaiState(ap, "valuemin");
			dijit.removeWaiState(ap, "valuemax");
		}else{
			if(String(this.progress).indexOf("%") != -1){
				percent = Math.min(parseFloat(this.progress)/100, 1);
				this.progress = percent * this.maximum;
			}else{
				this.progress = Math.min(this.progress, this.maximum);
				percent = this.progress / this.maximum;
			}

			dijit.setWaiState(ap, "describedby", this.labelNode.id);
			dijit.setWaiState(ap, "valuenow", this.progress);
			dijit.setWaiState(ap, "valuemin", 0);
			dijit.setWaiState(ap, "valuemax", this.maximum);
		}
		this.labelNode.innerHTML = this.report(percent);

		dojo.toggleClass(this.domNode, "dijitProgressBarIndeterminate", this.indeterminate);
		tip.style.width = (percent * 100) + "%";
		this.onChange();
	},

	_setValueAttr: function(v){
		this._set("value", v);
		if(v == Infinity){
			this.update({indeterminate:true});
		}else{
			this.update({indeterminate:false, progress:v});
		}
	},

	_setLabelAttr: function(label){
		this._set("label", label);
		this.update();
	},

	_setIndeterminateAttr: function(indeterminate){
		// Deprecated, use set("value", ...) instead
		this.indeterminate = indeterminate;
		this.update();
	},

	report: function(/*float*/percent){
		// summary:
		//		Generates message to show inside progress bar (normally indicating amount of task completed).
		//		May be overridden.
		// tags:
		//		extension

		return this.label ? this.label :
				(this.indeterminate ? "&nbsp;" : dojo.number.format(percent, { type: "percent", places: this.places, locale: this.lang }));
	},

	onChange: function(){
		// summary:
		//		Callback fired when progress updates.
		// tags:
		//		extension
	}
});

}

if(!dojo._hasResource["dijit.TitlePane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.TitlePane"] = true;
dojo.provide("dijit.TitlePane");






dojo.declare(
	"dijit.TitlePane",
	[dijit.layout.ContentPane, dijit._Templated, dijit._CssStateMixin],
{
	// summary:
	//		A pane with a title on top, that can be expanded or collapsed.
	//
	// description:
	//		An accessible container with a title Heading, and a content
	//		section that slides open and closed. TitlePane is an extension to
	//		`dijit.layout.ContentPane`, providing all the useful content-control aspects from it.
	//
	// example:
	// | 	// load a TitlePane from remote file:
	// |	var foo = new dijit.TitlePane({ href: "foobar.html", title:"Title" });
	// |	foo.startup();
	//
	// example:
	// |	<!-- markup href example: -->
	// |	<div dojoType="dijit.TitlePane" href="foobar.html" title="Title"></div>
	//
	// example:
	// |	<!-- markup with inline data -->
	// | 	<div dojoType="dijit.TitlePane" title="Title">
	// |		<p>I am content</p>
	// |	</div>

	// title: String
	//		Title of the pane
	title: "",

	// open: Boolean
	//		Whether pane is opened or closed.
	open: true,

	// toggleable: Boolean
	//		Whether pane can be opened or closed by clicking the title bar.
	toggleable: true,

	// tabIndex: String
	//		Tabindex setting for the title (so users can tab to the title then
	//		use space/enter to open/close the title pane)
	tabIndex: "0",

	// duration: Integer
	//		Time in milliseconds to fade in/fade out
	duration: dijit.defaultDuration,

	// baseClass: [protected] String
	//		The root className to be placed on this widget's domNode.
	baseClass: "dijitTitlePane",

	templateString: dojo.cache("dijit", "templates/TitlePane.html", "<div>\n\t<div dojoAttachEvent=\"onclick:_onTitleClick, onkeypress:_onTitleKey\"\n\t\t\tclass=\"dijitTitlePaneTitle\" dojoAttachPoint=\"titleBarNode\">\n\t\t<div class=\"dijitTitlePaneTitleFocus\" dojoAttachPoint=\"focusNode\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint=\"arrowNode\" class=\"dijitArrowNode\" role=\"presentation\"\n\t\t\t/><span dojoAttachPoint=\"arrowNodeInner\" class=\"dijitArrowNodeInner\"></span\n\t\t\t><span dojoAttachPoint=\"titleNode\" class=\"dijitTitlePaneTextNode\"></span>\n\t\t</div>\n\t</div>\n\t<div class=\"dijitTitlePaneContentOuter\" dojoAttachPoint=\"hideNode\" role=\"presentation\">\n\t\t<div class=\"dijitReset\" dojoAttachPoint=\"wipeNode\" role=\"presentation\">\n\t\t\t<div class=\"dijitTitlePaneContentInner\" dojoAttachPoint=\"containerNode\" role=\"region\" id=\"${id}_pane\">\n\t\t\t\t<!-- nested divs because wipeIn()/wipeOut() doesn't work right on node w/padding etc.  Put padding on inner div. -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"),

	attributeMap: dojo.delegate(dijit.layout.ContentPane.prototype.attributeMap, {
		title: { node: "titleNode", type: "innerHTML" },
		tooltip: {node: "focusNode", type: "attribute", attribute: "title"},	// focusNode spans the entire width, titleNode doesn't
		id:""
	}),

	buildRendering: function(){
		this.inherited(arguments);
		dojo.setSelectable(this.titleNode, false);
	},

	postCreate: function(){
		this.inherited(arguments);
		
		// Hover and focus effect on title bar, except for non-toggleable TitlePanes
		// This should really be controlled from _setToggleableAttr() but _CssStateMixin
		// doesn't provide a way to disconnect a previous _trackMouseState() call
		if(this.toggleable){
			this._trackMouseState(this.titleBarNode, "dijitTitlePaneTitle");
		}

		// setup open/close animations
		var hideNode = this.hideNode, wipeNode = this.wipeNode;
		this._wipeIn = dojo.fx.wipeIn({
			node: this.wipeNode,
			duration: this.duration,
			beforeBegin: function(){
				hideNode.style.display="";
			}
		});
		this._wipeOut = dojo.fx.wipeOut({
			node: this.wipeNode,
			duration: this.duration,
			onEnd: function(){
				hideNode.style.display="none";
			}
		});
	},

	_setOpenAttr: function(/*Boolean*/ open, /*Boolean*/ animate){
		// summary:
		//		Hook to make set("open", boolean) control the open/closed state of the pane.
		// open: Boolean
		//		True if you want to open the pane, false if you want to close it.

		dojo.forEach([this._wipeIn, this._wipeOut], function(animation){
			if(animation && animation.status() == "playing"){
				animation.stop();
			}
		});

		if(animate){
			var anim = this[open ? "_wipeIn" : "_wipeOut"];
			anim.play();
		}else{
			this.hideNode.style.display = this.wipeNode.style.display = open ? "" : "none";
		}

		// load content (if this is the first time we are opening the TitlePane
		// and content is specified as an href, or href was set when hidden)
		if(this._started){
			if(open){
				this._onShow();
			}else{
				this.onHide();
			}
		}

		this.arrowNodeInner.innerHTML = open ? "-" : "+";

		dijit.setWaiState(this.containerNode,"hidden", open ? "false" : "true");
		dijit.setWaiState(this.focusNode, "pressed", open ? "true" : "false");

		this._set("open", open);

		this._setCss();
	},

	_setToggleableAttr: function(/*Boolean*/ canToggle){
		// summary:
		//		Hook to make set("toggleable", boolean) work.
		// canToggle: Boolean
		//		True to allow user to open/close pane by clicking title bar.

		dijit.setWaiRole(this.focusNode, canToggle ? "button" : "heading");
		if(canToggle){
			// TODO: if canToggle is switched from true to false shouldn't we remove this setting?
			dijit.setWaiState(this.focusNode, "controls", this.id+"_pane");
			dojo.attr(this.focusNode, "tabIndex", this.tabIndex);
		}else{
			dojo.removeAttr(this.focusNode, "tabIndex");
		}

		this._set("toggleable", canToggle);

		this._setCss();
	},

	_setContentAttr: function(/*String|DomNode|Nodelist*/ content){
		// summary:
		//		Hook to make set("content", ...) work.
		// 		Typically called when an href is loaded.  Our job is to make the animation smooth.

		if(!this.open || !this._wipeOut || this._wipeOut.status() == "playing"){
			// we are currently *closing* the pane (or the pane is closed), so just let that continue
			this.inherited(arguments);
		}else{
			if(this._wipeIn && this._wipeIn.status() == "playing"){
				this._wipeIn.stop();
			}

			// freeze container at current height so that adding new content doesn't make it jump
			dojo.marginBox(this.wipeNode, { h: dojo.marginBox(this.wipeNode).h });

			// add the new content (erasing the old content, if any)
			this.inherited(arguments);

			// call _wipeIn.play() to animate from current height to new height
			if(this._wipeIn){
				this._wipeIn.play();
			}else{
				this.hideNode.style.display = "";
			}
		}
	},

	toggle: function(){
		// summary:
		//		Switches between opened and closed state
		// tags:
		//		private

		this._setOpenAttr(!this.open, true);
	},

	_setCss: function(){
		// summary:
		//		Set the open/close css state for the TitlePane
		// tags:
		//		private

		var node = this.titleBarNode || this.focusNode;
		var oldCls = this._titleBarClass;
		this._titleBarClass = "dijit" + (this.toggleable ? "" : "Fixed") + (this.open ? "Open" : "Closed");
		dojo.replaceClass(node, this._titleBarClass, oldCls || "");

		this.arrowNodeInner.innerHTML = this.open ? "-" : "+";
	},

	_onTitleKey: function(/*Event*/ e){
		// summary:
		//		Handler for when user hits a key
		// tags:
		//		private

		if(e.charOrCode == dojo.keys.ENTER || e.charOrCode == ' '){
			if(this.toggleable){
				this.toggle();
			}
			dojo.stopEvent(e);
		}else if(e.charOrCode == dojo.keys.DOWN_ARROW && this.open){
			this.containerNode.focus();
			e.preventDefault();
	 	}
	},

	_onTitleClick: function(){
		// summary:
		//		Handler when user clicks the title bar
		// tags:
		//		private
		if(this.toggleable){
			this.toggle();
		}
	},

	setTitle: function(/*String*/ title){
		// summary:
		//		Deprecated.  Use set('title', ...) instead.
		// tags:
		//		deprecated
		dojo.deprecated("dijit.TitlePane.setTitle() is deprecated.  Use set('title', ...) instead.", "", "2.0");
		this.set("title", title);
	}
});

}

if(!dojo._hasResource["dojo.dnd.Container"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Container"] = true;
dojo.provide("dojo.dnd.Container");




/*
	Container states:
		""		- normal state
		"Over"	- mouse over a container
	Container item states:
		""		- normal state
		"Over"	- mouse over a container item
*/

/*=====
dojo.declare("dojo.dnd.__ContainerArgs", [], {
	creator: function(){
		// summary:
		//		a creator function, which takes a data item, and returns an object like that:
		//		{node: newNode, data: usedData, type: arrayOfStrings}
	},

	// skipForm: Boolean
	//		don't start the drag operation, if clicked on form elements
	skipForm: false,

	// dropParent: Node||String
	//		node or node's id to use as the parent node for dropped items
	//		(must be underneath the 'node' parameter in the DOM)
	dropParent: null,

	// _skipStartup: Boolean
	//		skip startup(), which collects children, for deferred initialization
	//		(this is used in the markup mode)
	_skipStartup: false
});

dojo.dnd.Item = function(){
	// summary:
	//		Represents (one of) the source node(s) being dragged.
	//		Contains (at least) the "type" and "data" attributes.
	// type: String[]
	//		Type(s) of this item, by default this is ["text"]
	// data: Object
	//		Logical representation of the object being dragged.
	//		If the drag object's type is "text" then data is a String,
	//		if it's another type then data could be a different Object,
	//		perhaps a name/value hash.
	
	this.type = type;
	this.data = data;
}
=====*/

dojo.declare("dojo.dnd.Container", null, {
	// summary:
	//		a Container object, which knows when mouse hovers over it,
	//		and over which element it hovers
	
	// object attributes (for markup)
	skipForm: false,
	
	/*=====
	// current: DomNode
	//		The DOM node the mouse is currently hovered over
	current: null,
	
	// map: Hash<String, dojo.dnd.Item>
	//		Map from an item's id (which is also the DOMNode's id) to
	//		the dojo.dnd.Item itself.
	map: {},
	=====*/
	
	constructor: function(node, params){
		// summary:
		//		a constructor of the Container
		// node: Node
		//		node or node's id to build the container on
		// params: dojo.dnd.__ContainerArgs
		//		a dictionary of parameters
		this.node = dojo.byId(node);
		if(!params){ params = {}; }
		this.creator = params.creator || null;
		this.skipForm = params.skipForm;
		this.parent = params.dropParent && dojo.byId(params.dropParent);
		
		// class-specific variables
		this.map = {};
		this.current = null;

		// states
		this.containerState = "";
		dojo.addClass(this.node, "dojoDndContainer");
		
		// mark up children
		if(!(params && params._skipStartup)){
			this.startup();
		}

		// set up events
		this.events = [
			dojo.connect(this.node, "onmouseover", this, "onMouseOver"),
			dojo.connect(this.node, "onmouseout",  this, "onMouseOut"),
			// cancel text selection and text dragging
			dojo.connect(this.node, "ondragstart",   this, "onSelectStart"),
			dojo.connect(this.node, "onselectstart", this, "onSelectStart")
		];
	},
	
	// object attributes (for markup)
	creator: function(){
		// summary:
		//		creator function, dummy at the moment
	},
	
	// abstract access to the map
	getItem: function(/*String*/ key){
		// summary:
		//		returns a data item by its key (id)
		return this.map[key];	// dojo.dnd.Item
	},
	setItem: function(/*String*/ key, /*dojo.dnd.Item*/ data){
		// summary:
		//		associates a data item with its key (id)
		this.map[key] = data;
	},
	delItem: function(/*String*/ key){
		// summary:
		//		removes a data item from the map by its key (id)
		delete this.map[key];
	},
	forInItems: function(/*Function*/ f, /*Object?*/ o){
		// summary:
		//		iterates over a data map skipping members that
		//		are present in the empty object (IE and/or 3rd-party libraries).
		o = o || dojo.global;
		var m = this.map, e = dojo.dnd._empty;
		for(var i in m){
			if(i in e){ continue; }
			f.call(o, m[i], i, this);
		}
		return o;	// Object
	},
	clearItems: function(){
		// summary:
		//		removes all data items from the map
		this.map = {};
	},
	
	// methods
	getAllNodes: function(){
		// summary:
		//		returns a list (an array) of all valid child nodes
		return dojo.query("> .dojoDndItem", this.parent);	// NodeList
	},
	sync: function(){
		// summary:
		//		sync up the node list with the data map
		var map = {};
		this.getAllNodes().forEach(function(node){
			if(node.id){
				var item = this.getItem(node.id);
				if(item){
					map[node.id] = item;
					return;
				}
			}else{
				node.id = dojo.dnd.getUniqueId();
			}
			var type = node.getAttribute("dndType"),
				data = node.getAttribute("dndData");
			map[node.id] = {
				data: data || node.innerHTML,
				type: type ? type.split(/\s*,\s*/) : ["text"]
			};
		}, this);
		this.map = map;
		return this;	// self
	},
	insertNodes: function(data, before, anchor){
		// summary:
		//		inserts an array of new nodes before/after an anchor node
		// data: Array
		//		a list of data items, which should be processed by the creator function
		// before: Boolean
		//		insert before the anchor, if true, and after the anchor otherwise
		// anchor: Node
		//		the anchor node to be used as a point of insertion
		if(!this.parent.firstChild){
			anchor = null;
		}else if(before){
			if(!anchor){
				anchor = this.parent.firstChild;
			}
		}else{
			if(anchor){
				anchor = anchor.nextSibling;
			}
		}
		if(anchor){
			for(var i = 0; i < data.length; ++i){
				var t = this._normalizedCreator(data[i]);
				this.setItem(t.node.id, {data: t.data, type: t.type});
				this.parent.insertBefore(t.node, anchor);
			}
		}else{
			for(var i = 0; i < data.length; ++i){
				var t = this._normalizedCreator(data[i]);
				this.setItem(t.node.id, {data: t.data, type: t.type});
				this.parent.appendChild(t.node);
			}
		}
		return this;	// self
	},
	destroy: function(){
		// summary:
		//		prepares this object to be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		this.clearItems();
		this.node = this.parent = this.current = null;
	},

	// markup methods
	markupFactory: function(params, node){
		params._skipStartup = true;
		return new dojo.dnd.Container(node, params);
	},
	startup: function(){
		// summary:
		//		collects valid child items and populate the map
		
		// set up the real parent node
		if(!this.parent){
			// use the standard algorithm, if not assigned
			this.parent = this.node;
			if(this.parent.tagName.toLowerCase() == "table"){
				var c = this.parent.getElementsByTagName("tbody");
				if(c && c.length){ this.parent = c[0]; }
			}
		}
		this.defaultCreator = dojo.dnd._defaultCreator(this.parent);

		// process specially marked children
		this.sync();
	},

	// mouse events
	onMouseOver: function(e){
		// summary:
		//		event processor for onmouseover
		// e: Event
		//		mouse event
		var n = e.relatedTarget;
		while(n){
			if(n == this.node){ break; }
			try{
				n = n.parentNode;
			}catch(x){
				n = null;
			}
		}
		if(!n){
			this._changeState("Container", "Over");
			this.onOverEvent();
		}
		n = this._getChildByEvent(e);
		if(this.current == n){ return; }
		if(this.current){ this._removeItemClass(this.current, "Over"); }
		if(n){ this._addItemClass(n, "Over"); }
		this.current = n;
	},
	onMouseOut: function(e){
		// summary:
		//		event processor for onmouseout
		// e: Event
		//		mouse event
		for(var n = e.relatedTarget; n;){
			if(n == this.node){ return; }
			try{
				n = n.parentNode;
			}catch(x){
				n = null;
			}
		}
		if(this.current){
			this._removeItemClass(this.current, "Over");
			this.current = null;
		}
		this._changeState("Container", "");
		this.onOutEvent();
	},
	onSelectStart: function(e){
		// summary:
		//		event processor for onselectevent and ondragevent
		// e: Event
		//		mouse event
		if(!this.skipForm || !dojo.dnd.isFormElement(e)){
			dojo.stopEvent(e);
		}
	},
	
	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
	},
	_changeState: function(type, newState){
		// summary:
		//		changes a named state to new state value
		// type: String
		//		a name of the state to change
		// newState: String
		//		new state
		var prefix = "dojoDnd" + type;
		var state  = type.toLowerCase() + "State";
		//dojo.replaceClass(this.node, prefix + newState, prefix + this[state]);
		dojo.replaceClass(this.node, prefix + newState, prefix + this[state]);
		this[state] = newState;
	},
	_addItemClass: function(node, type){
		// summary:
		//		adds a class with prefix "dojoDndItem"
		// node: Node
		//		a node
		// type: String
		//		a variable suffix for a class name
		dojo.addClass(node, "dojoDndItem" + type);
	},
	_removeItemClass: function(node, type){
		// summary:
		//		removes a class with prefix "dojoDndItem"
		// node: Node
		//		a node
		// type: String
		//		a variable suffix for a class name
		dojo.removeClass(node, "dojoDndItem" + type);
	},
	_getChildByEvent: function(e){
		// summary:
		//		gets a child, which is under the mouse at the moment, or null
		// e: Event
		//		a mouse event
		var node = e.target;
		if(node){
			for(var parent = node.parentNode; parent; node = parent, parent = node.parentNode){
				if(parent == this.parent && dojo.hasClass(node, "dojoDndItem")){ return node; }
			}
		}
		return null;
	},
	_normalizedCreator: function(/*dojo.dnd.Item*/ item, /*String*/ hint){
		// summary:
		//		adds all necessary data to the output of the user-supplied creator function
		var t = (this.creator || this.defaultCreator).call(this, item, hint);
		if(!dojo.isArray(t.type)){ t.type = ["text"]; }
		if(!t.node.id){ t.node.id = dojo.dnd.getUniqueId(); }
		dojo.addClass(t.node, "dojoDndItem");
		return t;
	}
});

dojo.dnd._createNode = function(tag){
	// summary:
	//		returns a function, which creates an element of given tag
	//		(SPAN by default) and sets its innerHTML to given text
	// tag: String
	//		a tag name or empty for SPAN
	if(!tag){ return dojo.dnd._createSpan; }
	return function(text){	// Function
		return dojo.create(tag, {innerHTML: text});	// Node
	};
};

dojo.dnd._createTrTd = function(text){
	// summary:
	//		creates a TR/TD structure with given text as an innerHTML of TD
	// text: String
	//		a text for TD
	var tr = dojo.create("tr");
	dojo.create("td", {innerHTML: text}, tr);
	return tr;	// Node
};

dojo.dnd._createSpan = function(text){
	// summary:
	//		creates a SPAN element with given text as its innerHTML
	// text: String
	//		a text for SPAN
	return dojo.create("span", {innerHTML: text});	// Node
};

// dojo.dnd._defaultCreatorNodes: Object
//		a dictionary that maps container tag names to child tag names
dojo.dnd._defaultCreatorNodes = {ul: "li", ol: "li", div: "div", p: "div"};

dojo.dnd._defaultCreator = function(node){
	// summary:
	//		takes a parent node, and returns an appropriate creator function
	// node: Node
	//		a container node
	var tag = node.tagName.toLowerCase();
	var c = tag == "tbody" || tag == "thead" ? dojo.dnd._createTrTd :
			dojo.dnd._createNode(dojo.dnd._defaultCreatorNodes[tag]);
	return function(item, hint){	// Function
		var isObj = item && dojo.isObject(item), data, type, n;
		if(isObj && item.tagName && item.nodeType && item.getAttribute){
			// process a DOM node
			data = item.getAttribute("dndData") || item.innerHTML;
			type = item.getAttribute("dndType");
			type = type ? type.split(/\s*,\s*/) : ["text"];
			n = item;	// this node is going to be moved rather than copied
		}else{
			// process a DnD item object or a string
			data = (isObj && item.data) ? item.data : item;
			type = (isObj && item.type) ? item.type : ["text"];
			n = (hint == "avatar" ? dojo.dnd._createSpan : c)(String(data));
		}
		if(!n.id){
			n.id = dojo.dnd.getUniqueId();
		}
		return {node: n, data: data, type: type};
	};
};

}

if(!dojo._hasResource["dojo.dnd.Selector"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Selector"] = true;
dojo.provide("dojo.dnd.Selector");




/*
	Container item states:
		""			- an item is not selected
		"Selected"	- an item is selected
		"Anchor"	- an item is selected, and is an anchor for a "shift" selection
*/

/*=====
dojo.declare("dojo.dnd.__SelectorArgs", [dojo.dnd.__ContainerArgs], {
	//	singular: Boolean
	//		allows selection of only one element, if true
	singular: false,

	//	autoSync: Boolean
	//		autosynchronizes the source with its list of DnD nodes,
	autoSync: false
});
=====*/

dojo.declare("dojo.dnd.Selector", dojo.dnd.Container, {
	// summary:
	//		a Selector object, which knows how to select its children
	
	/*=====
	// selection: Set<String>
	//		The set of id's that are currently selected, such that this.selection[id] == 1
	//		if the node w/that id is selected.  Can iterate over selected node's id's like:
	//	|		for(var id in this.selection)
	selection: {},
	=====*/

	constructor: function(node, params){
		// summary:
		//		constructor of the Selector
		// node: Node||String
		//		node or node's id to build the selector on
		// params: dojo.dnd.__SelectorArgs?
		//		a dictionary of parameters
		if(!params){ params = {}; }
		this.singular = params.singular;
		this.autoSync = params.autoSync;
		// class-specific variables
		this.selection = {};
		this.anchor = null;
		this.simpleSelection = false;
		// set up events
		this.events.push(
			dojo.connect(this.node, "onmousedown", this, "onMouseDown"),
			dojo.connect(this.node, "onmouseup",   this, "onMouseUp"));
	},
	
	// object attributes (for markup)
	singular: false,	// is singular property
	
	// methods
	getSelectedNodes: function(){
		// summary:
		//		returns a list (an array) of selected nodes
		var t = new dojo.NodeList();
		var e = dojo.dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			t.push(dojo.byId(i));
		}
		return t;	// NodeList
	},
	selectNone: function(){
		// summary:
		//		unselects all items
		return this._removeSelection()._removeAnchor();	// self
	},
	selectAll: function(){
		// summary:
		//		selects all items
		this.forInItems(function(data, id){
			this._addItemClass(dojo.byId(id), "Selected");
			this.selection[id] = 1;
		}, this);
		return this._removeAnchor();	// self
	},
	deleteSelectedNodes: function(){
		// summary:
		//		deletes all selected items
		var e = dojo.dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			var n = dojo.byId(i);
			this.delItem(i);
			dojo.destroy(n);
		}
		this.anchor = null;
		this.selection = {};
		return this;	// self
	},
	forInSelectedItems: function(/*Function*/ f, /*Object?*/ o){
		// summary:
		//		iterates over selected items;
		//		see `dojo.dnd.Container.forInItems()` for details
		o = o || dojo.global;
		var s = this.selection, e = dojo.dnd._empty;
		for(var i in s){
			if(i in e){ continue; }
			f.call(o, this.getItem(i), i, this);
		}
	},
	sync: function(){
		// summary:
		//		sync up the node list with the data map
		
		dojo.dnd.Selector.superclass.sync.call(this);
		
		// fix the anchor
		if(this.anchor){
			if(!this.getItem(this.anchor.id)){
				this.anchor = null;
			}
		}
		
		// fix the selection
		var t = [], e = dojo.dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			if(!this.getItem(i)){
				t.push(i);
			}
		}
		dojo.forEach(t, function(i){
			delete this.selection[i];
		}, this);
		
		return this;	// self
	},
	insertNodes: function(addSelected, data, before, anchor){
		// summary:
		//		inserts new data items (see `dojo.dnd.Container.insertNodes()` method for details)
		// addSelected: Boolean
		//		all new nodes will be added to selected items, if true, no selection change otherwise
		// data: Array
		//		a list of data items, which should be processed by the creator function
		// before: Boolean
		//		insert before the anchor, if true, and after the anchor otherwise
		// anchor: Node
		//		the anchor node to be used as a point of insertion
		var oldCreator = this._normalizedCreator;
		this._normalizedCreator = function(item, hint){
			var t = oldCreator.call(this, item, hint);
			if(addSelected){
				if(!this.anchor){
					this.anchor = t.node;
					this._removeItemClass(t.node, "Selected");
					this._addItemClass(this.anchor, "Anchor");
				}else if(this.anchor != t.node){
					this._removeItemClass(t.node, "Anchor");
					this._addItemClass(t.node, "Selected");
				}
				this.selection[t.node.id] = 1;
			}else{
				this._removeItemClass(t.node, "Selected");
				this._removeItemClass(t.node, "Anchor");
			}
			return t;
		};
		dojo.dnd.Selector.superclass.insertNodes.call(this, data, before, anchor);
		this._normalizedCreator = oldCreator;
		return this;	// self
	},
	destroy: function(){
		// summary:
		//		prepares the object to be garbage-collected
		dojo.dnd.Selector.superclass.destroy.call(this);
		this.selection = this.anchor = null;
	},

	// markup methods
	markupFactory: function(params, node){
		params._skipStartup = true;
		return new dojo.dnd.Selector(node, params);
	},

	// mouse events
	onMouseDown: function(e){
		// summary:
		//		event processor for onmousedown
		// e: Event
		//		mouse event
		if(this.autoSync){ this.sync(); }
		if(!this.current){ return; }
		if(!this.singular && !dojo.isCopyKey(e) && !e.shiftKey && (this.current.id in this.selection)){
			this.simpleSelection = true;
			if(e.button === dojo.mouseButtons.LEFT){
				// accept the left button and stop the event
				// for IE we don't stop event when multiple buttons are pressed
				dojo.stopEvent(e);
			}
			return;
		}
		if(!this.singular && e.shiftKey){
			if(!dojo.isCopyKey(e)){
				this._removeSelection();
			}
			var c = this.getAllNodes();
			if(c.length){
				if(!this.anchor){
					this.anchor = c[0];
					this._addItemClass(this.anchor, "Anchor");
				}
				this.selection[this.anchor.id] = 1;
				if(this.anchor != this.current){
					var i = 0;
					for(; i < c.length; ++i){
						var node = c[i];
						if(node == this.anchor || node == this.current){ break; }
					}
					for(++i; i < c.length; ++i){
						var node = c[i];
						if(node == this.anchor || node == this.current){ break; }
						this._addItemClass(node, "Selected");
						this.selection[node.id] = 1;
					}
					this._addItemClass(this.current, "Selected");
					this.selection[this.current.id] = 1;
				}
			}
		}else{
			if(this.singular){
				if(this.anchor == this.current){
					if(dojo.isCopyKey(e)){
						this.selectNone();
					}
				}else{
					this.selectNone();
					this.anchor = this.current;
					this._addItemClass(this.anchor, "Anchor");
					this.selection[this.current.id] = 1;
				}
			}else{
				if(dojo.isCopyKey(e)){
					if(this.anchor == this.current){
						delete this.selection[this.anchor.id];
						this._removeAnchor();
					}else{
						if(this.current.id in this.selection){
							this._removeItemClass(this.current, "Selected");
							delete this.selection[this.current.id];
						}else{
							if(this.anchor){
								this._removeItemClass(this.anchor, "Anchor");
								this._addItemClass(this.anchor, "Selected");
							}
							this.anchor = this.current;
							this._addItemClass(this.current, "Anchor");
							this.selection[this.current.id] = 1;
						}
					}
				}else{
					if(!(this.current.id in this.selection)){
						this.selectNone();
						this.anchor = this.current;
						this._addItemClass(this.current, "Anchor");
						this.selection[this.current.id] = 1;
					}
				}
			}
		}
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(!this.simpleSelection){ return; }
		this.simpleSelection = false;
		this.selectNone();
		if(this.current){
			this.anchor = this.current;
			this._addItemClass(this.anchor, "Anchor");
			this.selection[this.current.id] = 1;
		}
	},
	onMouseMove: function(e){
		// summary
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		this.simpleSelection = false;
	},
	
	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
		this.onmousemoveEvent = dojo.connect(this.node, "onmousemove", this, "onMouseMove");
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
		dojo.disconnect(this.onmousemoveEvent);
		delete this.onmousemoveEvent;
	},
	_removeSelection: function(){
		// summary:
		//		unselects all items
		var e = dojo.dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			var node = dojo.byId(i);
			if(node){ this._removeItemClass(node, "Selected"); }
		}
		this.selection = {};
		return this;	// self
	},
	_removeAnchor: function(){
		if(this.anchor){
			this._removeItemClass(this.anchor, "Anchor");
			this.anchor = null;
		}
		return this;	// self
	}
});

}

if(!dojo._hasResource["dojo.dnd.Avatar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Avatar"] = true;
dojo.provide("dojo.dnd.Avatar");



dojo.declare("dojo.dnd.Avatar", null, {
	// summary:
	//		Object that represents transferred DnD items visually
	// manager: Object
	//		a DnD manager object

	constructor: function(manager){
		this.manager = manager;
		this.construct();
	},

	// methods
	construct: function(){
		// summary:
		//		constructor function;
		//		it is separate so it can be (dynamically) overwritten in case of need
		this.isA11y = dojo.hasClass(dojo.body(),"dijit_a11y");
		var a = dojo.create("table", {
				"class": "dojoDndAvatar",
				style: {
					position: "absolute",
					zIndex:   "1999",
					margin:   "0px"
				}
			}),
			source = this.manager.source, node,
			b = dojo.create("tbody", null, a),
			tr = dojo.create("tr", null, b),
			td = dojo.create("td", null, tr),
			icon = this.isA11y ? dojo.create("span", {
						id : "a11yIcon",
						innerHTML : this.manager.copy ? '+' : "<"
					}, td) : null,
			span = dojo.create("span", {
				innerHTML: source.generateText ? this._generateText() : ""
			}, td),
			k = Math.min(5, this.manager.nodes.length), i = 0;
		// we have to set the opacity on IE only after the node is live
		dojo.attr(tr, {
			"class": "dojoDndAvatarHeader",
			style: {opacity: 0.9}
		});
		for(; i < k; ++i){
			if(source.creator){
				// create an avatar representation of the node
				node = source._normalizedCreator(source.getItem(this.manager.nodes[i].id).data, "avatar").node;
			}else{
				// or just clone the node and hope it works
				node = this.manager.nodes[i].cloneNode(true);
				if(node.tagName.toLowerCase() == "tr"){
					// insert extra table nodes
					var table = dojo.create("table"),
						tbody = dojo.create("tbody", null, table);
					tbody.appendChild(node);
					node = table;
				}
			}
			node.id = "";
			tr = dojo.create("tr", null, b);
			td = dojo.create("td", null, tr);
			td.appendChild(node);
			dojo.attr(tr, {
				"class": "dojoDndAvatarItem",
				style: {opacity: (9 - i) / 10}
			});
		}
		this.node = a;
	},
	destroy: function(){
		// summary:
		//		destructor for the avatar; called to remove all references so it can be garbage-collected
		dojo.destroy(this.node);
		this.node = false;
	},
	update: function(){
		// summary:
		//		updates the avatar to reflect the current DnD state
		dojo[(this.manager.canDropFlag ? "add" : "remove") + "Class"](this.node, "dojoDndAvatarCanDrop");
		if (this.isA11y){
			var icon = dojo.byId("a11yIcon");
			var text = '+';   // assume canDrop && copy
			if (this.manager.canDropFlag && !this.manager.copy) {
				text = '< '; // canDrop && move
			}else if (!this.manager.canDropFlag && !this.manager.copy) {
				text = "o"; //!canDrop && move
			}else if(!this.manager.canDropFlag){
				text = 'x';  // !canDrop && copy
			}
			icon.innerHTML=text;
		}
		// replace text
		dojo.query(("tr.dojoDndAvatarHeader td span" +(this.isA11y ? " span" : "")), this.node).forEach(
			function(node){
				node.innerHTML = this._generateText();
			}, this);
	},
	_generateText: function(){
		// summary: generates a proper text to reflect copying or moving of items
		return this.manager.nodes.length.toString();
	}
});

}

if(!dojo._hasResource["dojo.dnd.Manager"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Manager"] = true;
dojo.provide("dojo.dnd.Manager");





dojo.declare("dojo.dnd.Manager", null, {
	// summary:
	//		the manager of DnD operations (usually a singleton)
	constructor: function(){
		this.avatar  = null;
		this.source = null;
		this.nodes = [];
		this.copy  = true;
		this.target = null;
		this.canDropFlag = false;
		this.events = [];
	},

	// avatar's offset from the mouse
	OFFSET_X: 16,
	OFFSET_Y: 16,
	
	// methods
	overSource: function(source){
		// summary:
		//		called when a source detected a mouse-over condition
		// source: Object
		//		the reporter
		if(this.avatar){
			this.target = (source && source.targetState != "Disabled") ? source : null;
			this.canDropFlag = Boolean(this.target);
			this.avatar.update();
		}
		dojo.publish("/dnd/source/over", [source]);
	},
	outSource: function(source){
		// summary:
		//		called when a source detected a mouse-out condition
		// source: Object
		//		the reporter
		if(this.avatar){
			if(this.target == source){
				this.target = null;
				this.canDropFlag = false;
				this.avatar.update();
				dojo.publish("/dnd/source/over", [null]);
			}
		}else{
			dojo.publish("/dnd/source/over", [null]);
		}
	},
	startDrag: function(source, nodes, copy){
		// summary:
		//		called to initiate the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		this.source = source;
		this.nodes  = nodes;
		this.copy   = Boolean(copy); // normalizing to true boolean
		this.avatar = this.makeAvatar();
		dojo.body().appendChild(this.avatar.node);
		dojo.publish("/dnd/start", [source, nodes, this.copy]);
		this.events = [
			dojo.connect(dojo.doc, "onmousemove", this, "onMouseMove"),
			dojo.connect(dojo.doc, "onmouseup",   this, "onMouseUp"),
			dojo.connect(dojo.doc, "onkeydown",   this, "onKeyDown"),
			dojo.connect(dojo.doc, "onkeyup",     this, "onKeyUp"),
			// cancel text selection and text dragging
			dojo.connect(dojo.doc, "ondragstart",   dojo.stopEvent),
			dojo.connect(dojo.body(), "onselectstart", dojo.stopEvent)
		];
		var c = "dojoDnd" + (copy ? "Copy" : "Move");
		dojo.addClass(dojo.body(), c);
	},
	canDrop: function(flag){
		// summary:
		//		called to notify if the current target can accept items
		var canDropFlag = Boolean(this.target && flag);
		if(this.canDropFlag != canDropFlag){
			this.canDropFlag = canDropFlag;
			this.avatar.update();
		}
	},
	stopDrag: function(){
		// summary:
		//		stop the DnD in progress
		dojo.removeClass(dojo.body(), ["dojoDndCopy", "dojoDndMove"]);
		dojo.forEach(this.events, dojo.disconnect);
		this.events = [];
		this.avatar.destroy();
		this.avatar = null;
		this.source = this.target = null;
		this.nodes = [];
	},
	makeAvatar: function(){
		// summary:
		//		makes the avatar; it is separate to be overwritten dynamically, if needed
		return new dojo.dnd.Avatar(this);
	},
	updateAvatar: function(){
		// summary:
		//		updates the avatar; it is separate to be overwritten dynamically, if needed
		this.avatar.update();
	},
	
	// mouse event processors
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		var a = this.avatar;
		if(a){
			dojo.dnd.autoScrollNodes(e);
			//dojo.dnd.autoScroll(e);
			var s = a.node.style;
			s.left = (e.pageX + this.OFFSET_X) + "px";
			s.top  = (e.pageY + this.OFFSET_Y) + "px";
			var copy = Boolean(this.source.copyState(dojo.isCopyKey(e)));
			if(this.copy != copy){
				this._setCopyStatus(copy);
			}
		}
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(this.avatar){
			if(this.target && this.canDropFlag){
				var copy = Boolean(this.source.copyState(dojo.isCopyKey(e))),
				params = [this.source, this.nodes, copy, this.target, e];
				dojo.publish("/dnd/drop/before", params);
				dojo.publish("/dnd/drop", params);
			}else{
				dojo.publish("/dnd/cancel");
			}
			this.stopDrag();
		}
	},
	
	// keyboard event processors
	onKeyDown: function(e){
		// summary:
		//		event processor for onkeydown:
		//		watching for CTRL for copy/move status, watching for ESCAPE to cancel the drag
		// e: Event
		//		keyboard event
		if(this.avatar){
			switch(e.keyCode){
				case dojo.keys.CTRL:
					var copy = Boolean(this.source.copyState(true));
					if(this.copy != copy){
						this._setCopyStatus(copy);
					}
					break;
				case dojo.keys.ESCAPE:
					dojo.publish("/dnd/cancel");
					this.stopDrag();
					break;
			}
		}
	},
	onKeyUp: function(e){
		// summary:
		//		event processor for onkeyup, watching for CTRL for copy/move status
		// e: Event
		//		keyboard event
		if(this.avatar && e.keyCode == dojo.keys.CTRL){
			var copy = Boolean(this.source.copyState(false));
			if(this.copy != copy){
				this._setCopyStatus(copy);
			}
		}
	},
	
	// utilities
	_setCopyStatus: function(copy){
		// summary:
		//		changes the copy status
		// copy: Boolean
		//		the copy status
		this.copy = copy;
		this.source._markDndStatus(this.copy);
		this.updateAvatar();
		dojo.replaceClass(dojo.body(),
			"dojoDnd" + (this.copy ? "Copy" : "Move"),
			"dojoDnd" + (this.copy ? "Move" : "Copy"));
	}
});

// dojo.dnd._manager:
//		The manager singleton variable. Can be overwritten if needed.
dojo.dnd._manager = null;

dojo.dnd.manager = function(){
	// summary:
	//		Returns the current DnD manager.  Creates one if it is not created yet.
	if(!dojo.dnd._manager){
		dojo.dnd._manager = new dojo.dnd.Manager();
	}
	return dojo.dnd._manager;	// Object
};

}

if(!dojo._hasResource["dojo.dnd.Source"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Source"] = true;
dojo.provide("dojo.dnd.Source");




/*
	Container property:
		"Horizontal"- if this is the horizontal container
	Source states:
		""			- normal state
		"Moved"		- this source is being moved
		"Copied"	- this source is being copied
	Target states:
		""			- normal state
		"Disabled"	- the target cannot accept an avatar
	Target anchor state:
		""			- item is not selected
		"Before"	- insert point is before the anchor
		"After"		- insert point is after the anchor
*/

/*=====
dojo.dnd.__SourceArgs = function(){
	//	summary:
	//		a dict of parameters for DnD Source configuration. Note that any
	//		property on Source elements may be configured, but this is the
	//		short-list
	//	isSource: Boolean?
	//		can be used as a DnD source. Defaults to true.
	//	accept: Array?
	//		list of accepted types (text strings) for a target; defaults to
	//		["text"]
	//	autoSync: Boolean
	//		if true refreshes the node list on every operation; false by default
	//	copyOnly: Boolean?
	//		copy items, if true, use a state of Ctrl key otherwise,
	//		see selfCopy and selfAccept for more details
	//	delay: Number
	//		the move delay in pixels before detecting a drag; 0 by default
	//	horizontal: Boolean?
	//		a horizontal container, if true, vertical otherwise or when omitted
	//	selfCopy: Boolean?
	//		copy items by default when dropping on itself,
	//		false by default, works only if copyOnly is true
	//	selfAccept: Boolean?
	//		accept its own items when copyOnly is true,
	//		true by default, works only if copyOnly is true
	//	withHandles: Boolean?
	//		allows dragging only by handles, false by default
	//  generateText: Boolean?
	//		generate text node for drag and drop, true by default
	this.isSource = isSource;
	this.accept = accept;
	this.autoSync = autoSync;
	this.copyOnly = copyOnly;
	this.delay = delay;
	this.horizontal = horizontal;
	this.selfCopy = selfCopy;
	this.selfAccept = selfAccept;
	this.withHandles = withHandles;
	this.generateText = true;
}
=====*/

dojo.declare("dojo.dnd.Source", dojo.dnd.Selector, {
	// summary:
	//		a Source object, which can be used as a DnD source, or a DnD target
	
	// object attributes (for markup)
	isSource: true,
	horizontal: false,
	copyOnly: false,
	selfCopy: false,
	selfAccept: true,
	skipForm: false,
	withHandles: false,
	autoSync: false,
	delay: 0, // pixels
	accept: ["text"],
	generateText: true,
	
	constructor: function(/*DOMNode|String*/node, /*dojo.dnd.__SourceArgs?*/params){
		// summary:
		//		a constructor of the Source
		// node:
		//		node or node's id to build the source on
		// params:
		//		any property of this class may be configured via the params
		//		object which is mixed-in to the `dojo.dnd.Source` instance
		dojo.mixin(this, dojo.mixin({}, params));
		var type = this.accept;
		if(type.length){
			this.accept = {};
			for(var i = 0; i < type.length; ++i){
				this.accept[type[i]] = 1;
			}
		}
		// class-specific variables
		this.isDragging = false;
		this.mouseDown = false;
		this.targetAnchor = null;
		this.targetBox = null;
		this.before = true;
		this._lastX = 0;
		this._lastY = 0;
		// states
		this.sourceState  = "";
		if(this.isSource){
			dojo.addClass(this.node, "dojoDndSource");
		}
		this.targetState  = "";
		if(this.accept){
			dojo.addClass(this.node, "dojoDndTarget");
		}
		if(this.horizontal){
			dojo.addClass(this.node, "dojoDndHorizontal");
		}
		// set up events
		this.topics = [
			dojo.subscribe("/dnd/source/over", this, "onDndSourceOver"),
			dojo.subscribe("/dnd/start",  this, "onDndStart"),
			dojo.subscribe("/dnd/drop",   this, "onDndDrop"),
			dojo.subscribe("/dnd/cancel", this, "onDndCancel")
		];
	},
	
	// methods
	checkAcceptance: function(source, nodes){
		// summary:
		//		checks if the target can accept nodes from this source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		if(this == source){
			return !this.copyOnly || this.selfAccept;
		}
		for(var i = 0; i < nodes.length; ++i){
			var type = source.getItem(nodes[i].id).type;
			// type instanceof Array
			var flag = false;
			for(var j = 0; j < type.length; ++j){
				if(type[j] in this.accept){
					flag = true;
					break;
				}
			}
			if(!flag){
				return false;	// Boolean
			}
		}
		return true;	// Boolean
	},
	copyState: function(keyPressed, self){
		// summary:
		//		Returns true if we need to copy items, false to move.
		//		It is separated to be overwritten dynamically, if needed.
		// keyPressed: Boolean
		//		the "copy" key was pressed
		// self: Boolean?
		//		optional flag that means that we are about to drop on itself
		
		if(keyPressed){ return true; }
		if(arguments.length < 2){
			self = this == dojo.dnd.manager().target;
		}
		if(self){
			if(this.copyOnly){
				return this.selfCopy;
			}
		}else{
			return this.copyOnly;
		}
		return false;	// Boolean
	},
	destroy: function(){
		// summary:
		//		prepares the object to be garbage-collected
		dojo.dnd.Source.superclass.destroy.call(this);
		dojo.forEach(this.topics, dojo.unsubscribe);
		this.targetAnchor = null;
	},

	// markup methods
	markupFactory: function(params, node){
		params._skipStartup = true;
		return new dojo.dnd.Source(node, params);
	},

	// mouse event processors
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		if(this.isDragging && this.targetState == "Disabled"){ return; }
		dojo.dnd.Source.superclass.onMouseMove.call(this, e);
		var m = dojo.dnd.manager();
		if(!this.isDragging){
			if(this.mouseDown && this.isSource &&
					(Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay)){
				var nodes = this.getSelectedNodes();
				if(nodes.length){
					m.startDrag(this, nodes, this.copyState(dojo.isCopyKey(e), true));
				}
			}
		}
		if(this.isDragging){
			// calculate before/after
			var before = false;
			if(this.current){
				if(!this.targetBox || this.targetAnchor != this.current){
					this.targetBox = dojo.position(this.current, true);
				}
				if(this.horizontal){
					before = (e.pageX - this.targetBox.x) < (this.targetBox.w / 2);
				}else{
					before = (e.pageY - this.targetBox.y) < (this.targetBox.h / 2);
				}
			}
			if(this.current != this.targetAnchor || before != this.before){
				this._markTargetAnchor(before);
				m.canDrop(!this.current || m.source != this || !(this.current.id in this.selection));
			}
		}
	},
	onMouseDown: function(e){
		// summary:
		//		event processor for onmousedown
		// e: Event
		//		mouse event
		if(!this.mouseDown && this._legalMouseDown(e) && (!this.skipForm || !dojo.dnd.isFormElement(e))){
			this.mouseDown = true;
			this._lastX = e.pageX;
			this._lastY = e.pageY;
			dojo.dnd.Source.superclass.onMouseDown.call(this, e);
		}
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(this.mouseDown){
			this.mouseDown = false;
			dojo.dnd.Source.superclass.onMouseUp.call(this, e);
		}
	},
	
	// topic event processors
	onDndSourceOver: function(source){
		// summary:
		//		topic event processor for /dnd/source/over, called when detected a current source
		// source: Object
		//		the source which has the mouse over it
		if(this != source){
			this.mouseDown = false;
			if(this.targetAnchor){
				this._unmarkTargetAnchor();
			}
		}else if(this.isDragging){
			var m = dojo.dnd.manager();
			m.canDrop(this.targetState != "Disabled" && (!this.current || m.source != this || !(this.current.id in this.selection)));
		}
	},
	onDndStart: function(source, nodes, copy){
		// summary:
		//		topic event processor for /dnd/start, called to initiate the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		if(this.autoSync){ this.sync(); }
		if(this.isSource){
			this._changeState("Source", this == source ? (copy ? "Copied" : "Moved") : "");
		}
		var accepted = this.accept && this.checkAcceptance(source, nodes);
		this._changeState("Target", accepted ? "" : "Disabled");
		if(this == source){
			dojo.dnd.manager().overSource(this);
		}
		this.isDragging = true;
	},
	onDndDrop: function(source, nodes, copy, target){
		// summary:
		//		topic event processor for /dnd/drop, called to finish the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		// target: Object
		//		the target which accepts items
		if(this == target){
			// this one is for us => move nodes!
			this.onDrop(source, nodes, copy);
		}
		this.onDndCancel();
	},
	onDndCancel: function(){
		// summary:
		//		topic event processor for /dnd/cancel, called to cancel the DnD operation
		if(this.targetAnchor){
			this._unmarkTargetAnchor();
			this.targetAnchor = null;
		}
		this.before = true;
		this.isDragging = false;
		this.mouseDown = false;
		this._changeState("Source", "");
		this._changeState("Target", "");
	},
	
	// local events
	onDrop: function(source, nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		
		if(this != source){
			this.onDropExternal(source, nodes, copy);
		}else{
			this.onDropInternal(nodes, copy);
		}
	},
	onDropExternal: function(source, nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		//		from an external source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		
		var oldCreator = this._normalizedCreator;
		// transferring nodes from the source to the target
		if(this.creator){
			// use defined creator
			this._normalizedCreator = function(node, hint){
				return oldCreator.call(this, source.getItem(node.id).data, hint);
			};
		}else{
			// we have no creator defined => move/clone nodes
			if(copy){
				// clone nodes
				this._normalizedCreator = function(node, hint){
					var t = source.getItem(node.id);
					var n = node.cloneNode(true);
					n.id = dojo.dnd.getUniqueId();
					return {node: n, data: t.data, type: t.type};
				};
			}else{
				// move nodes
				this._normalizedCreator = function(node, hint){
					var t = source.getItem(node.id);
					source.delItem(node.id);
					return {node: node, data: t.data, type: t.type};
				};
			}
		}
		this.selectNone();
		if(!copy && !this.creator){
			source.selectNone();
		}
		this.insertNodes(true, nodes, this.before, this.current);
		if(!copy && this.creator){
			source.deleteSelectedNodes();
		}
		this._normalizedCreator = oldCreator;
	},
	onDropInternal: function(nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		//		from the same target/source
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		
		var oldCreator = this._normalizedCreator;
		// transferring nodes within the single source
		if(this.current && this.current.id in this.selection){
			// do nothing
			return;
		}
		if(copy){
			if(this.creator){
				// create new copies of data items
				this._normalizedCreator = function(node, hint){
					return oldCreator.call(this, this.getItem(node.id).data, hint);
				};
			}else{
				// clone nodes
				this._normalizedCreator = function(node, hint){
					var t = this.getItem(node.id);
					var n = node.cloneNode(true);
					n.id = dojo.dnd.getUniqueId();
					return {node: n, data: t.data, type: t.type};
				};
			}
		}else{
			// move nodes
			if(!this.current){
				// do nothing
				return;
			}
			this._normalizedCreator = function(node, hint){
				var t = this.getItem(node.id);
				return {node: node, data: t.data, type: t.type};
			};
		}
		this._removeSelection();
		this.insertNodes(true, nodes, this.before, this.current);
		this._normalizedCreator = oldCreator;
	},
	onDraggingOver: function(){
		// summary:
		//		called during the active DnD operation, when items
		//		are dragged over this target, and it is not disabled
	},
	onDraggingOut: function(){
		// summary:
		//		called during the active DnD operation, when items
		//		are dragged away from this target, and it is not disabled
	},
	
	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
		dojo.dnd.Source.superclass.onOverEvent.call(this);
		dojo.dnd.manager().overSource(this);
		if(this.isDragging && this.targetState != "Disabled"){
			this.onDraggingOver();
		}
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
		dojo.dnd.Source.superclass.onOutEvent.call(this);
		dojo.dnd.manager().outSource(this);
		if(this.isDragging && this.targetState != "Disabled"){
			this.onDraggingOut();
		}
	},
	_markTargetAnchor: function(before){
		// summary:
		//		assigns a class to the current target anchor based on "before" status
		// before: Boolean
		//		insert before, if true, after otherwise
		if(this.current == this.targetAnchor && this.before == before){ return; }
		if(this.targetAnchor){
			this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
		}
		this.targetAnchor = this.current;
		this.targetBox = null;
		this.before = before;
		if(this.targetAnchor){
			this._addItemClass(this.targetAnchor, this.before ? "Before" : "After");
		}
	},
	_unmarkTargetAnchor: function(){
		// summary:
		//		removes a class of the current target anchor based on "before" status
		if(!this.targetAnchor){ return; }
		this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
		this.targetAnchor = null;
		this.targetBox = null;
		this.before = true;
	},
	_markDndStatus: function(copy){
		// summary:
		//		changes source's state based on "copy" status
		this._changeState("Source", copy ? "Copied" : "Moved");
	},
	_legalMouseDown: function(e){
		// summary:
		//		checks if user clicked on "approved" items
		// e: Event
		//		mouse event
		
		// accept only the left mouse button
		if(!dojo.mouseButtons.isLeft(e)){ return false; }
		
		if(!this.withHandles){ return true; }
		
		// check for handles
		for(var node = e.target; node && node !== this.node; node = node.parentNode){
			if(dojo.hasClass(node, "dojoDndHandle")){ return true; }
			if(dojo.hasClass(node, "dojoDndItem") || dojo.hasClass(node, "dojoDndIgnore")){ break; }
		}
		return false;	// Boolean
	}
});

dojo.declare("dojo.dnd.Target", dojo.dnd.Source, {
	// summary: a Target object, which can be used as a DnD target
	
	constructor: function(node, params){
		// summary:
		//		a constructor of the Target --- see the `dojo.dnd.Source.constructor` for details
		this.isSource = false;
		dojo.removeClass(this.node, "dojoDndSource");
	},

	// markup methods
	markupFactory: function(params, node){
		params._skipStartup = true;
		return new dojo.dnd.Target(node, params);
	}
});

dojo.declare("dojo.dnd.AutoSource", dojo.dnd.Source, {
	// summary:
	//		a source that syncs its DnD nodes by default
	
	constructor: function(node, params){
		// summary:
		//		constructor of the AutoSource --- see the Source constructor for details
		this.autoSync = true;
	},

	// markup methods
	markupFactory: function(params, node){
		params._skipStartup = true;
		return new dojo.dnd.AutoSource(node, params);
	}
});

}

if(!dojo._hasResource["dojox.color._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.color._base"] = true;
dojo.provide("dojox.color._base");


//	alias all the dojo.Color mechanisms
dojox.color.Color=dojo.Color;
dojox.color.blend=dojo.blendColors;
dojox.color.fromRgb=dojo.colorFromRgb;
dojox.color.fromHex=dojo.colorFromHex;
dojox.color.fromArray=dojo.colorFromArray;
dojox.color.fromString=dojo.colorFromString;

//	alias the dojo.colors mechanisms
dojox.color.greyscale=dojo.colors.makeGrey;

//	static methods
dojo.mixin(dojox.color, {
	fromCmy: function(/* Object|Array|int */cyan, /*int*/magenta, /*int*/yellow){
		//	summary
		//	Create a dojox.color.Color from a CMY defined color.
		//	All colors should be expressed as 0-100 (percentage)

		if(dojo.isArray(cyan)){
			magenta=cyan[1], yellow=cyan[2], cyan=cyan[0];
		} else if(dojo.isObject(cyan)){
			magenta=cyan.m, yellow=cyan.y, cyan=cyan.c;
		}
		cyan/=100, magenta/=100, yellow/=100;

		var r=1-cyan, g=1-magenta, b=1-yellow;
		return new dojox.color.Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
	},

	fromCmyk: function(/* Object|Array|int */cyan, /*int*/magenta, /*int*/yellow, /*int*/black){
		//	summary
		//	Create a dojox.color.Color from a CMYK defined color.
		//	All colors should be expressed as 0-100 (percentage)

		if(dojo.isArray(cyan)){
			magenta=cyan[1], yellow=cyan[2], black=cyan[3], cyan=cyan[0];
		} else if(dojo.isObject(cyan)){
			magenta=cyan.m, yellow=cyan.y, black=cyan.b, cyan=cyan.c;
		}
		cyan/=100, magenta/=100, yellow/=100, black/=100;
		var r,g,b;
		r = 1-Math.min(1, cyan*(1-black)+black);
		g = 1-Math.min(1, magenta*(1-black)+black);
		b = 1-Math.min(1, yellow*(1-black)+black);
		return new dojox.color.Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
	},
	
	fromHsl: function(/* Object|Array|int */hue, /* int */saturation, /* int */luminosity){
		//	summary
		//	Create a dojox.color.Color from an HSL defined color.
		//	hue from 0-359 (degrees), saturation and luminosity 0-100.

		if(dojo.isArray(hue)){
			saturation=hue[1], luminosity=hue[2], hue=hue[0];
		} else if(dojo.isObject(hue)){
			saturation=hue.s, luminosity=hue.l, hue=hue.h;
		}
		saturation/=100;
		luminosity/=100;

		while(hue<0){ hue+=360; }
		while(hue>=360){ hue-=360; }
		
		var r, g, b;
		if(hue<120){
			r=(120-hue)/60, g=hue/60, b=0;
		} else if (hue<240){
			r=0, g=(240-hue)/60, b=(hue-120)/60;
		} else {
			r=(hue-240)/60, g=0, b=(360-hue)/60;
		}
		
		r=2*saturation*Math.min(r, 1)+(1-saturation);
		g=2*saturation*Math.min(g, 1)+(1-saturation);
		b=2*saturation*Math.min(b, 1)+(1-saturation);
		if(luminosity<0.5){
			r*=luminosity, g*=luminosity, b*=luminosity;
		}else{
			r=(1-luminosity)*r+2*luminosity-1;
			g=(1-luminosity)*g+2*luminosity-1;
			b=(1-luminosity)*b+2*luminosity-1;
		}
		return new dojox.color.Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
	},
	
	fromHsv: function(/* Object|Array|int */hue, /* int */saturation, /* int */value){
		//	summary
		//	Create a dojox.color.Color from an HSV defined color.
		//	hue from 0-359 (degrees), saturation and value 0-100.

		if(dojo.isArray(hue)){
			saturation=hue[1], value=hue[2], hue=hue[0];
		} else if (dojo.isObject(hue)){
			saturation=hue.s, value=hue.v, hue=hue.h;
		}
		
		if(hue==360){ hue=0; }
		saturation/=100;
		value/=100;
		
		var r, g, b;
		if(saturation==0){
			r=value, b=value, g=value;
		}else{
			var hTemp=hue/60, i=Math.floor(hTemp), f=hTemp-i;
			var p=value*(1-saturation);
			var q=value*(1-(saturation*f));
			var t=value*(1-(saturation*(1-f)));
			switch(i){
				case 0:{ r=value, g=t, b=p; break; }
				case 1:{ r=q, g=value, b=p; break; }
				case 2:{ r=p, g=value, b=t; break; }
				case 3:{ r=p, g=q, b=value; break; }
				case 4:{ r=t, g=p, b=value; break; }
				case 5:{ r=value, g=p, b=q; break; }
			}
		}
		return new dojox.color.Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
	}
});

//	Conversions directly on dojox.color.Color
dojo.extend(dojox.color.Color, {
	toCmy: function(){
		//	summary
		//	Convert this Color to a CMY definition.
		var cyan=1-(this.r/255), magenta=1-(this.g/255), yellow=1-(this.b/255);
		return { c:Math.round(cyan*100), m:Math.round(magenta*100), y:Math.round(yellow*100) };		//	Object
	},
	
	toCmyk: function(){
		//	summary
		//	Convert this Color to a CMYK definition.
		var cyan, magenta, yellow, black;
		var r=this.r/255, g=this.g/255, b=this.b/255;
		black = Math.min(1-r, 1-g, 1-b);
		cyan = (1-r-black)/(1-black);
		magenta = (1-g-black)/(1-black);
		yellow = (1-b-black)/(1-black);
		return { c:Math.round(cyan*100), m:Math.round(magenta*100), y:Math.round(yellow*100), b:Math.round(black*100) };	//	Object
	},
	
	toHsl: function(){
		//	summary
		//	Convert this Color to an HSL definition.
		var r=this.r/255, g=this.g/255, b=this.b/255;
		var min = Math.min(r, b, g), max = Math.max(r, g, b);
		var delta = max-min;
		var h=0, s=0, l=(min+max)/2;
		if(l>0 && l<1){
			s = delta/((l<0.5)?(2*l):(2-2*l));
		}
		if(delta>0){
			if(max==r && max!=g){
				h+=(g-b)/delta;
			}
			if(max==g && max!=b){
				h+=(2+(b-r)/delta);
			}
			if(max==b && max!=r){
				h+=(4+(r-g)/delta);
			}
			h*=60;
		}
		return { h:h, s:Math.round(s*100), l:Math.round(l*100) };	//	Object
	},

	toHsv: function(){
		//	summary
		//	Convert this Color to an HSV definition.
		var r=this.r/255, g=this.g/255, b=this.b/255;
		var min = Math.min(r, b, g), max = Math.max(r, g, b);
		var delta = max-min;
		var h = null, s = (max==0)?0:(delta/max);
		if(s==0){
			h = 0;
		}else{
			if(r==max){
				h = 60*(g-b)/delta;
			}else if(g==max){
				h = 120 + 60*(b-r)/delta;
			}else{
				h = 240 + 60*(r-g)/delta;
			}

			if(h<0){ h+=360; }
		}
		return { h:h, s:Math.round(s*100), v:Math.round(max*100) };	//	Object
	}
});

}

if(!dojo._hasResource["dojox.color"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.color"] = true;
dojo.provide("dojox.color");


}

if(!dojo._hasResource["dojox.widget.ColorPicker"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.widget.ColorPicker"] = true;
dojo.provide("dojox.widget.ColorPicker");
dojo.experimental("dojox.widget.ColorPicker"); // level: beta //TODO: which?










(function(d){
	
	var webSafeFromHex = function(hex){
		// stub, this is planned later:
		return hex;
	};
	
	dojo.declare("dojox.widget.ColorPicker",
		dijit.form._FormWidget,
		{
		// summary: a HSV color picker - similar to Photoshop picker
		//
		// description:
		//		Provides an interactive HSV ColorPicker similar to
		//		PhotoShop's color selction tool. This is an enhanced
		//		version of the default dijit.ColorPalette, though provides
		//		no accessibility.
		//
		// example:
		// |	var picker = new dojox.widget.ColorPicker({
		// |		// a couple of example toggles:
		// |		animatePoint:false,
		// |		showHsv: false,
		// |		webSafe: false,
		// |		showRgb: false
		// |	});
		//
		// example:
		// |	<!-- markup: -->
		// |	<div dojoType="dojox.widget.ColorPicker"></div>
		//
		// showRgb: Boolean
		//	show/update RGB input nodes
		showRgb: true,
	
		// showHsv: Boolean
		//	show/update HSV input nodes
		showHsv: true,
	
		// showHex: Boolean
		//	show/update Hex value field
		showHex: true,

		// webSafe: Boolean
		//	deprecated? or just use a toggle to show/hide that node, too?
		webSafe: true,

		// animatePoint: Boolean
		//	toggle to use slideTo (true) or just place the cursor (false) on click
		animatePoint: true,

		// slideDuration: Integer
		//	time in ms picker node will slide to next location (non-dragging) when animatePoint=true
		slideDuration: 250,

		// liveUpdate: Boolean
		//		Set to true to fire onChange in an indeterminate way
		liveUpdate: false,

		// PICKER_HUE_H: int
		//     Height of the hue picker, used to calculate positions
		PICKER_HUE_H: 150,
		
		// PICKER_SAT_VAL_H: int
		//     Height of the 2d picker, used to calculate positions
		PICKER_SAT_VAL_H: 150,
		
		// PICKER_SAT_VAL_W: int
		//     Width of the 2d picker, used to calculate positions
		PICKER_SAT_VAL_W: 150,

		// PICKER_HUE_SELECTOR_H: int
		//		Height of the hue selector DOM node, used to calc offsets so that selection
		//		is center of the image node.
		PICKER_HUE_SELECTOR_H: 8,
		
		// PICKER_SAT_SELECTOR_H: int
		//		Height of the saturation selector DOM node, used to calc offsets so that selection
		//		is center of the image node.
		PICKER_SAT_SELECTOR_H: 10,

		// PICKER_SAT_SELECTOR_W: int
		//		Width of the saturation selector DOM node, used to calc offsets so that selection
		//		is center of the image node.
		PICKER_SAT_SELECTOR_W: 10,

		// value: String
		//	Default color for this component. Only hex values are accepted as incoming/returned
		//	values. Adjust this value with `.attr`, eg: dijit.byId("myPicker").attr("value", "#ededed");
		//	to cause the points to adjust and the values to reflect the current color.
		value: "#ffffff",
		
		_underlay: d.moduleUrl("dojox.widget","ColorPicker/images/underlay.png"),

		_hueUnderlay: d.moduleUrl("dojox.widget","ColorPicker/images/hue.png"),

		_pickerPointer: d.moduleUrl("dojox.widget","ColorPicker/images/pickerPointer.png"),

		_huePickerPointer: d.moduleUrl("dojox.widget","ColorPicker/images/hueHandle.png"),

		_huePickerPointerAlly: d.moduleUrl("dojox.widget","ColorPicker/images/hueHandleA11y.png"),

		// don't change to d.moduleUrl, build won't intern it.
		templateString: dojo.cache("dojox.widget", "ColorPicker/ColorPicker.html", "<table class=\"dojoxColorPicker\" dojoAttachEvent=\"onkeypress: _handleKey\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t<div class=\"dojoxColorPickerBox\">\n\t\t\t\t<!-- Forcing ABS in style attr due to dojo DND issue with not picking it up form the class. -->\n\t\t\t\t<img role=\"status\" title=\"${saturationPickerTitle}\" alt=\"${saturationPickerTitle}\" class=\"dojoxColorPickerPoint\" src=\"${_pickerPointer}\" tabIndex=\"0\" dojoAttachPoint=\"cursorNode\" style=\"position: absolute; top: 0px; left: 0px;\">\n\t\t\t\t<img role=\"presentation\" alt=\"\" dojoAttachPoint=\"colorUnderlay\" dojoAttachEvent=\"onclick: _setPoint, onmousedown: _stopDrag\" class=\"dojoxColorPickerUnderlay\" src=\"${_underlay}\" ondragstart=\"return false\">\n\t\t\t</div>\n\t\t</td>\n\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t<div class=\"dojoxHuePicker\">\n\t\t\t\t<!-- Forcing ABS in style attr due to dojo DND issue with not picking it up form the class. -->\n\t\t\t\t<img role=\"status\" dojoAttachPoint=\"hueCursorNode\" tabIndex=\"0\" class=\"dojoxHuePickerPoint\" title=\"${huePickerTitle}\" alt=\"${huePickerTitle}\" src=\"${_huePickerPointer}\" style=\"position: absolute; top: 0px; left: 0px;\">\n\t\t\t\t<div class=\"dojoxHuePickerUnderlay\" dojoAttachPoint=\"hueNode\">\n\t\t\t\t    <img role=\"presentation\" alt=\"\" dojoAttachEvent=\"onclick: _setHuePoint, onmousedown: _stopDrag\" src=\"${_hueUnderlay}\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t\t<table cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td valign=\"top\" class=\"dojoxColorPickerPreviewContainer\">\n\t\t\t\t\t\t<table cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t\t\t\t\t\t\t<div dojoAttachPoint=\"previewNode\" class=\"dojoxColorPickerPreview\"></div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t\t\t\t<div dojoAttachPoint=\"safePreviewNode\" class=\"dojoxColorPickerWebSafePreview\"></div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td valign=\"bottom\">\n\t\t\t\t\t\t<table class=\"dojoxColorPickerOptional\" cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class=\"dijitInline dojoxColorPickerRgb\" dojoAttachPoint=\"rgbNode\">\n\t\t\t\t\t\t\t\t\t\t<table cellpadding=\"1\" cellspacing=\"1\">\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_r\">${redLabel}</label></td><td><input id=\"${_uId}_r\" dojoAttachPoint=\"Rval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_g\">${greenLabel}</label></td><td><input id=\"${_uId}_g\" dojoAttachPoint=\"Gval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_b\">${blueLabel}</label></td><td><input id=\"${_uId}_b\" dojoAttachPoint=\"Bval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class=\"dijitInline dojoxColorPickerHsv\" dojoAttachPoint=\"hsvNode\">\n\t\t\t\t\t\t\t\t\t\t<table cellpadding=\"1\" cellspacing=\"1\">\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_h\">${hueLabel}</label></td><td><input id=\"${_uId}_h\" dojoAttachPoint=\"Hval\"size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${degLabel}</td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_s\">${saturationLabel}</label></td><td><input id=\"${_uId}_s\" dojoAttachPoint=\"Sval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${percentSign}</td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_v\">${valueLabel}</label></td><td><input id=\"${_uId}_v\" dojoAttachPoint=\"Vval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${percentSign}</td></tr>\n\t\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td colspan=\"2\">\n\t\t\t\t\t\t\t\t\t<div class=\"dojoxColorPickerHex\" dojoAttachPoint=\"hexNode\" aria-live=\"polite\">\t\n\t\t\t\t\t\t\t\t\t\t<label for=\"${_uId}_hex\">&nbsp;${hexLabel}&nbsp;</label><input id=\"${_uId}_hex\" dojoAttachPoint=\"hexCode, focusNode, valueNode\" size=\"6\" class=\"dojoxColorPickerHexCode\" dojoAttachEvent=\"onchange: _colorInputChange\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</td>\n\t</tr>\n</table>\n\n"),

		postMixInProperties: function(){
			if(dojo.hasClass(dojo.body(), "dijit_a11y")){
				// Use the pointer that will show up in high contrast.
				this._huePickerPointer = this._huePickerPointerAlly;
			}
			this._uId = dijit.getUniqueId(this.id);
			dojo.mixin(this, dojo.i18n.getLocalization("dojox.widget", "ColorPicker"));
			dojo.mixin(this, dojo.i18n.getLocalization("dojo.cldr", "number"));
			this.inherited(arguments);
		},

		postCreate: function(){
			// summary:
			//		As quickly as we can, set up ie6 alpha-filter support for our
			//		underlay.  we don't do image handles (done in css), just the 'core'
			//		of this widget: the underlay.
			this.inherited(arguments);
			if(d.isIE < 7){
				this.colorUnderlay.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this._underlay+"', sizingMethod='scale')";
				this.colorUnderlay.src = this._blankGif.toString();
			}
			// hide toggle-able nodes:
			if(!this.showRgb){ this.rgbNode.style.visibility = "hidden"; }
			if(!this.showHsv){ this.hsvNode.style.visibility = "hidden"; }
			if(!this.showHex){ this.hexNode.style.visibility = "hidden"; }
			if(!this.webSafe){ this.safePreviewNode.style.visibility = "hidden"; }
		},
		
		startup: function(){
			if(this._started){
				return;
			}
			this._started = true;
			this.set("value", this.value);
			this._mover = new d.dnd.move.boxConstrainedMoveable(this.cursorNode, {
				box: {
					t: -(this.PICKER_SAT_SELECTOR_H/2),
					l: -(this.PICKER_SAT_SELECTOR_W/2),
					w:this.PICKER_SAT_VAL_W,
					h:this.PICKER_SAT_VAL_H
				}
			});
			
			this._hueMover = new d.dnd.move.boxConstrainedMoveable(this.hueCursorNode, {
				box: {
					t: -(this.PICKER_HUE_SELECTOR_H/2),
					l:0,
					w:0,
					h:this.PICKER_HUE_H
				}
			});
			
			this._subs = [];
			// no dnd/move/move published ... use a timer:
			this._subs.push(d.subscribe("/dnd/move/stop", d.hitch(this, "_clearTimer")));
			this._subs.push(d.subscribe("/dnd/move/start", d.hitch(this, "_setTimer")));

			// Bind to up, down, left and right  arrows on the hue and saturation nodes.
			this._keyListeners = [];
			this._connects.push(dijit.typematic.addKeyListener(this.hueCursorNode,{
				charOrCode: dojo.keys.UP_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateHueCursorNode), 25, 25));
			this._connects.push(dijit.typematic.addKeyListener(this.hueCursorNode,{
				charOrCode: dojo.keys.DOWN_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateHueCursorNode), 25, 25));
			this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{
				charOrCode: dojo.keys.UP_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateCursorNode), 25, 25));
			this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{
				charOrCode: dojo.keys.DOWN_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateCursorNode), 25, 25));
			this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{
				charOrCode: dojo.keys.LEFT_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateCursorNode), 25, 25));
			this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{
				charOrCode: dojo.keys.RIGHT_ARROW,
				shiftKey: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false
			}, this, dojo.hitch(this, this._updateCursorNode), 25, 25));
		},
		
		_setValueAttr: function(value){
			if(!this._started){ return; }
			this.setColor(value, true);
		},
		
		setColor: function(/* String */color, force){
			// summary: Set a color on a picker. Usually used to set
			//          initial color as an alternative to passing defaultColor option
			//          to the constructor.
			var col = dojox.color.fromString(color);
			this._updatePickerLocations(col);
			this._updateColorInputs(col);
			this._updateValue(col, force);
		},
		
		_setTimer: function(/* d.dnd.Mover */mover){
			// FIXME: should I assume this? focus on mouse down so on mouse up
			dijit.focus(mover.node);
			d.setSelectable(this.domNode,false);
			this._timer = setInterval(d.hitch(this, "_updateColor"), 45);
		},
		
		_clearTimer: function(/* d.dnd.Mover */mover){
			clearInterval(this._timer);
			this._timer = null;
			this.onChange(this.value);
			d.setSelectable(this.domNode,true);
		},
		
		_setHue: function(/* Decimal */h){
			// summary:
			//		Sets a natural color background for the
			//		underlay image against closest hue value (full saturation)
			//		h: 0..360
			d.style(this.colorUnderlay, "backgroundColor", dojox.color.fromHsv(h,100,100).toHex());
			
		},

		_updateHueCursorNode: function(count, node, e){
			// summary:
			//		Function used by the typematic code to handle cursor position and update
			//		via keyboard.
			// count:
			//		-1 means stop, anything else is just how many times it was called.
			// node:
			//		The node generating the event.
			// e:
			//		The event.
			if(count !== -1){
				var y = dojo.style(this.hueCursorNode, "top");
				var selCenter = (this.PICKER_HUE_SELECTOR_H/2);

				// Account for our offset
				y += selCenter;
				var update = false;
				if(e.charOrCode == dojo.keys.UP_ARROW){
					if(y > 0){
						y -= 1;
						update = true;
					}
				}else if(e.charOrCode == dojo.keys.DOWN_ARROW){
					if(y < this.PICKER_HUE_H){
						y += 1;
						update = true;
					}
				}
				y -= selCenter;
				if(update){
					dojo.style(this.hueCursorNode, "top", y + "px");
				}
			}else{
				this._updateColor(true);
			}
		},
		
		_updateCursorNode: function(count, node, e){
			// summary:
			//		Function used by the typematic code to handle cursor position and update
			//		via keyboard.
			// count:
			//		-1 means stop, anything else is just how many times it was called.
			// node:
			//		The node generating the event.
			// e:
			//		The event.
			var selCenterH = this.PICKER_SAT_SELECTOR_H/2;
			var selCenterW = this.PICKER_SAT_SELECTOR_W/2;

			if(count !== -1){
				var y = dojo.style(this.cursorNode, "top");
				var x = dojo.style(this.cursorNode, "left");
				
				// Account for our offsets to center
				y += selCenterH;
				x += selCenterW;

				var update = false;
				if(e.charOrCode == dojo.keys.UP_ARROW){
					if(y > 0){
						y -= 1;
						update = true;
					}
				}else if(e.charOrCode == dojo.keys.DOWN_ARROW){
					if(y < this.PICKER_SAT_VAL_H){
						y += 1;
						update = true;
					}
				}else if(e.charOrCode == dojo.keys.LEFT_ARROW){
					if(x > 0){
						x -= 1;
						update = true;
					}
				}else if(e.charOrCode == dojo.keys.RIGHT_ARROW){
					if(x < this.PICKER_SAT_VAL_W){
						x += 1;
						update = true;
					}
				}
				if(update){
					// Account for our offsets to center
					y -= selCenterH;
					x -= selCenterW;
					dojo.style(this.cursorNode, "top", y + "px");
					dojo.style(this.cursorNode, "left", x + "px");
				}
			}else{
				this._updateColor(true);
			}
		},

		_updateColor: function(){
			// summary: update the previewNode color, and input values [optional]
			
			var hueSelCenter = this.PICKER_HUE_SELECTOR_H/2,
				satSelCenterH = this.PICKER_SAT_SELECTOR_H/2,
				satSelCenterW = this.PICKER_SAT_SELECTOR_W/2;

			var _huetop = d.style(this.hueCursorNode,"top") + hueSelCenter,
				_pickertop = d.style(this.cursorNode,"top") + satSelCenterH,
				_pickerleft = d.style(this.cursorNode,"left") + satSelCenterW,
				h = Math.round(360 - (_huetop / this.PICKER_HUE_H * 360)),
				col = dojox.color.fromHsv(h, _pickerleft / this.PICKER_SAT_VAL_W * 100, 100 - (_pickertop / this.PICKER_SAT_VAL_H * 100))
			;
			
			this._updateColorInputs(col);
			this._updateValue(col, true);
			
			// update hue, not all the pickers
			if (h!=this._hue) {
				this._setHue(h);
			}
		},
		
		_colorInputChange: function(e){
			//summary: updates picker position and inputs
			//         according to rgb, hex or hsv input changes
			var col, hasit = false;
			switch (e.target) {
				//transform to hsv to pixels

				case this.hexCode:
					col = dojox.color.fromString(e.target.value);
					hasit = true;
					
					break;
				case this.Rval:
				case this.Gval:
				case this.Bval:
					col = dojox.color.fromArray([this.Rval.value, this.Gval.value, this.Bval.value]);
					hasit = true;
					break;
				case this.Hval:
				case this.Sval:
				case this.Vval:
					col = dojox.color.fromHsv(this.Hval.value, this.Sval.value, this.Vval.value);
					hasit = true;
					break;
			}
			
			if(hasit){
				this._updatePickerLocations(col);
				this._updateColorInputs(col);
				this._updateValue(col, true);
			}
			
		},
		
		_updateValue: function(/* dojox.color.Color */col, /* Boolean */fireChange){
			// summary: updates the value of the widget
			//          can cancel reverse onChange by specifying second param
			var hex = col.toHex();
			
			this.value = this.valueNode.value = hex;
			
			// anytime we muck with the color, fire onChange?
			if(fireChange && (!this._timer || this.liveUpdate)) {
				this.onChange(hex);
			}
		},
		
		_updatePickerLocations: function(/* dojox.color.Color */col){
			//summary: update handles on the pickers acording to color values
			//
			var hueSelCenter = this.PICKER_HUE_SELECTOR_H/2,
				satSelCenterH = this.PICKER_SAT_SELECTOR_H/2,
				satSelCenterW = this.PICKER_SAT_SELECTOR_W/2;

            var hsv = col.toHsv(),
				ypos = Math.round(this.PICKER_HUE_H - hsv.h / 360 * this.PICKER_HUE_H) - hueSelCenter,
				newLeft = Math.round(hsv.s / 100 * this.PICKER_SAT_VAL_W) - satSelCenterW,
				newTop = Math.round(this.PICKER_SAT_VAL_H - hsv.v / 100 * this.PICKER_SAT_VAL_H) - satSelCenterH
			;
			
			if (this.animatePoint) {
				d.fx.slideTo({
					node: this.hueCursorNode,
					duration: this.slideDuration,
					top: ypos,
					left: 0
				}).play();
				
				d.fx.slideTo({
					node: this.cursorNode,
					duration: this.slideDuration,
					top: newTop,
					left: newLeft
				}).play();
				
			}
			else {
				d.style(this.hueCursorNode, "top", ypos + "px");
				d.style(this.cursorNode, {
					left: newLeft + "px",
					top: newTop + "px"
				});
			}
			
			// limit hue calculations to only when it changes
			if (hsv.h != this._hue) {
				this._setHue(hsv.h);
			}
			
		},
		
		_updateColorInputs: function(/* dojox.color.Color */col){
			//summary: updates color inputs that were changed through other inputs
			//or by clicking on the picker
			
			var hex = col.toHex();
			
			if (this.showRgb) {
				this.Rval.value = col.r;
				this.Gval.value = col.g;
				this.Bval.value = col.b;
			}
			
			if (this.showHsv) {
				var hsv = col.toHsv();
				this.Hval.value = Math.round((hsv.h)); // convert to 0..360
				this.Sval.value = Math.round(hsv.s);
				this.Vval.value = Math.round(hsv.v);
			}
			
			if (this.showHex) {
				this.hexCode.value = hex;
			}
			
			this.previewNode.style.backgroundColor = hex;
			
			if (this.webSafe) {
				this.safePreviewNode.style.backgroundColor = webSafeFromHex(hex);
			}
		},
		
		_setHuePoint: function(/* Event */evt){
			// summary: set the hue picker handle on relative y coordinates
			var selCenter = (this.PICKER_HUE_SELECTOR_H/2);
			var ypos = evt.layerY - selCenter;
			if(this.animatePoint){
				d.fx.slideTo({
					node: this.hueCursorNode,
					duration:this.slideDuration,
					top: ypos,
					left: 0,
					onEnd: d.hitch(this, function() {this._updateColor(true); dijit.focus(this.hueCursorNode);})
				}).play();
			}else{
				d.style(this.hueCursorNode, "top", ypos + "px");
				this._updateColor(false);
			}
		},
		
		_setPoint: function(/* Event */evt){
			// summary: set our picker point based on relative x/y coordinates
			//  evt.preventDefault();
			var satSelCenterH = this.PICKER_SAT_SELECTOR_H/2;
			var satSelCenterW = this.PICKER_SAT_SELECTOR_W/2;
			var newTop = evt.layerY - satSelCenterH;
			var newLeft = evt.layerX - satSelCenterW;
			
			if(evt){ dijit.focus(evt.target); }

			if(this.animatePoint){
				d.fx.slideTo({
					node: this.cursorNode,
					duration: this.slideDuration,
					top: newTop,
					left: newLeft,
					onEnd: d.hitch(this, function() {this._updateColor(true); dijit.focus(this.cursorNode);})
				}).play();
			}else{
				d.style(this.cursorNode, {
					left: newLeft + "px",
					top: newTop + "px"
				});
				this._updateColor(false);
			}
		},
		
		_handleKey: function(/* Event */e){
			// FIXME: not implemented YET
			// var keys = d.keys;
		},

		focus: function(){
			// summary:
			//		Put focus on this widget, only if focus isn't set on it already.
			if(!this._focused){
				dijit.focus(this.focusNode);
			}
		},

		_stopDrag: function(e){
			// summary:
			//		Function to hald the mouse down default
			//		to disable draggong of images out of the color
			//		picker.
			dojo.stopEvent(e);
		},

		destroy: function(){
			// summary:
			//		Over-ride to clean up subscriptions, etc.
			this.inherited(arguments);
			dojo.forEach(this._subs, function(sub){
				dojo.unsubscribe(sub);
			});
			delete this._subs;
		}
	});
})(dojo);

}


dojo.i18n._preloadLocalizations("dojo.nls.dojo-ext", ["ROOT","ar","ca","cs","da","de","de-de","el","en","en-gb","en-us","es","es-es","fi","fi-fi","fr","fr-fr","he","he-il","hu","it","it-it","ja","ja-jp","ko","ko-kr","nb","nl","nl-nl","pl","pt","pt-br","pt-pt","ru","sk","sl","sv","th","tr","xx","zh","zh-cn","zh-tw"]);
