(function ($) {
    $.fn.extend({
        tableExport: function (options) {

            var defaults = {
                ignoreColumn: [],
                type: 'excel',
                escape: 'true',
                htmlContent: 'false'
            };

            var options = $.extend(defaults, options);
            var el = this;

            if (defaults.type == 'excel' || defaults.type == 'doc' || defaults.type == 'powerpoint') {

                var excel = "<table>";

                // Header
                $(el).find('thead').find('tr').each(function () {
                    excel += "<tr>";
                    $(this).find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                    });
                    excel += '</tr>';

                });

                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function () {
                    excel += "<tr>";
                    var colCount = 0;
                    $(this).find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)).replace(/ New Tab/gi, '') + "</td>";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    excel += '</tr>';
                });
                excel += '</table>'

                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";

                var base64data = "base64," + $.base64.encode(excelFile);

                var filetype = '';
                if (defaults.type == 'excel')
                    filetype = 'xls';
                else if (defaults.type == 'word')
                    filetype = 'doc';
                else if (defaults.type == 'powerpoint')
                    filetype = 'ppt';

                if (isBrowser('chrome') || isBrowser('safari')) {
                    var a = document.createElement('a');
                    a.href = 'data:application/vnd.ms-' + defaults.type + ';' + base64data;
                    a.download = 'Shortlist_' + Date.now() + '.' + filetype;
                    a.click();
                } else if (isBrowser('firefox')) {
                    var filename = 'Shortlist_' + Date.now() + '.' + filetype;
                    var filelink = 'data:application/vnd.ms-' + defaults.type + ';' + base64data;
                    return {
                        'filename': filename,
                        'filelink': filelink
                    };
                }
            }

            function parseString(data) {

                var content_data = '';

                if (defaults.htmlContent == 'true')
                    content_data = data.html().trim();
                else
                    content_data = data.text().trim();

                if (defaults.escape == 'true')
                    content_data = encodeURI(content_data);

                return content_data;
            }

        }
    });
})(jQuery);

jQuery.base64 = ( function ($) {

    var _PADCHAR = "=",
        _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function _getbyte(s, i) {
        var x = s.charCodeAt(i);

        if (x > 255)
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";

        return x;
    }

    function _encode(s) {

        if (arguments.length !== 1)
            throw "SyntaxError: exactly one argument required";

        s = String(s);

        var i,
            b10,
            x = [],
            imax = s.length - s.length % 3;

        if (s.length === 0)
            return s;

        for (i = 0; i < imax; i += 3) {
            b10 = ( _getbyte(s, i) << 16 ) | ( _getbyte(s, i + 1) << 8 ) | _getbyte(s, i + 2);
            x.push(_ALPHA.charAt(b10 >> 18));
            x.push(_ALPHA.charAt(( b10 >> 12 ) & 0x3F));
            x.push(_ALPHA.charAt(( b10 >> 6 ) & 0x3f));
            x.push(_ALPHA.charAt(b10 & 0x3f));
        }

        switch (s.length - imax) {
            case 1:
                b10 = _getbyte(s, i) << 16;
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt(( b10 >> 12 ) & 0x3F) + _PADCHAR + _PADCHAR);
                break;

            case 2:
                b10 = ( _getbyte(s, i) << 16 ) | ( _getbyte(s, i + 1) << 8 );
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt(( b10 >> 12 ) & 0x3F) + _ALPHA.charAt(( b10 >> 6 ) & 0x3f) + _PADCHAR);
                break;
        }

        return x.join("");
    }

    return {
        encode: _encode
    };

}(jQuery) );
