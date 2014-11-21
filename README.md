#extended javascript console#


##better JavaScript console methods.##
![Welcome](https://lh5.googleusercontent.com/-xDUxoBivJfk/VG5u4e3etHI/AAAAAAAAKsw/E8kA8YnS8Nc/w469-h263-no/Screen%2BShot%2B2014-11-20%2Bat%2B4.43.21%2BPM.png "Welcome")

<hr>
###contents###
<ol>
	<li><a href="#getting-started">Getting Started</a></li>
	<li><a href="#consoleout">console.out()</a></li>
	<li><a href="#consolerun">console.run()</a></li>
	<li><a href="#consoleexpect">console.expect()</a></li>
	<li><a href="#namespace">Namespace</a></li>
	<li><a href="#tests">Tests</a></li>
	<li><a href="#contribute">Contribute</a></li>
	<li><a href="#acknowledgements">Acknowledgements</a></li>
</ol>

<hr>
###getting started###
xcon works as a require module or as a pojo.

require.js: I recommend declaring xcon last in your require path list, since you will not need to declare it as a module.
```js
define([
	"path/to/xcon-0.3.0.min"
], function () {
// no need to declare as a parameter
/* or... */
require(["path/to/xcon-0.3.0.min"])
```

plain ol' JavaScript:
```html
<script src="path/to/dist/xcon-0.3.0.min.js"></script>
```
<hr>

###console.out()###
like `console.log`, but also prints the primitive type.  Takes arguments to set the text color and to call native console to take a closer look at nested objects/arrays.

`console.out('hello world!');`
```
string:
hello world!
```
<hr width="50%">

`console.out(Math.PI);`
```
number:
3.141592653589793 
```
<hr width="50%">

`console.out(false);`
```
boolean:
false
```
<hr width="50%">

`console.out(NaN)`
```
number:
NaN 
```
<hr width="50%">

`console.out([1, 2, 3]);`
```
array:
[1,2,3] 
```
<hr width="50%">

```js
console.out({
    "can": "tell",
    "the": "difference",
    "between": "objects",
    "and": "arrays"
});
```
```
object:
{"can":"tell","the":"difference","between":"objects","and":"arrays"}
```
<hr width="50%">
####options####
```js
var someVar = {"foo": "bar"};
console.out(someVar, {
	"color": "rgba(0, 0, 255, 0.8)", // or any valid css color
    "log": true, // also calls native console.  Useful for objects
});
```
<hr>

###console.run()###
calls the given function; returns and logs the result with important details.  Catches errors gracefully and logs the error message.  Capable of nested calls for more complex debugging and logging.  Green text indicates that the function was run and returned a valid result.  Black text indicates that you are not invoking a function.  Red text indicates an error has occurred.

<hr width="50%">
```js
function goodFunction () {
	return "this function worked!";
}
console.run(goodFunction);
```
![valid output](https://lh6.googleusercontent.com/-MrklrzynTyk/VG60Yoj1PfI/AAAAAAAAKtI/1LE4bqArAsE/w468-h54-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.40.09%2BPM.png "Success")

<hr width="50%">
```js
function badFunction () {
	return undefinedVariable;
}
console.run(badFunction);
```
![error output](https://dl.dropboxusercontent.com/u/10976600/xcon/undefined%20error.png "Error")

<hr width="50%">
####passing arguments####
Pass all function arguments as an array as the second argument.
```js
function multiply () {
	var product = 1, n;
	for (n = 0; n < arguments.length; n++) {
    	product *= arguments[n];
    }
    return product;
}
console.run(multiply, [2, 2, 2]);
```
![arguments](https://lh4.googleusercontent.com/-EOH07rgIGqA/VG609d5aFwI/AAAAAAAAKtY/EHw1EqHLIrE/w463-h46-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.43.24%2BPM.png "Arguments")

<hr width="50%">
####passing context####
```js
var fakeObj = {};
function FakeConstructor () {
	this.prop = "something";
	return this;
}
fakeObj = console.run(FakeConstructor, [], fakeObj);
fakeObj.prop === "something"; // true
```

in the above example, `fakeObj` will be interpreted as `this` by `FakeConstructor'.

<hr width="50%">
####nesting calls####
sometimes it helps to know what a chain of dependent functions are doing.  Because console.run() returns the value of the function, you can keep eye on the output of each function in an organized way.
```js
function mcConaughey (article) {
	return "removing " + article;
}
function carrey (topic) {
	return "makes a joke about " + topic;
}
console.run(carrey, 
	[console.run(mcConaughey, ["shirt"])]
);
```
![chaining](https://lh4.googleusercontent.com/-nkWZ04G9agk/VG62fgNnz0I/AAAAAAAAKuY/AAYZzv1HsC0/w465-h82-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.50.02%2BPM.png "Chaining")

<hr width="50%">
It can help keep track of what's going wrong in your application flow:

```js
function carrotTop () {
	return hasNoIdeaWhatHesDoingHere;
}
console.run(carrey, 
	[console.run(mcConaughey, 
    		[console.run(carrotTop)]
    	)]
);
```
![chain undefined](https://lh6.googleusercontent.com/-n3olWEE3yO8/VG63A8H-6cI/AAAAAAAAKuo/u44gRCu6w-0/w458-h112-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.52.17%2BPM.png "Chain Debugging")

<hr width="50%">
####Non-functions####
It is possible to pass a non-function into `.run()`.  The value of that non-function will be logged as though you were calling `.out()`.  Additionally, that non-function will be returned, enabling the developer to write inline console statements.
```js
var a = console.run('a');
a === 'a' // evaluates to true
// in the console...
// string:
// a
```
<hr>
###console.expect()###
####unit tests in the browser console####
A stripped-down collection of unit test methods that borrow heavily from <a href="http://jasmine.github.io/">jasmine.js</a>.  Developers who regularly use console.log() to debug or dirty-test their code may find that console.expect adds a more precise tool to their workflow.

<hr width="50%">
####console.expect(data).toEqual(comparison)####
A passed test indicates that the argument passed to `expect()` and the argument passed to `toEqual()` are strictly equal - including truthy and falsy values.  Works for any JavaScript data type: primitives, objects, and functions.  Test results are highlighted in green (passed) or red (failed) in the console.
```js
console.expect(4).toEqual(4);
```
![toEqual](https://lh3.googleusercontent.com/-5h11iNoLwKM/VG63SifSbiI/AAAAAAAAKu8/Ng9OGwxRPng/w457-h27-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.53.29%2BPM.png ".toEqual")

<hr width="50%">
####console.expect(data).toBeTruthy()####
Passed test indicates a <a href="http://www.codeproject.com/Articles/713894/Truthy-Vs-Falsy-Values-in-JavaScript">truthy</a> value.
```js
console.expect("I'm truthy").toBeTruthy();
```
![toBeTruthy](https://lh6.googleusercontent.com/-hMWfjYtvuNM/VG63kNn_N6I/AAAAAAAAKvI/fHPtSHnb02I/w350-h21-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.54.40%2BPM.png ".toBeTruthy")

<hr width="50%">
####console.expect(data).toBeFalsy()####
Passed test indicates a <a href="http://www.codeproject.com/Articles/713894/Truthy-Vs-Falsy-Values-in-JavaScript">falsy</a> value.
```js
console.expect(undefined).toBeFalsy();
```
![toBeFalsy](https://lh6.googleusercontent.com/-ddGwr_gR33o/VG634Wpxe6I/AAAAAAAAKvY/0d2-2WwFcsw/w359-h21-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.55.59%2BPM.png ".toBeFalsy")

<hr width="50%">
####console.expect(data).toBeDefined()####
Passed test indicates data that is not undefined.
```js
console.expect({}).toBeDefined();
```
![toBeDefined](https://lh5.googleusercontent.com/-Dv7-tHpNsck/VG64PFuQkQI/AAAAAAAAKvo/C45le3SmgGA/w302-h22-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.57.25%2BPM.png ".toBeDefined")

<hr width="50%">
####.not####
Prepend the test method with .not to invert the test.
```js
console.expect(Math.PI).not.toEqual(Math.PI);
```
![notToEqual](https://lh5.googleusercontent.com/-YFAdrXMvFJM/VG64qrt7hFI/AAAAAAAAKv4/4LY_dq8PyNI/w443-h34-no/Screen%2BShot%2B2014-11-20%2Bat%2B9.59.20%2BPM.png "not.toEqual")

```js
console.expect([0, 1, 2]).not.toEqual({"0": 0, "1": 1, "2": 2});
```
![array-object](https://lh5.googleusercontent.com/-grkZ2V1mync/VG65GXkZWXI/AAAAAAAAKwI/MFy2JxbDvrw/w378-h36-no/Screen%2BShot%2B2014-11-20%2Bat%2B10.01.11%2BPM.png "array-object")

<em>Note: JavaScript would interpret these two blobs as identical because they are both objects, have identical keys and values.  For the purposes of testing, it is anticipated that developers would not want an array and object to be considered stricty equal for the purpose of testing code.  Furthermore, arrays and objects have different prototypes.  For these reasons, arrays and objects with identical keys and values will not be interpreted by xcon as equal.</em>

<hr>
###Namespace###
To ensure that xcon.js will never break native console methods, there are fallbacks in the code.  If Mozilla, Webkit, Microsoft, etc. were to implement .run or .out tomorrow, xcon will not overwrite those methods.
<hr>

###Tests###
Jasmine unit tests are in the `tests` directory.
<hr>

###Contribute###
Xcon source and test files use AMD modules via <a href="http://requirejs.org/">require.js</a>.  <a href="http://gruntjs.com/">Grunt</a>, <a href="https://github.com/gfranko/amdclean">AMDclean</a>, and <a href="https://github.com/gruntjs/grunt-contrib-uglify">uglify</a> are used to create production builds that do not need AMD.
<hr>

###Acknowledgements###
Thanks to <a href="https://github.com/kurtpeters">Kurt Peters</a> and Corbin Swagerty, both of whom offered some great ideas for this project.
