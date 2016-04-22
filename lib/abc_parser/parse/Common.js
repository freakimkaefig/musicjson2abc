exports.clone = function(source) {
  var destination = {};
  for (var property in source)
    if (source.hasOwnProperty(property))
      destination[property] = source[property];
  return destination;
};

exports.gsub = function(source, pattern, replacement) {
  return source.split(pattern).join(replacement);
};

exports.strip = function(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

exports.startsWith = function(str, pattern) {
  return str.indexOf(pattern) === 0;
};

exports.endsWith = function(str, pattern) {
  var d = str.length - pattern.length;
  return d >= 0 && str.lastIndexOf(pattern) === d;
};

exports.each = function(arr, iterator, context) {
  for (var i = 0, length = arr.length; i < length; i++)
    iterator.apply(context, [arr[i],i]);
};

exports.last = function(arr) {
  if (arr.length === 0)
    return null;
  return arr[arr.length-1];
};

exports.compact = function(arr) {
  var output = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i])
      output.push(arr[i]);
  }
  return output;
};

exports.detect = function(arr, iterator) {
  for (var i = 0; i < arr.length; i++) {
    if (iterator(arr[i]))
      return true;
  }
  return false;
};