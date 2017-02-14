
$(function () {
    var data = JSON.parse(localStorage.getItem("notesData"));
    data = data || {};

    $('#addNote').click(function () {
        $('#noteNode').removeClass('hidden');
        $('#title').focus();
    });

    $('#noteForm').on('keydown', '#title', function (e) {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            $('#description').focus();
        }
    });

    $('#cancel').click(function () {
        $('#noteForm')[0].reset();
        $('#identificator').val('');
        $('#noteNode').addClass('hidden');
    });

    $('#save').click(function () {
      save();
    });

    $('#search').on('keyup', function () {
        var value = this.value;
        $('#notesList li').hide().each(function () {
            if ($(this).find('.note-header').text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).first().add(this).show();
            }
        });
    });

    // Create element
    var createNote = function (params) {
        var wrapper, noteDiv;

        wrapper = $("<li />", {
            "class": "note",
            "id": params.id,
        });

        $("<h1/>", {
            "class": "note-header",
            "text": params.title
        }).appendTo(wrapper);

        noteDiv = $("<div />", {
            "class": "note-body",
        }).appendTo(wrapper);

        $("<p />", {
            "text": params.description
        }).appendTo(noteDiv);

        $("<button /> ", {
            "type": "button",
            "class": "edit",
            "text": "Редактировать",
            "click": function () {
                editNote(params);
            }
        }).appendTo(noteDiv);

        $(" <button />", {
            "type": "button",
            "class": "delete",
            "text": "Удалить",
            "click": function () {
                removeNote(params.id);
            }
        }).appendTo(noteDiv);
        return wrapper;
    };
    //add notes to DOM
    var addElement = function (params) {
        var parent = $('#notesList'),
        wrapper = createNote(params);
        wrapper.appendTo(parent);
    };

    //replace note if editing
    var editElement = function (params) {
        var prev = $( "#" + params.id ).prev(),
            next =  $( "#" + params.id ).next(),
            wrapper = createNote(params);
        if (prev.length > 0){
            wrapper.insertAfter(prev);
        } else {
            wrapper.insertBefore(next);
        }
    };

    //Initialize adding notes from localStorage
    function init() {
        $.each(data, function (index, params) {
            addElement(params);
        });
    }

    //removing note
    var removeNote = function (params) {
        $("#" + params).remove();
        delete data[params];
        localStorage.setItem("notesData", JSON.stringify(data));
    };

    //open edit modal window
    var editNote = function (params) {
        $('#noteNode').removeClass('hidden');
        $('#identificator').val(params.id);
        $('#title').focus().val(params.title);
        $('#description').val(params.description);
    };

    //save note to storage
    function save() {

        var title = $('#title').val(),
            description = $('#description').val(),
            ident = $('#identificator').val(),
            id, tempData;

        if (!title || !description) {
             return;
        }
        if (ident === '') {
            id = new Date().getTime();
        } else {
            id = ident;
        }

        tempData = {
            id: id,
            title: title,
            description: description
        };

        // Saving note in local storage
        data[id] = tempData;
        localStorage.setItem("notesData", JSON.stringify(data));

        if (ident === '') {
            // Generate note & add to list
            addElement(tempData);
        } else {
            // Edit note
            $( "#" + id ).replaceWith(function() {
                editElement(tempData);
            });
        }

        // Reset Form
        $('#noteForm')[0].reset();
        $('#identificator').val('');
        $('#noteNode').addClass('hidden');
    };
    init();

    $(window).bind('storage', function (e) {
       location.reload();
    });
});