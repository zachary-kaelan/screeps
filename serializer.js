/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('serializer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    pack: function (bytes) {
        var str = "";
        var numBytes = bytes.length;
        // You could make it faster by reading bytes.length once.
        for(var i = 0; i < numBytes; i += 2) {
            // If you're using signed bytes, you probably need to mask here.
            var char = bytes[i] << 8;
            // (undefined | 0) === 0 so you can save a test here by doing
            //     var char = (bytes[i] << 8) | (bytes[i + 1] & 0xff);
            if (bytes[i + 1])
                char |= bytes[i + 1];
                // Instead of using string += you could push char onto an array
                // and take advantage of the fact that String.fromCharCode can
                // take any number of arguments to do
                //     String.fromCharCode.apply(null, chars);
            str += String.fromCharCode(char);
        }
        return str;
    },

    unpack: function(str) {
        var bytes = [];
        for(var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            // You can combine both these calls into one,
            //    bytes.push(char >>> 8, char & 0xff);
            bytes.push(char >>> 8);
            bytes.push(char & 0xFF);
        }
        return bytes;
    },
    
    ab2str: function(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    },
    
    str2ab: function(str) {
      var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
      var bufView = new Uint16Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
};