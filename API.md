## Classes

<dl>
<dt><a href="#Measure">Measure</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#convertJsonToAbc">convertJsonToAbc(input)</a> ⇒ <code>string</code></dt>
<dd><p>Returns the abc notation string from given input</p>
</dd>
<dt><a href="#convertAbcToJson">convertAbcToJson(input)</a> ⇒ <code>string</code></dt>
<dd><p>Returns the abc notation string from given input</p>
</dd>
<dt><a href="#getAbcKey">getAbcKey(fifths, mode)</a> ⇒ <code>string</code></dt>
<dd><p>Returns the key for abc notation from given fifths</p>
</dd>
<dt><a href="#getAbcClef">getAbcClef(sign)</a> ⇒ <code>string</code></dt>
<dd><p>Returns the key for abc notation from given fifths</p>
</dd>
<dt><a href="#getAbcNote">getAbcNote(prevNote, curNote)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a note in abc notation from given note object (JSON)
!NOTE! min duration is 2</p>
</dd>
<dt><a href="#getJsonId">getJsonId(data)</a> ⇒ <code>string</code></dt>
<dd><p>Get id from abc string</p>
</dd>
<dt><a href="#createJsonFromLines">createJsonFromLines(tune)</a> ⇒ <code>object</code></dt>
<dd><p>Creates json object from abc tunes object</p>
</dd>
<dt><a href="#getKeyByValue">getKeyByValue(object, value)</a> ⇒ <code>string</code></dt>
<dd><p>Get object key by value</p>
</dd>
<dt><a href="#json2abc">json2abc(data)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a string in abc notation from given data</p>
</dd>
<dt><a href="#abc2json">abc2json(data)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a string in json notation from given abc data</p>
</dd>
<dt><a href="#xml2json">xml2json(data)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a string in json notation from given xml data</p>
</dd>
</dl>

<a name="Measure"></a>

## Measure
**Kind**: global class  

* [Measure](#Measure)
    * [new Measure()](#new_Measure_new)
    * [.setRepeatLeft()](#Measure+setRepeatLeft)
    * [.setRepeatRight()](#Measure+setRepeatRight)
    * [.addNote(note, divisions, beatType)](#Measure+addNote)
    * [.get()](#Measure+get) ⇒ <code>Object</code>

<a name="new_Measure_new"></a>

### new Measure()
Constructor for measure objects

<a name="Measure+setRepeatLeft"></a>

### measure.setRepeatLeft()
Set repeat left for measure

**Kind**: instance method of <code>[Measure](#Measure)</code>  
<a name="Measure+setRepeatRight"></a>

### measure.setRepeatRight()
Set repeat right for measure

**Kind**: instance method of <code>[Measure](#Measure)</code>  
<a name="Measure+addNote"></a>

### measure.addNote(note, divisions, beatType)
Add note to measure

**Kind**: instance method of <code>[Measure](#Measure)</code>  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>object</code> | The note object |
| divisions | <code>Number</code> | The calculated divisions |
| beatType | <code>Number</code> | The beat type |

<a name="Measure+get"></a>

### measure.get() ⇒ <code>Object</code>
Get measure object

**Kind**: instance method of <code>[Measure](#Measure)</code>  
<a name="convertJsonToAbc"></a>

## convertJsonToAbc(input) ⇒ <code>string</code>
Returns the abc notation string from given input

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>object</code> | The parsed input from input file |

<a name="convertAbcToJson"></a>

## convertAbcToJson(input) ⇒ <code>string</code>
Returns the abc notation string from given input

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>object</code> | The parsed input from input file |

<a name="getAbcKey"></a>

## getAbcKey(fifths, mode) ⇒ <code>string</code>
Returns the key for abc notation from given fifths

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fifths | <code>number</code> | The position inside the circle of fifths |
| mode | <code>string</code> &#124; <code>undefined</code> | The mode (major / minor) |

<a name="getAbcClef"></a>

## getAbcClef(sign) ⇒ <code>string</code>
Returns the key for abc notation from given fifths

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sign | <code>string</code> | The clef sign |

<a name="getAbcNote"></a>

## getAbcNote(prevNote, curNote) ⇒ <code>string</code>
Returns a note in abc notation from given note object (JSON)
!NOTE! min duration is 2

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| prevNote | <code>object</code> | The previous note |
| curNote | <code>object</code> | The note that should be transformed to abc |

<a name="getJsonId"></a>

## getJsonId(data) ⇒ <code>string</code>
Get id from abc string

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | The abc string |

<a name="createJsonFromLines"></a>

## createJsonFromLines(tune) ⇒ <code>object</code>
Creates json object from abc tunes object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tune | <code>object</code> | The parsed tune object |

<a name="getKeyByValue"></a>

## getKeyByValue(object, value) ⇒ <code>string</code>
Get object key by value

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The object to search in |
| value | <code>string</code> | The value to search for |

<a name="json2abc"></a>

## json2abc(data) ⇒ <code>string</code>
Returns a string in abc notation from given data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The JSON string data that should be transformed to abc |

<a name="abc2json"></a>

## abc2json(data) ⇒ <code>string</code>
Returns a string in json notation from given abc data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The abc string that should be transformed to json |

<a name="xml2json"></a>

## xml2json(data) ⇒ <code>string</code>
Returns a string in json notation from given xml data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The music xml that should be transformed to json |

